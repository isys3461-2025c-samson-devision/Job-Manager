// src/app/modules/company/pages/CompanyApplicants.jsx
import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import CompanyHeader from "../components/CompanyHeader";
import ApplicantCard from "../components/ApplicantsCard";
import Modal from "../components/Modal";
import mockApplicants from "../data/mockApplicants.json";

export default function CompanyApplicants() {
  const [keyword, setKeyword] = useState("");
  const [locationText, setLocationText] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // jobId, jobTitle from JobPostPage
  const routerLocation = useLocation();
  const jobIdFromJobPage = routerLocation.state?.jobId || null;
  const jobTitleFromJobPage = routerLocation.state?.jobTitle || "";

  const isJobContext = !!jobIdFromJobPage;

  // Filter applicants
  const filteredApplicants = useMemo(() => {
    return mockApplicants
      .filter((a) => {
        if (!jobIdFromJobPage) return true;
        return Array.isArray(a.appliedJobIds) && a.appliedJobIds.includes(Number(jobIdFromJobPage));
      })
      .filter((a) => {
        const kw = keyword.toLowerCase();
        const loc = locationText.toLowerCase();

        const matchKeyword =
          !kw ||
          a.name.toLowerCase().includes(kw) ||
          a.title.toLowerCase().includes(kw) ||
          a.skills.some((s) => s.toLowerCase().includes(kw));

        const matchLocation =
          !loc || a.location.toLowerCase().includes(loc);

        return matchKeyword && matchLocation;
      });
  }, [keyword, locationText, jobIdFromJobPage]);
  const handleViewProfile = (applicant) => {
    setSelectedApplicant(applicant);
    setShowModal(true);
  };

  const handleCloseModal = () => {
  setShowModal(false);
  setSelectedApplicant(null);
  };

  const pageTitle = isJobContext
    ? `Applicants for ${jobTitleFromJobPage}`
    : "Search Applicants";

  const pageSubtitle = isJobContext
    ? "Review candidates who applied for this job."
    : "Find the perfect candidates for your open positions.";

  return (
    <>
      <CompanyHeader />
      <div style={{ backgroundColor: "#f3f6fb", minHeight: "100vh" }}>
        <div className="container py-4" style={{ maxWidth: "1120px" }}>
          <h3 className="mb-1">{pageTitle}</h3>
          <p className="text-muted mb-4">{pageSubtitle}</p>

          {/* Search bar */}
          <div
            className="card mb-4 border-0"
            style={{
              borderRadius: "18px",
              boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div className="card-body py-3">
              <div className="row g-2 align-items-center">
                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="Search by name, title, or skills..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="Location"
                    value={locationText}
                    onChange={(e) => setLocationText(e.target.value)}
                  />
                </div>
                <div className="col-md-4 text-md-end">
                  <button
                    className="btn w-100"
                    style={{
                      backgroundColor: "#006BFF",
                      borderRadius: "999px",
                      color: "white",
                      height: "44px",
                      fontWeight: 500,
                    }}
                  >
                    <i className="bi bi-funnel-fill me-1" />
                    Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Result count */}
          <div className="mb-3 text-muted">
            {filteredApplicants.length} candidates found
          </div>

          {/* Applicant cards */}
          <div className="row g-3">
            {filteredApplicants.map((a) => (
              <div className="col-lg-6 col-12" key={a.id}>
                <ApplicantCard
                  applicant={a}
                  onViewProfile={handleViewProfile}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedApplicant && (
        <Modal
          applicant={selectedApplicant}
          onClose={handleCloseModal}
          showHireButton={isJobContext}       //show hire button
          jobTitle={jobTitleFromJobPage}
        />
      )}
    </>
  );
}
