import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Header from '../../components/Header';
import JobCard from '../../components/JobCard';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setJobs,
  setJobLoading,
  setJobError,
  setPagination,
  setCurrentPage,
  updateFilters
} from '../../store/jobSlice';
import { jobService } from '../../services/jobService';
import { profileService } from '../../services/profileServices';
import type { GetJobsParams } from '../../services/jobService';
import type { Job } from '../../types';

// Mock data for testing (set USE_MOCK_DATA to false to use real API)
const MOCK_JOBS: Job[] = [
  {
    job_id: 1,
    company_id: 101,
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced frontend developer to join our team. You will be responsible for building responsive web applications using React, TypeScript, and modern web technologies.',
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
    description: 'Join our backend team to build scalable microservices. Experience with Node.js, Express, and MongoDB required.',
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
    description: 'Work on both frontend and backend technologies. Build end-to-end features for our SaaS platform.',
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
    description: 'Manage our cloud infrastructure on AWS. Experience with Docker, Kubernetes, and CI/CD pipelines required.',
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
    description: 'Create beautiful and intuitive user interfaces. Proficiency in Figma and modern design principles required.',
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
    description: 'Entry-level position for recent graduates. Learn and grow with our mentorship program.',
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
    description: 'Build cross-platform mobile applications using React Native. iOS and Android experience preferred.',
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
    description: 'Analyze complex datasets and build machine learning models. Python and ML framework experience required.',
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
    description: 'Lead product strategy and development. Work closely with engineering and design teams.',
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
    description: 'Assist with digital marketing campaigns. Great opportunity for students or recent graduates.',
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
    description: 'Develop and maintain automated test suites. Experience with Selenium, Jest, and Cypress required.',
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
    description: 'Create documentation for our API and developer tools. Strong technical and writing skills required.',
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

const USE_MOCK_DATA = true; // Toggle this to switch between mock and real API

const EMPLOYMENT_TYPES = [
  { value: 'Full-time', label: 'Full Time' },
  { value: 'Part-time', label: 'Part Time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
];

const ITEMS_PER_PAGE = 8;

export default function JobListings() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { jobs, loading, error, currentPage, totalPages, filters } = useAppSelector((state) => state.job);

  // Local filter state
  const [searchQuery, setSearchQuery] = useState(filters.search || '');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(filters.employment_type || []);
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState(filters.location || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Array<{ id: string; name: string }>>([]);
  const [skillMap, setSkillMap] = useState<Map<string, string>>(new Map());

  // Load available skills on mount
  useEffect(() => {
    const loadSkills = async () => {
      try {
        // When using mock data, derive skills from the mock jobs
        if (USE_MOCK_DATA) {
          const uniqueSkills = new Set<string>();
          MOCK_JOBS.forEach((job) => {
            job.skills?.forEach((s) => uniqueSkills.add(s));
          });

          const skills = Array.from(uniqueSkills).map((skill) => ({
            id: skill.toLowerCase().replace(/\s+/g, '-'),
            name: skill,
          }));

          setAvailableSkills(skills);
          const map = new Map<string, string>();
          skills.forEach((skill) => map.set(skill.id, skill.name));
          setSkillMap(map);
          return;
        }

        // Real API fetch
        const skills = await profileService.getSkills();
        setAvailableSkills(skills);
        const map = new Map<string, string>();
        skills.forEach((skill) => {
          map.set(skill.id, skill.name);
        });
        setSkillMap(map);
      } catch (err) {
        console.error('Error loading skills:', err);

        // Fallback to mock-derived skills if API fails
        const uniqueSkills = new Set<string>();
        MOCK_JOBS.forEach((job) => job.skills?.forEach((s) => uniqueSkills.add(s)));
        const skills = Array.from(uniqueSkills).map((skill) => ({
          id: skill.toLowerCase().replace(/\s+/g, '-'),
          name: skill,
        }));
        setAvailableSkills(skills);
        const map = new Map<string, string>();
        skills.forEach((skill) => map.set(skill.id, skill.name));
        setSkillMap(map);
      }
    };
    loadSkills();
  }, []);

  // Fetch jobs when filters or pagination changes
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        dispatch(setJobLoading(true));

        if (USE_MOCK_DATA) {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Filter mock data
          let filteredJobs = [...MOCK_JOBS];

          // Apply search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filteredJobs = filteredJobs.filter(
              (job) =>
                job.title.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query) ||
                job.company_name?.toLowerCase().includes(query)
            );
          }

          // Apply employment type filter
          if (selectedTypes.length > 0) {
            filteredJobs = filteredJobs.filter((job) =>
              selectedTypes.includes(job.employment_type)
            );
          }

          // Apply location filter
          if (locationFilter) {
            const locQuery = locationFilter.toLowerCase();
            filteredJobs = filteredJobs.filter((job) =>
              job.location.toLowerCase().includes(locQuery)
            );
          }

          // Apply skills filter
          if (selectedSkills.length > 0) {
            filteredJobs = filteredJobs.filter((job) => {
              if (!job.skills || job.skills.length === 0) return false;
              return selectedSkills.some((skill) => job.skills?.includes(skill));
            });
          }

          // Pagination
          const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
          const endIndex = startIndex + ITEMS_PER_PAGE;
          const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
          const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);

          dispatch(setJobs(paginatedJobs));
          dispatch(setPagination({
            totalPages: totalPages || 1,
            currentPage: currentPage,
          }));
        } else {
          // Real API call
          const params: GetJobsParams = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
            search: searchQuery || undefined,
            employment_type: selectedTypes.length > 0 ? selectedTypes : undefined,
            location: locationFilter || undefined,
            skills: selectedSkills.length > 0 ? selectedSkills : undefined,
            sortBy: 'posted_date',
            sortOrder: 'desc',
          };

          const response = await jobService.getJobs(params);

          dispatch(setJobs(response.items));
          dispatch(setPagination({
            totalPages: response.totalPages,
            currentPage: response.page,
          }));
        }
      } catch (err) {
        dispatch(setJobError(err instanceof Error ? err.message : 'Failed to load jobs'));
      } finally {
        dispatch(setJobLoading(false));
      }
    };

    fetchJobs();
  }, [dispatch, currentPage, searchQuery, selectedTypes, locationFilter, selectedSkills]);

  // Sync URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedTypes.length > 0) params.set('type', selectedTypes.join(','));
    if (locationFilter) params.set('location', locationFilter);
    if (currentPage > 1) params.set('page', currentPage.toString());

    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedTypes, locationFilter, currentPage, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setCurrentPage(1));
    dispatch(updateFilters({ search: searchQuery }));
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    dispatch(setCurrentPage(1));
  };

  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName) ? prev.filter((s) => s !== skillName) : [...prev, skillName]
    );
    dispatch(setCurrentPage(1));
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedTypes([]);
    setLocationFilter('');
    setSelectedSkills([]);
    dispatch(setCurrentPage(1));
  };

  const hasActiveFilters = searchQuery || selectedTypes.length > 0 || locationFilter || selectedSkills.length > 0;

  return (
    <>
      <Header
        title="Job Listings"
        subtitle="Explore opportunities and find your next career move"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Jobs' },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mock Data Indicator (remove in production) */}
        {USE_MOCK_DATA && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm font-medium">
              ⚠️ Using Mock Data (for testing) - Set USE_MOCK_DATA to false for real API
            </p>
          </div>
        )}

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by job title, company, or keywords..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
              {hasActiveFilters && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {[searchQuery, ...selectedTypes, locationFilter].filter(Boolean).length}
                </span>
              )}
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <XMarkIcon className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                <div className="space-y-2">
                  {EMPLOYMENT_TYPES.map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() => toggleType(type.value)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="e.g., New York, Remote"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {availableSkills.length > 0 ? (
                    availableSkills.map((skill) => (
                      <label key={skill.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill.name)}
                          onChange={() => toggleSkill(skill.name)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{skill.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">Loading skills...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${jobs.length} jobs found`}
          </p>
          {totalPages > 1 && (
            <p className="text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job Grid */}
        {!loading && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {jobs.map((job) => (
              <JobCard key={job.job_id} job={job} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && jobs.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <button
              onClick={() => dispatch(setCurrentPage(currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => dispatch(setCurrentPage(pageNum))}
                    className={`px-4 py-2 border rounded-lg ${currentPage === pageNum
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum} className="px-2 py-2">...</span>;
              }
              return null;
            })}

            <button
              onClick={() => dispatch(setCurrentPage(currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}