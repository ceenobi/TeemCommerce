import { Link } from "react-router";
import { ArrowLeft, ArrowRight, Upload, Layers, ShoppingBag, Plus, FileSpreadsheet } from "lucide-react";
import { PageSection, PageWrapper } from "~/components/ui/pageWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import type { Route } from "../+types/page";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Inventory Import — Teem Commerce Onboarding" },
    {
      name: "description",
      content: "Populate your store catalog with inventory import.",
    },
  ];
}

export default function OnboardingInventory() {
  return (
    <PageWrapper>
      <PageSection index={0}>
        <div className="onboarding-fade-in">
          {/* ─── Header ─── */}
          <div className="mb-8 space-y-2">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-widest text-BrightTealBlue">
              Phase 03 — Catalog
            </p>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Inventory Import.
            </h1>
            <p className="text-sm text-muted-foreground max-w-[540px] leading-relaxed">
              Populate your store catalog in seconds. Connect your existing platforms or upload a bulk file to get started.
            </p>
          </div>

          <div className="space-y-6">
            {/* CSV Import Section */}
            <Card className="onboarding-fade-in onboarding-delay-1 overflow-hidden">
              <div className="bg-BrightTealBlue/5 px-6 py-2 border-b border-BrightTealBlue/10 flex items-center justify-between">
                <span className="text-[10px] font-bold text-BrightTealBlue uppercase tracking-widest">Recommended Path</span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase"><FileSpreadsheet size={10} /> Validated Template</span>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Upload size={18} className="text-BrightTealBlue" />
                  Import from CSV
                </CardTitle>
                <CardDescription>
                  Bulk upload your products using our standard spreadsheet template for rapid deployment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="onboarding-upload-zone flex flex-col items-center justify-center p-12 rounded-xl bg-muted/20 border-border hover:bg-muted/40 transition-all cursor-pointer group">
                  <div className="w-14 h-14 rounded-full bg-background border shadow-sm flex items-center justify-center text-muted-foreground group-hover:text-BrightTealBlue group-hover:scale-110 transition-all mb-4">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Drag and drop your catalog file</p>
                  <p className="text-xs text-muted-foreground mt-1">or click to browse your computer (xlsx, csv)</p>
                </div>
                <div className="flex justify-center">
                  <Button variant="link" size="sm" className="text-xs text-BrightTealBlue">Download CSV Template</Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Shopify Sync */}
               <Card className="onboarding-fade-in onboarding-delay-2 flex flex-row items-center p-4 gap-4 hover:border-BrightTealBlue/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-[#95BF47] flex items-center justify-center text-white shrink-0">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">Shopify Sync</p>
                    <p className="text-xs text-muted-foreground truncate">Pull collections & orders</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold tracking-widest px-4 border-2">Connect</Button>
               </Card>

               {/* Etsy Sync */}
               <Card className="onboarding-fade-in onboarding-delay-2 flex flex-row items-center p-4 gap-4 hover:border-BrightTealBlue/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-[#F1641E] flex items-center justify-center text-white shrink-0">
                    <Layers size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">Etsy Import</p>
                    <p className="text-xs text-muted-foreground truncate">Sync listings & media</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-[10px] uppercase font-bold tracking-widest px-4 border-2">Link</Button>
               </Card>
            </div>

            {/* Manual Entry Footer */}
            <Card className="onboarding-fade-in onboarding-delay-3 bg-muted/10 border-dashed">
               <CardContent className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-background border flex items-center justify-center text-muted-foreground shrink-0">
                      <Plus size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground text-center sm:text-left">Add products manually</p>
                      <p className="text-xs text-muted-foreground text-center sm:text-left">Best for small collections or personalized items</p>
                    </div>
                  </div>
                  <Button variant="secondary" className="font-semibold text-xs uppercase px-6">New Entry</Button>
               </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex items-center justify-between pt-8">
              <Link to="/onboarding/branding" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors no-underline">
                <ArrowLeft size={16} />
                Back
              </Link>
              <Link to="/onboarding/payments">
                <Button className="bg-BrightTealBlue hover:bg-BrightTealBlue/90 uppercase font-medium text-white px-10 h-12">
                  Continue <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageSection>
    </PageWrapper>
  );
}
