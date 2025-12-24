import { Link } from 'react-router-dom';
import {
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import type { Job } from '../types';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return 'Negotiable';
    if (job.salary_min && job.salary_max) {
      return `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`;
    }
    if (job.salary_min) return `From $${job.salary_min.toLocaleString()}`;
    return `Up to $${job.salary_max?.toLocaleString()}`;
  };

  const getEmploymentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'Full-time': 'bg-green-100 text-green-800',
      'Part-time': 'bg-blue-100 text-blue-800',
      'Contract': 'bg-purple-100 text-purple-800',
      'Internship': 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
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

  return (
    <Link to={`/jobs/${job.job_id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 hover:border-blue-400 cursor-pointer h-full flex flex-col">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-4">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            {job.company_logo ? (
              <img
                src={job.company_logo}
                alt={job.company_name || 'Company'}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {job.company_name?.charAt(0) || job.title.charAt(0)}
              </div>
            )}
          </div>

          {/* Title and Company */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-gray-900 mb-1 line-clamp-2">
              {job.title}
            </h3>
            {job.company_name && (
              <p className="text-gray-600 font-medium mb-2 truncate">{job.company_name}</p>
            )}

            {/* Badge */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEmploymentTypeBadge(job.employment_type)}`}>
                {job.employment_type}
              </span>
              {!job.is_published && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Draft
                </span>
              )}
            </div>
          </div>

          {/* Posted Time */}
          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-1 text-sm text-gray-500 whitespace-nowrap">
              <ClockIcon className="w-4 h-4" />
              <span>{getTimeAgo(job.posted_date)}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">
          {job.description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPinIcon className="w-5 h-5 text-gray-400" />
            <span className="truncate">{job.location}</span>
          </div>

          {/* Salary */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
            <span>{formatSalary()}</span>
          </div>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-xs text-gray-500">+{job.skills.length - 4} more</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BriefcaseIcon className="w-4 h-4" />
            <span>View Details</span>
          </div>

          <span className="text-xs text-gray-500">
            {job.salary_type}
          </span>
        </div>
      </div>
    </Link>
  );
}