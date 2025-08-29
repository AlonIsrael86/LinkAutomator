import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import QRCode from "@/components/shared/qr-code";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Copy, BarChart3, Edit } from "lucide-react";
import { useLocation } from "wouter";

export default function TopLinksTable() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: topLinks = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/links/top"]
  });

  const copyToClipboard = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(`https://${shortUrl}`);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card data-testid="top-links-loading">
        <CardHeader>
          <CardTitle>Top Performing Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="top-links-table">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Top Performing Links</CardTitle>
          <Button 
            variant="ghost" 
            className="text-sm text-primary hover:text-primary/80 font-medium"
            onClick={() => setLocation("/my-links")}
            data-testid="button-view-all-links"
          >
            View All Links
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {topLinks.length === 0 ? (
          <div className="text-center py-8" data-testid="empty-top-links">
            <p className="text-muted-foreground">No links created yet</p>
            <p className="text-sm text-muted-foreground mt-1">Create your first link to see it here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="top-links-table-content">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Link</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Clicks</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">QR</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {topLinks.map((link: any) => (
                  <tr key={link.id} className="border-b border-border hover:bg-accent/50" data-testid={`top-link-row-${link.id}`}>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm" data-testid={`top-link-short-url-${link.id}`}>
                          {link.domain}/{link.shortCode}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-xs" data-testid={`top-link-target-url-${link.id}`}>
                          {link.targetUrl}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm" data-testid={`top-link-title-${link.id}`}>{link.title}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold" data-testid={`top-link-clicks-${link.id}`}>
                        {link.clickCount || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={link.isActive ? "default" : "secondary"} data-testid={`top-link-status-${link.id}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${link.isActive ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                        {link.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <QRCode value={`https://${link.domain}/${link.shortCode}`} size={60} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${link.domain}/${link.shortCode}`)}
                          title="Copy Link"
                          data-testid={`button-copy-top-link-${link.id}`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setLocation("/analytics")}
                          title="View Analytics"
                          data-testid={`button-analytics-top-link-${link.id}`}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit Link"
                          data-testid={`button-edit-top-link-${link.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
