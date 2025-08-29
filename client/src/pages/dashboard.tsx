import TopBar from "@/components/layout/topbar";
import StatsCards from "@/components/dashboard/stats-cards";
import QuickCreateForm from "@/components/dashboard/quick-create-form";
import RecentActivity from "@/components/dashboard/recent-activity";
import AnalyticsChart from "@/components/dashboard/analytics-chart";
import TopLinksTable from "@/components/dashboard/top-links-table";

export default function Dashboard() {
  return (
    <>
      <TopBar 
        title="Dashboard"
        subtitle="Overview of your link performance"
        buttonText="Create New Link"
        buttonAction="/create-link"
      />
      
      <div className="p-6 space-y-6">
        <StatsCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QuickCreateForm />
          </div>
          <RecentActivity />
        </div>

        <AnalyticsChart />
        <TopLinksTable />
      </div>
    </>
  );
}
