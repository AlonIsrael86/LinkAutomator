import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Removed React Hook Form imports - using simple HTML forms
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Removed unused imports
// Simplified without complex form validation
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type CustomDomain } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function CreateLink() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [currentDomain, setCurrentDomain] = useState("yourdomain.com");

  // Fetch available domains
  const { data: customDomains = [] } = useQuery<CustomDomain[]>({
    queryKey: ["/api/domains"]
  });
  
  const availableDomains = [
    { domain: window.location.hostname, isDefault: true },
    ...customDomains.map(d => ({ domain: d.domain, isDefault: false }))
  ];

  // Get current domain on client side
  useEffect(() => {
    setCurrentDomain(window.location.hostname);
  }, []);

  const [formData, setFormData] = useState({
    targetUrl: "",
    title: "",
    customSlug: "",
    domain: currentDomain,
    isActive: true,
    enableWebhook: false,
    enableConditionals: false,
    webhookUrl: "",
    conditionalRules: null
  });

  // Update form data when domain changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, domain: currentDomain }));
  }, [currentDomain]);

  // Simple direct form submission without complex validation
  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.targetUrl || !formData.title) {
      toast({
        title: "Error",
        description: "Please fill in Target URL and Link Title",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/links", formData);
      const newLink = await response.json();
      
      toast({
        title: "Success",
        description: `Link created! Short code: ${newLink.shortCode}`,
      });
      
      setLocation("/my-links");
    } catch (error: any) {
      console.error("Create link error:", error);
      toast({
        title: "Error", 
        description: error.message || "Failed to create link",
        variant: "destructive"
      });
    }
  };

  // Removed unused React Hook Form code

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
              <form onSubmit={handleDirectSubmit} className="space-y-6">
                <div>
                  <label htmlFor="targetUrl" className="text-sm font-medium">Target URL</label>
                  <Input 
                    id="targetUrl"
                    placeholder="https://example.com/very-long-url"
                    value={formData.targetUrl}
                    onChange={(e) => {
                      console.log("Target URL changed:", e.target.value);
                      setFormData({...formData, targetUrl: e.target.value});
                    }}
                    className="mt-1"
                    data-testid="input-target-url"
                  />
                </div>

                <div>
                  <label htmlFor="title" className="text-sm font-medium">Link Title</label>
                  <Input 
                    id="title"
                    placeholder="Marketing Campaign Q4"
                    value={formData.title}
                    onChange={(e) => {
                      console.log("Title changed:", e.target.value);
                      setFormData({...formData, title: e.target.value});
                    }}
                    className="mt-1"
                    data-testid="input-title"
                  />
                </div>

                <div>
                  <label htmlFor="domain" className="text-sm font-medium">דומיין</label>
                  <Select value={formData.domain} onValueChange={(value) => setFormData({...formData, domain: value})}>
                    <SelectTrigger className="mt-1" data-testid="select-domain">
                      <SelectValue placeholder="בחר דומיין" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDomains.map((domainOption, index) => (
                        <SelectItem key={index} value={domainOption.domain}>
                          {domainOption.domain} {domainOption.isDefault && "(ברירת מחדל)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="customSlug" className="text-sm font-medium">Custom Back-half (Optional)</label>
                  <div className="flex mt-1">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-input bg-muted text-muted-foreground text-sm rounded-l-md">
{formData.domain}/
                    </span>
                    <Input 
                      id="customSlug"
                      placeholder="my-link"
                      className="rounded-l-none"
                      value={formData.customSlug}
                      onChange={(e) => setFormData({...formData, customSlug: e.target.value})}
                      data-testid="input-custom-slug"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="enableWebhook"
                      checked={formData.enableWebhook}
                      onCheckedChange={(checked) => setFormData({...formData, enableWebhook: !!checked})}
                      data-testid="checkbox-enable-webhook"
                    />
                    <div>
                      <label htmlFor="enableWebhook" className="text-sm font-medium">Enable Webhook</label>
                      <p className="text-sm text-muted-foreground">
                        Send click data to Make.com or other webhook URLs
                      </p>
                    </div>
                  </div>

                  {formData.enableWebhook && (
                    <div>
                      <label htmlFor="webhookUrl" className="text-sm font-medium">Webhook URL</label>
                      <Input 
                        id="webhookUrl"
                        placeholder="https://hook.make.com/..."
                        value={formData.webhookUrl || ""}
                        onChange={(e) => setFormData({...formData, webhookUrl: e.target.value})}
                        className="mt-1"
                        data-testid="input-webhook-url"
                      />
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="enableConditionals"
                      checked={formData.enableConditionals}
                      onCheckedChange={(checked) => setFormData({...formData, enableConditionals: !!checked})}
                      data-testid="checkbox-enable-conditionals"
                    />
                    <div>
                      <label htmlFor="enableConditionals" className="text-sm font-medium">Conditional Redirects</label>
                      <p className="text-sm text-muted-foreground">
                        Redirect to different URLs based on device type
                      </p>
                    </div>
                  </div>

                  {formData.enableConditionals && (
                    <div className="space-y-4 pl-6 border-l-2 border-muted">
                      <div>
                        <label className="text-sm font-medium">Mobile URL (Optional)</label>
                        <Input 
                          placeholder="https://mobile.example.com"
                          className="mt-1"
                          data-testid="input-mobile-url"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Desktop URL (Optional)</label>
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
                    data-testid="button-create-link"
                  >
                    Create Link
                  </Button>
                </div>
                </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
