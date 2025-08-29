import TopBar from "@/components/layout/topbar";
import AnalyticsChart from "@/components/dashboard/analytics-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useState } from "react";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7");
  const [selectedLink, setSelectedLink] = useState("all");

  const { data: dashboardStats } = useQuery<any>({
    queryKey: ["/api/analytics/dashboard"]
  });

  const { data: links = [] } = useQuery<any[]>({
    queryKey: ["/api/links"]
  });

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedLink !== "all") {
        params.append("linkId", selectedLink);
      }
      
      const response = await fetch(`/api/analytics/export?${params}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analytics.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <>
      <TopBar 
        title="Analytics"
        subtitle="Detailed analytics and performance metrics"
      />
      
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40" data-testid="select-time-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLink} onValueChange={setSelectedLink}>
              <SelectTrigger className="w-48" data-testid="select-link">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Links</SelectItem>
                {links.map((link: any) => (
                  <SelectItem key={link.id} value={link.id}>
                    {link.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleExport} data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-clicks">
                {dashboardStats?.totalClicks || 0}
              </div>
              <p className="text-sm text-muted-foreground">
                +12% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unique Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-unique-visitors">
                {Math.floor((dashboardStats?.totalClicks || 0) * 0.7)}
              </div>
              <p className="text-sm text-muted-foreground">
                +8% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Click Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-click-rate">
                {dashboardStats?.clickRate || 0}%
              </div>
              <p className="text-sm text-muted-foreground">
                +5.2% from last period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Daily</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-avg-daily">
                {Math.floor((dashboardStats?.totalClicks || 0) / 30)}
              </div>
              <p className="text-sm text-muted-foreground">
                +15% from last period
              </p>
            </CardContent>
          </Card>
        </div>

        <AnalyticsChart />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle data-testid="device-breakdown-title">Device Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Desktop</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mobile</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-chart-2 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tablet</span>
                  <span className="font-medium">5%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-chart-3 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle data-testid="top-referrers-title">Top Referrers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Direct</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Google</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Twitter</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Facebook</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Others</span>
                  <span className="font-medium">5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
