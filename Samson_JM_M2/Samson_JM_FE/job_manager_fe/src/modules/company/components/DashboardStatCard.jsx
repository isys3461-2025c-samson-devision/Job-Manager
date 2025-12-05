export default function DashboardStatCard({ title, value, icon }) {
  return (
    <div className="p-3 shadow-sm rounded-4 bg-white text-center">
      <div className="display-6">{icon}</div>
      <h5 className="fw-bold mt-2">{value}</h5>
      <p className="text-muted">{title}</p>
    </div>
  );
}
