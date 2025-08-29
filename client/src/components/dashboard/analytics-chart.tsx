import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useState } from "react";

export default function AnalyticsChart() {
  const [timeRange, setTimeRange] = useState("7");

  const { data: dashboardStats } = useQuery<any>({
    queryKey: ["/api/analytics/dashboard"]
  });

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/analytics/export');
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
    <Card data-testid="analytics-chart">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Click Analytics</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32" data-testid="select-time-range">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleExportData}
              data-testid="button-export-csv"
            >
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-border mb-4 relative overflow-hidden">
          <div className="absolute top-4 left-4 text-sm text-muted-foreground">Clicks over time</div>
          
          {/* Simple chart visualization */}
          <svg className="absolute bottom-5 left-5 right-5" height="60" viewBox="0 0 100 20">
            <polyline
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              points="0,15 15,10 30,12 45,8 60,11 75,6 90,9 100,4"
            />
            {/* Data points */}
            <circle cx="15" cy="10" r="3" fill="hsl(var(--primary))" stroke="white" strokeWidth="2" />
            <circle cx="30" cy="12" r="3" fill="hsl(var(--primary))" stroke="white" strokeWidth="2" />
            <circle cx="45" cy="8" r="3" fill="hsl(var(--primary))" stroke="white" strokeWidth="2" />
            <circle cx="60" cy="11" r="3" fill="hsl(var(--primary))" stroke="white" strokeWidth="2" />
            <circle cx="75" cy="6" r="3" fill="hsl(var(--primary))" stroke="white" strokeWidth="2" />
            <circle cx="90" cy="9" r="3" fill="hsl(var(--primary))" stroke="white" strokeWidth="2" />
          </svg>
          
          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-muted-foreground">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary" data-testid="stat-today-clicks">
              {Math.floor((dashboardStats?.totalClicks || 0) * 0.1)}
            </p>
            <p className="text-sm text-muted-foreground">Today</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-chart-2" data-testid="stat-week-clicks">
              {Math.floor((dashboardStats?.totalClicks || 0) * 0.7)}
            </p>
            <p className="text-sm text-muted-foreground">This Week</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-chart-3" data-testid="stat-month-clicks">
              {dashboardStats?.totalClicks || 0}
            </p>
            <p className="text-sm text-muted-foreground">This Month</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-chart-4" data-testid="stat-avg-daily">
              {Math.floor((dashboardStats?.totalClicks || 0) / 30)}
            </p>
            <p className="text-sm text-muted-foreground">Daily Avg</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
