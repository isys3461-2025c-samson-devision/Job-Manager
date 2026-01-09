import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import { getNames } from "country-list";

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
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [employmentType, setEmploymentType] = useState("FULL_TIME");
  const [categories, setCategories] = useState([]);
  const [salaryType, setSalaryType] = useState("RANGE");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [skillInput, setSkillInput] = useState("");
  const [technicalSkills, setTechnicalSkills] = useState([]);

  const countryOptions = getNames(); // ["Vietnam", "Singapore", ...]

  // ---------------------------
  // PREFILL FOR EDIT MODE
  // ---------------------------
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      if (initialData.location) {
        const [savedCity, savedCountry] = initialData.location.split(", ");
        setCity(savedCity || "");
        setCountry(savedCountry || "");
      }
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
    setCity("");
    setCountry("");
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

  const toggleCategory = (category) => {
    setCategories(
      (prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category) // remove
          : [...prev, category] // add
    );
  };

  const CATEGORY_OPTIONS = [
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" },
  ];

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
      location: city && country ? `${city}, ${country}` : null,
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
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Label>City</Form.Label>
              <Form.Control
                placeholder="e.g. Ho Chi Minh City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="col-md-6">
              <Form.Label>Country</Form.Label>
              <Form.Select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select country</option>
                {countryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

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
              </Form.Select>
            </div>

            <div className="col-md-6">
              <div className="col-md-6">
                <Form.Label>Category</Form.Label>

                <div className="d-flex flex-column gap-1 mt-1">
                  {CATEGORY_OPTIONS.map((cat) => (
                    <Form.Check
                      key={cat.value}
                      type="checkbox"
                      label={cat.label}
                      checked={categories.includes(cat.value)}
                      onChange={() => toggleCategory(cat.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SALARY */}
          <Form.Group className="mt-3">
            <Form.Label>Salary Type</Form.Label>
            <Form.Select
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
            >
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
