import TopBar from "@/components/layout/topbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCustomDomainSchema, type InsertCustomDomain, type CustomDomain } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Plus, Trash2, AlertCircle, CheckCircle, Globe } from "lucide-react";

export default function CustomDomain() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: domains = [], isLoading } = useQuery<CustomDomain[]>({
    queryKey: ["/api/domains"]
  });

  const form = useForm<InsertCustomDomain>({
    resolver: zodResolver(insertCustomDomainSchema),
    defaultValues: {
      domain: "",
      isVerified: false,
      verificationMethod: "CNAME",
      verificationRecord: ""
    }
  });

  const createDomainMutation = useMutation({
    mutationFn: async (data: InsertCustomDomain) => {
      const response = await apiRequest("POST", "/api/domains", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Domain added successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add domain",
        variant: "destructive"
      });
    }
  });

  const deleteDomainMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/domains/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success", 
        description: "Domain removed successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove domain",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: InsertCustomDomain) => {
    // Generate verification record based on method
    const verificationRecord = data.verificationMethod === "CNAME" 
      ? "links.yourdomain.com" 
      : `linkautomator-verification=${Math.random().toString(36).substring(7)}`;
    
    createDomainMutation.mutate({
      ...data,
      verificationRecord
    });
  };

  if (isLoading) {
    return (
      <>
        <TopBar title="Custom Domain" subtitle="Configure your custom domain" />
        <div className="p-6">
          <div className="text-center">Loading domains...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Custom Domain" subtitle="Configure your custom domain" />
      
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold" data-testid="custom-domain-title">Custom Domains</h2>
            <p className="text-sm text-muted-foreground">
              Use your own domain for shortened links
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-domain">
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Domain</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="links.yourdomain.com"
                            data-testid="input-domain"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="verificationMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Verification Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value ?? "CNAME"}>
                          <FormControl>
                            <SelectTrigger data-testid="select-verification-method">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CNAME">CNAME Record</SelectItem>
                            <SelectItem value="TXT">TXT Record</SelectItem>
                          </SelectContent>
                        </Select>
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
                      disabled={createDomainMutation.isPending}
                      data-testid="button-add-domain-submit"
                    >
                      {createDomainMutation.isPending ? "Adding..." : "Add Domain"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {domains.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center" data-testid="empty-state">
                <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No custom domains configured.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Add a custom domain to use your own branding for shortened links.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {domains.map((domain) => (
              <Card key={domain.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <CardTitle className="text-lg" data-testid={`text-domain-${domain.id}`}>
                          {domain.domain}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={domain.isVerified ? "default" : "destructive"}
                            data-testid={`badge-verification-${domain.id}`}
                          >
                            {domain.isVerified ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Pending Verification
                              </>
                            )}
                          </Badge>
                          <Badge variant="outline" data-testid={`badge-method-${domain.id}`}>
                            {domain.verificationMethod}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteDomainMutation.mutate(domain.id)}
                      disabled={deleteDomainMutation.isPending}
                      data-testid={`button-delete-domain-${domain.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {!domain.isVerified && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="space-y-2">
                          <p>To verify this domain, add the following DNS record:</p>
                          <div className="bg-muted p-3 rounded font-mono text-sm">
                            <div><strong>Type:</strong> {domain.verificationMethod}</div>
                            <div><strong>Name:</strong> {domain.verificationMethod === 'CNAME' ? domain.domain : '@'}</div>
                            <div><strong>Value:</strong> {domain.verificationRecord}</div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            DNS changes may take up to 24 hours to propagate.
                          </p>
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Added on {domain.createdAt ? new Date(domain.createdAt).toLocaleDateString() : 'Unknown'}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle data-testid="setup-instructions-title">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">1. Add Domain</h4>
              <p className="text-sm text-muted-foreground">
                Click "Add Domain" and enter your domain name (e.g., links.yourdomain.com).
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">2. Configure DNS</h4>
              <p className="text-sm text-muted-foreground">
                Add the required DNS record to your domain's DNS settings.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium">3. Verification</h4>
              <p className="text-sm text-muted-foreground">
                Once DNS propagates, your domain will be automatically verified and ready to use.
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> DNS changes can take up to 24-48 hours to fully propagate worldwide.
                Your domain will be verified automatically once the DNS record is detected.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
