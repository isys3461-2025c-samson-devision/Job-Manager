import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CountrySelect from "../../components/CountrySelect";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setProfileData,
  setProfileLoading,
  setProfileError,
  setSkills,
} from "../../store/authSlice";

import { profileService } from "../../services/profileServices";
import type { ProfileFormData } from "../../types";
import Header from "../../components/Header";

/* ================= TYPES ================= */

interface Country {
  name: string;
  code: string; // ISO alpha-2 (VN, US...)
}

type RestCountry = {
  cca2?: string;
  name?: {
    common?: string;
  };
};

type RestCountryWithFields = {
  cca2: string;
  name: {
    common: string;
  };
};

/* ================= COMPONENT ================= */

export default function ProfileCreatePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { skills, loading, error } = useAppSelector(
    (state) => state.auth.profile
  );

  /* ---------- Local State ---------- */

  const [countries, setCountries] = useState<Country[]>([]);

  const [formData, setFormData] = useState<ProfileFormData>({
    email: "",
    country: "",
    phone: "",
    street: "",
    city: "",
    skills: [],
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [submitLoading, setSubmitLoading] = useState(false);

  /* ================= FETCH DATA ================= */

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        dispatch(setProfileLoading(true));
        const skillsData = await profileService.getSkills();
        dispatch(setSkills(skillsData));
      } catch (err) {
        dispatch(
          setProfileError(
            err instanceof Error ? err.message : "Failed to load skills"
          )
        );
      } finally {
        dispatch(setProfileLoading(false));
      }
    };

    fetchSkills();
  }, [dispatch]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
      }));
    }
  }, []);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,cca2"
        );

        const raw = res.data as RestCountry[];
        const data: Country[] = raw
          .filter(
            (c): c is RestCountryWithFields =>
              typeof c.cca2 === "string" &&
              typeof c.name?.common === "string" &&
              c.cca2.length > 0 &&
              c.name.common.length > 0
          )
          .map((c) => ({
            name: c.name.common,
            code: c.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(data);
      } catch (err: unknown) {
        console.error("Failed to load countries", err);
      }
    };

    fetchCountries();
  }, []);

  /* ================= VALIDATION ================= */

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.country) {
      errors.country = "Country is required";
    }

    if (formData.skills.length === 0) {
      errors.skills = "Please select at least one skill";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /* ================= HANDLERS ================= */

  const handleSkillToggle = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((id) => id !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitLoading(true);
      await profileService.createProfile(formData);
      dispatch(setProfileData(formData));
      navigate("/dashboard");
    } catch (err) {
      dispatch(
        setProfileError(
          err instanceof Error ? err.message : "Failed to create profile"
        )
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <>
        <Header title="Loading..." />
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Complete Your Profile"
        subtitle="Add your personal information and select your coding skills"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Profile" }]}
      />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ================= PERSONAL INFO ================= */}
          <fieldset className="border rounded-lg p-6">
            <legend className="text-lg font-semibold px-2">
              Personal Information
            </legend>

            {/* Email */}
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />

            {/* Country */}
            <div className="mt-4">
              <label className="block text-sm font-medium">Country *</label>

              <CountrySelect
                countries={countries}
                value={formData.country}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, country: value }))
                }
                error={!!validationErrors.country}
              />

              {validationErrors.country && (
                <p className="text-sm text-red-600">
                  {validationErrors.country}
                </p>
              )}
            </div>
          </fieldset>

          {/* ================= SKILLS ================= */}
          <fieldset className="border rounded-lg p-6">
            <legend className="text-lg font-semibold px-2">
              Coding Skills *
            </legend>

            {validationErrors.skills && (
              <p className="text-sm text-red-600 mb-2">
                {validationErrors.skills}
              </p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <label
                  key={skill.id}
                  className="flex items-center gap-2 border p-2 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill.id)}
                    onChange={() => handleSkillToggle(skill.id)}
                  />
                  {skill.name}
                </label>
              ))}
            </div>
          </fieldset>

          {/* ================= ACTIONS ================= */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitLoading}
              className="flex-1 bg-blue-600 text-white py-2 rounded"
            >
              {submitLoading ? "Creating..." : "Create Profile"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-gray-300 py-2 rounded"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
