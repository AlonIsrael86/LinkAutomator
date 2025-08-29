import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Link, BarChart3, TrendingUp, Webhook } from "lucide-react";

export default function StatsCards() {
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/analytics/dashboard"]
  });

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} data-testid={`loading-card-${i}`}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-muted rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card data-testid="stat-card-total-links">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Links</p>
              <p className="text-2xl font-bold" data-testid="stat-value-total-links">{stats?.totalLinks || 0}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Link className="text-primary h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+12%</span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="stat-card-total-clicks">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
              <p className="text-2xl font-bold" data-testid="stat-value-total-clicks">{stats?.totalClicks || 0}</p>
            </div>
            <div className="w-12 h-12 bg-chart-2/10 rounded-full flex items-center justify-center">
              <BarChart3 className="text-green-600 h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+28%</span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="stat-card-click-rate">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Click Rate</p>
              <p className="text-2xl font-bold" data-testid="stat-value-click-rate">{stats?.clickRate || '0'}</p>
            </div>
            <div className="w-12 h-12 bg-chart-3/10 rounded-full flex items-center justify-center">
              <TrendingUp className="text-yellow-600 h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600 font-medium">+5.2%</span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card data-testid="stat-card-active-webhooks">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Webhooks</p>
              <p className="text-2xl font-bold" data-testid="stat-value-active-webhooks">{stats?.activeWebhooks || 0}</p>
            </div>
            <div className="w-12 h-12 bg-chart-5/10 rounded-full flex items-center justify-center">
              <Webhook className="text-purple-600 h-6 w-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="inline-flex items-center">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
              <span className="text-muted-foreground">All operational</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
