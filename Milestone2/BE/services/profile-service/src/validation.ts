import Joi from "joi";

export const updateProfileSchema = Joi.object({
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  country: Joi.string().optional()
});

const yearRegex = /^\d{4}$/;
const monthYearRegex = /^(0[1-9]|1[0-2])-\d{4}$/;
const currentYear = new Date().getFullYear();

const educationEntrySchema = Joi.object({
  degree: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Degree is required',
      'string.min': 'Degree must be at least 2 characters',
      'string.max': 'Degree cannot exceed 200 characters'
    }),
    
  institution: Joi.string()
    .min(2)
    .max(200)
    .required()
    .messages({
      'string.empty': 'Institution is required',
      'string.min': 'Institution name must be at least 2 characters',
      'string.max': 'Institution name cannot exceed 200 characters'
    }),
    
  from: Joi.string()
    .pattern(yearRegex)
    .required()
    .messages({
      'string.pattern.base': 'From year must be in YYYY format',
      'any.required': 'Start year is required'
    })
    .custom((value, helpers) => {
      const year = parseInt(value);
      if (year < 1900 || year > currentYear) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'Year range validation'),
    
  to: Joi.alternatives()
    .try(
      Joi.string().pattern(yearRegex),
      Joi.string().valid('current', 'now', 'present')
    )
    .optional()
    .messages({
      'string.pattern.base': 'To year must be in YYYY format or "current"'
    })
    .when(Joi.exist(), {
      then: Joi.custom((value, helpers) => {
        if (value === 'current' || value === 'now' || value === 'present') {
          return value;
        }
        
        const year = parseInt(value);
        const fromYear = parseInt(helpers.state.ancestors[0].from);
        
        if (year < fromYear) {
          return helpers.error('any.invalid', {
            message: 'End year cannot be before start year'
          });
        }
        
        if (year > currentYear) {
          return helpers.error('any.invalid', {
            message: 'End year cannot be in the future'
          });
        }
        
        return value;
      }, 'End year validation')
    }),
    
  GPA: Joi.number()
    .min(0)
    .max(100)
    .optional()
    .precision(2)
    .messages({
      'number.min': 'GPA cannot be less than 0',
      'number.max': 'GPA cannot exceed 100',
      'number.precision': 'GPA must have maximum 2 decimal places'
    })
});

const workExperienceEntrySchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Job title is required',
      'string.min': 'Job title must be at least 2 characters',
      'string.max': 'Job title cannot exceed 100 characters'
    }),
    
  startDate: Joi.string()
    .pattern(monthYearRegex)
    .required()
    .messages({
      'string.pattern.base': 'Start date must be in MM-YYYY format',
      'any.required': 'Start date is required'
    })
    .custom((value, helpers) => {
      const [month, year] = value.split('-').map(Number);
      const date = new Date(year, month - 1);
      
      if (date > new Date()) {
        return helpers.error('any.invalid', {
          message: 'Start date cannot be in the future'
        });
      }
      
      return value;
    }, 'Start date validation'),
    
  endDate: Joi.alternatives()
    .try(
      Joi.string().pattern(monthYearRegex),
      Joi.string().valid('current', 'now', 'present')
    )
    .optional()
    .messages({
      'string.pattern.base': 'End date must be in MM-YYYY format or "current"'
    })
    .custom((value, helpers) => {
      if (value === 'current' || value === 'now' || value === 'present') {
        return value;
      }
      
      const startDateStr = helpers.state.ancestors[0].startDate;
      const [startMonth, startYear] = startDateStr.split('-').map(Number);
      const [endMonth, endYear] = value.split('-').map(Number);
      
      const startDate = new Date(startYear, startMonth - 1);
      const endDate = new Date(endYear, endMonth - 1);
      
      if (endDate < startDate) {
        return helpers.error('any.invalid', {
          message: 'End date cannot be before start date'
        });
      }
      
      if (endDate > new Date()) {
        return helpers.error('any.invalid', {
          message: 'End date cannot be in the future'
        });
      }
      
      return value;
    }, 'End date validation'),
    
  description: Joi.string()
    .max(1000)
    .optional()
    .messages({
      'string.max': 'Job description cannot exceed 1000 characters'
    })
});

export const updateBasicTextProfileSchema = Joi.object({
  summary: Joi.string()
    .max(500)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Objective summary cannot exceed 500 characters'
    }),
    
  education: Joi.array()
    .items(educationEntrySchema)
    .optional()
    .max(10) 
    .unique((a, b) => 
      a.institution === b.institution && 
      a.degree === b.degree && 
      a.from === b.from
    )
    .messages({
      'array.max': 'Maximum 10 education entries allowed',
      'array.unique': 'Duplicate education entry detected'
    }),
    
  workExperiences: Joi.array()
    .items(workExperienceEntrySchema)
    .optional()
    .max(20) 
    .unique((a, b) => 
      a.title === b.title && 
      a.startDate === b.startDate
    )
    .messages({
      'array.max': 'Maximum 20 work experience entries allowed',
      'array.unique': 'Duplicate work experience entry detected'
    })
})
.options({
  stripUnknown: true, // Remove unknown fields
  abortEarly: false, // Return all validation errors, not just the first
})
.custom((value, helpers) => {
  // Additional business logic validation
  const { education, workExperiences } = value;
  
  if (education) {
    // Validate no overlapping education periods for the same institution
    for (let i = 0; i < education.length; i++) {
      for (let j = i + 1; j < education.length; j++) {
        if (education[i].institution === education[j].institution) {
          const from1 = parseInt(education[i].from);
          const to1 = education[i].to === 'current' ? currentYear : 
                     (education[i].to ? parseInt(education[i].to) : currentYear);
          const from2 = parseInt(education[j].from);
          const to2 = education[j].to === 'current' ? currentYear : 
                     (education[j].to ? parseInt(education[j].to) : currentYear);
          
          if ((from1 >= from2 && from1 <= to2) || 
              (to1 >= from2 && to1 <= to2)) {
            return helpers.error('any.invalid', {
              message: `Overlapping education periods detected for ${education[i].institution}`
            });
          }
        }
      }
    }
  }
  
  if (workExperiences) {
    // Validate no overlapping work periods for the same company
    // Assuming company is not stored, we'll check by title for simplicity
    for (let i = 0; i < workExperiences.length; i++) {
      for (let j = i + 1; j < workExperiences.length; j++) {
        if (workExperiences[i].title === workExperiences[j].title) {
          const start1 = workExperiences[i].startDate;
          const end1 = workExperiences[i].endDate === 'current' ? 
                      new Date().toLocaleDateString('en-GB').split('/').reverse().join('-') :
                      workExperiences[i].endDate || start1;
          
          const start2 = workExperiences[j].startDate;
          const end2 = workExperiences[j].endDate === 'current' ? 
                      new Date().toLocaleDateString('en-GB').split('/').reverse().join('-') :
                      workExperiences[j].endDate || start2;
          
          if (datesOverlap(start1, end1, start2, end2)) {
            return helpers.error('any.invalid', {
              message: `Overlapping work periods detected for position: ${workExperiences[i].title}`
            });
          }
        }
      }
    }
  }
  
  return value;
});

// Helper function for date overlap detection
function datesOverlap(start1: string, end1: string, start2: string, end2: string): boolean {
  const [month1, year1] = start1.split('-').map(Number);
  const [month2, year2] = end2.split('-').map(Number);
  const [month3, year3] = start2.split('-').map(Number);
  const [month4, year4] = end2.split('-').map(Number);
  
  const date1 = new Date(year1, month1 - 1);
  const date2 = new Date(year2, month2 - 1);
  const date3 = new Date(year3, month3 - 1);
  const date4 = new Date(year4, month4 - 1);
  
  return (date1 <= date4 && date2 >= date3);
}