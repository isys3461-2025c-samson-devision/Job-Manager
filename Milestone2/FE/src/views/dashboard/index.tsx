import Header from "../../components/Header";
import { useAppSelector } from "../../store/hooks.ts";
import FilterBar from "../../components/Filter.tsx";
import RecentJobsWidget from "../../components/RecentJobsWidget";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${user?.email || "User"}!`}
      />
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        <div className="flex-1">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                Profile Status
              </h3>
              <p className="text-gray-600 mt-2">
                Complete your profile to get started
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                Applications
              </h3>
              <p className="text-gray-600 mt-2">
                View and manage your job applications
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                Opportunities
              </h3>
              <p className="text-gray-600 mt-2">Explore job opportunities</p>
            </div>
          </div>

          {/* Recent Jobs Widget */}
          <RecentJobsWidget maxJobs={5} />
        </div>

        {/* Sidebar with Filter */}
        <aside className="w-full lg:w-72 shrink-0">
          <FilterBar />
        </aside>
      </div>
    </>
  );
}

