import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus, Trash2, Copy, Eye, EyeOff, Key } from "lucide-react";
import { type ApiToken } from "@shared/schema";

export default function ApiAccess() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [visibleTokens, setVisibleTokens] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tokens = [], isLoading } = useQuery<ApiToken[]>({
    queryKey: ["/api/tokens"]
  });

  const form = useForm({
    defaultValues: {
      name: ""
    }
  });

  const createTokenMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await apiRequest("POST", "/api/tokens", data);
      return response.json();
    },
    onSuccess: (newToken) => {
      toast({
        title: "Success",
        description: "API token created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tokens"] });
      setIsDialogOpen(false);
      form.reset();
      
      // Show the new token temporarily
      setVisibleTokens(prev => new Set(Array.from(prev).concat([newToken.id])));
      setTimeout(() => {
        setVisibleTokens(prev => {
          const next = new Set(prev);
          next.delete(newToken.id);
          return next;
        });
      }, 30000); // Hide after 30 seconds
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create API token",
        variant: "destructive"
      });
    }
  });

  const deleteTokenMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/tokens/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "API token deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/tokens"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete API token",
        variant: "destructive"
      });
    }
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Token copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy token",
        variant: "destructive"
      });
    }
  };

  const toggleTokenVisibility = (tokenId: string) => {
    setVisibleTokens(prev => {
      const next = new Set(prev);
      if (next.has(tokenId)) {
        next.delete(tokenId);
      } else {
        next.add(tokenId);
      }
      return next;
    });
  };

  const onSubmit = (data: { name: string }) => {
    createTokenMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <>
        <TopBar title="API Access" subtitle="Manage API tokens for programmatic access" />
        <div className="p-6">
          <div className="text-center">Loading API tokens...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="API Access" subtitle="Manage API tokens for programmatic access" />
      
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold" data-testid="api-tokens-title">API Tokens</h2>
            <p className="text-sm text-muted-foreground">
              Create tokens to access the Link Automator API programmatically
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-token">
                <Plus className="h-4 w-4 mr-2" />
                Create Token
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create API Token</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Token Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="My App Integration"
                            data-testid="input-token-name"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createTokenMutation.isPending}
                      data-testid="button-create-token-submit"
                    >
                      {createTokenMutation.isPending ? "Creating..." : "Create Token"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {tokens.length === 0 ? (
              <div className="text-center py-12" data-testid="empty-state">
                <Key className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No API tokens created.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create your first API token to start using the REST API.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="tokens-table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Token</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Last Used</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Created</th>
                      <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map((token) => {
                      const isVisible = visibleTokens.has(token.id);
                      const displayToken = isVisible ? token.token : `${token.token.substring(0, 8)}${'*'.repeat(32)}`;
                      
                      return (
                        <tr key={token.id} className="border-b border-border hover:bg-accent/50" data-testid={`row-token-${token.id}`}>
                          <td className="py-4 px-6">
                            <span className="font-medium" data-testid={`text-token-name-${token.id}`}>
                              {token.name}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm" data-testid={`text-token-value-${token.id}`}>
                                {displayToken}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTokenVisibility(token.id)}
                                data-testid={`button-toggle-visibility-${token.id}`}
                              >
                                {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <Badge variant={token.isActive ? "default" : "secondary"} data-testid={`badge-token-status-${token.id}`}>
                              {token.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-muted-foreground" data-testid={`text-token-last-used-${token.id}`}>
                              {token.lastUsed ? new Date(token.lastUsed).toLocaleDateString() : "Never"}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-sm text-muted-foreground" data-testid={`text-token-created-${token.id}`}>
                              {token.createdAt ? new Date(token.createdAt).toLocaleDateString() : 'Unknown'}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(token.token)}
                                title="Copy Token"
                                data-testid={`button-copy-${token.id}`}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTokenMutation.mutate(token.id)}
                                disabled={deleteTokenMutation.isPending}
                                title="Delete Token"
                                data-testid={`button-delete-${token.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle data-testid="api-documentation-title">API Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Authentication</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Include your API token in the Authorization header:
              </p>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`Authorization: Bearer YOUR_API_TOKEN`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium">Base URL</h4>
              <pre className="bg-muted p-4 rounded-lg text-sm">
{`${window.location.origin}/api`}
              </pre>
            </div>

            <div>
              <h4 className="font-medium">Available Endpoints</h4>
              <div className="space-y-2 text-sm">
                <div className="flex gap-4">
                  <Badge variant="outline">GET</Badge>
                  <code>/api/links</code>
                  <span className="text-muted-foreground">- List all links</span>
                </div>
                <div className="flex gap-4">
                  <Badge variant="outline">POST</Badge>
                  <code>/api/links</code>
                  <span className="text-muted-foreground">- Create new link</span>
                </div>
                <div className="flex gap-4">
                  <Badge variant="outline">GET</Badge>
                  <code>/api/links/:id</code>
                  <span className="text-muted-foreground">- Get link details</span>
                </div>
                <div className="flex gap-4">
                  <Badge variant="outline">PUT</Badge>
                  <code>/api/links/:id</code>
                  <span className="text-muted-foreground">- Update link</span>
                </div>
                <div className="flex gap-4">
                  <Badge variant="outline">DELETE</Badge>
                  <code>/api/links/:id</code>
                  <span className="text-muted-foreground">- Delete link</span>
                </div>
                <div className="flex gap-4">
                  <Badge variant="outline">GET</Badge>
                  <code>/api/analytics</code>
                  <span className="text-muted-foreground">- Get analytics data</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium">Example: Create Link</h4>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`curl -X POST ${window.location.origin}/api/links \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "targetUrl": "https://example.com",
    "title": "My Link",
    "customSlug": "my-link"
  }'`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
