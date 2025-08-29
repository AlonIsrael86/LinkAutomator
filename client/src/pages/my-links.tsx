import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import QRCode from "@/components/shared/qr-code";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type Link } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Copy, BarChart3, Edit, Trash2, Search } from "lucide-react";

export default function MyLinks() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: links = [], isLoading } = useQuery<Link[]>({
    queryKey: ["/api/links"]
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/links/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Link deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to delete link",
        variant: "destructive"
      });
    }
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

  const filteredLinks = links.filter(link => 
    link.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <>
        <TopBar 
          title="My Links"
          subtitle="Manage all your shortened links"
          buttonText="Create New Link"
          buttonAction="/create-link"
        />
        <div className="p-6">
          <div className="text-center">Loading links...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar 
        title="My Links"
        subtitle="Manage all your shortened links"
        buttonText="Create New Link"
        buttonAction="/create-link"
      />
      
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle data-testid="my-links-title">All Links ({filteredLinks.length})</CardTitle>
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search links..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-links"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredLinks.length === 0 ? (
              <div className="text-center py-12" data-testid="empty-state">
                <p className="text-muted-foreground">No links found.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchTerm ? "Try adjusting your search." : "Create your first link to get started."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="links-table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Link</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">Created</th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">QR</th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLinks.map((link) => (
                      <tr key={link.id} className="border-b border-border hover:bg-accent/50" data-testid={`row-link-${link.id}`}>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm" data-testid={`text-short-url-${link.id}`}>
                              {link.domain}/{link.shortCode}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-xs" data-testid={`text-target-url-${link.id}`}>
                              {link.targetUrl}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm" data-testid={`text-title-${link.id}`}>{link.title}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={link.isActive ? "default" : "secondary"} data-testid={`badge-status-${link.id}`}>
                            {link.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-muted-foreground" data-testid={`text-created-${link.id}`}>
                            {link.createdAt ? new Date(link.createdAt).toLocaleDateString() : 'Unknown'}
                          </span>
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
                              data-testid={`button-copy-${link.id}`}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="View Analytics"
                              data-testid={`button-analytics-${link.id}`}
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Edit Link"
                              data-testid={`button-edit-${link.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteLinkMutation.mutate(link.id)}
                              disabled={deleteLinkMutation.isPending}
                              title="Delete Link"
                              data-testid={`button-delete-${link.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
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
      </div>
    </>
  );
}
