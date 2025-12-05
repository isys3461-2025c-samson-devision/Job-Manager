import CompanyHeader from "../components/CompanyHeader";
import DashboardStatCard from "../components/DashboardStatCard";
import JobPostPreviewList from "../components/JobPostPreviewList";
import WelcomeBanner from "../components/WelcomeBanner";

export default function CompanyDashboard() {
  const mockPosts = [
    { title: "Frontend Developer", applicants: 12, status: "Open" },
    { title: "UI/UX Designer", applicants: 5, status: "Closed" },
  ];

  return (
    <div className="container py-4">
      <>
        <CompanyHeader />

        <div className="container py-4">
          <WelcomeBanner />

          {/* The Search Banner goes here */}
          {/* The Stats Cards go here */}
          {/* The Featured Jobs section goes here */}
        </div>
      </>

      {/* Dashboard stats */}
      <div className="row mb-4">
        <div className="col">
          <DashboardStatCard title="Active Job Posts" value={3} icon="📄" />
        </div>
        <div className="col">
          <DashboardStatCard title="Applicants" value={45} icon="👥" />
        </div>
        <div className="col">
          <DashboardStatCard title="Interviews" value={8} icon="🎤" />
        </div>
      </div>

      {/* Job Posts Preview */}
      <JobPostPreviewList posts={mockPosts} />
    </div>
  );
}
