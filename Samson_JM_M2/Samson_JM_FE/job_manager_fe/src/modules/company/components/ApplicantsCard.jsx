export default function ApplicantCard({ applicant: a }) {
  return (
    <div
      className="card border-0 h-100"
      style={{
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        border: "1px solid #dbeafe",
        boxShadow: "0 8px 18px rgba(30, 64, 175, 0.08)",
      }}
    >
      <div className="card-body p-3">
        {/* HEADER: avatar + name + button */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div className="d-flex">
            <img
              src={a.avatarUrl}
              alt={a.name}
              className="rounded-circle me-3"
              style={{ width: 48, height: 48, objectFit: "cover" }}
            />
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                {a.name}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#6b7280",
                  marginBottom: 2,
                }}
              >
                {a.title}
              </div>
              <div className="d-flex align-items-center">
                <i
                  className="bi bi-star-fill"
                  style={{ color: "#FDBA3C", fontSize: "0.8rem" }}
                />
                <span
                  style={{
                    fontSize: "0.8rem",
                    marginLeft: 4,
                    color: "#111827",
                  }}
                >
                  {a.rating}
                </span>
              </div>
            </div>
          </div>

          <button
            className="btn btn-primary btn-sm"
            style={{
              borderRadius: 999,
              paddingInline: 18,
              paddingBlock: 6,
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            View Profile
          </button>
        </div>

        {/* MIDDLE: info + skills */}
        <div className="mb-3" style={{ fontSize: "0.8rem", color: "#4b5563" }}>
          {/* info */}
          <div className="mb-2 d-flex align-items-center">
            <i className="bi bi-geo-alt me-2" />
            {a.location}
          </div>
          <div className="mb-2 d-flex align-items-center">
            <i className="bi bi-briefcase me-2" />
            {a.yearsExperience} years experience
          </div>
          <div className="mb-2 d-flex align-items-center">
            <i className="bi bi-mortarboard me-2" />
            {a.education}
          </div>

          {/* Skills – mb-2 */}
          <div className="mb-2">
            <div
              style={{
                fontSize: "0.78rem",
                color: "#000000ff",
                marginBottom: 4,
                fontWeight: 600, // bold "Skills"
              }}
            >
              Skills:
            </div>
            <div>
              {a.skills.map((s) => (
                <span
                  key={s}
                  className="badge me-1 mb-1"
                  style={{
                    backgroundColor: "#e5f0ff",
                    color: "#006BFF",
                    borderRadius: 999,
                    padding: "4px 10px",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    border: "none",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Grey-Line */}
        <hr className="my-3" />

        {/* BOTTOM: salary + availability */}
        <div className="d-flex justify-content-between">
          <div>
            <div
              style={{
                fontSize: "0.78rem",
                color: "#9ca3af",
                marginBottom: 2,
              }}
            >
              Expected Salary
            </div>
            <div style={{ fontSize: "0.8rem", color: "#111827" }}>
              {a.expectedSalary}
            </div>
          </div>
          <div className="text-end">
            <div
              style={{
                fontSize: "0.78rem",
                color: "#9ca3af",
                marginBottom: 2,
              }}
            >
              Availability
            </div>
            <div style={{ fontSize: "0.8rem", color: "#111827" }}>
              {a.availability}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
