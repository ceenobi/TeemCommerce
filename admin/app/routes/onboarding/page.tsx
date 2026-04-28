import type { Route } from "./+types/page";
import { ArrowRight, Store, Globe, AlertCircle, RefreshCcw } from "lucide-react";
import { useFetcher, Form, useNavigate } from "react-router";
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
import { updateVendorStore } from "../api/vendor-route";
import { toast } from "sonner";
import { useEffect } from "react";
import { getQueryClientRsc } from "~/lib/getQueryClient";
import { getVendorProfileQuery } from "~/queries/vendor";
import { dehydrate, useSuspenseQuery } from "@tanstack/react-query";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Store Setup — Teem Commerce Onboarding" },
    {
      name: "description",
      content: "Set up your store identity on Teem Commerce.",
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const cookie = request.headers.get("Cookie") || "";
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as Record<string, string>;
    const response = await updateVendorStore({
      validated: onboardingStoreSchema.parse(data),
      cookie,
    });
    return response;
  } catch (error: any) {
    console.error("Onboarding Action Error:", error);
    return {
      status: 500,
      body: {
        message: error?.message || "An unexpected error occurred during setup",
      },
    };
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("Cookie") || "";
  const queryClient = getQueryClientRsc();
  await queryClient.ensureQueryData(
    getVendorProfileQuery({
      cookie,
    }),
  );
  return { dehydratedState: dehydrate(queryClient) };
}

export default function OnboardingStoreSetup() {
  const { data: response } = useSuspenseQuery(getVendorProfileQuery({}));
  console.log({ response });
  const vendor = response.body.data;
  const form = useForm<OnboardingStoreSchema>({
    resolver: zodResolver(onboardingStoreSchema),
    defaultValues: {
      storeName: vendor.storeName || "",
      industry: vendor.industry || "",
      storeUrl: vendor.storeUrl || "",
    },
  });

  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { status, body } = fetcher.data as any;
    if (!body) return;
    if (status !== 200) {
      toast.error(body.message || "Failed to update store details");
      return;
    }
    const message = body.message || "Store details updated successfully";
    toast.success(message);
    navigate("/onboarding/branding");
  }, [fetcher.data, fetcher.state, navigate]);

  // Auto-generate slug from store name
  const watchedName = form.watch("storeName");
  const watchedUrl = form.watch("storeUrl");
  const generatedSlug = watchedName
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Auto-sync storeUrl with generatedSlug until the user manually edits it
  useEffect(() => {
    const isUrlDirty = form.getFieldState("storeUrl").isDirty;
    if (!isUrlDirty && generatedSlug) {
      form.setValue("storeUrl", generatedSlug, { shouldValidate: true });
    }
  }, [generatedSlug, form]);

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
            <p className="text-sm text-muted-foreground max-w-135 leading-relaxed">
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
                {watchedUrl && (
                  <div className="text-xs text-muted-foreground px-1 animate-in fade-in slide-in-from-top-1 duration-300">
                    Your store will be available at:{" "}
                    <span className="font-semibold text-BrightTealBlue">
                      teem.commerce/{watchedUrl}
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
                    classname="font-medium uppercase bg-BrightTealBlue py-5.5 hover:bg-BrightTealBlue/90 dark:bg-BrightTealBlue dark:text-white"
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

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-100 p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6 shadow-sm border border-red-500/20">
        <AlertCircle size={32} />
      </div>
      <h1 className="text-2xl font-bold text-foreground tracking-tight">
        Setup Unavailable
      </h1>
      <p className="text-muted-foreground mt-3 max-w-[320px] text-sm leading-relaxed">
        We hit a snag while preparing your storefront identity. This could be a connection issue or a temporary server hiccup.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-BrightTealBlue text-white font-semibold text-sm transition-all hover:bg-BrightTealBlue/90 active:scale-95 shadow-lg shadow-BrightTealBlue/20"
        >
          <RefreshCcw size={16} />
          Retry Setup
        </button>
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-semibold text-sm transition-all hover:bg-muted/80 active:scale-95 border border-border"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
