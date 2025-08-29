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
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWebhookSchema, type InsertWebhook, type Webhook } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus, Trash2, Edit, TestTube } from "lucide-react";

export default function Webhooks() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: webhooks = [], isLoading } = useQuery<Webhook[]>({
    queryKey: ["/api/webhooks"]
  });

  const form = useForm<InsertWebhook>({
    resolver: zodResolver(insertWebhookSchema),
    defaultValues: {
      name: "",
      url: "",
      isActive: true,
      events: ["click"]
    }
  });

  const createWebhookMutation = useMutation({
    mutationFn: async (data: InsertWebhook) => {
      const response = await apiRequest("POST", "/api/webhooks", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Webhook created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create webhook",
        variant: "destructive"
      });
    }
  });

  const deleteWebhookMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/webhooks/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Webhook deleted successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/webhooks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete webhook",
        variant: "destructive"
      });
    }
  });

  const testWebhookMutation = useMutation({
    mutationFn: async (webhookUrl: string) => {
      const testPayload = {
        event: 'test',
        link: {
          id: 'test-link-id',
          shortCode: 'test',
          title: 'Test Link',
          targetUrl: 'https://example.com'
        },
        click: {
          ipAddress: '127.0.0.1',
          userAgent: 'Test User Agent',
          referer: 'https://test.com',
          timestamp: new Date().toISOString()
        }
      };
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });
      
      if (!response.ok) {
        throw new Error('Webhook test failed');
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Webhook test sent successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Webhook test failed",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertWebhook) => {
    createWebhookMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <>
        <TopBar title="Webhooks" subtitle="Manage webhook integrations" />
        <div className="p-6">
          <div className="text-center">Loading webhooks...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Webhooks" subtitle="Manage webhook integrations" />
      
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold" data-testid="webhooks-title">Webhook Endpoints</h2>
            <p className="text-sm text-muted-foreground">
              Configure webhooks to receive click data in real-time
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-create-webhook">
                <Plus className="h-4 w-4 mr-2" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Webhook</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Make.com Integration"
                            data-testid="input-webhook-name"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Webhook URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://hook.make.com/..."
                            data-testid="input-webhook-url"
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
                      disabled={createWebhookMutation.isPending}
                      data-testid="button-save-webhook"
                    >
                      {createWebhookMutation.isPending ? "Creating..." : "Create Webhook"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            {webhooks.length === 0 ? (
              <div className="text-center py-12" data-testid="empty-state">
                <p className="text-muted-foreground">No webhooks configured.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add your first webhook to receive click notifications.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="webhooks-table">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">URL</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-4 px-6 font-medium text-muted-foreground">Created</th>
                      <th className="text-right py-4 px-6 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {webhooks.map((webhook) => (
                      <tr key={webhook.id} className="border-b border-border hover:bg-accent/50" data-testid={`row-webhook-${webhook.id}`}>
                        <td className="py-4 px-6">
                          <span className="font-medium" data-testid={`text-webhook-name-${webhook.id}`}>
                            {webhook.name}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-muted-foreground font-mono truncate max-w-xs block" data-testid={`text-webhook-url-${webhook.id}`}>
                            {webhook.url}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={webhook.isActive ? "default" : "secondary"} data-testid={`badge-webhook-status-${webhook.id}`}>
                            {webhook.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm text-muted-foreground" data-testid={`text-webhook-created-${webhook.id}`}>
                            {webhook.createdAt ? new Date(webhook.createdAt).toLocaleDateString() : 'Unknown'}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => testWebhookMutation.mutate(webhook.url)}
                              disabled={testWebhookMutation.isPending}
                              title="Test Webhook"
                              data-testid={`button-test-${webhook.id}`}
                            >
                              <TestTube className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Edit Webhook"
                              data-testid={`button-edit-${webhook.id}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteWebhookMutation.mutate(webhook.id)}
                              disabled={deleteWebhookMutation.isPending}
                              title="Delete Webhook"
                              data-testid={`button-delete-${webhook.id}`}
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

        <Card>
          <CardHeader>
            <CardTitle data-testid="webhook-info-title">Webhook Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Payload Format</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Webhooks receive JSON payloads with the following structure:
              </p>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`{
  "event": "click",
  "link": {
    "id": "link-id",
    "shortCode": "abc123",
    "title": "Link Title",
    "targetUrl": "https://example.com"
  },
  "click": {
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "referer": "https://google.com",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-medium">Supported Events</h4>
              <ul className="text-sm text-muted-foreground list-disc list-inside">
                <li>click - Triggered when a shortened link is clicked</li>
                <li>test - Used for webhook testing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
