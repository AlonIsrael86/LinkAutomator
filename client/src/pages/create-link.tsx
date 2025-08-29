import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLinkSchema, type InsertLink } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function CreateLink() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const form = useForm<InsertLink>({
    resolver: zodResolver(insertLinkSchema),
    defaultValues: {
      targetUrl: "",
      title: "",
      customSlug: "",
      domain: "links.yourdomain.com",
      isActive: true,
      enableWebhook: false,
      enableConditionals: false,
      webhookUrl: "",
      conditionalRules: null
    }
  });

  const createLinkMutation = useMutation({
    mutationFn: async (data: InsertLink) => {
      const response = await apiRequest("POST", "/api/links", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Link created successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      setLocation("/my-links");
    },
    onError: (error: any) => {
      console.error("Create link error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create link",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertLink) => {
    console.log("Form submitted with data:", data);
    createLinkMutation.mutate(data);
  };

  return (
    <>
      <TopBar 
        title="Create New Link"
        subtitle="Create a shortened link with custom options"
      />
      
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle data-testid="create-link-title">Link Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="targetUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/very-long-url"
                            data-testid="input-target-url"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Marketing Campaign Q4"
                            data-testid="input-title"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="customSlug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Custom Back-half (Optional)</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 py-2 border border-r-0 border-input bg-muted text-muted-foreground text-sm rounded-l-md">
                              links.yourdomain.com/
                            </span>
                            <Input 
                              placeholder="my-link"
                              className="rounded-l-none"
                              data-testid="input-custom-slug"
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="enableWebhook"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value ?? false}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-enable-webhook"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Enable Webhook</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Send click data to Make.com or other webhook URLs
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("enableWebhook") && (
                      <FormField
                        control={form.control}
                        name="webhookUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Webhook URL</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://hook.make.com/..."
                                data-testid="input-webhook-url"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      control={form.control}
                      name="enableConditionals"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value ?? false}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-enable-conditionals"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Conditional Redirects</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Redirect to different URLs based on device type
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("enableConditionals") && (
                      <div className="space-y-4 pl-6 border-l-2 border-muted">
                        <div>
                          <FormLabel>Mobile URL (Optional)</FormLabel>
                          <Input 
                            placeholder="https://mobile.example.com"
                            className="mt-1"
                            data-testid="input-mobile-url"
                          />
                        </div>
                        <div>
                          <FormLabel>Desktop URL (Optional)</FormLabel>
                          <Input 
                            placeholder="https://desktop.example.com"
                            className="mt-1"
                            data-testid="input-desktop-url"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setLocation("/")}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createLinkMutation.isPending}
                      data-testid="button-create-link"
                    >
                      {createLinkMutation.isPending ? "Creating..." : "Create Link"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
