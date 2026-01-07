import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";

export default function JobPostFormModal({
  show,
  onClose,
  onSubmit,
  mode = "create", // "create" | "edit"
  initialData = null,
}) {
  // ---------------------------
  // STATE
  // ---------------------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("FULL_TIME");
  const [categories, setCategories] = useState([]);
  const [salaryType, setSalaryType] = useState("RANGE");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [skillInput, setSkillInput] = useState("");
  const [technicalSkills, setTechnicalSkills] = useState([]);

  // ---------------------------
  // PREFILL FOR EDIT MODE
  // ---------------------------
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setLocation(initialData.location || "");
      setEmploymentType(initialData.employmentType || "FULL_TIME");
      setCategories(initialData.categories || []);
      setSalaryType(initialData.salaryType || "RANGE");
      setSalaryMin(initialData.salaryMin ?? "");
      setSalaryMax(initialData.salaryMax ?? "");
      setExpiryDate(initialData.expiryDate || "");
      setIsPublished(initialData.isPublished ?? false);
      setTechnicalSkills(initialData.technicalSkills || []);
    }

    if (mode === "create") {
      resetForm();
    }
  }, [mode, initialData]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setEmploymentType("FULL_TIME");
    setCategories([]);
    setSalaryType("RANGE");
    setSalaryMin("");
    setSalaryMax("");
    setExpiryDate("");
    setIsPublished(false);
    setTechnicalSkills([]);
    setSkillInput("");
  };

  // ---------------------------
  // SKILLS
  // ---------------------------
  const addSkill = () => {
    if (skillInput.trim() && !technicalSkills.includes(skillInput.trim())) {
      setTechnicalSkills([...technicalSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setTechnicalSkills(technicalSkills.filter((s) => s !== skill));
  };

  // ---------------------------
  // SUBMIT
  // ---------------------------
  const handleSubmit = () => {
    const payload = {
      title,
      description,
      location,
      employmentType,
      categories,
      salaryType,
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,
      expiryDate: expiryDate || null,
      technicalSkills,
      isPublished,
    };

    onSubmit(payload);
    onClose();
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "edit" ? "Edit Job Post" : "Create Job Post"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* TITLE */}
          <Form.Group className="mb-3">
            <Form.Label>Job Title</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} />
          </Form.Group>

          {/* DESCRIPTION */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          {/* LOCATION */}
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control value={location} onChange={(e) => setLocation(e.target.value)} />
          </Form.Group>

          {/* EMPLOYMENT + CATEGORY */}
          <div className="row">
            <div className="col-md-6">
              <Form.Label>Employment Type</Form.Label>
              <Form.Select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
              >
                <option value="FULL_TIME">Full-time</option>
                <option value="PART_TIME">Part-time</option>
                <option value="INTERN">Internship</option>
              </Form.Select>
            </div>

            <div className="col-md-6">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={categories[0] || ""}
                onChange={(e) => setCategories([e.target.value])}
              >
                <option value="">Select</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </Form.Select>
            </div>
          </div>

          {/* SALARY */}
          <Form.Group className="mt-3">
            <Form.Label>Salary Type</Form.Label>
            <Form.Select value={salaryType} onChange={(e) => setSalaryType(e.target.value)}>
              <option value="RANGE">Range</option>
              <option value="FROM">From</option>
              <option value="UP_TO">Up to</option>
              <option value="NEGOTIABLE">Negotiable</option>
            </Form.Select>
          </Form.Group>

          {salaryType !== "NEGOTIABLE" && (
            <div className="row mt-2">
              <div className="col">
                <Form.Control
                  placeholder="Min"
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                />
              </div>
              <div className="col">
                <Form.Control
                  placeholder="Max"
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* SKILLS */}
          <Form.Group className="mt-3">
            <Form.Label>Technical Skills</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
              />
              <Button onClick={addSkill}>Add</Button>
            </div>
          </Form.Group>

          <div className="mt-2">
            {technicalSkills.map((skill) => (
              <Badge
                key={skill}
                pill
                bg="primary"
                className="me-2"
                style={{ cursor: "pointer" }}
                onClick={() => removeSkill(skill)}
              >
                {skill} ✕
              </Badge>
            ))}
          </div>

          {/* PUBLISH */}
          <Form.Check
            className="mt-3"
            label="Publish job post"
            checked={isPublished}
            onChange={() => setIsPublished(!isPublished)}
          />
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {mode === "edit" ? "Save Changes" : "Create Job"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
