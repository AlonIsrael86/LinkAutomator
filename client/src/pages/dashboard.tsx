import TopBar from "@/components/layout/topbar";
import StatsCards from "@/components/dashboard/stats-cards";
import QuickCreateForm from "@/components/dashboard/quick-create-form";
import RecentActivity from "@/components/dashboard/recent-activity";
import AnalyticsChart from "@/components/dashboard/analytics-chart";
import TopLinksTable from "@/components/dashboard/top-links-table";

export default function Dashboard() {
  return (
    <div className="min-h-screen">
      <TopBar 
        title="לוח בקרה"
        subtitle="סקירה כללית של ביצועי הלינקים שלך"
        buttonText="צור לינק חדש"
        buttonAction="/create-link"
      />
      
      <div className="p-8 space-y-8" dir="rtl">
        <section>
          <StatsCards />
        </section>
        
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <QuickCreateForm />
          </div>
          <RecentActivity />
        </section>

        <section>
          <AnalyticsChart />
        </section>
        
        <section>
          <TopLinksTable />
        </section>
      </div>
    </div>
  );
}
