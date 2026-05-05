const ROWS = [
  { label: 'Location', key: 'location', format: (v) => v },
  { label: 'Annual Fees', key: 'fees', format: (v) => `₹${Number(v).toLocaleString('en-IN')}` },
  { label: 'Rating', key: 'rating', format: (v) => `${v} / 5 ⭐` },
  { label: 'Placement %', key: 'placement_percentage', format: (v) => `${v}%` },
  { label: 'Established', key: 'established_year', format: (v) => v || 'N/A' },
]

export default function CompareTable({ colleges }) {
  if (!colleges || colleges.length === 0) return null

  // Find best values for highlighting
  const bestPlacement = Math.max(...colleges.map((c) => c.placement_percentage))
  const lowestFees = Math.min(...colleges.map((c) => c.fees))
  const bestRating = Math.max(...colleges.map((c) => parseFloat(c.rating)))

  const isBest = (college, key) => {
    if (key === 'placement_percentage') return college[key] === bestPlacement
    if (key === 'fees') return college[key] === lowestFees
    if (key === 'rating') return parseFloat(college[key]) === bestRating
    return false
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-100">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className="text-left px-4 py-3 font-medium text-slate-500 w-32">Criteria</th>
            {colleges.map((c) => (
              <th key={c.id} className="text-center px-4 py-3 font-display font-semibold text-slate-800">
                {c.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row, i) => (
            <tr key={row.key} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
              <td className="px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wide">
                {row.label}
              </td>
              {colleges.map((c) => (
                <td
                  key={c.id}
                  className={`px-4 py-3 text-center font-medium ${
                    isBest(c, row.key)
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-slate-700'
                  }`}
                >
                  {row.format(c[row.key])}
                  {isBest(c, row.key) && (
                    <span className="ml-1 text-xs">✓</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}