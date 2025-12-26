import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { MousePointerClick, Plus, Webhook, ExternalLink, Clock } from "lucide-react";

interface ActivityItem {
  id: string;
  type: 'click' | 'create' | 'webhook';
  title: string;
  subtitle: string;
  timestamp: string;
}

export default function RecentActivity() {
  const { data: links = [] } = useQuery<any[]>({
    queryKey: ["/api/links"]
  });

  const recentActivity: ActivityItem[] = links
    .slice(0, 5)
    .map((link: any, index: number) => ({
      id: link.id,
      type: 'create' as const,
      title: 'לינק חדש נוצר',
      subtitle: link.title || 'ללא כותרת',
      timestamp: `לפני ${index + 1} שעות`
    }));

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'click':
        return <MousePointerClick className="h-4 w-4" />;
      case 'create':
        return <Plus className="h-4 w-4" />;
      case 'webhook':
        return <Webhook className="h-4 w-4" />;
      default:
        return <MousePointerClick className="h-4 w-4" />;
    }
  };

  const getActivityStyle = (type: string) => {
    switch (type) {
      case 'click':
        return { bg: 'bg-[#8BDBAB]/20', color: 'text-[#8BDBAB]', border: 'border-[#8BDBAB]/30' };
      case 'create':
        return { bg: 'bg-blue-500/20', color: 'text-blue-400', border: 'border-blue-500/30' };
      case 'webhook':
        return { bg: 'bg-yellow-500/20', color: 'text-yellow-400', border: 'border-yellow-500/30' };
      default:
        return { bg: 'bg-[#8BDBAB]/20', color: 'text-[#8BDBAB]', border: 'border-[#8BDBAB]/30' };
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 h-full" data-testid="recent-activity">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Clock className="h-5 w-5 text-[#8BDBAB]" />
          פעילות אחרונה
        </h3>
      </div>
      
      <div className="space-y-4">
        {recentActivity.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-activity">
            <div className="w-16 h-16 bg-[#333] rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-gray-400 font-medium">אין פעילות אחרונה</p>
            <p className="text-gray-500 text-sm mt-1">צור את הלינק הראשון שלך</p>
          </div>
        ) : (
          recentActivity.map((activity, index) => {
            const style = getActivityStyle(activity.type);
            return (
              <div
                key={activity.id}
                className={`flex items-center gap-4 p-4 rounded-xl bg-[#0A0A0A]/50 border ${style.border} hover:bg-[#0A0A0A] transition-all duration-300 cursor-pointer group animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`activity-item-${activity.id}`}
              >
                <div className={`w-10 h-10 ${style.bg} rounded-xl flex items-center justify-center ${style.color}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{activity.title}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.subtitle}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  <ExternalLink className="h-4 w-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {recentActivity.length > 0 && (
        <Button 
          variant="ghost" 
          className="w-full mt-6 text-[#8BDBAB] hover:text-[#8BDBAB] hover:bg-[#8BDBAB]/10 font-medium rounded-xl"
          data-testid="button-view-all-activity"
        >
          צפה בכל הפעילות
        </Button>
      )}
    </div>
  );
}
