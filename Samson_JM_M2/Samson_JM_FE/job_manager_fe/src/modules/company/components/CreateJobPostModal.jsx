import React, { useState } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";

export default function CreateJobPostModal({ show, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("Full-time");
  const [category, setCategory] = useState("None");
  const [salaryType, setSalaryType] = useState("Range");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const addSkill = () => {
    if (skillInput.trim() !== "") {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = () => {
    const jobPost = {
      title,
      description,
      location,
      posted_date: new Date().toISOString().split("T")[0],
      expiry_date: expiryDate || null,
      employment_type: `${category !== "None" ? category + " " : ""}${employmentType}`,
      salary_type: salaryType,
      salary_min: salaryMin ? Number(salaryMin) : null,
      salary_max: salaryMax ? Number(salaryMax) : null,
      is_published: isPublished,
      skills,
    };

    onSubmit(jobPost);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered>
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
              placeholder="Describe the job responsibilities..."
            />
          </Form.Group>

          {/* LOCATION */}
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ho Chi Minh City, Vietnam"
            />
          </Form.Group>

          {/* EMPLOYMENT TYPE */}
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Contract Type</Form.Label>
                <Form.Select
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                >
                  <option>Full-time</option>
                  <option>Part-time</option>
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
                  <option>None</option>
                  <option>Internship</option>
                  <option>Contract</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          {/* EXPIRY DATE */}
          <Form.Group className="mb-3">
            <Form.Label>Expiry Date (Optional)</Form.Label>
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
              <option>Range</option>
              <option>Estimation</option>
              <option>Up to</option>
              <option>From</option>
              <option>Negotiable</option>
            </Form.Select>
          </Form.Group>

          {/* SALARY INPUTS */}
          {salaryType !== "Negotiable" && (
            <div className="row">
              {(salaryType === "Range" ||
                salaryType === "Estimation" ||
                salaryType === "From") && (
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Min Salary</Form.Label>
                    <Form.Control
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                    />
                  </Form.Group>
                </div>
              )}

              {(salaryType === "Range" || salaryType === "Up to") && (
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Max Salary</Form.Label>
                    <Form.Control
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                    />
                  </Form.Group>
                </div>
              )}
            </div>
          )}

          {/* SKILLS TAGGING */}
          <Form.Group className="mb-2">
            <Form.Label>Technical Skills</Form.Label>
            <div className="input-group">
              <Form.Control
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add a skill (e.g., Python)"
              />
              <Button variant="outline-primary" onClick={addSkill}>
                Add
              </Button>
            </div>
          </Form.Group>

          <div className="mb-3">
            {skills.map((skill) => (
              <Badge
                bg="secondary"
                className="me-2 p-2"
                key={skill}
                style={{ cursor: "pointer" }}
                onClick={() => removeSkill(skill)}
              >
                {skill} ✕
              </Badge>
            ))}
          </div>

          {/* PUBLISH TOGGLE */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Publish this job post"
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
