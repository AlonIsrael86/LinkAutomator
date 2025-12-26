import { useQuery } from "@tanstack/react-query";
import { Link2, MousePointerClick, TrendingUp, Webhook, ArrowUpRight } from "lucide-react";

export default function StatsCards() {
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/analytics/dashboard"]
  });

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-[#333] rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-[#333] rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "סה״כ לינקים",
      value: stats?.totalLinks || 0,
      icon: Link2,
      gradient: "stat-card-1",
      iconBg: "bg-[#8BDBAB]/20",
      iconColor: "text-[#8BDBAB]",
      trend: "+12%",
      trendLabel: "מהחודש שעבר"
    },
    {
      title: "סה״כ קליקים",
      value: stats?.totalClicks || 0,
      icon: MousePointerClick,
      gradient: "stat-card-2",
      iconBg: "bg-blue-500/20",
      iconColor: "text-blue-400",
      trend: "+28%",
      trendLabel: "מהחודש שעבר"
    },
    {
      title: "יחס קליקים",
      value: stats?.clickRate || '0',
      icon: TrendingUp,
      gradient: "stat-card-3",
      iconBg: "bg-yellow-500/20",
      iconColor: "text-yellow-400",
      trend: "+5.2%",
      trendLabel: "מהחודש שעבר"
    },
    {
      title: "Webhooks פעילים",
      value: stats?.activeWebhooks || 0,
      icon: Webhook,
      gradient: "stat-card-4",
      iconBg: "bg-purple-500/20",
      iconColor: "text-purple-400",
      trend: null,
      trendLabel: "פעילים"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`${card.gradient} rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer animate-fade-in-up animate-delay-${index + 1}`}
            data-testid={`stat-card-${index}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 ${card.iconBg} rounded-xl flex items-center justify-center`}>
                <Icon className={`h-7 w-7 ${card.iconColor}`} />
              </div>
              {card.trend && (
                <div className="flex items-center gap-1 text-[#8BDBAB] text-sm font-medium bg-[#8BDBAB]/10 px-2 py-1 rounded-lg">
                  <ArrowUpRight className="h-3 w-3" />
                  {card.trend}
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-gray-400 text-sm font-medium">{card.title}</p>
              <p className="text-4xl font-bold text-white animate-count">{card.value}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="text-xs text-gray-500">
                {card.trend ? (
                  <span className="text-[#8BDBAB]">{card.trend}</span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#8BDBAB] rounded-full pulse-glow"></span>
                  </span>
                )}
                <span className="mr-1">{card.trendLabel}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
