import type { Route } from "./+types/page";
import { Mail, LockOpen, ArrowRight, Tent } from "lucide-react";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useFetcher, Link, useNavigate, redirect } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { signInSchema, type SignInFormSchema } from "~/lib/schemaValidations";
import { formFields } from "~/lib/constants";
import FormBox from "~/components/ui/formBox";
import ActionButton from "~/components/ui/actionButton";
import { GoogleIcon } from "~/components/icons/googleIcon";
import { PageSection, PageWrapper } from "~/components/ui/pageWrapper";
import { signInWithEmail } from "~/routes/api/auth-route";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teem Commerce - Account Login" },
    { name: "description", content: `Teem Commerce - Account Login` },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;
  const response = await signInWithEmail({
    validated: signInSchema.parse(data),
  });
  const setCookieHeader = response.headers?.get("set-cookie");
  const headers: Record<string, string> = {};
  if (setCookieHeader) {
    headers["Set-Cookie"] = setCookieHeader;
  }
  if (response.status === 200) {
    return redirect("/");
  }
  return response;
}

export default function Signin() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible?.((prev) => !prev);
  const filterFields = formFields.filter((field) =>
    ["email", "password"].includes(field.name),
  );
  const form = useForm<SignInFormSchema>({
    resolver: zodResolver(signInSchema),
  });
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  const onSubmit: SubmitHandler<SignInFormSchema> = async (
    data: SignInFormSchema,
  ) => {
    fetcher.submit(data, {
      method: "post",
      action: `/account/signin`,
    });
  };

  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      const { status, body } = fetcher.data as any;

      if (status !== 200 && body) {
        toast.error(body.message || "Something went wrong during signin");
        if (body.message === "Email not verified") {
          navigate(`/account/verify-email?query=${form.getValues("email")}`);
        }
        if (body.details && Array.isArray(body.details)) {
          body.details.forEach((err: any) => {
            if (err.path) {
              form.setError(err.path[0] as keyof SignInFormSchema, {
                type: "manual",
                message: err.message,
              });
            }
          });
        }
      }
    }
  }, [fetcher.data, fetcher.state, form, navigate]);

  return (
    <PageWrapper>
      <div className="grid grid-cols-12 gap-4 min-h-screen">
        <div className="col-span-12 lg:col-span-6 xl:col-span-8 h-fit lg:sticky lg:top-0 lg:h-screen hidden lg:flex">
          <div className="min-h-screen w-full bg-white dark:bg-DarkNight relative flex justify-center items-center overflow-hidden">
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
                <div className="px-6">
                  {/* <Link to="/">
                    <Tent
                      size={30}
                      className="text-BrightTealBlue w-full text-center mb-4"
                    />
                  </Link> */}
                  <h1 className="text-3xl font-semibold">Teem Commerce</h1>
                  <p className="text-muted-foreground text-sm">
                    Enter your details to sign in.
                  </p>
                </div>

                <fetcher.Form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="relative p-6 space-y-4"
                >
                  <FormBox
                    form={form}
                    toggleVisibility={toggleVisibility}
                    isVisible={isVisible}
                    data={filterFields}
                    classname="w-full"
                    icon={true}
                    inputIconPosition={"inline-start"}
                    inputIcon={filterFields.map((field) => {
                      if (field.name === "email") {
                        return (
                          <Mail className="text-gray-500 cursor-pointer" />
                        );
                      }
                      return (
                        <LockOpen
                          className="text-gray-500 cursor-pointer"
                          onClick={toggleVisibility}
                        />
                      );
                    })}
                  />
                  <Link
                    to="/account/forgot-password"
                    className="absolute top-[30%] right-5 font-semibold text-sm text-right text-BrightTealBlue"
                  >
                    Forgot password?
                  </Link>
                  <ActionButton
                    text={
                      <>
                        Sign In to Dashboard <ArrowRight />
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
                      or continue with
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
                    Sign in with Google
                  </Button>
                </fetcher.Form>
                <p className="text-center text-sm">
                  Don't have an account?{" "}
                  <Link
                    to="/account/signup"
                    className="text-BrightTealBlue font-semibold"
                  >
                    Get started
                  </Link>
                </p>
              </div>
            </div>
          </PageSection>
        </div>
      </div>
    </PageWrapper>
  );
}
