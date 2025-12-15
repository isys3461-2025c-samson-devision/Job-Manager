// src/modules/company/components/Modal.jsx
import React, { useState } from "react";

const Modal = ({ applicant, onClose, showHireButton = false, jobTitle = "", onHire }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  if (!applicant) return null;

  const summaryText =
    applicant.summary ||
    `${applicant.name} is a ${applicant.title} with ${applicant.yearsExperience}+ years of experience in modern development and collaboration with cross-functional teams.`;

  const pink = "#ec4899";

  // Handle Hire click (optional callback)
  const handleHire = () => {
    if (typeof onHire === "function") onHire(applicant);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 960,
          backgroundColor: "#ffffff",
          borderRadius: 18,
          boxShadow: "0 18px 45px rgba(15,23,42,0.4)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          className="btn-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "none",
            border: "none",
            zIndex: 10,
          }}
        ></button>

        {/* Top-right action buttons */}
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 24,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            zIndex: 10,
            alignItems: "flex-end",
          }}
        >
          {/* Row: Warning + Favorite */}
          <div style={{ display: "flex", gap: 8 }}>
            {/* Warning */}
            <button
              type="button"
              title="Warning"
              onClick={() => setIsWarning((p) => !p)}
              style={{
                borderRadius: "999px",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                border: "1.5px solid #ef4444",
                backgroundColor: isWarning ? "#fef2f2" : "transparent",
                color: "#ef4444",
              }}
            >
              <i className={`bi ${isWarning ? "bi-x-circle-fill" : "bi-x-lg"}`} />
            </button>

            {/* Favorite */}
            <button
              type="button"
              title="Favorite"
              onClick={() => setIsFavorite((p) => !p)}
              style={{
                borderRadius: "999px",
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0,
                border: `1.5px solid ${pink}`,
                backgroundColor: isFavorite ? "#fdf2f8" : "transparent",
                color: pink,
              }}
            >
              <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`} />
            </button>
          </div>

          {/* Hire button (only in job context) */}
          {showHireButton && (
            <button
              type="button"
              onClick={handleHire}
              className="btn btn-success btn-sm"
              style={{
                borderRadius: 10,
                paddingInline: 16,
                height: 36,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              title={jobTitle ? `Hire for ${jobTitle}` : "Hire"}
            >
              <i className="bi bi-check2-circle" />
              Hire
            </button>
          )}
        </div>

        {/* CV layout */}
        <div className="row g-0">
          {/* LEFT SIDEBAR */}
          <div
            className="col-md-4"
            style={{
              backgroundColor: "#0b2540",
              color: "#e5e7eb",
              padding: "28px 22px",
            }}
          >
            {/* Avatar */}
            <div className="text-center mb-4">
              <img
                src={applicant.avatarUrl}
                alt={applicant.name}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid #ffffff",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.5)",
                  marginBottom: 14,
                }}
              />
            </div>

            {/* CONTACT */}
            <div
              className="mb-3 pb-3"
              style={{
                borderBottom: "1px solid rgba(148,163,184,0.5)",
                fontSize: "0.82rem",
              }}
            >
              <div
                className="mb-2"
                style={{
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                Contact
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-geo-alt me-2" />
                <span>{applicant.location}</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-clock me-2" />
                <span>Availability: {applicant.availability}</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <i className="bi bi-cash-coin me-2" />
                <span>Salary: {applicant.expectedSalary}</span>
              </div>
              {applicant.rating && (
                <div className="d-flex align-items-center mb-1">
                  <i className="bi bi-star-fill me-2" style={{ color: "#FDBA3C" }} />
                  <span>Rating: {applicant.rating}</span>
                </div>
              )}
            </div>

            {/* EDUCATION */}
            <div
              className="mb-3 pb-3"
              style={{
                borderBottom: "1px solid rgba(148,163,184,0.5)",
                fontSize: "0.82rem",
              }}
            >
              <div
                className="mb-2"
                style={{
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                Education
              </div>
              <div style={{ lineHeight: 1.5 }}>{applicant.education}</div>
            </div>

            {/* SKILLS */}
            <div style={{ fontSize: "0.82rem" }}>
              <div
                className="mb-2"
                style={{
                  textTransform: "uppercase",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                }}
              >
                Skills
              </div>
              <div>
                {applicant.skills.map((skill) => (
                  <span
                    key={skill}
                    className="badge me-1 mb-1"
                    style={{
                      backgroundColor: "rgba(15,23,42,0.95)",
                      color: "#e5f0ff",
                      borderRadius: 999,
                      padding: "4px 10px",
                      fontSize: "0.75rem",
                      border: "1px solid rgba(148,163,253,0.7)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div
            className="col-md-8"
            style={{
              padding: "30px 34px",
              fontSize: "0.9rem",
              backgroundColor: "#ffffff",
            }}
          >
            <section className="mb-4">
              <h3 className="mb-1" style={{ fontWeight: 700, letterSpacing: "0.03em" }}>
                {applicant.name}
              </h3>
              <div
                style={{
                  textTransform: "uppercase",
                  color: "#6b7280",
                  fontSize: "0.85rem",
                  letterSpacing: "0.16em",
                }}
              >
                {applicant.title}
              </div>

              {/* Optional: show job title context */}
              {showHireButton && jobTitle && (
                <div style={{ marginTop: 10, color: "#334155", fontSize: "0.86rem" }}>
                  Applied for: <strong>{jobTitle}</strong>
                </div>
              )}
            </section>

            <section className="mb-4">
              <h6
                className="mb-2"
                style={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontSize: "0.8rem",
                }}
              >
                Career Objective
              </h6>
              <p style={{ color: "#4b5563", marginBottom: 0 }}>{summaryText}</p>
            </section>

            <section className="mb-4">
              <h6
                className="mb-2"
                style={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontSize: "0.8rem",
                }}
              >
                Work Experience
              </h6>

              {Array.isArray(applicant.experiences) && applicant.experiences.length > 0 ? (
                applicant.experiences.map((exp, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="d-flex justify-content-between">
                      <strong>{exp.company}</strong>
                      <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>{exp.period}</span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.86rem",
                        color: "#111827",
                        marginBottom: 2,
                      }}
                    >
                      {exp.role}
                    </div>
                    <ul
                      style={{
                        paddingLeft: "1.1rem",
                        marginBottom: 0,
                        fontSize: "0.85rem",
                        color: "#4b5563",
                      }}
                    >
                      {Array.isArray(exp.highlights)
                        ? exp.highlights.map((h, i) => <li key={i}>{h}</li>)
                        : exp.description && <li>{exp.description}</li>}
                    </ul>
                  </div>
                ))
              ) : (
                <p style={{ color: "#4b5563", fontSize: "0.85rem" }}>
                  {applicant.yearsExperience}+ years of experience building and maintaining web
                  applications, collaborating closely with designers, product owners and backend teams.
                </p>
              )}
            </section>

            <section>
              <h6
                className="mb-2"
                style={{
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  fontSize: "0.8rem",
                }}
              >
                Highlights
              </h6>
              <ul
                style={{
                  paddingLeft: "1.1rem",
                  marginBottom: 0,
                  fontSize: "0.85rem",
                  color: "#4b5563",
                }}
              >
                <li>
                  Strong hands-on experience with {applicant.skills.slice(0, 3).join(", ")} and other
                  modern technologies.
                </li>
                <li>Comfortable working in agile teams and communicating with stakeholders.</li>
                <li>Open to opportunities in {applicant.location}.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
