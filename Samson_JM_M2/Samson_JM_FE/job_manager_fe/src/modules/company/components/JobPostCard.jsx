import "../styles/jobPost.css";
import { useNavigate } from "react-router-dom";

import {
  EMPLOYMENT_TYPE_LABELS,
  formatSalary,
  formatPostedDate,
} from "../config/jobPostConfig";

export default function JobPostCard({ post }) {
  const navigate = useNavigate();

  // ---------------------------
  // DERIVED VALUES (SAFE)
  // ---------------------------
  const isPublished = post.isPublished === true;

  const statusLabel = isPublished ? "Published" : "Draft";
  const statusClass = isPublished ? "status-public" : "status-draft";

  const employmentLabel =
    EMPLOYMENT_TYPE_LABELS[post.employmentType] ?? post.employmentType;

  const description =
    post.description && post.description.trim().length > 0
      ? post.description
      : "No description provided.";

  // ---------------------------
  // NAVIGATION
  // ---------------------------
  const handleViewApplicants = () => {
    navigate("/company/applicants", {
      state: {
        jobId: post.id || post._id,
        jobTitle: post.title,
      },
    });
  };

  // ---------------------------
  // RENDER
  // ---------------------------
  return (
    <div className="p-4 mb-4 bg-white rounded-4 shadow-sm border">
      <div className="row">
        {/* LEFT COLUMN */}
        <div className="col-12 col-lg-9">
          {/* TITLE + STATUS */}
          <div className="d-flex align-items-center gap-3 mb-2">
            <h4 className="fw-bold mb-0">{post.title}</h4>

            <span className={`status-badge ${statusClass}`}>
              {statusLabel}
            </span>
          </div>

          {/* META ROW */}
          <div className="text-muted small d-flex flex-wrap gap-4 mb-3">
            <span>
              <i className="bi bi-geo-alt me-1 text-danger"></i>
              {post.location}
            </span>

            <span>
              <i className="bi bi-briefcase me-1 text-primary"></i>
              {employmentLabel}
            </span>

            {post.categories?.length > 0 && (
              <span>
                <i className="bi bi-tag me-1"></i>
                {post.categories.join(", ")}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <p className="text-muted">{description}</p>

          {/* SALARY */}
          <div className="fw-semibold mb-3">
            <i className="bi bi-cash-stack me-2 text-success"></i>
            Salary: {formatSalary(post)}
          </div>

          {/* TECHNICAL SKILLS */}
          {post.technicalSkills?.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {post.technicalSkills.map((skill) => (
                <span key={skill} className="skill-chip">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* POSTED DATE */}
          <div className="text-muted small">
            Posted: {formatPostedDate(post.postedDate)}
          </div>
        </div>

        {/* RIGHT COLUMN — ACTIONS */}
        <div className="col-12 col-lg-3 d-flex flex-column align-items-end gap-3 mt-3 mt-lg-0">
          <button
            className="btn btn-primary job-action-btn"
            onClick={handleViewApplicants}
          >
            View Applicants
          </button>

          <button className="btn btn-outline-secondary job-action-btn">
            Edit
          </button>

          <button
            className="btn job-action-btn"
            style={{ background: "#F8D7DA", color: "#D9534F" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
