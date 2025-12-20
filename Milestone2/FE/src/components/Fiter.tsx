import { FunnelIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { profileService } from '../services/profileServices';
import { setProfileError, setProfileLoading, setSkills } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

type SortValue = 'date_desc' | 'date_asc';

const SORT_OPTIONS: Array<{ label: string; value: SortValue }> = [
  { label: 'Newest first', value: 'date_desc' },
  { label: 'Oldest first', value: 'date_asc' },
];

const parseCsv = (value: string | null): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const toCsv = (values: string[]): string | null => {
  const next = values.map((v) => v.trim()).filter(Boolean);
  return next.length > 0 ? next.join(',') : null;
};

export default function FilterBar() {
  const dispatch = useAppDispatch();
  const { skills, loading } = useAppSelector((state) => state.auth.profile);
  const [searchParams, setSearchParams] = useSearchParams();

  const [showAllSkills, setShowAllSkills] = useState(false);

  const urlSortValue = (searchParams.get('sort') as SortValue | null) ?? 'date_desc';
  const urlSelectedSkillIds = parseCsv(searchParams.get('skills'));

  const [draftSortValue, setDraftSortValue] = useState<SortValue>(urlSortValue);
  const [draftSkillIds, setDraftSkillIds] = useState<string[]>(urlSelectedSkillIds);

  // Keep draft state in sync if user navigates or URL changes.
  useEffect(() => {
    setDraftSortValue(urlSortValue);
    setDraftSkillIds(urlSelectedSkillIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSortValue, searchParams.toString()]);

  const skillById = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>();
    for (const s of skills) map.set(s.id, s);
    return map;
  }, [skills]);

  const visibleSkills = useMemo(() => {
    const limit = 4;
    if (showAllSkills) return skills;
    return skills.slice(0, limit);
  }, [skills, showAllSkills]);

  useEffect(() => {
    // Populate skill tags for the filter once per app session.
    if (skills.length > 0) return;

    let cancelled = false;
    const load = async () => {
      try {
        dispatch(setProfileLoading(true));
        const nextSkills = await profileService.getSkills();
        if (!cancelled) dispatch(setSkills(nextSkills));
      } catch (err) {
        if (!cancelled) {
          dispatch(
            setProfileError(
              err instanceof Error ? err.message : 'Failed to load skills'
            )
          );
        }
      } finally {
        if (!cancelled) dispatch(setProfileLoading(false));
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [dispatch, skills.length]);

  const toggleSkill = (id: string) => {
    setDraftSkillIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const applyFilters = () => {
    const next = new URLSearchParams(searchParams);

    // sort
    if (!draftSortValue) next.delete('sort');
    else next.set('sort', draftSortValue);

    // skills
    const csv = toCsv(draftSkillIds);
    if (!csv) next.delete('skills');
    else next.set('skills', csv);

    setSearchParams(next, { replace: true });
  };

  return (
    <aside className="w-full bg-white border border-gray-200">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-700" />
          <h2 className="text-base font-semibold text-gray-900 tracking-wide">
           Filters
          </h2>
        </div>

        {/* Sort by date */}
        <div className="pb-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort by date</h3>
          <div className="space-y-2">
            {SORT_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 text-sm text-gray-900">
                <input
                  type="radio"
                  name="sort"
                  value={opt.value}
                  checked={draftSortValue === opt.value}
                  onChange={() => setDraftSortValue(opt.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{opt.label === 'Newest first' ? 'Newest' : 'Oldest'}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Skill tags */}
        <div className="py-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Skills</h3>

          {loading ? (
            <div className="text-sm text-gray-500">Loading skills…</div>
          ) : skills.length === 0 ? (
            <div className="text-sm text-gray-500">No skills available</div>
          ) : (
            <div className="space-y-2">
              {visibleSkills.map((skill) => (
                <label key={skill.id} className="flex items-center gap-3 text-sm text-gray-900">
                  <input
                    type="checkbox"
                    checked={draftSkillIds.includes(skill.id)}
                    onChange={() => toggleSkill(skill.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="truncate" title={skill.name}>
                    {skill.name}
                  </span>
                </label>
              ))}
            </div>
          )}

          {skills.length > 4 && (
            <button
              type="button"
              onClick={() => setShowAllSkills((v) => !v)}
              className="mt-3 inline-flex items-center gap-2 text-sm text-gray-900"
              disabled={loading}
            >
              <span>More</span>
              <ChevronDownIcon
                className={`h-4 w-4 text-gray-700 transition-transform ${
                  showAllSkills ? 'rotate-180' : ''
                }`}
              />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={applyFilters}
          disabled={loading}
          className={`mt-4 w-full px-4 py-3 text-sm font-semibold text-white rounded ${
            loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
            Apply 
        </button>

        {/* Small summary (optional but minimal): selected chips count */}
        <div className="mt-3 text-xs text-gray-500">
          Selected: {draftSkillIds.length} Skills
        </div>
      </div>
    </aside>
  );
}