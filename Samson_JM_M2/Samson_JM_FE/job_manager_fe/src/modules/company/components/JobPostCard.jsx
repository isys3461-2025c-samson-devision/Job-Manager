import "../styles/jobPost.css";

export default function JobPostCard({ post }) {
  const statusClass =
    {
      public: "status-public",
      private: "status-private",
      draft: "status-draft",
    }[post.status.toLowerCase()] || "status-draft";

  return (
    <div className="p-4 mb-4 bg-white rounded-4 shadow-sm border">
      <div className="row">
        {/* LEFT COLUMN — JOB INFO */}
        <div className="col-12 col-lg-9">
          {/* Title + status badge in SAME LINE */}
          <div className="d-flex align-items-center gap-3 mb-2">
            <h4 className="fw-bold mb-0">{post.title}</h4>
            <span className={`status-badge ${statusClass} ms-3`}>
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </span>
          </div>

          <div className="text-muted small d-flex flex-wrap gap-3 mb-3">
            <span>
              <i className="bi bi-building me-1"></i>
              {post.company}
            </span>
            <span>
              <i className="bi bi-geo-alt me-1 text-danger"></i>
              {post.location}
            </span>
            <span>
              <i className="bi bi-cash-stack me-1 text-success"></i>
              {post.salary}
            </span>
            <span>
              <i className="bi bi-briefcase me-1 text-primary"></i>
              {post.type}
            </span>
          </div>

          <p className="text-muted">{post.description}</p>

          <div className="text-muted small mt-3 d-flex gap-4 flex-wrap">
            <span>
              <i className="bi bi-people me-1 text-primary"></i>
              {post.applicants} applicants
            </span>
            <span>
              <i className="bi bi-eye me-1 text-success"></i>
              {post.views} views
            </span>
            <span>Posted: {post.postedDate}</span>
          </div>
        </div>

        {/* RIGHT COLUMN — BUTTONS */}
        <div className="col-12 col-lg-3 d-flex flex-column align-items-end gap-3 mt-3 mt-lg-0">
          {/* VIEW APPLICANTS */}
          <button className="btn btn-primary job-action-btn">
            View Applicants
          </button>

          {/* EDIT BUTTON */}
          <button className="btn btn-outline-secondary job-action-btn">
            Edit
          </button>

          {/* DELETE BUTTON */}
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
