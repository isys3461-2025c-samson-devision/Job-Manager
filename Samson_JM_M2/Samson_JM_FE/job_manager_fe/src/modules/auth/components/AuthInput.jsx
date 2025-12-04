export default function AuthInput({ label, type, icon, onChange }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">{label}</label>

      <div className="input-group">
        <span className="input-group-text bg-light">
          <i className={`bi ${icon} text-muted`}></i>
        </span>

        <input 
          type={type}
          className="form-control"
          onChange={onChange}
        />
      </div>
    </div>
  );
}
