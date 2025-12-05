import CompanyHeader from "../components/CompanyHeader";
import JobPostPreviewList from "../components/JobPostPreviewList";
import WelcomeBanner from "../components/WelcomeBanner";
import StatCard from "../components/StatCard";
import mockPosts from "../data/mockJobPosts.json";

import { useEffect, useState } from "react";
import { companyService } from "../service/companyService";

export default function CompanyDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    companyService.getCompanyStats().then(setStats);
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <>
      <CompanyHeader />

      <div className="container py-4">
        <WelcomeBanner />

          {/* ROW 2 — StatCards */}
          <div className="row mb-4 g-4">
            <div className="col-md-3 col-sm-6">
              <StatCard
                icon="bi-briefcase"
                iconColor="#2d68ff"
                value={stats.activeJobs}
                label="JobPosts"
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <StatCard
                icon="bi-building"
                iconColor="#555"
                value={stats.companies}
                label="Companies"
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <StatCard
                icon="bi-graph-up-arrow"
                iconColor="#C063E6"
                value={stats.newToday}
                label="New Today"
              />
            </div>

            <div className="col-md-3 col-sm-6">
              <StatCard
                icon="bi-bookmark"
                iconColor="#E88F2A"
                value={stats.savedJobs}
                label="Saved Jobs"
              />
            </div>
          </div>

        {/* Recent job posts */}
        <JobPostPreviewList posts={mockPosts} />
      </div>
    </>
  );
}
