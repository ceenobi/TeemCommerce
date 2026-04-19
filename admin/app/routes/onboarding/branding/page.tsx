import type { Route } from "../+types/page";
import { useState, useRef } from "react";
import { Link, useFetcher, Form } from "react-router";
import { ArrowRight, ArrowLeft, Upload, ImageIcon, Palette } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingBrandingSchema,
  type OnboardingBrandingSchema,
} from "~/lib/schemaValidations";
import { onboardingBrandingFields } from "~/lib/constants";
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
import { cn } from "~/lib/utils";


export function meta({}: Route.MetaArgs) {
  return [
    { title: "Branding & Design — Teem Commerce Onboarding" },
    {
      name: "description",
      content: "Customize your brand identity with logo and colors.",
    },
  ];
}

const PRESET_COLORS = [
  "#006b2f",
  "#007cbe",
  "#7c3aed",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#0d9488",
  "#be185d",
  "#1e3a5f",
  "#2d3047",
];

export default function OnboardingBranding() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<OnboardingBrandingSchema>({
    resolver: zodResolver(onboardingBrandingSchema),
    defaultValues: {
      brandPrimary: "#006b2f",
      brandSecondary: "#fdc003",
    },
  });

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const primaryColor = form.watch("brandPrimary");
  const secondaryColor = form.watch("brandSecondary");

  const onSubmit: SubmitHandler<OnboardingBrandingSchema> = async (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/onboarding/branding",
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <PageWrapper>
      <PageSection index={0}>
        <div className="onboarding-fade-in">
          {/* ─── Header ─── */}
          <div className="mb-8 space-y-2">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-widest text-BrightTealBlue">
              Phase 02 — Visual Identity
            </p>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Branding & Design.
            </h1>
            <p className="text-sm text-muted-foreground max-w-[540px] leading-relaxed">
              Craft the visual identity of your storefront. Upload your logo and define the palette that represents your brand.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
            <div className="space-y-6">
              {/* Logo Upload Card */}
              <Card className="onboarding-fade-in onboarding-delay-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon size={16} className="text-BrightTealBlue" />
                    Store Logo
                  </CardTitle>
                  <CardDescription>
                    Upload a high-resolution logo for your storefront.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/svg+xml,image/png,image/jpeg"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <div
                    className="onboarding-upload-zone flex flex-col items-center justify-center p-8 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors bg-muted/20 border-border"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="max-w-[120px] max-h-[120px] object-contain"
                      />
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-BrightTealBlue flex items-center justify-center text-white mb-3">
                          <Upload size={20} />
                        </div>
                        <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground mt-1">SVG, PNG, or JPG (max. 5MB)</p>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Brand Colors Card */}
              <Card className="onboarding-fade-in onboarding-delay-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette size={16} className="text-BrightTealBlue" />
                    Brand Colors
                  </CardTitle>
                  <CardDescription>
                    Select your primary and secondary palette accents.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormBox
                          form={form}
                          data={onboardingBrandingFields.slice(0, 1)}
                          classname="w-full"
                          icon={true}
                          inputIcon={
                            <div 
                              className="w-4 h-4 rounded-full border border-border" 
                              style={{ background: primaryColor }} 
                            />
                          }
                          inputIconPosition="inline-start"
                        />
                        <div>
                          <p className="text-[0.6875rem] font-medium uppercase tracking-widest text-muted-foreground mb-3">Presets</p>
                          <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map((color) => (
                              <button
                                key={color}
                                type="button"
                                className={cn(
                                  "w-8 h-8 rounded-full transition-transform hover:scale-110",
                                  primaryColor === color && "ring-2 ring-offset-2 ring-foreground"
                                )}
                                style={{ background: color }}
                                onClick={() => form.setValue("brandPrimary", color)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <FormBox
                          form={form}
                          data={onboardingBrandingFields.slice(1, 2)}
                          classname="w-full"
                          icon={true}
                          inputIcon={
                            <div 
                              className="w-4 h-4 rounded-full border border-border" 
                              style={{ background: secondaryColor }} 
                            />
                          }
                          inputIconPosition="inline-start"
                        />
                        {/* Native color pickers for custom selection */}
                        <div className="flex gap-4">
                           <div className="flex flex-col gap-1.5 flex-1">
                              <span className="text-[10px] uppercase text-muted-foreground font-bold">Pick Primary</span>
                              <input 
                                type="color" 
                                value={primaryColor} 
                                onChange={(e) => form.setValue("brandPrimary", e.target.value)}
                                className="w-full h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                              />
                           </div>
                           <div className="flex flex-col gap-1.5 flex-1">
                              <span className="text-[10px] uppercase text-muted-foreground font-bold">Pick Secondary</span>
                              <input 
                                type="color" 
                                value={secondaryColor} 
                                onChange={(e) => form.setValue("brandSecondary", e.target.value)}
                                className="w-full h-8 rounded border border-border bg-transparent p-0 cursor-pointer"
                              />
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-border">
                      <Link
                        to="/onboarding"
                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft size={16} />
                        Back
                      </Link>
                      <ActionButton
                        text={<>Save & Continue <ArrowRight /></>}
                        type="submit"
                        loading={isSubmitting}
                        size="lg"
                        classname="bg-BrightTealBlue hover:bg-BrightTealBlue/90 uppercase font-medium text-white px-8"
                      />
                    </div>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview Column */}
            <div className="sticky top-10 flex flex-col gap-4 onboarding-fade-in onboarding-delay-3">
              <p className="text-[0.6875rem] font-bold uppercase tracking-widest text-center text-muted-foreground">
                Live Preview
              </p>
              <div className="w-full aspect-2/3 max-w-[280px] mx-auto rounded-[2rem] border-[6px] border-muted bg-card shadow-2xl overflow-hidden flex flex-col">
                <div className="p-6 flex flex-col items-center gap-3">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden"
                    style={{ background: logoPreview ? 'transparent' : `${primaryColor}15` }}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-2xl font-bold" style={{ color: primaryColor }}>B</span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">Your Boutique</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Est. 2024</p>
                  </div>
                </div>
                <div className="flex-1 p-4 flex flex-col gap-3">
                  <div className="w-full h-24 rounded-lg bg-muted animate-pulse" />
                  <div className="flex justify-between items-center px-1">
                    <div className="h-4 w-1/3 bg-muted rounded" />
                    <div className="h-4 w-1/4 bg-muted rounded" />
                  </div>
                  <div 
                    className="mt-auto p-3 rounded-lg text-center text-[10px] font-bold text-white uppercase tracking-widest"
                    style={{ background: primaryColor }}
                  >
                    Shop Collection
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageSection>
    </PageWrapper>
  );
}
