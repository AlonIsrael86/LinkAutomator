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
      customSlug: "", // Leave empty for auto-generated short codes
      domain: typeof window !== 'undefined' ? window.location.hostname : '',
      isActive: true,
      enableWebhook: false,
      enableConditionals: false,
      webhookUrl: "",
      conditionalRules: null
    }
  });

  const createLinkMutation = useMutation({
    mutationFn: async (data: InsertLink) => {
      console.log("Quick create form data:", data);
      
      // Clean the data to be compatible with old backend validation
      const cleanData = {
        targetUrl: data.targetUrl,
        title: data.title,
        customSlug: data.customSlug || undefined, // Remove empty string
        domain: data.domain,
        isActive: data.isActive
        // Remove fields that might cause validation issues
      };
      
      // Remove undefined fields
      Object.entries(cleanData).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          delete (cleanData as any)[key];
        }
      });
      
      const apiUrl = '/api/links';
      
      console.log("Making request to:", apiUrl);
      console.log("Current hostname:", window.location.hostname);
      console.log("Cleaned request data:", JSON.stringify(cleanData, null, 2));
      
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify(cleanData)
      });

      console.log("Quick create response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.text();
        console.log("Quick create error response:", errorData);
        
        let userFriendlyMessage = "נכשל ביצירת הקישור"; // Default: Failed to create link
        
        try {
          const parsed = JSON.parse(errorData);
          const backendMessage = parsed.message || "Unknown error";
          
          // Handle specific error cases with Hebrew translations
          if (backendMessage === "Custom slug is already taken") {
            userFriendlyMessage = "הקישור המקוצר כבר קיים. אנא בחר שם אחר"; // Custom slug already exists. Please choose another name
          } else if (backendMessage.includes("validation") || backendMessage.includes("Invalid")) {
            userFriendlyMessage = "הנתונים שהוזנו אינם תקינים. אנא בדוק שהקישור תקין"; // Invalid data entered. Please check that the link is valid
          } else {
            // Use the backend message as-is for other errors
            userFriendlyMessage = backendMessage;
          }
          
          console.log("Parsed error details:", parsed);
          console.log("User-friendly message:", userFriendlyMessage);
        } catch {
          console.log("Raw error text:", errorData);
        }
        
        throw new Error(userFriendlyMessage);
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "הצלחה",
        description: "הקישור נוצר בהצלחה"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/dashboard"] });
      form.reset();
    },
    onError: (error: any) => {
      console.error("Quick create error:", error);
      toast({
        title: "שגיאה",
        description: error.message || "נכשל ביצירת הקישור",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertLink) => {
    // Add debugging
    console.log("=== QUICK CREATE FORM SUBMISSION ===");
    console.log("Form data being sent:", JSON.stringify(data, null, 2));
    console.log("Domain value:", data.domain);
    console.log("=====================================");
    
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
                  <FormLabel>קישור יעד</FormLabel>
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
                    <FormLabel>קישור מקוצר מותאם (אופציונלי)</FormLabel>
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
                    <FormLabel>לקוח</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="שם הלקוח או כותרת הקישור"
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
                        <FormLabel className="text-sm">אפשר Webhook</FormLabel>
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
                        <FormLabel className="text-sm">הפניות מותנות</FormLabel>
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
                {createLinkMutation.isPending ? "יוצר..." : "צור קישור"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
