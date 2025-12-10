import "../styles/jobFilterBar.css";

export default function JobFilterBar({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
}) {
  return (
    <div className="job-filter-container p-3 rounded-4 shadow-sm mb-4">
      <div className="d-flex align-items-center gap-3 w-100">

        {/* SEARCH BAR */}
        <div className="job-search-box flex-grow-1 d-flex align-items-center px-3">
          <i className="bi bi-search me-2"></i>
          <input
            type="text"
            placeholder="Search job title, location, or type..."
            className="job-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* STATUS DROPDOWN */}
        <div className="job-dropdown-box px-3 d-flex align-items-center">
          <i className="bi bi-funnel me-2"></i>
          <select
            className="job-filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="public">public</option>
            <option value="private">private</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* FILTER BUTTON */}
        <button className="btn job-filter-btn text-white px-4">
          <i className="bi bi-sliders me-2"></i>
          Filters
        </button>

      </div>
    </div>
  );
}
