import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setProfileData,
  setProfileLoading,
  setProfileError,
  setSkills,
} from '../../store/authSlice';
import { profileService } from '../../services/profileServices';
import type { ProfileFormData } from '../../types';
import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';

export default function ProfileCreatePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { skills, loading, error } = useAppSelector((state) => state.auth.profile);

  // Local form state
  const [formData, setFormData] = useState<ProfileFormData>({
    email: '',
    country: '',
    phone: '',
    street: '',
    city: '',
    skills: [],
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch skills on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        dispatch(setProfileLoading(true));
        const skillsData = await profileService.getSkills();
        dispatch(setSkills(skillsData));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load skills';
        dispatch(setProfileError(errorMessage));
      } finally {
        dispatch(setProfileLoading(false));
      }
    };

    fetchSkills();
  }, [dispatch]);

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    }

    if (formData.skills.length === 0) {
      errors.skills = 'Please select at least one skill';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle skill selection
  const handleSkillToggle = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((id) => id !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);
      await profileService.createProfile(formData);
      dispatch(setProfileData(formData));
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create profile';
      dispatch(setProfileError(errorMessage));
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Header title="Loading..." />
        <div className="flex justify-center items-center min-h-screen">
          <p>Loading skills...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header
        title="Complete Your Profile"
        subtitle="Add your personal information and select your coding skills"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Profile' },
        ]}
      />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information Section */}
          <fieldset className="border border-gray-300 rounded-lg p-6">
            <legend className="text-lg font-semibold text-gray-900 px-2">
              Personal Information
            </legend>

            {/* Email */}
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="you@example.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            {/* Country */}
            <div className="mt-4">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">-- Select Country --</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select>
              {validationErrors.country && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.country}</p>
              )}
            </div>

            {/* Phone */}
            <div className="mt-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Street */}
            <div className="mt-4">
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                Street Address <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main St"
              />
            </div>

            {/* City */}
            <div className="mt-4">
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New York"
              />
            </div>
          </fieldset>

          {/* Skills Section */}
          <fieldset className="border border-gray-300 rounded-lg p-6">
            <legend className="text-lg font-semibold text-gray-900 px-2">
              Coding Skills
            </legend>

            <p className="mt-4 text-sm text-gray-600 mb-4">
              Select your coding skills <span className="text-red-500">*</span>
            </p>

            {validationErrors.skills && (
              <p className="mb-4 text-sm text-red-600">{validationErrors.skills}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <label
                  key={skill.id}
                  className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-blue-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.skills.includes(skill.id)}
                    onChange={() => handleSkillToggle(skill.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{skill.name}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitLoading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {submitLoading ? 'Creating Profile...' : 'Create Profile'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-md hover:bg-gray-400 font-medium"
            >
              Skip for Now
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}