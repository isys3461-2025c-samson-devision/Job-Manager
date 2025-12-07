import CompanyHeader from "../components/CompanyHeader";

const mockProfile = {
  name: "User Name",
  title: "Job Seeker",
  email: "test@gmail.com",
  phone: "+084 123 456 789",
  location: "Ho Chi Minh City, Vietnam",
  about:
    "Passionate professional with 5+ year of experience in technology and innovation. Specialized in building scalable solutions and leading cross-functional teams. Always eager to learn new technologies and contribute to meaningful projects.",
  experience: {
    role: "Senior Developer",
    company: "Tech Company Ltd",
    period: "2021 - Present",
    description:
      "Leading development of web applications using modern technologies. Managing a team of 5 developers and driving technical decisions.",
  },
  skills: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Next.js",
    "Node.js",
    "AWS",
    "Python",
    "Docker",
    "PostgreSQL",
  ],
  certificates: [
    {
      title: "AWS Solutions Architect",
      issuer: "Amazon Web Services",
    },
    {
      title: "Professional Scrum Master",
      issuer: "Scrum.org",
    },
  ],
};

export default function CompanyProfile() {
  const p = mockProfile;

  return (
    <>
      <CompanyHeader />

      <div style={{ backgroundColor: "#f3f6fb", minHeight: "100vh" }}>
        <div className="container py-4" style={{ maxWidth: "1120px" }}>
          {/* TOP PROFILE CARD */}
          <div
            className="card border-0 mb-4"
            style={{
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 8px 18px rgba(15,23,42,0.08)",
            }}
          >
            {/* blue banner */}
            <div
              style={{
                backgroundColor: "#006BFF",
                height: "80px",
              }}
            />

            {/* main content */}
            <div className="px-4 pb-3 pt-2 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {/* avatar placeholder */}
                  <div
                    className="d-flex align-items-center justify-content-center me-3"
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "12px",
                      backgroundColor: "#e5e7eb",
                      marginTop: -32,
                      border: "3px solid #ffffff",
                    }}
                  >
                    <i
                      className="bi bi-person fs-3"
                      style={{ color: "#6b7280" }}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: "1rem", fontWeight: 600 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                      {p.title}
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  style={{
                    borderRadius: "999px",
                    paddingInline: 20,
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                >
                  <i className="bi bi-pencil me-1" />
                  Edit Profile
                </button>
              </div>

              {/* contact row */}
              <div
                className="d-flex flex-wrap justify-content-between mt-3 pt-3"
                style={{ borderTop: "1px solid #e5e7eb", fontSize: "0.85rem" }}
              >
                <div className="d-flex align-items-center me-3 mb-2">
                  <i className="bi bi-envelope me-2" />
                  <span>{p.email}</span>
                </div>
                <div className="d-flex align-items-center me-3 mb-2">
                  <i className="bi bi-telephone me-2" />
                  <span>{p.phone}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-geo-alt me-2" />
                  <span>{p.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN GRID */}
          <div className="row g-3">
            {/* LEFT COLUMN */}
            <div className="col-lg-8">
              {/* About Me */}
              <div
                className="card border-0 mb-3"
                style={{
                  borderRadius: "14px",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
                }}
              >
                <div className="card-body">
                  <div
                    className="d-flex justify-content-between align-items-center mb-2"
                    style={{ fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    <span>About Me</span>
                    <i
                      className="bi bi-pencil"
                      style={{ fontSize: "0.9rem", cursor: "pointer" }}
                    />
                  </div>
                  <p
                    className="mb-0"
                    style={{ fontSize: "0.85rem", color: "#4b5563" }}
                  >
                    {p.about}
                  </p>
                </div>
              </div>

              {/* Work Experience */}
              <div
                className="card border-0"
                style={{
                  borderRadius: "14px",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
                }}
              >
                <div className="card-body">
                  <div
                    className="d-flex justify-content-between align-items-center mb-3"
                    style={{ fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    <span>Work Experience</span>
                    <i
                      className="bi bi-pencil"
                      style={{ fontSize: "0.9rem", cursor: "pointer" }}
                    />
                  </div>

                  <div className="d-flex">
                    <div
                      className="d-flex align-items-start justify-content-center me-3"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "10px",
                        backgroundColor: "#e0edff",
                      }}
                    >
                      <i
                        className="bi bi-briefcase"
                        style={{
                          color: "#006BFF",
                          fontSize: "1.1rem",
                          marginTop: 8,
                        }}
                      />
                    </div>
                    <div>
                      <div
                        style={{ fontSize: "0.9rem", fontWeight: 600 }}
                        className="mb-1"
                      >
                        {p.experience.role}
                      </div>
                      <div
                        style={{ fontSize: "0.82rem", color: "#6b7280" }}
                        className="mb-1"
                      >
                        {p.experience.company}
                      </div>
                      <div
                        style={{ fontSize: "0.8rem", color: "#9ca3af" }}
                        className="mb-2"
                      >
                        {p.experience.period}
                      </div>
                      <p
                        className="mb-0"
                        style={{ fontSize: "0.85rem", color: "#4b5563" }}
                      >
                        {p.experience.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-lg-4">
              {/* Skills */}
              <div
                className="card border-0 mb-3"
                style={{
                  borderRadius: "14px",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
                }}
              >
                <div className="card-body">
                  <div
                    className="d-flex justify-content-between align-items-center mb-2"
                    style={{ fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    <span>Skills</span>
                    <i
                      className="bi bi-pencil"
                      style={{ fontSize: "0.9rem", cursor: "pointer" }}
                    />
                  </div>
                  <div>
                    {p.skills.map((s) => (
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
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certificate */}
              <div
                className="card border-0"
                style={{
                  borderRadius: "14px",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.06)",
                }}
              >
                <div className="card-body">
                  <div
                    className="d-flex justify-content-between align-items-center mb-3"
                    style={{ fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    <span>Certificate</span>
                    <i
                      className="bi bi-pencil"
                      style={{ fontSize: "0.9rem", cursor: "pointer" }}
                    />
                  </div>

                  {p.certificates.map((c, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="d-flex align-items-start">
                        <i
                          className="bi bi-award me-2"
                          style={{ color: "#F97316", fontSize: "1.1rem" }}
                        />
                        <div>
                          <div
                            style={{ fontSize: "0.85rem", fontWeight: 600 }}
                            className="mb-1"
                          >
                            {c.title}
                          </div>
                          <div
                            style={{ fontSize: "0.8rem", color: "#6b7280" }}
                          >
                            {c.issuer}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
