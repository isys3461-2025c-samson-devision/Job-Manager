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
import Header from '../../components/Header';

// Mock data for testing
const MOCK_SKILLS = [
  { id: '1', name: 'JavaScript' },
  { id: '2', name: 'TypeScript' },
  { id: '3', name: 'React' },
  { id: '4', name: 'Node.js' },
  { id: '5', name: 'Python' },
  { id: '6', name: 'SQL' },
  { id: '7', name: 'MongoDB' },
  { id: '8', name: 'AWS' },
  { id: '9', name: 'Docker' },
  { id: '10', name: 'Git' },
];


const USE_MOCK_DATA = true; // Set to false to use real API

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
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        dispatch(setProfileLoading(true));

        if (USE_MOCK_DATA) {
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));
          dispatch(setSkills(MOCK_SKILLS));
        } else {
          const skillsData = await profileService.getSkills();
          dispatch(setSkills(skillsData));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load skills';
        dispatch(setProfileError(errorMessage));
      } finally {
        dispatch(setProfileLoading(false));
      }
    };

    fetchSkills();
  }, [dispatch]);

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <>
        <Header
          title="Complete Your Profile"
          subtitle="Add your personal information and select your coding skills"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Profile' },
          ]}
        />

        <div className="flex justify-center items-center min-h-screen">
          <p>Loading profile creation form...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Complete Your Profile"
        subtitle="Add your personal information and select your coding skills"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Profile' },
        ]}
      />

      <div className="max-w-2xl mx-auto px-4 py-8">
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
                className={`mt-2 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${validationErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                placeholder="you@example.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
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

            {validationErrors.skills && (
              <p className="mt-4 mb-4 text-sm text-red-600">{validationErrors.skills}</p>
            )}

            {/* Selected Skills Tags */}
            {formData.skills.length > 0 && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Selected Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skillId) => {
                    const skill = skills.find((s) => s.id === skillId);
                    return skill ? (
                      <div
                        key={skillId}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-200 text-blue-900 rounded-full text-sm font-medium"
                      >
                        <span>{skill.name}</span>
                        <button
                          type="button"
                          onClick={() => handleSkillToggle(skillId)}
                          className="ml-1 font-bold text-blue-900 hover:text-blue-700 focus:outline-none"
                          aria-label={`Remove ${skill.name}`}
                        >
                          ✕
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-4">
              Select your coding skills <span className="text-red-500">*</span>
            </p>

            {/* Search Input */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredSkills.length > 0 ? (
                filteredSkills.map((skill) => {
                  const isSelected = formData.skills.includes(skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => handleSkillToggle(skill.id)}
                      className={`p-3 py-2 border rounded-full font-medium text-sm transition-colors ${isSelected
                          ? 'bg-blue-100 border-blue-400 text-blue-900 cursor-pointer hover:bg-blue-200'
                          : 'bg-white border-gray-300 text-gray-700 cursor-pointer hover:border-blue-400 hover:bg-blue-50'
                        }`}
                    >
                      {skill.name}
                    </button>
                  );
                })
              ) : (
                <p className="col-span-2 md:col-span-3 text-sm text-gray-500">
                  No skills found matching "{searchQuery}"
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Selected: {formData.skills.length} skill(s) | Showing {filteredSkills.length} of {skills.length}
            </p>
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
    </>
  );
}