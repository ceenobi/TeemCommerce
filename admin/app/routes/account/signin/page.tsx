import type { Route } from "./+types/page";
import { Mail, LockOpen, ArrowRight, Tent } from "lucide-react";
import { Button } from "~/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useFetcher, Form, Link } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { signInSchema, type SigninFormSchema } from "~/lib/schemaValidations";
import { formFields } from "~/lib/constants";
import FormBox from "~/components/ui/formBox";
import ActionButton from "~/components/ui/actionButton";
import { GoogleIcon } from "~/components/icons/googleIcon";
import { PageSection, PageWrapper } from "~/components/ui/pageWrapper";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teem Commerce - Account Login" },
    { name: "description", content: `Teem Commerce - Account Login` },
  ];
}

export default function Signin() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible?.((prev) => !prev);
  const filterFields = formFields.filter((field) =>
    ["email", "password"].includes(field.name),
  );
  const form = useForm<SigninFormSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const onSubmit: SubmitHandler<SigninFormSchema> = async (
    data: SigninFormSchema,
  ) => {
    fetcher.submit(data, {
      method: "post",
      action: `/account/signin`,
    });
  };

  return (
    <PageWrapper>
      <PageSection index={0}>
        <div className="max-w-sm mx-auto">
          <div className="space-y-4">
            <div className="text-center">
              <Link to="/">
                <Tent
                  size={30}
                  className="text-BrightTealBlue w-full text-center mb-4"
                />
              </Link>
              <h1 className="text-3xl font-bold">Teem Commerce</h1>
              <p className="text-muted-foreground text-sm">
                Welcome back! Please enter your details to sign in.
              </p>
            </div>

            <Form
              onSubmit={form.handleSubmit(onSubmit)}
              className="relative bg-white dark:bg-DarkBlue p-6 border space-y-4"
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
                    return <Mail className="text-gray-500 cursor-pointer" />;
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
                className="absolute top-[31%] right-5 font-semibold text-sm text-right text-BrightTealBlue"
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
                classname="w-full font-medium uppercase bg-BrightTealBlue py-[22px] hover:bg-BrightTealBlue dark:bg-BrightTealBlue dark:text-white"
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
                className="w-full gap-2 cursor-pointer"
                // onClick={() => handleSocialSignIn("google")}
              >
                <GoogleIcon width="0.98em" height="1.5em" />
                Sign in with Google
              </Button>
            </Form>
            <p className="text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/account/signup"
                className="text-BrightTealBlue font-semibold"
              >
                Get started for free
              </Link>
            </p>
          </div>
        </div>
      </PageSection>
    </PageWrapper>
  );
}
