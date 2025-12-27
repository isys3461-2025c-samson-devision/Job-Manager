// Employment Type
export const EMPLOYMENT_TYPE_LABELS = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  INTERN: "Internship",
  CONTRACT: "Contract",
};

// Salary Type
export const SALARY_TYPE_LABELS = {
  RANGE: "Salary Range",
  FIXED: "Fixed Salary",
  FROM: "From",
  UP_TO: "Up To",
  NEGOTIABLE: "Negotiable",
};

// Publish Status (derived, not backend field)
export const getPublishStatus = (jobPost) => {
  return jobPost.isPublished ? "Published" : "Draft";
};


// Salary display logic (VERY IMPORTANT)
export const formatSalary = (jobPost) => {
  const { salaryType, salaryMin, salaryMax } = jobPost;

  switch (salaryType) {
    case "RANGE":
      return `$${salaryMin} - $${salaryMax}`;
    case "FROM":
      return `From $${salaryMin}`;
    case "UP_TO":
      return `Up to $${salaryMax}`;
    case "FIXED":
      return `$${salaryMin}`;
    case "NEGOTIABLE":
      return "Negotiable";
    default:
      return "Not specified";
  }
};

// Date formatter
export const formatPostedDate = (postedDate) => {
  if (!postedDate) return "—";
  return new Date(postedDate).toLocaleDateString();
};
