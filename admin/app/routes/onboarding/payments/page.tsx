import type { Route } from "../+types/page";
import { useState } from "react";
import { Link, useFetcher, Form } from "react-router";
import { ArrowLeft, CreditCard, Map, Truck, Rocket, Check, DollarSign } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingShippingSchema,
  type OnboardingShippingSchema,
} from "~/lib/schemaValidations";
import { onboardingShippingFields } from "~/lib/constants";
import FormBox from "~/components/ui/formBox";
import ActionButton from "~/components/ui/actionButton";
import { PageSection, PageWrapper } from "~/components/ui/pageWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Payments & Shipping — Teem Commerce Onboarding" },
    {
      name: "description",
      content: "Configure merchant settings and logistics.",
    },
  ];
}

const REGIONS = ["North America", "Europe", "Asia Pacific", "Africa", "South America", "Middle East"];

export default function OnboardingPayments() {
  const [activeRegions, setActiveRegions] = useState<string[]>(["North America", "Europe"]);
  const [gateways, setGateways] = useState({ stripe: true, paypal: false });

  const form = useForm<OnboardingShippingSchema>({
    resolver: zodResolver(onboardingShippingSchema),
    defaultValues: {
      shippingStandard: "12.00",
      shippingExpress: "25.00",
      freeShippingThreshold: "150.00",
    },
  });

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const toggleRegion = (region: string) => {
    setActiveRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const onSubmit: SubmitHandler<OnboardingShippingSchema> = async (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/onboarding/payments",
    });
  };

  return (
    <PageWrapper>
      <PageSection index={0}>
        <div className="onboarding-fade-in">
          {/* ─── Header ─── */}
          <div className="mb-8 space-y-2">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-widest text-BrightTealBlue">
              Phase 04 — Logistics
            </p>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Payments & Shipping.
            </h1>
            <p className="text-sm text-muted-foreground max-w-[540px] leading-relaxed">
              Connect your merchant accounts and define your reach. We’ve automated the technical overhead—you just set the rules.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Gateways */}
            <Card className="onboarding-fade-in onboarding-delay-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard size={18} className="text-BrightTealBlue" />
                  Merchant Setup
                </CardTitle>
                <CardDescription>
                  Connect accounts to start processing global transactions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:bg-muted/30",
                  gateways.stripe ? "border-BrightTealBlue bg-BrightTealBlue/5" : "border-border"
                )} onClick={() => setGateways(p => ({...p, stripe: !p.stripe}))}>
                  <div className="w-10 h-10 rounded-lg bg-[#635BFF] flex items-center justify-center text-white font-bold shrink-0">S</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">Stripe</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-widest">Connect Account</p>
                  </div>
                  {gateways.stripe && <div className="w-5 h-5 rounded-full bg-BrightTealBlue flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div>}
                </div>

                <div className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:bg-muted/30",
                  gateways.paypal ? "border-[#003087] bg-[#003087]/5" : "border-border"
                )} onClick={() => setGateways(p => ({...p, paypal: !p.paypal}))}>
                  <div className="w-10 h-10 rounded-lg bg-[#003087] flex items-center justify-center text-white font-bold shrink-0">P</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground">PayPal</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-widest">PayPal & Venmo</p>
                  </div>
                  {gateways.paypal && <div className="w-5 h-5 rounded-full bg-[#003087] flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div>}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Regions */}
            <Card className="onboarding-fade-in onboarding-delay-1 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map size={18} className="text-BrightTealBlue" />
                  Fulfillment Reach
                </CardTitle>
                <CardDescription>
                  Select the regions where you provide delivery services.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="bg-muted/30 rounded-xl p-4 flex flex-wrap gap-2 items-center justify-center min-h-[140px] border border-dashed border-border">
                  {REGIONS.map(region => (
                    <button
                      key={region}
                      onClick={() => toggleRegion(region)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all",
                        activeRegions.includes(region) 
                          ? "bg-foreground text-background border-foreground" 
                          : "bg-background text-muted-foreground border-border hover:border-muted-foreground"
                      )}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 mt-6">
            {/* Shipping Rates Form */}
            <Card className="onboarding-fade-in onboarding-delay-2 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck size={18} className="text-BrightTealBlue" />
                  Logistics & Rates
                </CardTitle>
                <CardDescription>
                  Define your shipping fee structure across all active regions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormBox
                    form={form}
                    data={onboardingShippingFields}
                    classname="w-full"
                    icon={true}
                    inputIcon={<DollarSign size={14} className="text-muted-foreground" />}
                    inputIconPosition="inline-start"
                  />
                </Form>
              </CardContent>
            </Card>

            {/* Final CTA Card */}
            <div className="onboarding-fade-in onboarding-delay-3 flex flex-col items-center justify-center p-8 rounded-2xl bg-foreground text-background text-center gap-5 shadow-xl relative overflow-hidden group">
               {/* Decorative Background Icon */}
               <Rocket className="absolute -bottom-8 -right-8 w-40 h-40 text-background/10 -rotate-12 transition-transform group-hover:scale-110" />
               
               <div className="w-16 h-16 rounded-full bg-BrightTealBlue flex items-center justify-center shadow-lg relative z-10 transition-transform hover:scale-110">
                 <Rocket className="text-white" size={28} />
               </div>
               <div className="space-y-2 relative z-10">
                 <h3 className="text-xl font-bold tracking-tight">Ready to Launch?</h3>
                 <p className="text-xs text-background/70 leading-relaxed font-medium">Your store identity, palette, and catalog are live. Click below to deploy your instance.</p>
               </div>
               <Button className="w-full bg-BrightTealBlue hover:bg-BrightTealBlue/90 text-white font-bold uppercase py-6 text-xs tracking-[0.15em] relative z-10">
                 Finalize Setup
               </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-8 mt-4 border-t border-border">
            <Link to="/onboarding/inventory" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors no-underline">
              <ArrowLeft size={16} />
              Back
            </Link>
            <div />
          </div>
        </div>
      </PageSection>
    </PageWrapper>
  );
}
