import CompanyHeader from "../components/CompanyHeader";
import WelcomeBanner from "../components/WelcomeBanner";
import StatCard from "../components/StatCard";
import JobPostCard from "../components/JobPostCard";
import JobFilterBar from "../components/JobFilterBar";

import mockPosts from "../data/mockJobPosts.json";

import { useEffect, useState } from "react";
import { companyService } from "../service/companyService";

export default function CompanyDashboard() {
  const [stats, setStats] = useState(null);

  // SEARCH INPUT
  const [searchTerm, setSearchTerm] = useState("");

  // SIMPLE FILTER DROPDOWN
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    companyService.getCompanyStats().then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  // ---------------------------
  // SEARCH + FILTER LOGIC
  // ---------------------------
  const filteredPosts = mockPosts.filter((post) => {
    const searchMatch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.type.toLowerCase().includes(searchTerm.toLowerCase());

    const filterMatch = filterStatus === "all" || post.status === filterStatus;

    return searchMatch && filterMatch;
  });

  return (
    <>
      <CompanyHeader />

      <div className="container py-4">
        <WelcomeBanner />

        {/* STAT CARDS */}
        <div className="row mb-4 g-4">
          <div className="col-md-3 col-sm-6">
            <StatCard
              icon="bi-briefcase"
              iconColor="#2d68ff"
              value={stats.activeJobs}
              label="Active Jobs"
            />
          </div>

          <div className="col-md-3 col-sm-6">
            <StatCard
              icon="bi-people"
              iconColor="#555"
              value={stats.totalApplicants}
              label="Total Applicants"
            />
          </div>

          <div className="col-md-3 col-sm-6">
            <StatCard
              icon="bi-eye"
              iconColor="#C063E6"
              value={stats.totalViews}
              label="Total Views"
            />
          </div>

          <div className="col-md-3 col-sm-6">
            <StatCard
              icon="bi-file-earmark-text"
              iconColor="#E88F2A"
              value={stats.drafts}
              label="Drafts"
            />
          </div>
        </div>

        {/* JOB POSTING HEADER */}
        <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
          <div>
            <h4 className="fw-bold">Job Posting</h4>
            <p className="text-muted small">Create new jobs</p>
          </div>
          <button className="btn btn-primary">+ Post New Job</button>
        </div>

        {/* YOUR JOB LIST */}
        <div className="mt-4">
          <h4 className="fw-bold">Your Job List</h4>
          <p className="text-muted small">
            Manage your job listing and track applications
          </p>

          {/* SEARCH + FILTER */}
          <JobFilterBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        </div>

        {/* JOB POST LIST */}
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <JobPostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center text-muted py-5">
            <i className="bi bi-search fs-1 mb-3"></i>
            <p className="fw-semibold">No job posts found</p>
            <p className="small">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </>
  );
}
