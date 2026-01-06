export default function SubscriptionPlanCard({
  title,
  price,
  description,
  featureList = [],
  isPremium,
  isCurrent,
  buttonLabel,
  buttonDisabled,
  onButtonClick
}) {

  return (
    <div
      className="p-4 bg-white rounded-4 shadow-sm border"
      style={{
        borderColor: isCurrent ? "#0d6efd" : "#e5e5e5",
      }}
    >
      <h4 className="fw-bold">{title}</h4>
      <p className="text-muted">{description}</p>

      <h2
        className="fw-bold mt-2"
        style={{ color: isPremium ? "#f4a700" : "inherit" }}
      >
        {price}
      </h2>

      <div className="mt-3 mb-4">
        {featureList.map((f, i) => {
          const available = isPremium ? f.premium : f.free;

          return (
            <div
              key={i}
              className="d-flex align-items-center mb-2"
            >
              {available ? (
                <i className="bi bi-check-circle-fill text-success me-2"></i>
              ) : (
                <i className="bi bi-x-circle text-secondary me-2"></i>
              )}
              <span className={available ? "" : "text-muted"}>
                {f.label}
              </span>
            </div>
          );
        })}
      </div>

      <button
        className={`btn w-100 ${isCurrent ? "btn-outline-primary" : "btn-primary"}`}
        disabled={buttonDisabled}
        onClick={onButtonClick}
      >
        {buttonLabel}
      </button>

      {isCurrent && (
        <p className="text-success fw-bold text-center mt-2">Current Plan</p>
      )}
    </div>
  );
}
