import type { Route } from "./+types/page";
import { ArrowRight, Store, Globe } from "lucide-react";
import { useFetcher, Form } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingStoreSchema,
  type OnboardingStoreSchema,
} from "~/lib/schemaValidations";
import { onboardingStoreFields } from "~/lib/constants";
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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Store Setup — Teem Commerce Onboarding" },
    {
      name: "description",
      content: "Set up your store identity on Teem Commerce.",
    },
  ];
}

export default function OnboardingStoreSetup() {
  const form = useForm<OnboardingStoreSchema>({
    resolver: zodResolver(onboardingStoreSchema),
    defaultValues: {
      storeName: "",
      industry: "",
      storeUrl: "",
    },
  });

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  // Auto-generate slug from store name
  const watchedName = form.watch("storeName");
  const generatedSlug = watchedName
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const onSubmit: SubmitHandler<OnboardingStoreSchema> = async (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/onboarding",
    });
  };

  const showIcon = (name: string) => {
    switch (name) {
      case "storeName":
        return <Store size={18} />;
      case "storeUrl":
        return <Globe size={18} />;
      default:
        return null;
    }
  };

  return (
    <PageWrapper>
      <PageSection index={0}>
        <div className="onboarding-fade-in">
          {/* ─── Header ─── */}
          <div className="mb-8 space-y-2">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-widest text-BrightTealBlue">
              Phase 01 — Identity
            </p>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              The First Brick.
            </h1>
            <p className="text-sm text-muted-foreground max-w-[540px] leading-relaxed">
              Every global empire starts with a single identity. Define your
              commerce presence and establish your storefront on the network.
            </p>
          </div>

          {/* ─── Store Details Card ─── */}
          <Card className="onboarding-fade-in onboarding-delay-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe size={16} className="text-BrightTealBlue" />
                Store Identity
              </CardTitle>
              <CardDescription>
                Your unique handle and presence on the Teem Commerce network.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormBox
                  form={form}
                  data={onboardingStoreFields}
                  classname="w-full"
                  icon={true}
                  inputIconPosition={onboardingStoreFields.map((field) => {
                    if (field.name === "storeName" || field.name === "storeUrl")
                      return "inline-start";
                    return "inline-start";
                  })}
                  inputIcon={onboardingStoreFields.map((field) => {
                    const icon = showIcon(field.name);
                    if (!icon) return null;
                    return (
                      <div className="text-muted-foreground cursor-pointer">
                        {icon}
                      </div>
                    );
                  })}
                />

                {/* URL Preview */}
                {generatedSlug && (
                  <div className="text-xs text-muted-foreground px-1">
                    Your store will be available at:{" "}
                    <span className="font-semibold text-BrightTealBlue">
                      teem.commerce/{generatedSlug}
                    </span>
                  </div>
                )}

                {/* ─── Actions ─── */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div />
                  <ActionButton
                    text={
                      <>
                        Establish Infrastructure <ArrowRight />
                      </>
                    }
                    type="submit"
                    loading={isSubmitting}
                    size="lg"
                    classname="font-medium uppercase bg-BrightTealBlue py-[22px] hover:bg-BrightTealBlue/90 dark:bg-BrightTealBlue dark:text-white"
                  />
                </div>
              </Form>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageWrapper>
  );
}
