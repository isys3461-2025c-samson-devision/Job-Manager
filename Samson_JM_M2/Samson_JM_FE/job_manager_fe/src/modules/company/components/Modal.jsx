import React from "react";

const Modal = ({ applicant, onClose }) => {
  if (!applicant) return null; // If no applicant is passed, return null (modal won't show)

  return (
    <div
      className="modal-backdrop"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        zIndex: 1000,
      }}
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="modal-content"
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          zIndex: 1001,
        }}
        onClick={(e) => e.stopPropagation()} // Prevent clicking inside modal from closing it
      >
        <button
          className="btn-close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
          }}
        ></button>

        {/* Modal content */}
        <h4>{applicant.name}</h4>
        <p>{applicant.title}</p>
        <p><strong>Location:</strong> {applicant.location}</p>
        <p><strong>Experience:</strong> {applicant.yearsExperience} years</p>
        <div>
          <strong>Skills:</strong>
          {applicant.skills.map((skill, index) => (
            <span
              key={index}
              className="badge me-1 mb-1"
              style={{
                backgroundColor: "#e5f0ff", // light blue
                color: "#006BFF",
                borderRadius: "999px",
                padding: "4px 10px",
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
        <p><strong>Expected Salary:</strong> {applicant.expectedSalary}</p>
        <p><strong>Availability:</strong> {applicant.availability}</p>
      </div>
    </div>
  );
};

export default Modal;
