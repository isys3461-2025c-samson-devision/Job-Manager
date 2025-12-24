import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, ClockIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import type { Job } from '../types';

interface JobCardMiniProps {
  job: Job;
}

const JobCardMini: React.FC<JobCardMiniProps> = ({ job }) => {
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInMs = now.getTime() - posted.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null;
    
    const formatNumber = (num: number) => {
      if (job.salary_type === 'Annual' && num >= 1000) {
        return `$${(num / 1000).toFixed(0)}k`;
      }
      return `$${num}`;
    };

    if (job.salary_min && job.salary_max) {
      return `${formatNumber(job.salary_min)} - ${formatNumber(job.salary_max)}`;
    }
    return formatNumber(job.salary_min || job.salary_max || 0);
  };

  return (
    <Link
      to={`/jobs/${job.job_id}`}
      className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
    >
      <div className="flex gap-3">
        {/* Company Logo */}
        <div className="flex-shrink-0">
          {job.company_logo ? (
            <img
              src={job.company_logo}
              alt={job.company_name || 'Company'}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <BriefcaseIcon className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Job Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {job.title}
          </h3>
          <p className="text-xs text-gray-600 truncate">
            {job.company_name || 'Company'}
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPinIcon className="w-3 h-3" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              <span>{getTimeAgo(job.posted_date)}</span>
            </div>
          </div>

          {/* Salary and Type */}
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {job.employment_type}
            </span>
            {formatSalary() && (
              <span className="text-xs font-semibold text-green-600">
                {formatSalary()}
              </span>
            )}
          </div>

          {/* Skill Tags */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {job.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{job.skills.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default JobCardMini;
