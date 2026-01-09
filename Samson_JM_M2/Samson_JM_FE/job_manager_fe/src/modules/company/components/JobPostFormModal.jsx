import React, { useEffect, useState, useMemo } from "react";
import { Modal, Button, Form, Badge} from "react-bootstrap";
import countryList from 'react-select-country-list';

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
  
  const [salaryType, setSalaryType] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  const [skillInput, setSkillInput] = useState("");
  const [technicalSkills, setTechnicalSkills] = useState([]);

  const [employmentTag, setEmploymentTag] = useState([]);

  const [valMessage, setValMessage] = useState(["", "", "", "", ""]);
  // generated country list once
  const options = useMemo(() => countryList().getData(), []);

  // ---------------------------
  // PREFILL FOR EDIT MODE
  // ---------------------------

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setLocation(initialData.location || "");
      setSalaryType(initialData.salaryType || "RANGE");
      setSalaryMin(initialData.salaryMin ?? "");
      setSalaryMax(initialData.salaryMax ?? "");
      setExpiryDate(initialData.expiryDate || "");
      setIsPublished(initialData.isPublished ?? false);
      setTechnicalSkills(initialData.technicalSkills || []);
      setEmploymentTag(initialData.employmentTag || []);
      setValMessage(initialData || []);
    }

    if (mode === "create") {
      resetForm();
    }
  }, [mode, initialData]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setSalaryType("RANGE");
    setSalaryMin("");
    setSalaryMax("");
    setExpiryDate("");
    setIsPublished(false);
    setTechnicalSkills([]);
    setEmploymentTag([]);
    setSkillInput("");
    setValMessage(["", "", "", "", ""]);
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
  // EMPLOYMENT TYPE
  // ---------------------------
  const addEmploy = (tag) => {
    const value = tag.trim();
    if (!value) return;

    setEmploymentTag((prev) => {
    let basket = [...prev];

    // FULL_TIME & PART_TIME are mutually exclusive by remove other emp type already in the list
    if (value === "FULL_TIME") {
      basket = basket.filter((v) => v !== "PART_TIME");
    }

    if (value === "PART_TIME") {
      basket = basket.filter((v) => v !== "FULL_TIME");
    }

    // Avoid duplicates
    if (!basket.includes(value)) {
      basket.push(value);
    }

    return basket;
  });
  };

  const removeEmploy = (emp) => {
    setEmploymentTag((prev) => prev.filter((v) => v !== emp));
  }
  // add validation message
  const changeValidationMessage = (index, message) => {
    setValMessage((prev) => {
      const next = [...prev];
      next[index] = message;
      return next;
    });
  }
  // ---------------------------
  // SUBMIT
  // ---------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    setValMessage(["", "", "", "", ""]);

    let hasError = false;
    const employmentType =
    employmentTag.find(
      (type) => type === "FULL_TIME" || type === "PART_TIME"
    ) ?? "NOT_SPECIFIED";

    const categories = employmentTag.filter(
      (type) => type === "CONTRACT" || type === "INTERNSHIP"
    );
    if(categories.length === 0){
      categories.push("NOT_SPECIFIED");
    }

    //check validity
    if (!title.trim()) {
      changeValidationMessage(0, "Please choose a title.");
      hasError = true;
    }
    if (!location.trim()) {
      changeValidationMessage(1, "Select a location.");
      hasError = true;
    }
    if (employmentTag.length === 0) {
      changeValidationMessage(2, "Choose at least 1 employment type (full time or part time).");
      hasError = true;
    }
    if (!salaryType.trim()) {
      changeValidationMessage(3, "Choose a salary type.");
      hasError = true;
    }
    else {
      switch (salaryType) {
        case "RANGE":
          if (!salaryMin || !salaryMax || Number(salaryMin) >= Number(salaryMax)) {
            changeValidationMessage(3, "For range, ensure min and max salary are filled correctly.");
            hasError = true;
          }
          break;
        case "FROM":
          if (!salaryMin) {
            changeValidationMessage(3, "For from, ensure min salary is filled.");
            hasError = true;
          }
          break;
        case "UP_TO":
          if (!salaryMax) {
            changeValidationMessage(3, "For up to, ensure max salary is filled.");
            hasError = true;
          }
          break;
        default:
          break;
      }
    }
    if (technicalSkills.length === 0) {
      changeValidationMessage(4, "Add at least 1 skill.");
      hasError = true;
    }

    if(!hasError){
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
    }
    else{
      return;
    }

    // prepare payload

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
        <Form noValidate> 
          {/* TITLE */}
          <Form.Group className="mb-3">
            <Form.Label>Job Title</Form.Label>
            <Form.Control 
            isInvalid={!!valMessage[0]} 
            value={title} 
            onChange={(e) => {
              setTitle(e.target.value); 
              changeValidationMessage(0, "") ;} }/>
            <Form.Control.Feedback type="invalid">{valMessage[0]}</Form.Control.Feedback>
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
            <Form.Select 
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                changeValidationMessage(1, "");}}
              isInvalid={!!valMessage[1]}
            >
              <option value="">Select a country</option>
              {options.map((country) => (
                <option key={country.value} value={country.label}>
                  {country.label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{valMessage[1]}</Form.Control.Feedback>
          </Form.Group>

          {/* EMPLOYMENT TYPE */}
            <Form.Group className="mb-3">
              <Form.Label>Employment Type</Form.Label>
              <Form.Select 
              value = "" 
              onChange={(e) => {
                addEmploy(e.target.value); 
                changeValidationMessage(2, "");}} 
              isInvalid={!!valMessage[2]}>
                <option value = "" >Selecting</option>
                <option value = "FULL_TIME" >Full Time</option>
                <option value ="PART_TIME">Part Time</option>
                <option value ="CONTRACT" >Contract</option>
                <option value ="INTERNSHIP" >Internship</option>
              </Form.Select>
            <Form.Control.Feedback type="invalid">{valMessage[2]}</Form.Control.Feedback>
            </Form.Group>

          <div className="mt-2">
            {employmentTag.map((tag) => (
              <Badge
                key={tag}
                pill
                bg="primary"
                className="me-2"
                style={{ cursor: "pointer" }}
                onClick={() => removeEmploy(tag)}
              >
                {tag} ✕
              </Badge>
            ))}
          </div>

          {/* SALARY */}
          <Form.Group className="mt-3">
            <Form.Label>Salary Type</Form.Label>
            <Form.Select
            isInvalid={!!valMessage[3]} 
            value={salaryType} 
            onChange={(e) => {
              setSalaryType(e.target.value);
              changeValidationMessage(3, "");}}>
              <option value="">Selecting</option>
              <option value="RANGE">Range</option>
              <option value="FROM">From</option>
              <option value="UP_TO">Up to</option>
              <option value="NEGOTIABLE">Negotiable</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{valMessage[3]}</Form.Control.Feedback>
          </Form.Group>

          {salaryType !== "NEGOTIABLE" && (
            <div className="row mt-2">
              <div className="col">
                <Form.Control
                  placeholder="Min"
                  type="number"
                  value={salaryMin}
                  disabled={salaryType === "UP_TO"}
                  onChange={(e) => setSalaryMin(e.target.value)}
                />
              </div>
              <div className="col">
                <Form.Control
                  placeholder="Max"
                  type="number"
                  value={salaryMax}
                  disabled={salaryType === "FROM"}
                  onChange={(e) => setSalaryMax(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* SKILLS */}
          <Form.Group className="mt-3">
            <Form.Label>Technical Skills</Form.Label>
            <div className={`d-flex gap-2 ${valMessage[4] ? "is-invalid" : ""}`}>
              <Form.Control
                value={skillInput}
                onChange={(e) => {
                  setSkillInput(e.target.value)
                  changeValidationMessage(4, "");
                }}
              />
              <Button onClick={addSkill}>Add</Button>
            </div>
            {valMessage[4] && (
              <div className="invalid-feedback d-block">
                {valMessage[4]}
              </div>
            )}
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
