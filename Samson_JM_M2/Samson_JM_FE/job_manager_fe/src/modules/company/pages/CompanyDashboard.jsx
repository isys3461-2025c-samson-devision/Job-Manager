import { useEffect, useState } from "react";

import CompanyHeader from "../components/CompanyHeader";
import WelcomeBanner from "../components/WelcomeBanner";
import StatCard from "../components/StatCard";
import JobPostCard from "../components/JobPostCard";
import JobFilterBar from "../components/JobFilterBar";
import JobPostFormModal from "../components/JobPostFormModal";

import { companyService } from "../service/companyService";
import { jobPostService } from "../service/jobPostService";

export default function CompanyDashboard() {
  const [stats, setStats] = useState(null);

  const [jobPosts, setJobPosts] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // =======================
  // LOAD COMPANY STATS
  // =======================
  useEffect(() => {
    companyService.getCompanyStats().then(setStats);
  }, []);

  // =======================
  // LOAD JOB POSTS
  // =======================
  const fetchJobPosts = () => {
    setLoadingJobs(true);
    jobPostService
      .getCompanyJobPosts()
      .then(setJobPosts)
      .finally(() => setLoadingJobs(false));
  };

  useEffect(() => {
    fetchJobPosts();
  }, []);

  if (!stats) return <p>Loading...</p>;

  // =======================
  // DELETE JOB
  // =======================
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job post?"))
      return;

    await jobPostService.deleteJobPost(jobId);
    fetchJobPosts();
  };

  // =======================
  // SEARCH + FILTER
  // =======================
  const filteredPosts = jobPosts.filter((post) => {
    const search = searchTerm.toLowerCase();

    const searchMatch =
      (post.title || "").toLowerCase().includes(search) ||
      (post.location || "").toLowerCase().includes(search) ||
      (post.employmentType || "").toLowerCase().includes(search);

    let statusMatch = true;
    if (filterStatus === "published") statusMatch = post.isPublished === true;
    if (filterStatus === "draft") statusMatch = post.isPublished === false;

    return searchMatch && statusMatch;
  });

  return (
    <>
      <CompanyHeader />

      <div className="container py-4">
        <WelcomeBanner />

        {/* =======================
            STAT CARDS
        ======================== */}
        <div className="row mb-4 g-4">
          <div className="col-md-3 col-sm-6">
            <StatCard
              icon="bi-briefcase"
              iconColor="#2d68ff"
              value={stats.publishedJobs}
              label="Published Jobs"
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

        {/* =======================
            HEADER
        ======================== */}
        <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
          <div>
            <h4 className="fw-bold">Job Posting</h4>
            <p className="text-muted small">Create new jobs</p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => setShowCreateJobModal(true)}
          >
            + Create Job Post
          </button>
        </div>

        {/* =======================
            FILTER BAR
        ======================== */}
        <JobFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {/* =======================
            JOB LIST
        ======================== */}
        {loadingJobs ? (
          <p className="text-muted mt-4">Loading job posts...</p>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <JobPostCard
              key={post.id}
              post={post}
              onEdit={setEditingJob}
              onDelete={handleDeleteJob}
            />
          ))
        ) : (
          <div className="text-center text-muted py-5">
            <i className="bi bi-search fs-1 mb-3"></i>
            <p className="fw-semibold">No job posts found</p>
            <p className="small">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>

      {/* =======================
          CREATE MODAL
      ======================== */}
      <JobPostFormModal
        show={showCreateJobModal}
        mode="create"
        onClose={() => setShowCreateJobModal(false)}
        onSubmit={async (payload) => {
          await jobPostService.createJobPost(payload);
          setShowCreateJobModal(false);
          fetchJobPosts();
        }}
      />

      {/* =======================
          EDIT MODAL
      ======================== */}
      <JobPostFormModal
        show={!!editingJob}
        mode="edit"
        initialData={editingJob}
        onClose={() => setEditingJob(null)}
        onSubmit={async (payload) => {
          await jobPostService.updateJobPost(editingJob.id, payload);
          setEditingJob(null);
          fetchJobPosts();
        }}
      />
    </>
  );
}
