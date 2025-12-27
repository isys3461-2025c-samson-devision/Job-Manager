import React, { useState } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";

export default function CreateJobPostModal({ show, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [employmentType, setEmploymentType] = useState("FULL_TIME");
  const [category, setCategory] = useState("");

  const [salaryType, setSalaryType] = useState("RANGE");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  const [expiryDate, setExpiryDate] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [skillInput, setSkillInput] = useState("");
  const [technicalSkills, setTechnicalSkills] = useState([]);

  /* ======================
     SKILLS
     ====================== */
  const addSkill = () => {
    if (skillInput.trim() && !technicalSkills.includes(skillInput.trim())) {
      setTechnicalSkills([...technicalSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setTechnicalSkills(technicalSkills.filter((s) => s !== skill));
  };

  /* ======================
     SUBMIT
     ====================== */
  const handleSubmit = () => {
    const payload = {
      title,
      description,
      location,

      employmentType,
      categories: category ? [category] : [],

      expiryDate: expiryDate || null,

      salaryType,
      salaryMin: salaryMin ? Number(salaryMin) : null,
      salaryMax: salaryMax ? Number(salaryMax) : null,

      technicalSkills,
      isPublished,
    };

    onSubmit(payload);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create Job Post</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>

          {/* TITLE */}
          <Form.Group className="mb-3">
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Software Engineer"
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
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Form.Group>

          {/* EMPLOYMENT + CATEGORY */}
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Employment Type</Form.Label>
                <Form.Select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                >
                  <option value="FULL_TIME">Full-time</option>
                  <option value="PART_TIME">Part-time</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">None</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          {/* EXPIRY DATE */}
          <Form.Group className="mb-3">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </Form.Group>

          {/* SALARY TYPE */}
          <Form.Group className="mb-3">
            <Form.Label>Salary Type</Form.Label>
            <Form.Select
              value={salaryType}
              onChange={(e) => setSalaryType(e.target.value)}
            >
              <option value="RANGE">Range</option>
              <option value="ESTIMATION">Estimation</option>
              <option value="UP_TO">Up to</option>
              <option value="FROM">From</option>
              <option value="NEGOTIABLE">Negotiable</option>
            </Form.Select>
          </Form.Group>

          {/* SALARY INPUTS */}
          {salaryType !== "NEGOTIABLE" && (
            <div className="row">
              {(salaryType === "RANGE" || salaryType === "ESTIMATION" || salaryType === "FROM") && (
                <div className="col-md-6">
                  <Form.Control
                    type="number"
                    placeholder="Min salary"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                  />
                </div>
              )}
              {(salaryType === "RANGE" || salaryType === "UP_TO") && (
                <div className="col-md-6">
                  <Form.Control
                    type="number"
                    placeholder="Max salary"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* SKILLS */}
          <Form.Group className="mt-3">
            <Form.Label>Technical Skills</Form.Label>
            <div className="input-group">
              <Form.Control
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
              />
              <Button variant="outline-primary" onClick={addSkill}>
                Add
              </Button>
            </div>
          </Form.Group>

          <div className="mt-2">
            {technicalSkills.map((skill) => (
              <Badge
                key={skill}
                bg="primary"
                className="me-2 p-2"
                style={{ cursor: "pointer" }}
                onClick={() => removeSkill(skill)}
              >
                {skill} ✕
              </Badge>
            ))}
          </div>

          {/* PUBLISH */}
          <Form.Group className="mt-3">
            <Form.Check
              type="checkbox"
              label="Publish immediately"
              checked={isPublished}
              onChange={() => setIsPublished(!isPublished)}
            />
          </Form.Group>

        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create Job Post
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
