import MainLayout from '../../layouts/MainLayout';
import Header from '../../components/Header';
import { useAppSelector } from '../../store/hooks.ts';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <MainLayout>
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${user?.email || 'User'}`}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Profile Status</h3>
            <p className="text-gray-600 mt-2">Complete your profile to get started</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Applications</h3>
            <p className="text-gray-600 mt-2">View and manage your job applications</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Opportunities</h3>
            <p className="text-gray-600 mt-2">Explore job opportunities</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}