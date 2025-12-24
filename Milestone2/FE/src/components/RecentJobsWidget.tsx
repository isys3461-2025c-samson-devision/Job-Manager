import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BriefcaseIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import JobCardMini from '../components/JobCardMini';
import type { Job } from '../types';
import { jobService } from '../services/jobService';
import { profileService } from '../services/profileServices';

const USE_MOCK_DATA = true; // Toggle this to switch between mock and real API

// Mock data matching JobListings.tsx
const MOCK_JOBS: Job[] = [
  {
    job_id: 1,
    company_id: 101,
    title: 'Senior Frontend Developer',
    description: 'We are looking for an experienced frontend developer to join our team.',
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
    description: 'Join our backend team to build scalable microservices.',
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
    description: 'Work on both frontend and backend technologies.',
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
    description: 'Manage our cloud infrastructure on AWS.',
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
    description: 'Create beautiful and intuitive user interfaces.',
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
    description: 'Entry-level position for recent graduates.',
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
];

interface RecentJobsWidgetProps {
  maxJobs?: number;
}

const RecentJobsWidget: React.FC<RecentJobsWidgetProps> = ({ maxJobs = 6 }) => {
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skillMap, setSkillMap] = useState<Map<string, string>>(new Map());

  // Fetch skills on component mount to build ID -> Name mapping
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const skills = await profileService.getSkills();
        const map = new Map<string, string>();
        skills.forEach((skill) => {
          map.set(skill.id, skill.name);
        });
        setSkillMap(map);
      } catch (err) {
        console.error('Error loading skills:', err);
      }
    };
    loadSkills();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [searchParams, skillMap]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      if (USE_MOCK_DATA) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Get skill IDs from URL params
        const skillsParam = searchParams.get('skills');
        const selectedSkillIds = skillsParam ? skillsParam.split(',').filter(Boolean) : [];

        // Convert skill IDs to skill names using the skill map
        const selectedSkillNames = selectedSkillIds
          .map((id) => skillMap.get(id))
          .filter(Boolean) as string[];

        let filteredJobs = [...MOCK_JOBS];

        // Filter by skills if any are selected
        if (selectedSkillNames.length > 0) {
          filteredJobs = filteredJobs.filter((job) => {
            if (!job.skills || job.skills.length === 0) return false;
            return selectedSkillNames.some((skill) => job.skills?.includes(skill));
          });
        }

        // Sort by posted_date (most recent first) and limit
        const recentJobs = filteredJobs
          .sort((a, b) => new Date(b.posted_date).getTime() - new Date(a.posted_date).getTime())
          .slice(0, maxJobs);

        setJobs(recentJobs);
      } else {
        // Use real API
        const skillsParam = searchParams.get('skills');
        const selectedSkillIds = skillsParam ? skillsParam.split(',').filter(Boolean) : [];

        // Convert skill IDs to skill names using the skill map
        const selectedSkillNames = selectedSkillIds
          .map((id) => skillMap.get(id))
          .filter(Boolean) as string[];

        const response = await jobService.getJobs({
          page: 1,
          limit: maxJobs,
          skills: selectedSkillNames.length > 0 ? selectedSkillNames : undefined,
        });

        setJobs(response.items);
      }
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <BriefcaseIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Recommended Jobs</h2>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-2 mb-4">
          <BriefcaseIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Recommended Jobs</h2>
        </div>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BriefcaseIcon className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Recommended Jobs</h2>
        </div>
        <Link
          to="/jobs"
          className="text-base font-medium text-blue-600 hover:text-blue-700 flex items-center gap-2"
        >
          View All
          <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <BriefcaseIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-base text-gray-500">No jobs found matching your skills.</p>
          <Link
            to="/jobs"
            className="mt-3 inline-block text-base font-medium text-blue-600 hover:text-blue-700"
          >
            Browse all jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCardMini key={job.job_id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentJobsWidget;
