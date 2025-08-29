import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, Plus, Webhook } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'click' | 'create' | 'webhook';
  title: string;
  subtitle: string;
  timestamp: string;
  icon: 'click' | 'create' | 'webhook';
}

export default function RecentActivity() {
  const { data: links = [] } = useQuery<any[]>({
    queryKey: ["/api/links"]
  });

  // Generate recent activity from actual data
  const recentActivity: ActivityItem[] = links
    .slice(0, 5)
    .map((link: any, index: number) => ({
      id: link.id,
      type: 'create' as const,
      title: 'New link created',
      subtitle: link.title,
      timestamp: `${index + 1} hour${index === 0 ? '' : 's'} ago`,
      icon: 'create' as const
    }));

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'click':
        return <BarChart3 className="text-primary h-3 w-3" />;
      case 'create':
        return <Plus className="text-green-600 h-3 w-3" />;
      case 'webhook':
        return <Webhook className="text-yellow-600 h-3 w-3" />;
      default:
        return <BarChart3 className="text-primary h-3 w-3" />;
    }
  };

  const getActivityBgColor = (type: string) => {
    switch (type) {
      case 'click':
        return 'bg-primary/10';
      case 'create':
        return 'bg-chart-2/10';
      case 'webhook':
        return 'bg-chart-3/10';
      default:
        return 'bg-primary/10';
    }
  };

  return (
    <Card data-testid="recent-activity">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8" data-testid="empty-activity">
              <p className="text-muted-foreground text-sm">No recent activity</p>
              <p className="text-muted-foreground text-xs mt-1">Create your first link to see activity here</p>
            </div>
          ) : (
            recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3" data-testid={`activity-item-${activity.id}`}>
                <div className={`w-8 h-8 ${getActivityBgColor(activity.type)} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" data-testid={`activity-title-${activity.id}`}>
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate" data-testid={`activity-subtitle-${activity.id}`}>
                    {activity.subtitle}
                  </p>
                  <p className="text-xs text-muted-foreground" data-testid={`activity-timestamp-${activity.id}`}>
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        <Button 
          variant="ghost" 
          className="w-full mt-4 text-sm text-primary hover:text-primary/80 font-medium"
          data-testid="button-view-all-activity"
        >
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
}
