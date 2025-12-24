import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';
import Header from '../../components/Header';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCurrentJob, setJobLoading, setJobError } from '../../store/jobSlice';
import { jobService } from '../../services/jobService';
import type { Job } from '../../types';

const USE_MOCK_DATA = true; // Toggle this to switch between mock and real API

// Mock data - same as JobListings
const MOCK_JOBS: Job[] = [
  {
    job_id: 1,
    company_id: 101,
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced frontend developer to join our team. You will be responsible for building responsive web applications using React, TypeScript, and modern web technologies.\n\nKey Responsibilities:\n- Develop and maintain responsive web applications\n- Collaborate with backend developers and designers\n- Optimize applications for maximum speed and scalability\n- Write clean, maintainable code following best practices\n\nRequirements:\n- 5+ years of experience with React\n- Strong knowledge of TypeScript\n- Experience with modern frontend tools and workflows\n- Excellent problem-solving skills',
    posted_date: '2025-12-20T10:00:00Z',
    location: 'New York, NY',
    employment_type: 'Full-time',
    salary_type: 'Annual',
    salary_min: 100000,
    salary_max: 150000,
    is_published: true,
    company_name: 'TechCorp Inc.',
    skills: ['JavaScript', 'TypeScript', 'React'],
  },
  {
    job_id: 2,
    company_id: 102,
    title: 'Backend Engineer',
    description: 'Join our backend team to build scalable microservices. Experience with Node.js, Express, and MongoDB required.\n\nWhat we\'re looking for:\n- Strong backend development experience\n- Proficiency with Node.js and Express\n- MongoDB database design and optimization\n- RESTful API design principles\n\nYour day-to-day:\n- Develop and maintain backend services\n- Design and implement APIs\n- Optimize database queries\n- Participate in code reviews',
    posted_date: '2025-12-19T14:30:00Z',
    location: 'San Francisco, CA',
    employment_type: 'Full-time',
    salary_type: 'Annual',
    salary_min: 120000,
    salary_max: 180000,
    is_published: true,
    company_name: 'StartupXYZ',
    skills: ['Node.js', 'MongoDB', 'SQL'],
  },
  {
    job_id: 3,
    company_id: 103,
    title: 'Full Stack Developer',
    description: 'Work on both frontend and backend technologies. Build end-to-end features for our SaaS platform.\n\nAbout the role:\n- Full ownership of features from design to deployment\n- Work with modern tech stack (React, Node.js, PostgreSQL)\n- Collaborate with cross-functional teams\n- Contribute to architectural decisions\n\nWhat you bring:\n- Full stack development experience\n- Understanding of both frontend and backend concepts\n- Problem-solving mindset\n- Communication skills',
    posted_date: '2025-12-18T09:00:00Z',
    location: 'Austin, TX',
    employment_type: 'Full-time',
    salary_type: 'Annual',
    salary_min: 90000,
    salary_max: 140000,
    is_published: true,
    company_name: 'CloudSolutions',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
  },
  {
    job_id: 4,
    company_id: 104,
    title: 'DevOps Engineer',
    description: 'Manage our cloud infrastructure on AWS. Experience with Docker, Kubernetes, and CI/CD pipelines required.\n\nResponsibilities:\n- Infrastructure management and monitoring\n- Implement CI/CD pipelines\n- Container orchestration with Kubernetes\n- Security and performance optimization\n\nYou should have:\n- AWS expertise\n- Docker and container knowledge\n- Scripting and automation skills\n- Understanding of Linux systems',
    posted_date: '2025-12-17T11:00:00Z',
    location: 'Seattle, WA',
    employment_type: 'Full-time',
    salary_type: 'Annual',
    salary_min: 110000,
    salary_max: 160000,
    is_published: true,
    company_name: 'DataFlow Systems',
    skills: ['AWS', 'Docker', 'Git'],
  },
  {
    job_id: 5,
    company_id: 105,
    title: 'UI/UX Designer',
    description: 'Create beautiful and intuitive user interfaces. Proficiency in Figma and modern design principles required.\n\nKey tasks:\n- Design user interfaces and experiences\n- Create wireframes and prototypes\n- User research and testing\n- Design systems and component libraries\n\nYou have:\n- 3+ years of UX/UI design experience\n- Figma expertise\n- Understanding of accessibility\n- Portfolio of design work',
    posted_date: '2025-12-16T15:00:00Z',
    location: 'Los Angeles, CA',
    employment_type: 'Full-time',
    salary_type: 'Annual',
    salary_min: 80000,
    salary_max: 120000,
    is_published: true,
    company_name: 'DesignHub',
    skills: ['JavaScript', 'React', 'TypeScript'],
  },
  {
    job_id: 6,
    company_id: 106,
    title: 'Junior Software Developer',
    description: 'Entry-level position for recent graduates. Learn and grow with our mentorship program.\n\nWhat you\'ll do:\n- Write code under mentorship\n- Participate in daily standups\n- Contribute to existing codebases\n- Learn best practices and patterns\n\nWhat you need:\n- Computer Science degree or bootcamp graduate\n- Fundamental programming knowledge\n- Willingness to learn\n- Team player mentality',
    posted_date: '2025-12-15T08:00:00Z',
    location: 'Remote',
    employment_type: 'Full-time',
    salary_type: 'Annual',
    salary_min: 60000,
    salary_max: 80000,
    is_published: true,
    company_name: 'CodeAcademy Pro',
    skills: ['Python', 'JavaScript', 'Git'],
  },
  {
    job_id: 7,
    company_id: 107,
    title: 'React Native Developer',
    description: 'Build cross-platform mobile applications using React Native. iOS and Android experience preferred.\n\nYour mission:\n- Develop mobile apps for iOS and Android\n- Write reusable component libraries\n- Optimize app performance\n- Collaborate with native developers\n\nRequired:\n- React Native experience\n- JavaScript/TypeScript skills\n- Mobile app development knowledge\n- Testing and debugging expertise',
    posted_date: '2025-12-14T12:00:00Z',
    location: 'Boston, MA',
    employment_type: 'Contract',
    salary_type: 'Hourly',
    salary_min: 60,
    salary_max: 90,
    is_published: true,
    company_name: 'MobileFirst',
    skills: ['React', 'TypeScript', 'JavaScript'],
  },
  {
    job_id: 8,
    company_id: 108,
    title: 'Data Scientist',
    description: 'Analyze complex datasets and build machine learning models. Python and ML framework experience required.\n\nRole highlights:\n- Data analysis and visualization\n- Machine learning model development\n- Statistical analysis\n- Data pipeline creation\n\nRequired skills:\n- Python expertise\n- Machine learning frameworks (TensorFlow, PyTorch)\n- SQL and data manipulation\n- Statistics and mathematics',
    posted_date: '2025-12-13T10:00:00Z',
    location: 'Chicago, IL',
    employment_type: 'Full-time',
    salary_type: 'Annual',
    salary_min: 130000,
    salary_max: 190000,
    is_published: true,
    company_name: 'AI Innovations',
    skills: ['Python', 'SQL', 'AWS'],
  },
  {
    job_id: 9,
    company_id: 109,
    title: 'Product Manager',
    description: 'Lead product strategy and development. Work closely with engineering and design teams.\n\nCore activities:\n- Define product vision and roadmap\n- Work with cross-functional teams\n- Gather and analyze user feedback\n- Drive product launches\n\nYou bring:\n- Product management experience\n- Data-driven decision making\n- Leadership skills\n- Communication abilities',
    posted_date: '2025-12-12T14:00:00Z',
    location: 'Denver, CO',
    employment_type: 'Full-time',
    salary_type: 'Annual',
    salary_min: 110000,
    salary_max: 150000,
    is_published: true,
    company_name: 'ProductHub',
    skills: ['Git', 'MongoDB'],
  },
  {
    job_id: 10,
    company_id: 110,
    title: 'Marketing Intern',
    description: 'Assist with digital marketing campaigns. Great opportunity for students or recent graduates.\n\nInternship focus:\n- Social media management\n- Content creation\n- Campaign analysis\n- Market research support\n\nIdeal candidate:\n- Marketing student or recent graduate\n- Social media savvy\n- Creative thinking\n- Attention to detail',
    posted_date: '2025-12-11T09:00:00Z',
    location: 'Miami, FL',
    employment_type: 'Internship',
    salary_type: 'Monthly',
    salary_min: 2000,
    salary_max: 3000,
    is_published: true,
    company_name: 'GrowthMarketing Co.',
    skills: ['JavaScript', 'React'],
  },
  {
    job_id: 11,
    company_id: 111,
    title: 'QA Automation Engineer',
    description: 'Develop and maintain automated test suites. Experience with Selenium, Jest, and Cypress required.\n\nWhat you\'ll do:\n- Write automated tests\n- Maintain test frameworks\n- Bug identification and documentation\n- Performance testing\n\nYou have:\n- QA automation experience\n- Testing framework knowledge\n- Problem-solving skills\n- Attention to quality',
    posted_date: '2025-12-10T11:30:00Z',
    location: 'Portland, OR',
    employment_type: 'Full-time',
    salary_type: 'Annual',
    salary_min: 85000,
    salary_max: 125000,
    is_published: true,
    company_name: 'QualityFirst',
    skills: ['JavaScript', 'TypeScript', 'Git'],
  },
  {
    job_id: 12,
    company_id: 112,
    title: 'Technical Writer',
    description: 'Create documentation for our API and developer tools. Strong technical and writing skills required.\n\nResponsibilities:\n- API documentation\n- Developer guides and tutorials\n- Code examples and snippets\n- Documentation maintenance\n\nRequired:\n- Technical writing experience\n- Code understanding\n- Clear communication\n- Attention to detail',
    posted_date: '2025-12-09T16:00:00Z',
    location: 'Remote',
    employment_type: 'Part-time',
    salary_type: 'Hourly',
    salary_min: 40,
    salary_max: 60,
    is_published: true,
    company_name: 'DocuTech',
    skills: ['Git', 'MongoDB', 'SQL'],
  },
];

export default function JobDetails() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentJob, loading, error } = useAppSelector((state) => state.job);

  const [isApplying, setIsApplying] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;

      try {
        dispatch(setJobLoading(true));
        
        if (USE_MOCK_DATA) {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 300));
          
          // Find job in mock data
          const job = MOCK_JOBS.find((j) => j.job_id === parseInt(jobId));
          if (!job) {
            dispatch(setJobError('Job not found'));
          } else {
            dispatch(setCurrentJob(job));
          }
        } else {
          // Use real API
          const job = await jobService.getJobById(parseInt(jobId));
          dispatch(setCurrentJob(job));
        }
      } catch (err) {
        dispatch(setJobError(err instanceof Error ? err.message : 'Failed to load job details'));
      } finally {
        dispatch(setJobLoading(false));
      }
    };

    fetchJobDetails();
  }, [jobId, dispatch]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;

    try {
      setIsApplying(true);
      setApplicationError(null);

      await jobService.applyToJob(parseInt(jobId), {
        coverLetter: coverLetter.trim() || undefined,
      });

      setApplicationSuccess(true);
      setShowApplicationForm(false);
      setCoverLetter('');

      setTimeout(() => setApplicationSuccess(false), 5000);
    } catch (err) {
      setApplicationError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setIsApplying(false);
    }
  };

  const formatSalary = () => {
    if (!currentJob) return 'Not specified';
    if (!currentJob.salary_min && !currentJob.salary_max) return 'Negotiable';
    if (currentJob.salary_min && currentJob.salary_max) {
      return `$${currentJob.salary_min.toLocaleString()} - $${currentJob.salary_max.toLocaleString()}`;
    }
    if (currentJob.salary_min) return `From $${currentJob.salary_min.toLocaleString()}`;
    return `Up to $${currentJob.salary_max?.toLocaleString()}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  if (loading) {
    return (
      <>
        <Header title="Loading..." />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
          </div>
        </div>
      </>
    );
  }

  if (error || !currentJob) {
    return (
      <>
        <Header title="Job Not Found" />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error || 'Job not found'}</p>
            <Link
              to="/jobs"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Back to Job Listings
            </Link>
          </div>
        </div>
      </>
    );
  }

  const job = currentJob;

  return (
    <>
      <Header
        title={job.title}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Jobs', href: '/jobs' },
          { label: job.title },
        ]}
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className="group inline-flex items-center gap-2 text-gray-700 hover:text-blue-700 mb-6 px-4 py-2 border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-sm hover:-translate-x-0.5"
        >
          <ArrowLeftIcon className="w-5 h-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span className="font-medium">Back to Jobs</span>
        </button>

        {/* Success Message */}
        {applicationSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">Application submitted successfully!</p>
              <p className="text-green-700 text-sm">The employer will review your application soon.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                {job.company_logo ? (
                  <img
                    src={job.company_logo}
                    alt={job.company_name || 'Company'}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {job.company_name?.charAt(0) || job.title.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  {job.company_name && (
                    <p className="text-xl text-gray-700 font-medium mb-2">{job.company_name}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {job.employment_type}
                    </span>
                    {job.is_published ? (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Open
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="w-5 h-5 text-gray-400" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
                  <span>{formatSalary()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <span>Posted {getTimeAgo(job.posted_date)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BriefcaseIcon className="w-5 h-5 text-gray-400" />
                  <span>{job.salary_type}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Apply Button */}
              <div className="bg-white rounded-lg shadow-md p-6">
                {job.is_published ? (
                  <div>
                    {!showApplicationForm ? (
                      <button
                        onClick={() => setShowApplicationForm(true)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Apply Now
                      </button>
                    ) : (
                      <form onSubmit={handleApply} className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Apply for this position</h3>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cover Letter (Optional)
                          </label>
                          <textarea
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            rows={6}
                            placeholder="Tell us why you're a great fit for this role..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          />
                        </div>

                        {applicationError && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                            {applicationError}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={isApplying}
                            className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isApplying ? 'Submitting...' : 'Submit Application'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowApplicationForm(false);
                              setCoverLetter('');
                              setApplicationError(null);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-600">This position is not published yet</p>
                  </div>
                )}
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Posted:</span>
                    <p className="text-gray-900 font-medium">{new Date(job.posted_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Employment Type:</span>
                    <p className="text-gray-900 font-medium">{job.employment_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Salary Type:</span>
                    <p className="text-gray-900 font-medium">{job.salary_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Company ID:</span>
                    <p className="text-gray-900 font-medium">{job.company_id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}