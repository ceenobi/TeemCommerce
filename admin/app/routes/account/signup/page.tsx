import type { Route } from "./+types/page";
import {
  ClockFading,
  Shield,
  Mail,
  LockOpen,
  ArrowRight,
  User,
} from "lucide-react";
import { useState } from "react";
import { formFields } from "~/lib/constants";
import { useFetcher, Link, redirect } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignupFormSchema } from "~/lib/schemaValidations";
import FormBox from "~/components/ui/formBox";
import ActionButton from "~/components/ui/actionButton";
import { PageSection, PageWrapper } from "~/components/ui/pageWrapper";
import { signUpWithEmail } from "~/routes/api/auth-route";
import { toast } from "sonner";
import { useEffect } from "react";
import { GoogleIcon } from "~/components/icons/googleIcon";
import { Button } from "~/components/ui/button";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teem Commerce - Account Signup" },
    { name: "description", content: `Teem Commerce - Account Signup` },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData) as Record<string, string>;
    const response = await signUpWithEmail({
      validated: signUpSchema.parse(data),
    });
    if (response.status === 201) {
      return redirect(`/account/verify-email?query=${data.email}`);
    }
    return response;
  } catch (error: any) {
    console.error(error);
    return {
      status: 500,
      body: {
        success: false,
        message: error.message || "An unexpected error occurred",
      },
    };
  }
}

export default function Signup() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible?.((prev) => !prev);
  const filterFields = formFields.filter((field) =>
    ["name", "email", "password"].includes(field.name),
  );
  const form = useForm<SignupFormSchema>({
    resolver: zodResolver(signUpSchema),
  });
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      const { status, body } = fetcher.data as any;

      if (status !== 201 && body) {
        toast.error(body.message || "Something went wrong during signup");

        if (body.details && Array.isArray(body.details)) {
          body.details.forEach((err: any) => {
            if (err.path) {
              form.setError(err.path[0] as keyof SignupFormSchema, {
                type: "manual",
                message: err.message,
              });
            }
          });
        }
      }
    }
  }, [fetcher.data, fetcher.state, form]);

  const isSubmitting = fetcher.state === "submitting";

  const showIcon = (name: string) => {
    switch (name) {
      case "name":
        return <User size={18} />;
      case "email":
        return <Mail size={18} />;
      case "password":
        return <LockOpen size={18} onClick={toggleVisibility} />;
    }
  };

  const onSubmit: SubmitHandler<SignupFormSchema> = async (
    data: SignupFormSchema,
  ) => {
    fetcher.submit(data, {
      method: "post",
      action: `/account/signup`,
    });
  };

  const info = [
    {
      icon: <Shield />,
      label: "Secure access",
    },
    {
      icon: <ClockFading />,
      label: "Fast setup",
    },
  ];

  return (
    <PageWrapper>
      <div className="grid grid-cols-12 gap-4 min-h-screen">
        <div className="col-span-12 lg:col-span-6 xl:col-span-8 h-fit lg:sticky lg:top-0 lg:h-screen hidden lg:flex">
          <div className="min-h-screen w-full bg-WhiteNeutral dark:bg-DarkNight relative flex justify-center items-center overflow-hidden">
            {/* Nexus Kinetic Dotted Pattern */}
            <div
              className="absolute inset-0 z-0 opacity-[0.15] dark:opacity-10"
              style={{
                backgroundImage: `
                            radial-gradient(circle at 2px 2px, var(--color-BrightTealBlue) 1px, transparent 0),
                            radial-gradient(circle at 2px 2px, var(--color-AmberFlame) 1px, transparent 0)
                          `,
                backgroundSize: "40px 40px, 30px 30px",
                backgroundPosition: "0 0, 15px 15px",
              }}
            />

            {/* Decorative Orbs */}
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-BrightTealBlue/10 dark:bg-BrightTealBlue/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-AmberFlame/10 dark:bg-AmberFlame/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Your Content/Components */}
            <PageSection index={0}>
              <div className="max-w-xl mx-auto w-full px-8 self-center relative z-10 text-CharcoalBlack dark:text-WhiteNeutral">
                <h1 className="text-4xl leading-tight font-bold text-center tracking-tight">
                  You’re 2 clicks away from <br />
                  <span className="text-BrightTealBlue dark:text-AmberFlame">
                    shipping higher-quality code.
                  </span>
                </h1>
                <p className="mt-6 text-sm leading-relaxed text-center text-CoalBrown dark:text-muted-foreground">
                  Teem is the all-in-one platform to manage all your customer
                  interactions with premium performance.
                </p>
              </div>
            </PageSection>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 xl:col-span-4 md:py-20 lg:py-0">
          <PageSection
            index={1}
            className="flex justify-center items-center w-full min-h-screen"
          >
            <div className="max-w-sm mx-auto w-full">
              <div className="space-y-1">
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold">Create Account</h1>
                  <p className="text-muted-foreground text-sm">
                    Start your editorial commerce journey today.
                  </p>
                </div>
                <fetcher.Form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="relative py-4 space-y-4"
                >
                  <FormBox
                    form={form}
                    toggleVisibility={toggleVisibility}
                    isVisible={isVisible}
                    data={filterFields}
                    classname="w-full"
                    icon={true}
                    inputIconPosition={filterFields.map((field) => {
                      if (field.type === "password") {
                        return "inline-start";
                      }
                      return "inline-start";
                    })}
                    inputIcon={filterFields.map((field) => {
                      const icon = showIcon(field.name);
                      return (
                        <div className="text-gray-500 cursor-pointer">
                          {icon}
                        </div>
                      );
                    })}
                  />
                  <p className="text-xs">
                    By continuing, you agree to our{" "}
                    <span className="text-BrightTealBlue font-semibold">
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span className="text-BrightTealBlue font-semibold">
                      Privacy Policy
                    </span>
                    .
                  </p>
                  <ActionButton
                    text={
                      <>
                        Create Acount <ArrowRight />
                      </>
                    }
                    type="submit"
                    loading={isSubmitting}
                    size="lg"
                    classname="w-full font-medium uppercase bg-BrightTealBlue py-5.5 hover:bg-BrightTealBlue dark:bg-BrightTealBlue dark:text-white"
                  />
                  <div className="flex items-center gap-2">
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-600" />{" "}
                    <span className="text-muted-foreground text-sm uppercase whitespace-nowrap">
                      or
                    </span>{" "}
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-600" />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full gap-2 cursor-pointer py-5.5"
                    // onClick={() => handleSocialSignIn("google")}
                  >
                    <GoogleIcon width="0.98em" height="1.5em" />
                    Continue with Google
                  </Button>
                </fetcher.Form>
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/account/signin"
                    className="text-BrightTealBlue font-semibold"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
            {/* <div className="max-w-sm mx-auto space-y-4 flex flex-col justify-center h-full">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">Create Account</h1>
                <p className="text-muted-foreground text-sm">
                  Start your editorial commerce journey today.
                </p>
              </div>
            </div> */}
          </PageSection>
        </div>
      </div>
    </PageWrapper>
  );
}
