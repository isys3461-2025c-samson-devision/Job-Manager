// src/app/modules/company/pages/CompanyApplicants.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import CompanyHeader from "../components/CompanyHeader";
import ApplicantCard from "../components/ApplicantsCard";
import Modal from "../components/Modal";
import mockApplicants from "../data/mockApplicants.json";
import { useSubscription } from "../../subscription/hooks/useSubscription";
import { httpClient } from "../../../infrastructure/http/httpClient";

export default function CompanyApplicants() {
  const PAGE_SIZE = 4;
  const STATUS_STORAGE_KEY = "jm.applicantFlags";
  const [keyword, setKeyword] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [skillTagInput, setSkillTagInput] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const { isPremium, loading: subscriptionLoading } = useSubscription();
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileNotice, setProfileNotice] = useState("");
  const [applicantFlags, setApplicantFlags] = useState(() => {
    if (typeof window === "undefined") {
      return {};
    }

    try {
      const stored = localStorage.getItem(STATUS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      return {};
    }
  });

  const defaultFilters = {
    locationType: "city",
    locationValue: "",
    educationDegree: "",
    workExperience: "",
    workExperienceKeyword: "",
    employmentTypes: [],
    skillTags: [],
    salaryMin: "",
    salaryMax: "",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [draftFilters, setDraftFilters] = useState(defaultFilters);

  const EMPLOYMENT_TYPES = [
    "Full-time",
    "Part-time",
    "Fresher",
    "Internship",
    "Contract",
  ];

  const EDUCATION_DEGREES = ["Bachelor", "Master", "Doctorate"];

  // jobId, jobTitle from JobPostPage
  const routerLocation = useLocation();
  const jobIdFromJobPage = routerLocation.state?.jobId || null;
  const jobTitleFromJobPage = routerLocation.state?.jobTitle || "";

  const isJobContext = !!jobIdFromJobPage;

  const openFilters = () => {
    setDraftFilters(filters);
    setSkillTagInput("");
    setProfileNotice("");
    setShowFilters(true);
  };

  const closeFilters = () => {
    setShowFilters(false);
  };

  const applyFilters = () => {
    setFilters(draftFilters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setDraftFilters(defaultFilters);
    setSkillTagInput("");
  };

  const toggleEmploymentType = (type) => {
    setDraftFilters((prev) => {
      const exists = prev.employmentTypes.includes(type);
      return {
        ...prev,
        employmentTypes: exists
          ? prev.employmentTypes.filter((t) => t !== type)
          : [...prev.employmentTypes, type],
      };
    });
  };

  const addSkillTag = (value) => {
    const tag = value.trim();
    if (!tag) {
      return;
    }

    setDraftFilters((prev) => {
      if (prev.skillTags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
        return prev;
      }

      return {
        ...prev,
        skillTags: [...prev.skillTags, tag],
      };
    });

    setSkillTagInput("");
  };

  const removeSkillTag = (tagToRemove) => {
    setDraftFilters((prev) => ({
      ...prev,
      skillTags: prev.skillTags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const getApplicantFlags = (applicantId) => {
    const entry = applicantFlags[applicantId];
    return {
      favorite: !!entry?.favorite,
      warning: !!entry?.warning,
    };
  };

  const toggleApplicantFlag = (applicantId, key) => {
    setApplicantFlags((prev) => {
      const current = prev[applicantId] || {};
      const nextValue = !current[key];
      return {
        ...prev,
        [applicantId]: {
          ...current,
          [key]: nextValue,
        },
      };
    });
  };

  const handleToggleFavorite = (applicantId) => {
    toggleApplicantFlag(applicantId, "favorite");
  };

  const handleToggleWarning = (applicantId) => {
    toggleApplicantFlag(applicantId, "warning");
  };

  const getHighestEducationDegree = (education) => {
    const rank = {
      Bachelor: 1,
      Master: 2,
      Doctorate: 3,
    };

    if (!education) {
      return "";
    }

    const degrees = Array.isArray(education)
      ? education.map((e) => e.degree)
      : [education];

    let topDegree = "";
    let topRank = 0;

    degrees.forEach((degree) => {
      if (!degree || !rank[degree]) {
        return;
      }
      if (rank[degree] > topRank) {
        topRank = rank[degree];
        topDegree = degree;
      }
    });

    return topDegree;
  };

  const parseSalaryInput = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const parseExpectedSalary = (expectedSalary) => {
    if (expectedSalary === null || expectedSalary === undefined) {
      return null;
    }

    if (typeof expectedSalary === "number") {
      return { min: expectedSalary, max: expectedSalary };
    }

    const matches = String(expectedSalary).match(/\d+(\.\d+)?/g);
    if (!matches || matches.length === 0) {
      return null;
    }

    const values = matches
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));

    if (values.length === 0) {
      return null;
    }

    if (values.length === 1) {
      return { min: values[0], max: values[0] };
    }

    const min = Math.min(values[0], values[1]);
    const max = Math.max(values[0], values[1]);
    return { min, max };
  };

  const getSalaryFilter = () => {
    if (!isPremium) {
      return { hasFilter: false, min: 0, max: Infinity };
    }

    const minValue = parseSalaryInput(filters.salaryMin);
    const maxValue = parseSalaryInput(filters.salaryMax);

    if (minValue === null && maxValue === null) {
      return { hasFilter: false, min: 0, max: Infinity };
    }

    return {
      hasFilter: true,
      min: minValue ?? 0,
      max: maxValue ?? Infinity,
    };
  };

  const mapProfileToFilters = (profile) => {
    if (!profile) {
      return defaultFilters;
    }

    const countryValue = profile.country || "";
    return {
      ...defaultFilters,
      locationType: countryValue ? "country" : defaultFilters.locationType,
      locationValue: countryValue,
      educationDegree: profile.highestEducationDegree || "",
      employmentTypes: Array.isArray(profile.employmentStatuses)
        ? profile.employmentStatuses
        : [],
      skillTags: Array.isArray(profile.technicalBackground)
        ? profile.technicalBackground
        : [],
      salaryMin: profile.salaryMin !== null && profile.salaryMin !== undefined
        ? String(profile.salaryMin)
        : "",
      salaryMax: profile.salaryMax !== null && profile.salaryMax !== undefined
        ? String(profile.salaryMax)
        : "",
    };
  };

  const buildProfilePayload = (profileFilters) => {
    const countryValue = profileFilters.locationType === "country"
      ? profileFilters.locationValue.trim()
      : "";

    return {
      technicalBackground: profileFilters.skillTags,
      employmentStatuses: profileFilters.employmentTypes,
      country: countryValue || null,
      salaryMin: parseSalaryInput(profileFilters.salaryMin),
      salaryMax: parseSalaryInput(profileFilters.salaryMax),
      highestEducationDegree: profileFilters.educationDegree || null,
    };
  };

  const fetchSavedProfile = async () => {
    setProfileLoading(true);
    setProfileNotice("");
    try {
      const res = await httpClient.get("/api/applicant-search-profile");
      if (!res) {
        setProfileNotice("No saved search profile.");
        return;
      }

      const nextFilters = mapProfileToFilters(res);
      setFilters(nextFilters);
      setDraftFilters(nextFilters);
      setProfileNotice("Saved search profile loaded.");
    } catch (error) {
      setProfileNotice("Failed to load search profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const saveProfile = async () => {
    setProfileSaving(true);
    setProfileNotice("");
    try {
      const payload = buildProfilePayload(draftFilters);
      await httpClient.post("/api/applicant-search-profile", payload);
      setProfileNotice("Search profile saved.");
    } catch (error) {
      setProfileNotice("Failed to save search profile.");
    } finally {
      setProfileSaving(false);
    }
  };

  useEffect(() => {
    if (subscriptionLoading || !isPremium) {
      return;
    }
    fetchSavedProfile();
  }, [subscriptionLoading, isPremium]);

  // Filter applicants
  const filteredApplicants = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    const locationValue = filters.locationValue.trim().toLowerCase();
    const experienceKeyword = filters.workExperienceKeyword.trim().toLowerCase();
    const salaryFilter = getSalaryFilter();

    return mockApplicants
      .filter((a) => {
        if (!jobIdFromJobPage) return true;
        return Array.isArray(a.appliedJobIds) && a.appliedJobIds.includes(Number(jobIdFromJobPage));
      })
      .filter((a) => {
        const experienceText = (a.workExperiences || [])
          .map((exp) => `${exp.title || ""} ${exp.description || ""}`)
          .join(" ")
          .toLowerCase();

        const summaryText = (a.summary || "").toLowerCase();
        const skillsText = (a.skills || []).join(" ").toLowerCase();

        const matchKeyword =
          !kw ||
          a.name.toLowerCase().includes(kw) ||
          a.title.toLowerCase().includes(kw) ||
          skillsText.includes(kw) ||
          summaryText.includes(kw) ||
          experienceText.includes(kw);

        return matchKeyword;
      })
      .filter((a) => {
        if (!locationValue) {
          return true;
        }

        if (filters.locationType === "city") {
          return (a.city || "").toLowerCase().includes(locationValue);
        }

        return (a.country || "").toLowerCase().includes(locationValue);
      })
      .filter((a) => {
        if (!filters.educationDegree) {
          return true;
        }

        const highestDegree = getHighestEducationDegree(a.education);
        return highestDegree === filters.educationDegree;
      })
      .filter((a) => {
        if (!filters.workExperience) {
          return true;
        }

        const hasExperience = Array.isArray(a.workExperiences)
          && a.workExperiences.length > 0;

        if (filters.workExperience === "none") {
          return !hasExperience;
        }

        if (filters.workExperience === "any") {
          return hasExperience;
        }

        if (filters.workExperience === "keyword") {
          if (!experienceKeyword) {
            return false;
          }

          const experienceText = (a.workExperiences || [])
            .map((exp) => `${exp.title || ""} ${exp.description || ""}`)
            .join(" ")
            .toLowerCase();

          return experienceText.includes(experienceKeyword);
        }

        return true;
      })
      .filter((a) => {
        if (filters.employmentTypes.length === 0) {
          return true;
        }

        const applicantTypes = Array.isArray(a.employmentTypes)
          ? a.employmentTypes.map((t) => t.toLowerCase())
          : [];

        return filters.employmentTypes.some(
          (type) => applicantTypes.includes(type.toLowerCase())
        );
      })
      .filter((a) => {
        if (filters.skillTags.length === 0) {
          return true;
        }

        const applicantSkills = Array.isArray(a.skills)
          ? a.skills.map((s) => s.toLowerCase())
          : [];

        return filters.skillTags.some((tag) =>
          applicantSkills.includes(tag.toLowerCase())
        );
      })
      .filter((a) => {
        if (!salaryFilter.hasFilter) {
          return true;
        }

        const applicantSalary = parseExpectedSalary(a.expectedSalary);
        if (!applicantSalary) {
          return true;
        }

        return applicantSalary.min <= salaryFilter.max
          && applicantSalary.max >= salaryFilter.min;
      });
  }, [keyword, filters, jobIdFromJobPage, isPremium]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [keyword, filters, jobIdFromJobPage]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(applicantFlags));
  }, [applicantFlags]);

  const visibleApplicants = filteredApplicants.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredApplicants.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredApplicants.length));
  };
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
                <div className="col-md-8">
                  <input
                    className="form-control"
                    placeholder="Search by name, title, or skills..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
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
                    onClick={openFilters}
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
            Showing {visibleApplicants.length} of {filteredApplicants.length} candidates
          </div>

          {/* Applicant cards */}
          <div className="row g-3">
            {visibleApplicants.map((a) => {
              const flags = getApplicantFlags(a.id);
              return (
                <div className="col-lg-6 col-12" key={a.id}>
                  <ApplicantCard
                    applicant={a}
                    onViewProfile={handleViewProfile}
                    isFavorite={flags.favorite}
                    isWarning={flags.warning}
                  />
                </div>
              );
            })}
          </div>

          {canLoadMore && (
            <div className="d-flex justify-content-center mt-4">
              <button
                type="button"
                className="btn btn-outline-primary"
                style={{ borderRadius: "999px", paddingInline: 24 }}
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedApplicant && (
        <Modal
          applicant={selectedApplicant}
          onClose={handleCloseModal}
          showHireButton={isJobContext}       //show hire button
          jobTitle={jobTitleFromJobPage}
          isFavorite={getApplicantFlags(selectedApplicant.id).favorite}
          isWarning={getApplicantFlags(selectedApplicant.id).warning}
          onToggleFavorite={handleToggleFavorite}
          onToggleWarning={handleToggleWarning}
        />
      )}

      {showFilters && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{
              zIndex: 2000,
              position: "fixed",
              left: 0,
              top: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <div
              className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-fullscreen-sm-down"
              style={{ maxWidth: 560, width: "94%", margin: "0.75rem auto" }}
            >
              <div
                className="modal-content p-4 rounded-4 shadow"
                style={{ maxHeight: "calc(100vh - 2rem)" }}
              >
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title">Filter Applicants</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeFilters}
                  ></button>
                </div>

                <div className="modal-body pt-3">
                  <div className="mb-3">
                    <label className="form-label">Location Type</label>
                    <div className="d-flex gap-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="locationType"
                          id="locationCity"
                          checked={draftFilters.locationType === "city"}
                          onChange={() =>
                            setDraftFilters((prev) => ({
                              ...prev,
                              locationType: "city",
                            }))
                          }
                        />
                        <label className="form-check-label" htmlFor="locationCity">
                          City
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="locationType"
                          id="locationCountry"
                          checked={draftFilters.locationType === "country"}
                          onChange={() =>
                            setDraftFilters((prev) => ({
                              ...prev,
                              locationType: "country",
                            }))
                          }
                        />
                        <label className="form-check-label" htmlFor="locationCountry">
                          Country
                        </label>
                      </div>
                    </div>
                    <input
                      className="form-control mt-2"
                      placeholder={`Enter ${draftFilters.locationType}`}
                      value={draftFilters.locationValue}
                      onChange={(e) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          locationValue: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Education Degree</label>
                    <select
                      className="form-select"
                      value={draftFilters.educationDegree}
                      onChange={(e) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          educationDegree: e.target.value,
                        }))
                      }
                    >
                      <option value="">Any</option>
                      {EDUCATION_DEGREES.map((degree) => (
                        <option key={degree} value={degree}>
                          {degree}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Work Experience</label>
                    <select
                      className="form-select"
                      value={draftFilters.workExperience}
                      onChange={(e) =>
                        setDraftFilters((prev) => ({
                          ...prev,
                          workExperience: e.target.value,
                        }))
                      }
                    >
                      <option value="">Any</option>
                      <option value="none">None</option>
                      <option value="any">Any (has experience)</option>
                      <option value="keyword">Keyword</option>
                    </select>
                    {draftFilters.workExperience === "keyword" && (
                      <input
                        className="form-control mt-2"
                        placeholder="Enter work experience keyword"
                        value={draftFilters.workExperienceKeyword}
                        onChange={(e) =>
                          setDraftFilters((prev) => ({
                            ...prev,
                            workExperienceKeyword: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Employment Types</label>
                    <div className="d-flex flex-column flex-sm-row flex-wrap gap-2">
                      {EMPLOYMENT_TYPES.map((type) => (
                        <label key={type} className="form-check me-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={draftFilters.employmentTypes.includes(type)}
                            onChange={() => toggleEmploymentType(type)}
                          />
                          <span className="form-check-label">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Salary Range (USD)</label>
                    {isPremium ? (
                      <>
                        <div className="row g-2">
                          <div className="col-6">
                            <input
                              type="number"
                              min="0"
                              className="form-control"
                              placeholder="Min"
                              value={draftFilters.salaryMin}
                              onChange={(e) =>
                                setDraftFilters((prev) => ({
                                  ...prev,
                                  salaryMin: e.target.value,
                                }))
                              }
                            />
                          </div>
                          <div className="col-6">
                            <input
                              type="number"
                              min="0"
                              className="form-control"
                              placeholder="Max"
                              value={draftFilters.salaryMax}
                              onChange={(e) =>
                                setDraftFilters((prev) => ({
                                  ...prev,
                                  salaryMax: e.target.value,
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div className="form-text">
                          Applicants with undeclared preferred salary are included.
                        </div>
                      </>
                    ) : (
                      <div className="text-muted small">
                        Upgrade to Premium to filter by salary range.
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Search Profile</label>
                    {isPremium ? (
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={fetchSavedProfile}
                            disabled={profileLoading}
                          >
                            {profileLoading ? "Loading..." : "Load Saved Profile"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={saveProfile}
                            disabled={profileSaving}
                          >
                            {profileSaving ? "Saving..." : "Save Profile"}
                          </button>
                        </div>
                        {profileNotice && (
                          <div className="small text-muted">{profileNotice}</div>
                        )}
                      </div>
                    ) : (
                      <div className="text-muted small">
                        Upgrade to Premium to save a search profile.
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Technical Skills Tags</label>
                    <input
                      className="form-control"
                      placeholder="Type a tag and press Enter"
                      value={skillTagInput}
                      onChange={(e) => setSkillTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          addSkillTag(skillTagInput);
                        }
                      }}
                    />
                    {draftFilters.skillTags.length > 0 && (
                      <div className="mt-2 d-flex flex-wrap gap-2">
                        {draftFilters.skillTags.map((tag) => (
                          <span
                            key={tag}
                            className="badge d-inline-flex align-items-center"
                            style={{
                              backgroundColor: "#e5f0ff",
                              color: "#006BFF",
                              borderRadius: 999,
                              padding: "6px 10px",
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              gap: 6,
                            }}
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeSkillTag(tag)}
                              style={{
                                border: "none",
                                background: "transparent",
                                color: "#006BFF",
                                fontWeight: 700,
                                lineHeight: 1,
                                cursor: "pointer",
                              }}
                              aria-label={`Remove ${tag}`}
                            >
                              x
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={resetFilters}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={applyFilters}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1500 }}
            onClick={closeFilters}
          ></div>
        </>
      )}
    </>
  );
}
