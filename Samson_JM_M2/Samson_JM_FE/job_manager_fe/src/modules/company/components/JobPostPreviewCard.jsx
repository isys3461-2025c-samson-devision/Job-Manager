export default function JobPostPreviewCard({ title, applicants, status }) {
  return (
    <div className="p-3 shadow-sm rounded-4 bg-white mb-3">
      <h6 className="fw-bold">{title}</h6>
      <div className="d-flex justify-content-between mt-2">
        <small className="text-muted">{applicants} Applicants</small>
        <span className="badge bg-success">{status}</span>
      </div>
    </div>
  );
}
