import { useMemo, useState } from "react";
import CompanyHeader from "../components/CompanyHeader";
import mockApplicants from "../data/mockApplicants.json";

export default function CompanyApplicants() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const filteredApplicants = useMemo(() => {
    return mockApplicants.filter((a) => {
      const kw = keyword.toLowerCase();
      const loc = location.toLowerCase();

      const matchKeyword =
        !kw ||
        a.name.toLowerCase().includes(kw) ||
        a.title.toLowerCase().includes(kw) ||
        a.skills.some((s) => s.toLowerCase().includes(kw));

      const matchLocation = !loc || a.location.toLowerCase().includes(loc);

      return matchKeyword && matchLocation;
    });
  }, [keyword, location]);

  return (
    <>
      <CompanyHeader />

      {/* light grey background like Figma */}
      <div style={{ backgroundColor: "#f5f7fb", minHeight: "100vh" }}>
        <div
          className="container py-4"
          style={{ maxWidth: "1120px" }} // narrower center column
        >
          {/* Page title */}
          <h3 className="mb-1">Search Applicants</h3>
          <p className="text-muted mb-4">
            Find the perfect candidates for your open positions.
          </p>

          {/* Search bar card */}
          <div
            className="card mb-4 border-0 shadow-sm"
            style={{ borderRadius: "16px" }}
          >
            <div className="card-body py-3">
              <div className="row g-2 align-items-center">
                {/* Keyword */}
                <div className="col-md-5">
                  <div
                    className="input-group"
                    style={{ backgroundColor: "#f9fafb", borderRadius: "999px" }}
                  >
                    <span
                      className="input-group-text bg-transparent border-0"
                      style={{ paddingLeft: "16px" }}
                    >
                      <i className="bi bi-search" />
                    </span>
                    <input
                      className="form-control border-0"
                      style={{
                        backgroundColor: "transparent",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
                      placeholder="Search by name, title, or skills..."
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="col-md-4">
                  <div
                    className="input-group"
                    style={{ backgroundColor: "#f9fafb", borderRadius: "999px" }}
                  >
                    <span
                      className="input-group-text bg-transparent border-0"
                      style={{ paddingLeft: "16px" }}
                    >
                      <i className="bi bi-geo-alt" />
                    </span>
                    <input
                      className="form-control border-0"
                      style={{
                        backgroundColor: "transparent",
                        paddingTop: "10px",
                        paddingBottom: "10px",
                      }}
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filters button */}
                <div className="col-md-3 text-md-end">
                  <button
                    className="btn btn-primary w-100 w-md-auto"
                    style={{
                      borderRadius: "999px",
                      paddingInline: "28px",
                      paddingBlock: "10px",
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
              <div className="col-md-6" key={a.id}>
                <div
                  className="card h-100 border-0 shadow-sm"
                  style={{ borderRadius: "16px" }}
                >
                  <div className="card-body">
                    {/* top row */}
                    <div className="d-flex justify-content-between">
                      <div className="d-flex">
                        <img
                          src={a.avatarUrl}
                          alt={a.name}
                          className="rounded-circle me-3"
                          style={{
                            width: "56px",
                            height: "56px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <h6 className="mb-0">{a.name}</h6>
                          <small className="text-muted d-block">
                            {a.title}
                          </small>
                          <div className="d-flex align-items-center mt-1">
                            <i className="bi bi-star-fill text-warning me-1" />
                            <small>{a.rating}</small>
                          </div>
                        </div>
                      </div>

                      <button className="btn btn-primary btn-sm align-self-start">
                        View Profile
                      </button>
                    </div>

                    <hr />

                    <div className="row">
                      <div className="col-sm-6 mb-2">
                        <div className="mb-1">
                          <i className="bi bi-geo-alt me-2" />
                          <small>{a.location}</small>
                        </div>
                        <div className="mb-1">
                          <i className="bi bi-briefcase me-2" />
                          <small>{a.yearsExperience} years experience</small>
                        </div>
                        <div className="mb-1">
                          <i className="bi bi-mortarboard me-2" />
                          <small>{a.education}</small>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="mb-2">
                          <small className="text-muted d-block mb-1">
                            Skills:
                          </small>
                          {a.skills.map((s) => (
                            <span
                              key={s}
                              className="badge bg-light text-dark border me-1 mb-1"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        <div className="d-flex flex-wrap gap-3">
                          <div>
                            <small className="text-muted d-block">
                              Expected Salary
                            </small>
                            <small>{a.expectedSalary}</small>
                          </div>
                          <div>
                            <small className="text-muted d-block">
                              Availability
                            </small>
                            <small>{a.availability}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
