import { useEffect, useState } from "react";
import CompanyHeader from "../components/CompanyHeader";

// Change this if your backend runs on a different port/domain
const API_BASE_URL = "http://localhost:8080";

// Change this if you store token under a different key
const TOKEN_KEY = "token";

function buildLocation(city, country) {
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return "";
}

function mapBeToFe(be) {
  return {
    companyId: be.companyId ?? "",
    name: be.name ?? "",
    title: "Employer",
    email: "N/A",
    phone: be.phone ?? "",
    street: be.street ?? "",
    city: be.city ?? "",
    country: be.country ?? "",
    location: buildLocation(be.city, be.country),

    about: be.aboutUs ?? "",
    whoWeAreLookingFor: be.whoWeAreLookingFor ?? "",

    logoUrl: be.logoUrl ?? "",

    media: [],
    skillsNeeded: [],
    achievements: []
  };
}

function mapFeToBe(p) {
  return {
    name: p.name,
    phone: p.phone,
    street: p.street,
    city: p.city,
    country: p.country,
    aboutUs: p.about,
    whoWeAreLookingFor: p.whoWeAreLookingFor
  };
}

async function fetchMyProfile(token) {
  const res = await fetch(`${API_BASE_URL}/api/companies/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET /api/companies/me failed: ${res.status} ${text}`);
  }

  return await res.json();
}

async function saveMyProfile(token, payload) {
  // Try PATCH first (your Postman test used PATCH)
  let res = await fetch(`${API_BASE_URL}/api/companies/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  // If backend only supports PUT, retry automatically
  if (res.status === 405) {
    res = await fetch(`${API_BASE_URL}/api/companies/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`SAVE /api/companies/me failed: ${res.status} ${text}`);
  }

  return await res.json();
}

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem(TOKEN_KEY);

  useEffect(() => {
    const run = async () => {
      setError("");

      if (!token) {
        setLoading(false);
        setError("No token found. Please login first.");
        return;
      }

      try {
        setLoading(true);
        const beData = await fetchMyProfile(token);
        setProfile(mapBeToFe(beData));
      } catch (e) {
        setError(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token]);

  const p = profile || {
    companyId: "",
    name: "",
    title: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    country: "",
    location: "",
    about: "",
    whoWeAreLookingFor: "",
    logoUrl: "",
    media: [],
    skillsNeeded: [],
    achievements: []
  };

  const toggleEditMode = async () => {
    setError("");

    // If currently editing and user clicks "Done" => save to BE
    if (isEditMode) {
      if (!token) {
        setError("No token found. Please login first.");
        return;
      }

      try {
        setSaving(true);
        const payload = mapFeToBe(p);
        const savedBe = await saveMyProfile(token, payload);
        setProfile(mapBeToFe(savedBe));
        setIsEditMode(false);
      } catch (e) {
        setError(e?.message || "Failed to save profile");
      } finally {
        setSaving(false);
      }
      return;
    }

    // turn ON edit mode
    setIsEditMode(true);
  };

  const handleEditAbout = () => {
    if (!isEditMode) return;
    const newAbout = window.prompt("Edit About Us", p.about);
    if (newAbout !== null) {
      setProfile({ ...p, about: newAbout });
    }
  };

  const handleEditSkills = () => {
    if (!isEditMode) return;
    const current = (p.skillsNeeded || []).join(", ");
    const input = window.prompt("Edit skills (separate by comma):", current);
    if (input !== null) {
      const skills = input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setProfile({ ...p, skillsNeeded: skills });
    }
  };

  const handleEditMedia = () => {
    if (!isEditMode) return;
    alert("Media editing not implemented yet (demo only).");
  };

  const handleEditAchievements = () => {
    if (!isEditMode) return;
    alert("Achievements editing not implemented yet (demo only).");
  };

  if (loading) {
    return (
      <>
        <CompanyHeader />
        <div style={{ padding: 20 }}>Loading profile...</div>
      </>
    );
  }

  return (
    <>
      <CompanyHeader />

      <div style={{ backgroundColor: "#f3f6fb", minHeight: "100vh" }}>
        <div className="container py-4" style={{ maxWidth: "1120px" }}>
          {error ? (
            <div
              className="alert alert-warning"
              style={{ borderRadius: 12 }}
            >
              {error}
            </div>
          ) : null}

          {saving ? (
            <div
              className="alert alert-info"
              style={{ borderRadius: 12 }}
            >
              Saving...
            </div>
          ) : null}

          {/* TOP PROFILE CARD */}
          <div
            className="card border-0 mb-4"
            style={{
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 8px 18px rgba(15,23,42,0.08)"
            }}
          >
            {/* blue banner */}
            <div
              style={{
                backgroundColor: "#006BFF",
                height: "80px"
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
                      border: "3px solid #ffffff"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.4rem",
                        fontWeight: 600,
                        color: "#4b5563"
                      }}
                    >
                      {(p.name || "C").charAt(0)}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontSize: "1rem", fontWeight: 600 }}>
                      {p.name || "No name"}
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
                    fontWeight: 500
                  }}
                  onClick={toggleEditMode}
                  disabled={saving}
                >
                  <i
                    className={`bi ${isEditMode ? "bi-check-lg" : "bi-pencil"} me-1`}
                  />
                  {isEditMode ? "Done" : "Edit Profile"}
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
              {/* About Us */}
              <div
                className="card border-0 mb-3"
                style={{
                  borderRadius: "14px",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.06)"
                }}
              >
                <div className="card-body">
                  <div
                    className="d-flex justify-content-between align-items-center mb-2"
                    style={{ fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    <span>About Us</span>
                    {isEditMode && (
                      <button
                        type="button"
                        className="btn btn-link p-0 ms-1"
                        onClick={handleEditAbout}
                      >
                        <i className="bi bi-pencil" style={{ fontSize: "0.9rem" }} />
                      </button>
                    )}
                  </div>
                  <p className="mb-0" style={{ fontSize: "0.85rem", color: "#4b5563" }}>
                    {p.about || "No content"}
                  </p>
                </div>
              </div>

              {/* Images & Video */}
              <div
                className="card border-0"
                style={{
                  borderRadius: "14px",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.06)"
                }}
              >
                <div className="card-body">
                  <div
                    className="d-flex justify-content-between align-items-center mb-3"
                    style={{ fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    <span>Images &amp; Video</span>
                    {isEditMode && (
                      <button
                        type="button"
                        className="btn btn-link p-0 ms-1"
                        onClick={handleEditMedia}
                      >
                        <i className="bi bi-pencil" style={{ fontSize: "0.9rem" }} />
                      </button>
                    )}
                  </div>

                  <div className="d-flex flex-wrap gap-3">
                    {(p.media || []).length === 0 ? (
                      <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                        No media yet (mock feature).
                      </div>
                    ) : (
                      p.media.map((m) =>
                        m.type === "image" ? (
                          <div
                            key={m.id}
                            className="position-relative"
                            style={{
                              width: 220,
                              height: 130,
                              borderRadius: "12px",
                              overflow: "hidden",
                              backgroundColor: "#e5e7eb"
                            }}
                          >
                            <img
                              src={m.url}
                              alt={m.label}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover"
                              }}
                            />
                            <div
                              className="position-absolute bottom-0 start-0 end-0 px-2 py-1"
                              style={{
                                background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
                                fontSize: "0.75rem",
                                color: "#f9fafb"
                              }}
                            >
                              {m.label}
                            </div>
                          </div>
                        ) : (
                          <div key={m.id} style={{ flex: "1 1 100%" }}>
                            <div
                              className="ratio ratio-16x9"
                              style={{
                                borderRadius: "12px",
                                overflow: "hidden",
                                backgroundColor: "#000"
                              }}
                            >
                              <iframe
                                src={m.url}
                                title={m.label}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                            <div className="mt-1" style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                              {m.label}
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-lg-4">
              {/* Skills Needed */}
              <div
                className="card border-0 mb-3"
                style={{
                  borderRadius: "14px",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.06)"
                }}
              >
                <div className="card-body">
                  <div
                    className="d-flex justify-content-between align-items-center mb-2"
                    style={{ fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    <span>Skills Needed</span>
                    {isEditMode && (
                      <button
                        type="button"
                        className="btn btn-link p-0 ms-1"
                        onClick={handleEditSkills}
                      >
                        <i className="bi bi-pencil" style={{ fontSize: "0.9rem" }} />
                      </button>
                    )}
                  </div>

                  <div>
                    {(p.skillsNeeded || []).length === 0 ? (
                      <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                        No skills yet (mock feature).
                      </div>
                    ) : (
                      p.skillsNeeded.map((s) => (
                        <span
                          key={s}
                          className="badge me-1 mb-1"
                          style={{
                            backgroundColor: "#e5f0ff",
                            color: "#006BFF",
                            borderRadius: 999,
                            padding: "4px 10px",
                            fontSize: "0.75rem",
                            fontWeight: 500
                          }}
                        >
                          {s}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div
                className="card border-0"
                style={{
                  borderRadius: "14px",
                  boxShadow: "0 4px 12px rgba(15,23,42,0.06)"
                }}
              >
                <div className="card-body">
                  <div
                    className="d-flex justify-content-between align-items-center mb-3"
                    style={{ fontSize: "0.95rem", fontWeight: 600 }}
                  >
                    <span>Achievements</span>
                    {isEditMode && (
                      <button
                        type="button"
                        className="btn btn-link p-0 ms-1"
                        onClick={handleEditAchievements}
                      >
                        <i className="bi bi-pencil" style={{ fontSize: "0.9rem" }} />
                      </button>
                    )}
                  </div>

                  {(p.achievements || []).length === 0 ? (
                    <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                      No achievements yet (mock feature).
                    </div>
                  ) : (
                    p.achievements.map((a, idx) => (
                      <div key={idx} className="mb-3">
                        <div className="d-flex align-items-start">
                          <i
                            className="bi bi-trophy me-2"
                            style={{ color: "#F59E0B", fontSize: "1.1rem" }}
                          />
                          <div>
                            <div
                              style={{ fontSize: "0.85rem", fontWeight: 600 }}
                              className="mb-1"
                            >
                              {a.title}
                            </div>
                            <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
                              {a.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
