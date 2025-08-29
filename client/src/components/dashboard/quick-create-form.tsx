import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLinkSchema, type InsertLink } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

export default function QuickCreateForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertLink>({
    resolver: zodResolver(insertLinkSchema),
    defaultValues: {
      targetUrl: "",
      title: "",
      customSlug: "",
      domain: window.location.hostname,
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
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/dashboard"] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create link",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertLink) => {
    createLinkMutation.mutate(data);
  };

  return (
    <Card data-testid="quick-create-form">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quick Link Creation</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-advanced-settings">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Back-half (Optional)</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 py-2 border border-r-0 border-input bg-muted text-muted-foreground text-sm rounded-l-md">
                          {window.location.hostname}/
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
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-4">
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
                        <FormLabel className="text-sm">Enable Webhook</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
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
                        <FormLabel className="text-sm">Conditional Redirects</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
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
  );
}
