import { useState } from 'react';
import { HiOutlineSearch, HiOutlineAdjustments } from 'react-icons/hi';

const workModes = ['remote', 'onsite', 'hybrid'];
const employmentTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];

const SearchFilters = ({ filters, onChange, onSubmit }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [local, setLocal] = useState(filters);

  const update = (patch) => setLocal((prev) => ({ ...prev, ...patch }));

  const apply = () => {
    onChange(local);
    onSubmit?.();
  };

  const clear = () => {
    setLocal({});
    onChange({});
    onSubmit?.();
  };

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            className="input pl-9"
            placeholder="Job title, skill, or keyword"
            value={local.search || ''}
            onChange={(e) => update({ search: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
          />
        </div>
        <input
          className="input sm:w-56"
          placeholder="Location"
          value={local.location || ''}
          onChange={(e) => update({ location: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
        />
        <button onClick={apply} className="btn-primary shrink-0">Search</button>
        <button
          onClick={() => setShowAdvanced((s) => !s)}
          className="btn-secondary shrink-0"
          aria-expanded={showAdvanced}
        >
          <HiOutlineAdjustments /> Filters
        </button>
      </div>

      {showAdvanced && (
        <div className="mt-4 grid grid-cols-1 gap-4 border-t border-black/5 pt-4 dark:border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">Work mode</label>
            <select className="input" value={local.workMode || ''} onChange={(e) => update({ workMode: e.target.value })}>
              <option value="">Any</option>
              {workModes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Employment type</label>
            <select className="input" value={local.employmentType || ''} onChange={(e) => update({ employmentType: e.target.value })}>
              <option value="">Any</option>
              {employmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Company</label>
            <input className="input" value={local.company || ''} onChange={(e) => update({ company: e.target.value })} />
          </div>
          <div>
            <label className="label">Skills (comma separated)</label>
            <input className="input" value={local.skills || ''} onChange={(e) => update({ skills: e.target.value })} />
          </div>
          <div>
            <label className="label">Experience min (yrs)</label>
            <input type="number" min="0" className="input" value={local.experienceMin || ''} onChange={(e) => update({ experienceMin: e.target.value })} />
          </div>
          <div>
            <label className="label">Experience max (yrs)</label>
            <input type="number" min="0" className="input" value={local.experienceMax || ''} onChange={(e) => update({ experienceMax: e.target.value })} />
          </div>
          <div>
            <label className="label">Salary min</label>
            <input type="number" min="0" className="input" value={local.salaryMin || ''} onChange={(e) => update({ salaryMin: e.target.value })} />
          </div>
          <div>
            <label className="label">Salary max</label>
            <input type="number" min="0" className="input" value={local.salaryMax || ''} onChange={(e) => update({ salaryMax: e.target.value })} />
          </div>
          <div>
            <label className="label">Sort by</label>
            <select className="input" value={local.sort || '-createdAt'} onChange={(e) => update({ sort: e.target.value })}>
              <option value="-createdAt">Newest first</option>
              <option value="salaryMax">Salary: low to high</option>
              <option value="-salaryMax">Salary: high to low</option>
              <option value="-views">Most viewed</option>
            </select>
          </div>
          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
            <button onClick={apply} className="btn-primary">Apply filters</button>
            <button onClick={clear} className="btn-secondary">Clear all</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
