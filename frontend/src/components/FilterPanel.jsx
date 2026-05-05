const LOCATIONS = ['Mumbai', 'New Delhi', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Rajasthan', 'Karnataka', 'Tamil Nadu']
const FEE_OPTIONS = [
  { label: 'Under ₹1L', value: '100000' },
  { label: 'Under ₹2L', value: '200000' },
  { label: 'Under ₹3L', value: '300000' },
  { label: 'Under ₹5L', value: '500000' },
]

export default function FilterPanel({ filters, onChange }) {
  return (
    <div className="card p-4 space-y-5">
      <h3 className="font-display font-semibold text-slate-800 text-sm">Filters</h3>

      {/* Location filter */}
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-2">
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
          className="input text-sm"
        >
          <option value="">All Locations</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Max fees filter */}
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-2">
          Max Annual Fees
        </label>
        <select
          value={filters.maxFees}
          onChange={(e) => onChange({ ...filters, maxFees: e.target.value })}
          className="input text-sm"
        >
          <option value="">Any</option>
          {FEE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ location: '', maxFees: '' })}
        className="text-xs text-brand-600 hover:underline"
      >
        Clear filters
      </button>
    </div>
  )
}