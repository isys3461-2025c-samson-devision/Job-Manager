export default function ApplicantCard({
  applicant: a,
  onViewProfile,
  isFavorite = false,
  isWarning = false,
}) {
  const nameParts = (a.name || "").trim().split(/\s+/);
  const firstName = a.firstName || nameParts[0] || "Unknown";
  const lastName = a.lastName || nameParts.slice(1).join(" ") || "";
  const displayName = `${firstName} ${lastName}`.trim();
  const showFlags = isWarning || isFavorite;

  const getHighestEducationDegree = (education) => {
    const rank = {
      Bachelor: 1,
      Master: 2,
      Doctorate: 3,
    };

    if (!education) {
      return "Not specified";
    }

    const degrees = Array.isArray(education)
      ? education.map((edu) => edu.degree)
      : [education];

    let highest = "";
    let highestRank = 0;

    degrees.forEach((degree) => {
      if (!degree || !rank[degree]) {
        return;
      }
      if (rank[degree] > highestRank) {
        highestRank = rank[degree];
        highest = degree;
      }
    });

    return highest || degrees[0] || "Not specified";
  };

  const highestEducation = getHighestEducationDegree(a.education);

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
                {displayName}
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
              {showFlags && (
                <div className="d-flex align-items-center gap-2 mt-1">
                  {isWarning && (
                    <span
                      title="Warning"
                      style={{ color: "#ef4444", fontSize: "0.85rem" }}
                    >
                      <i className="bi bi-exclamation-triangle-fill" />
                    </span>
                  )}
                  {isFavorite && (
                    <span
                      title="Favorite"
                      style={{ color: "#ec4899", fontSize: "0.85rem" }}
                    >
                      <i className="bi bi-heart-fill" />
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* "View Profile" Button inside the Card */}
          <button
            className="btn btn-primary btn-sm"
            style={{
              borderRadius: 999,
              paddingInline: 18,
              paddingBlock: 6,
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
            onClick={() => onViewProfile(a)} // Trigger modal in the parent component
          >
            View Profile
          </button>
        </div>

        {/* MIDDLE: info + skills */}
        <div className="mb-3" style={{ fontSize: "0.8rem", color: "#4b5563" }}>
          {/* info */}
          <div className="mb-2 d-flex align-items-center">
            <i className="bi bi-geo-alt me-2" />
            {a.city}, {a.country}
          </div>
          <div className="mb-2 d-flex align-items-center">
            <i className="bi bi-envelope me-2" />
            {a.email || "Email not provided"}
          </div>
          <div className="mb-2 d-flex align-items-center">
            <i className="bi bi-mortarboard me-2" />
            Highest Education: {highestEducation}
          </div>

          {/* Skills */}
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
