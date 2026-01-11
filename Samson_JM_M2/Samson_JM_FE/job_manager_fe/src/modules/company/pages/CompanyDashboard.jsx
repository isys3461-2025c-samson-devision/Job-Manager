import { useEffect, useState } from "react";

import CompanyHeader from "../components/CompanyHeader";
import WelcomeBanner from "../components/WelcomeBanner";
import JobPostCard from "../components/JobPostCard";
import JobFilterBar from "../components/JobFilterBar";
import JobPostFormModal from "../components/JobPostFormModal";
import { hasValidToken } from "../../../infrastructure/http/httpClient";

import { jobPostService } from "../service/jobPostService";

import { getMyCompany } from "../api/companyApi";
import { localStorageUtil } from "../../../infrastructure/storage/localStorageUtil";

export default function CompanyDashboard() {
  const [companyName, setCompanyName] = useState(null);


  const [jobPosts, setJobPosts] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [showCreateJobModal, setShowCreateJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobPosts = () => {
    setLoadingJobs(true);

    jobPostService
      .getCompanyJobPosts()
      .then((res) => {
        console.log("JOB POSTS RESPONSE:", res);

        let posts = [];

        if (Array.isArray(res)) {
          posts = res;
        } else if (Array.isArray(res?.content)) {
          posts = res.content;
        } else if (Array.isArray(res?.data)) {
          posts = res.data;
        }

        setJobPosts(
          posts.map((p) => ({
            ...p,
            id: p._id || p.id || p.jobId,
          }))
        );
      })
      .catch((err) => {
        console.error("Failed to load job posts:", err);
        setJobPosts([]);
      })
      .finally(() => setLoadingJobs(false));
  };

  const syncCompanyNameFromApi = async () => {
    try {
      const data = await getMyCompany();
      const name = data?.companyName || "Company";
      setCompanyName(name);
      localStorageUtil.setCompanyName(name);
    } catch (e) {}
  };

  useEffect(() => {
    if (!hasValidToken()) return;

    fetchJobPosts();

    setCompanyName(localStorageUtil.getCompanyName() || "Company");
    syncCompanyNameFromApi();

    const onUpdated = () => {
      setCompanyName(localStorageUtil.getCompanyName() || "Company");
      syncCompanyNameFromApi();
    };

    window.addEventListener("companyNameUpdated", onUpdated);
    return () => window.removeEventListener("companyNameUpdated", onUpdated);
  }, []);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job post?"))
      return;

    await jobPostService.deleteJobPost(jobId);
    fetchJobPosts();
  };

  const handleEditJob = (post) => {
    if (!post.id) {
      console.error("No job ID found!", post);
      alert("Cannot edit job – missing ID");
      return;
    }

    setEditingJob({
      ...post,
      expiryDate: post.expiryDate
        ? new Date(post.expiryDate).toISOString().slice(0, 10)
        : "",
    });
  };

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
        <WelcomeBanner companyName={companyName || "Company"} />

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

        <JobFilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
        />

        {loadingJobs ? (
          <p className="text-muted mt-4">Loading job posts...</p>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <JobPostCard
              key={post.id || post._id}
              post={post}
              onEdit={handleEditJob}
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

      <JobPostFormModal
        show={!!editingJob}
        mode="edit"
        initialData={editingJob}
        onClose={() => setEditingJob(null)}
        onSubmit={async (payload) => {
          console.log("EDITING JOB AT SUBMIT:", editingJob);

          const jobId = editingJob?.id || editingJob?._id || editingJob?.jobId;

          if (!jobId) {
            console.error("No job ID found!", editingJob);
            alert("Error: Cannot update job - no ID found");
            return;
          }

          console.log("Using job ID:", jobId);
          await jobPostService.updateJobPost(jobId, payload);
          setEditingJob(null);
          fetchJobPosts();
        }}
      />
    </>
  );
}
