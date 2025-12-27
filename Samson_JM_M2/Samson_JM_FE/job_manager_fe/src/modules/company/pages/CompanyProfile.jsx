import { useState, useEffect } from "react";
import CompanyHeader from "../components/CompanyHeader";
import { getMyCompany, updateMyCompany } from "../api/companyApi";

export default function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState(null);

  // =========================
  // Fetch company profile
  // =========================
  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    const data = await getMyCompany();

    setLogoPreview(data.logoUrl || null);

    setProfile({
      name: data.companyName,
      title: "Employer",
      email: data.email,
      phone: data.phoneNumber,
      location: [data.city, data.country].filter(Boolean).join(", "),
      about: data.aboutUs || "Not provided yet",
      skillsNeeded: [], // later from job posts
      media: data.logoUrl
        ? [
            {
              id: 1,
              type: "image",
              url: data.logoUrl,
              label: "Company logo",
            },
          ]
        : [],
      achievements: [], // static for now
    });

    setLoading(false);
  };

  // =========================
  // Toggle edit mode (SAVE on Done)
  // =========================
  const toggleEditMode = async () => {
    if (isEditMode) {
      await updateMyCompany({
        companyName: profile.name,
        phoneNumber: profile.phone,
        aboutUs: profile.about,
        logoUrl: logoPreview,
      });

      await fetchCompany();
    }

    setIsEditMode((prev) => !prev);
  };

  // =========================
  // Edit handlers (UI-only, saved on Done)
  // =========================
  const handleEditAbout = () => {
    if (!isEditMode) return;
    const newAbout = window.prompt("Edit About Us", profile.about);
    if (newAbout !== null) {
      setProfile({ ...profile, about: newAbout });
    }
  };

  const handleEditSkills = () => {
    if (!isEditMode) return;
    const current = profile.skillsNeeded.join(", ");
    const input = window.prompt("Edit skills (comma separated):", current);
    if (input !== null) {
      const skills = input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      setProfile({ ...profile, skillsNeeded: skills });
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 128; // final logo size
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");

        // center-crop
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;

        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);

        const resizedBase64 = canvas.toDataURL("image/png");
        setLogoPreview(resizedBase64);
      };
    };

    reader.readAsDataURL(file);
  };

  const handleEditMedia = () => {
    if (!isEditMode) return;
    alert("Media editing not implemented yet.");
  };

  const handleEditAchievements = () => {
    if (!isEditMode) return;
    alert("Achievements editing not implemented yet.");
  };

  // =========================
  // Loading guard
  // =========================
  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No company profile</p>;

  const p = profile;

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
            <div style={{ backgroundColor: "#006BFF", height: "80px" }} />

            <div className="px-4 pb-3 pt-2 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div
                    className="position-relative me-3"
                    style={{
                      width: 64,
                      height: 64,
                      marginTop: -32,
                    }}
                  >
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "12px",
                        backgroundColor: "#e5e7eb",
                        border: "3px solid #ffffff",
                        overflow: "hidden",
                      }}
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Company logo"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: "1.4rem",
                            fontWeight: 600,
                            color: "#4b5563",
                          }}
                        >
                          {p.name.charAt(0)}
                        </span>
                      )}
                    </div>

                    {/* Edit icon */}
                    {isEditMode && (
                      <label
                        htmlFor="logoUpload"
                        className="position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center"
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          backgroundColor: "#006BFF",
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: "0.7rem",
                        }}
                      >
                        <i className="bi bi-pencil" />
                      </label>
                    )}

                    <input
                      id="logoUpload"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleLogoUpload}
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
                  onClick={toggleEditMode}
                >
                  <i
                    className={`bi ${
                      isEditMode ? "bi-check-lg" : "bi-pencil"
                    } me-1`}
                  />
                  {isEditMode ? "Done" : "Edit Profile"}
                </button>
              </div>

              {/* CONTACT ROW */}
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
            {/* LEFT */}
            <div className="col-lg-8">
              {/* About Us */}
              <div className="card border-0 mb-3" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ fontWeight: 600 }}>About Us</span>
                    {isEditMode && (
                      <button
                        className="btn btn-link p-0"
                        onClick={handleEditAbout}
                      >
                        <i className="bi bi-pencil" />
                      </button>
                    )}
                  </div>
                  <p>{p.about}</p>
                </div>
              </div>

              {/* Images & Video */}
              <div className="card border-0" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ fontWeight: 600 }}>Images & Video</span>
                    {isEditMode && (
                      <button
                        className="btn btn-link p-0"
                        onClick={handleEditMedia}
                      >
                        <i className="bi bi-pencil" />
                      </button>
                    )}
                  </div>

                  <div className="d-flex flex-wrap gap-3">
                    {p.media.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          width: 220,
                          height: 130,
                          borderRadius: 12,
                          backgroundColor: "#f3f4f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          overflow: "hidden",
                        }}
                      >
                        <img
                          src={m.url}
                          alt={m.label}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-lg-4">
              {/* Skills */}
              <div className="card border-0 mb-3" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span style={{ fontWeight: 600 }}>Skills Needed</span>
                    {isEditMode && (
                      <button
                        className="btn btn-link p-0"
                        onClick={handleEditSkills}
                      >
                        <i className="bi bi-pencil" />
                      </button>
                    )}
                  </div>

                  {p.skillsNeeded.map((s) => (
                    <span
                      key={s}
                      className="badge me-1"
                      style={{ backgroundColor: "#e5f0ff", color: "#006BFF" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="card border-0" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3">
                    <span style={{ fontWeight: 600 }}>Achievements</span>
                    {isEditMode && (
                      <button
                        className="btn btn-link p-0"
                        onClick={handleEditAchievements}
                      >
                        <i className="bi bi-pencil" />
                      </button>
                    )}
                  </div>

                  <p style={{ color: "#6b7280" }}>No achievements added yet.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
