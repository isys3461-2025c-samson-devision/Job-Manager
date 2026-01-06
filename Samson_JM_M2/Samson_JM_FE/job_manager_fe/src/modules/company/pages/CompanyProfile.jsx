// CompanyProfile.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import CompanyHeader from "../components/CompanyHeader";
import { getMyCompany, updateMyCompany } from "../api/companyApi";

/* -----------------------------
  Helpers
------------------------------ */
const uniqueKeepOrder = (arr) => {
  const seen = new Set();
  const out = [];
  (arr || []).forEach((x) => {
    const v = (x || "").trim();
    if (!v) return;
    if (seen.has(v)) return;
    seen.add(v);
    out.push(v);
  });
  return out;
};

const detectMediaType = (url) => {
  const u = (url || "").toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "video";
  if (u.endsWith(".mp4") || u.endsWith(".webm") || u.endsWith(".mov")) return "video";
  return "image";
};

const getYouTubeId = (url) => {
  if (!url) return null;
  const u = String(url);
  const short = u.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (short) return short[1];
  const watch = u.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watch) return watch[1];
  const embed = u.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
  if (embed) return embed[1];
  return null;
};

const toYouTubeEmbedUrl = (url) => {
  const id = getYouTubeId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
};

const buildMediaObjects = (urls) => {
  return (urls || []).map((url, i) => ({
    id: `m${i + 1}`,
    type: detectMediaType(url),
    url,
    label: `Media ${i + 1}`
  }));
};

const deepFindFirst = (obj, predicate) => {
  const seen = new Set();
  const stack = [obj];

  while (stack.length) {
    const cur = stack.pop();
    if (!cur || typeof cur !== "object") continue;
    if (seen.has(cur)) continue;
    seen.add(cur);

    try {
      if (predicate(cur)) return cur;
    } catch (e) {}

    for (const k of Object.keys(cur)) {
      const v = cur[k];
      if (v && typeof v === "object") stack.push(v);
    }
  }
  return null;
};

const resolvePlanType = (data) => {
  const direct =
    data?.planType ||
    data?.subscription?.planType ||
    data?.company?.planType;

  if (direct) return String(direct).toUpperCase();

  const hit = deepFindFirst(data, (x) => typeof x.planType === "string");
  if (hit?.planType) return String(hit.planType).toUpperCase();

  return "FREEMIUM";
};

const isPrePlan = (planType) => {
  const p = String(planType || "").toUpperCase();
  return p === "PRE" || p === "PREMIUM" || p.includes("PRE");
};

/* -----------------------------
  UI: Toast
------------------------------ */
function Toast({ show, message, kind = "success", onClose }) {
  if (!show) return null;
  const bg = kind === "success" ? "#16a34a" : kind === "error" ? "#dc2626" : "#0f172a";

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 99999,
        background: bg,
        color: "#fff",
        padding: "12px 14px",
        borderRadius: 12,
        boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
        maxWidth: 360
      }}
    >
      <div className="d-flex align-items-start justify-content-between gap-3">
        <div style={{ fontSize: 14, lineHeight: 1.3 }}>{message}</div>
        <button
          className="btn btn-sm"
          onClick={onClose}
          type="button"
          style={{
            background: "rgba(255,255,255,0.18)",
            color: "#fff",
            borderRadius: 10,
            padding: "4px 10px",
            border: "none"
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

/* -----------------------------
  UI: Modal Shell
------------------------------ */
function ModalShell({ open, title, onClose, children, footer }) {
  if (!open) return null;

  return (
    <div
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
    >
      <div
        className="card border-0"
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "min(720px, 94vw)",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          overflow: "hidden"
        }}
      >
        <div
          className="card-body"
          style={{
            padding: 16,
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 16 }}>{title}</div>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
            type="button"
            style={{ borderRadius: 10 }}
            aria-label="Close"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="card-body" style={{ padding: 16 }}>
          {children}
        </div>

        <div
          className="card-body"
          style={{
            padding: 16,
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10
          }}
        >
          {footer}
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
  UI: Lightbox Viewer (big center)
------------------------------ */
function MediaViewer({ open, item, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !item) return null;

  const isYoutube = !!toYouTubeEmbedUrl(item.url);
  const embedUrl = toYouTubeEmbedUrl(item.url);

  return (
    <div
      onMouseDown={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(2,6,23,0.72)",
        zIndex: 100000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 18
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: "min(980px, 96vw)",
          borderRadius: 16,
          background: "#0b1220",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 2,
            width: 38,
            height: 38,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.10)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-label="Close viewer"
        >
          <i className="bi bi-x-lg" />
        </button>

        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          {item.type === "image" ? (
            <img
              src={item.url}
              alt={item.label || "Preview"}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          ) : isYoutube ? (
            <iframe
              src={embedUrl}
              title={item.label || "Video"}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", height: "100%", border: 0 }}
            />
          ) : (
            <video src={item.url} controls style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          )}
        </div>

        <div style={{ padding: 12, color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
          {item.url}
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
  UI: Plan Badge
------------------------------ */
function PlanBadge({ planType }) {
  const pre = isPrePlan(planType);

  const style = pre
    ? { background: "#fff7d6", color: "#b45309", border: "1px solid #fde68a" }
    : { background: "#e5f0ff", color: "#006BFF", border: "1px solid #bfdbfe" };

  const text = pre ? "PRE" : "FREEMIUM";

  return (
    <span
      style={{
        ...style,
        fontSize: 12,
        fontWeight: 800,
        padding: "4px 10px",
        borderRadius: 999,
        display: "inline-flex",
        alignItems: "center",
        lineHeight: 1
      }}
    >
      {text}
    </span>
  );
}

/* -----------------------------
  UI: Tag Editor (Skills / Achievements)
------------------------------ */
function TagEditor({ label, items, setItems, inputPlaceholder }) {
  const [input, setInput] = useState("");

  const addFromInput = () => {
    const raw = (input || "").trim();
    if (!raw) return;

    const parts = raw
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const next = uniqueKeepOrder([...(items || []), ...parts]);
    setItems(next);
    setInput("");
  };

  const remove = (value) => {
    setItems((items || []).filter((x) => x !== value));
  };

  return (
    <div>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>{label}</div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        {(items || []).map((x) => (
          <span
            key={x}
            style={{
              background: "#e5f0ff",
              color: "#006BFF",
              padding: "8px 10px",
              borderRadius: 999,
              display: "inline-flex",
              alignItems: "center",
              gap: 10
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 800 }}>{x}</span>
            <button
              type="button"
              onClick={() => remove(x)}
              className="btn btn-sm"
              style={{
                background: "rgba(0,107,255,0.12)",
                color: "#006BFF",
                borderRadius: 999,
                padding: "2px 10px",
                border: "none"
              }}
            >
              Remove
            </button>
          </span>
        ))}
      </div>

      <div className="d-flex gap-2">
        <input
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={inputPlaceholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addFromInput();
            }
          }}
        />
        <button className="btn btn-primary" type="button" onClick={addFromInput}>
          Add
        </button>
      </div>

      <div style={{ color: "#6b7280", fontSize: 12, marginTop: 10 }}>
        Press Enter to add. You can also paste multiple items using commas or new lines.
      </div>
    </div>
  );
}

/* -----------------------------
  UI: Media Editor (URL list)
------------------------------ */
function MediaEditor({ items, setItems }) {
  const [url, setUrl] = useState("");
  const [dragKey, setDragKey] = useState(null);

  const addUrl = () => {
    const u = (url || "").trim();
    if (!u) return;
    setItems(uniqueKeepOrder([...(items || []), u]));
    setUrl("");
  };

  const remove = (u) => {
    setItems((items || []).filter((x) => x !== u));
  };

  const move = (fromIndex, toIndex) => {
    if (fromIndex === toIndex) return;
    const arr = [...(items || [])];
    const [picked] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, picked);
    setItems(arr);
  };

  return (
    <div>
      <div style={{ fontWeight: 800, marginBottom: 10 }}>Images & Video</div>

      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a URL and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addUrl();
            }
          }}
        />
        <button className="btn btn-primary" type="button" onClick={addUrl}>
          Add
        </button>
      </div>

      <div style={{ color: "#6b7280", fontSize: 12, marginBottom: 10 }}>
        Note: This is URL only. If you want upload image from PC, you must upload to storage first (S3/Cloudinary) then paste URL.
      </div>

      <div className="d-flex flex-column gap-2">
        {(items || []).map((u, idx) => {
          const key = `${u}__${idx}`;
          return (
            <div
              key={key}
              draggable
              onDragStart={() => setDragKey(key)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                const from = (items || []).findIndex((x, i) => `${x}__${i}` === dragKey);
                const to = idx;
                if (from >= 0) move(from, to);
                setDragKey(null);
              }}
              className="d-flex align-items-center justify-content-between"
              style={{
                padding: 10,
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                background: "#fff"
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12, color: "#6b7280" }}>#{idx + 1}</div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#111827",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                  title={u}
                >
                  {u}
                </div>
              </div>

              <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => remove(u)}>
                Remove
              </button>
            </div>
          );
        })}
      </div>

      {!items?.length && <div style={{ color: "#6b7280", fontSize: 13, marginTop: 8 }}>No media added yet.</div>}
    </div>
  );
}

/* -----------------------------
  UI: Media Thumb (clickable)
------------------------------ */
function MediaThumb({ m, onOpen }) {
  const ytId = getYouTubeId(m.url);
  const ytThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;

  const wrapStyle = {
    width: 320,
    height: 180,
    borderRadius: 14,
    overflow: "hidden",
    background: "#0b1220",
    position: "relative",
    cursor: "pointer",
    boxShadow: "0 10px 22px rgba(15,23,42,0.10)"
  };

  return (
    <div style={wrapStyle} onClick={() => onOpen(m)} title="Click to preview">
      {m.type === "image" ? (
        <img src={m.url} alt={m.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : ytThumb ? (
        <>
          <img src={ytThumb} alt="Video thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.92 }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.22)",
                border: "1px solid rgba(255,255,255,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(6px)"
              }}
            >
              <i className="bi bi-play-fill" style={{ fontSize: 26, color: "#fff", marginLeft: 3 }} />
            </div>
          </div>
        </>
      ) : (
        <video
          src={m.url}
          muted
          playsInline
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95 }}
        />
      )}
    </div>
  );
}

/* -----------------------------
  Main Component
------------------------------ */
export default function CompanyProfile() {
  const [profile, setProfile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoPreview, setLogoPreview] = useState(null);

  const [modal, setModal] = useState({ open: false, type: null });
  const [draftAbout, setDraftAbout] = useState("");
  const [draftSkills, setDraftSkills] = useState([]);
  const [draftAchievements, setDraftAchievements] = useState([]);
  const [draftMediaUrls, setDraftMediaUrls] = useState([]);

  const [toast, setToast] = useState({ show: false, kind: "success", message: "" });
  const toastTimerRef = useRef(null);

  const [viewer, setViewer] = useState({ open: false, item: null });

  const showToast = useCallback((message, kind = "success") => {
    setToast({ show: true, kind, message });
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToast((p) => ({ ...p, show: false }));
    }, 2500);
  }, []);

  const fetchCompany = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getMyCompany();

      const logo = data.logoUrl || null;
      setLogoPreview(logo);

      const combined = uniqueKeepOrder([...(logo ? [logo] : []), ...(data.mediaUrls || [])]);
      const planType = resolvePlanType(data);
      const media = buildMediaObjects(combined);

      setProfile({
        name: data.companyName || "",
        title: "Employer",
        email: data.email || "",
        phone: data.phoneNumber || "",
        location: [data.city, data.country].filter(Boolean).join(", "),
        about: data.aboutUs || "",
        skillsNeeded: data.skillsNeeded || [],
        achievements: data.achievements || [],
        media,
        planType
      });
    } catch (e) {
      showToast("Failed to load profile.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const toggleEditMode = async () => {
    if (!profile) return;

    if (isEditMode) {
      try {
        const mediaUrls = uniqueKeepOrder(
          (profile.media || [])
            .map((m) => m.url)
            .filter((u) => u && u !== logoPreview)
        );

        await updateMyCompany({
          companyName: profile.name,
          phoneNumber: profile.phone,
          aboutUs: profile.about,
          logoUrl: logoPreview,
          skillsNeeded: profile.skillsNeeded || [],
          achievements: profile.achievements || [],
          mediaUrls
        });

        showToast("Profile updated successfully.", "success");
        await fetchCompany();
        setIsEditMode(false);
        return;
      } catch (e) {
        showToast("Update failed. Please try again.", "error");
        return;
      }
    }

    setIsEditMode(true);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 256;
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, size, size);

        const scale = Math.max(size / img.width, size / img.height);
        const newW = img.width * scale;
        const newH = img.height * scale;
        const dx = (size - newW) / 2;
        const dy = (size - newH) / 2;

        ctx.drawImage(img, dx, dy, newW, newH);

        const base64 = canvas.toDataURL("image/png");
        setLogoPreview(base64);

        setProfile((prev) => {
          if (!prev) return prev;
          const otherUrls = uniqueKeepOrder((prev.media || []).map((m) => m.url).filter((u) => u && u !== logoPreview));
          const combined = uniqueKeepOrder([base64, ...otherUrls]);
          return { ...prev, media: buildMediaObjects(combined) };
        });
      };
    };

    reader.readAsDataURL(file);
  };

  const openModal = (type) => {
    if (!isEditMode || !profile) return;

    if (type === "about") setDraftAbout(profile.about || "");
    if (type === "skills") setDraftSkills(profile.skillsNeeded || []);
    if (type === "achievements") setDraftAchievements(profile.achievements || []);
    if (type === "media") {
      const urls = uniqueKeepOrder(
        (profile.media || [])
          .map((m) => m.url)
          .filter((u) => u && u !== logoPreview)
      );
      setDraftMediaUrls(urls);
    }

    setModal({ open: true, type });
  };

  const closeModal = () => setModal({ open: false, type: null });

  const saveModal = () => {
    if (!profile) return;

    if (modal.type === "about") setProfile((prev) => ({ ...prev, about: draftAbout }));
    if (modal.type === "skills") setProfile((prev) => ({ ...prev, skillsNeeded: uniqueKeepOrder(draftSkills) }));
    if (modal.type === "achievements") setProfile((prev) => ({ ...prev, achievements: uniqueKeepOrder(draftAchievements) }));

    if (modal.type === "media") {
      const combined = uniqueKeepOrder([...(logoPreview ? [logoPreview] : []), ...(draftMediaUrls || [])]);
      setProfile((prev) => ({ ...prev, media: buildMediaObjects(combined) }));
    }

    closeModal();
  };

  const modalTitle =
    modal.type === "about"
      ? "Edit About Us"
      : modal.type === "skills"
      ? "Edit Skills Needed"
      : modal.type === "achievements"
      ? "Edit Achievements"
      : modal.type === "media"
      ? "Edit Images & Video"
      : "Edit";

  const iconBtnStyle = {
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    backgroundColor: "#fff",
    width: 34,
    height: 34,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>No company profile</p>;

  const p = profile;

  const openViewer = (item) => {
    setViewer({ open: true, item });
  };

  return (
    <>
      <CompanyHeader />

      <Toast
        show={toast.show}
        kind={toast.kind}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <MediaViewer
        open={viewer.open}
        item={viewer.item}
        onClose={() => setViewer({ open: false, item: null })}
      />

      <ModalShell
        open={modal.open}
        title={modalTitle}
        onClose={closeModal}
        footer={
          <>
            <button className="btn btn-outline-secondary" onClick={closeModal} type="button" style={{ borderRadius: 10 }}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={saveModal} type="button" style={{ borderRadius: 10 }}>
              Save
            </button>
          </>
        }
      >
        {modal.type === "about" && (
          <div>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>About Us</div>
            <textarea
              className="form-control"
              rows={6}
              value={draftAbout}
              onChange={(e) => setDraftAbout(e.target.value)}
              placeholder="Write something about your company..."
            />
          </div>
        )}

        {modal.type === "skills" && (
          <TagEditor
            label="Skills Needed"
            items={draftSkills}
            setItems={setDraftSkills}
            inputPlaceholder="Type a skill and press Enter"
          />
        )}

        {modal.type === "achievements" && (
          <TagEditor
            label="Achievements"
            items={draftAchievements}
            setItems={setDraftAchievements}
            inputPlaceholder="Type an achievement and press Enter"
          />
        )}

        {modal.type === "media" && <MediaEditor items={draftMediaUrls} setItems={setDraftMediaUrls} />}
      </ModalShell>

      <div style={{ backgroundColor: "#f3f6fb", minHeight: "100vh" }}>
        <div className="container py-4" style={{ maxWidth: "1120px" }}>
          <div
            className="card border-0 mb-4"
            style={{
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: "0 8px 18px rgba(15,23,42,0.08)"
            }}
          >
            <div style={{ backgroundColor: "#006BFF", height: "80px" }} />
            <div className="px-4 pb-3 pt-2 bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="position-relative me-3" style={{ width: 64, height: 64, marginTop: -32 }}>
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 14,
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 8px 16px rgba(15,23,42,0.08)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: logoPreview ? "pointer" : "default"
                      }}
                      onClick={() => {
                        if (!logoPreview) return;
                        openViewer({ type: "image", url: logoPreview, label: "Company logo" });
                      }}
                      title={logoPreview ? "Click to preview" : ""}
                    >
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Company logo"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "#4b5563" }}>
                          {(p.name || "?").charAt(0)}
                        </span>
                      )}
                    </div>

                    {isEditMode && (
                      <label
                        htmlFor="logoUpload"
                        className="position-absolute bottom-0 end-0 d-flex align-items-center justify-content-center"
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          backgroundColor: "#006BFF",
                          color: "#fff",
                          cursor: "pointer",
                          border: "2px solid #fff",
                          boxShadow: "0 6px 14px rgba(0,0,0,0.18)"
                        }}
                        title="Edit logo"
                      >
                        <i className="bi bi-pencil" style={{ fontSize: 12 }} />
                      </label>
                    )}

                    <input id="logoUpload" type="file" accept="image/*" hidden onChange={handleLogoUpload} />
                  </div>

                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ fontSize: "1rem", fontWeight: 900 }}>{p.name}</div>
                      <PlanBadge planType={p.planType} />
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>{p.title}</div>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  style={{ borderRadius: "999px", paddingInline: 20, fontSize: "0.85rem", fontWeight: 800 }}
                  onClick={toggleEditMode}
                  type="button"
                >
                  {isEditMode ? "Done" : "Edit Profile"}
                </button>
              </div>

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

          <div className="row g-3">
            <div className="col-lg-8">
              <div className="card border-0 mb-3" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ fontWeight: 900 }}>About Us</span>
                    {isEditMode && (
                      <button type="button" className="btn btn-light btn-sm" style={iconBtnStyle} onClick={() => openModal("about")} title="Edit">
                        <i className="bi bi-pencil" />
                      </button>
                    )}
                  </div>
                  <p className="mb-0">{p.about || "Not provided yet."}</p>
                </div>
              </div>

              <div className="card border-0" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span style={{ fontWeight: 900 }}>Images & Video</span>
                    {isEditMode && (
                      <button type="button" className="btn btn-light btn-sm" style={iconBtnStyle} onClick={() => openModal("media")} title="Edit">
                        <i className="bi bi-pencil" />
                      </button>
                    )}
                  </div>

                  {!p.media?.length ? (
                    <div style={{ color: "#6b7280" }}>No media added yet.</div>
                  ) : (
                    <div className="d-flex flex-wrap gap-3">
                      {p.media.map((m) => (
                        <MediaThumb key={m.id} m={m} onOpen={openViewer} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 mb-3" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ fontWeight: 900 }}>Skills Needed</span>
                    {isEditMode && (
                      <button type="button" className="btn btn-light btn-sm" style={iconBtnStyle} onClick={() => openModal("skills")} title="Edit">
                        <i className="bi bi-pencil" />
                      </button>
                    )}
                  </div>

                  {p.skillsNeeded?.length ? (
                    p.skillsNeeded.map((s) => (
                      <span key={s} className="badge me-1" style={{ backgroundColor: "#e5f0ff", color: "#006BFF" }}>
                        {s}
                      </span>
                    ))
                  ) : (
                    <div style={{ color: "#6b7280" }}>No skills added yet.</div>
                  )}
                </div>
              </div>

              <div className="card border-0" style={{ borderRadius: 14 }}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span style={{ fontWeight: 900 }}>Achievements</span>
                    {isEditMode && (
                      <button type="button" className="btn btn-light btn-sm" style={iconBtnStyle} onClick={() => openModal("achievements")} title="Edit">
                        <i className="bi bi-pencil" />
                      </button>
                    )}
                  </div>

                  {p.achievements?.length ? (
                    <ul className="mb-0" style={{ paddingLeft: 18 }}>
                      {p.achievements.map((a, idx) => (
                        <li key={`${a}-${idx}`}>{a}</li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ color: "#6b7280" }}>No achievements added yet.</div>
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
