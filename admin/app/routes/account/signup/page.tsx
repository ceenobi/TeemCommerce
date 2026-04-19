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
import { useFetcher, Form, Link } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignupFormSchema } from "~/lib/schemaValidations";
import FormBox from "~/components/ui/formBox";
import ActionButton from "~/components/ui/actionButton";
import { PageSection, PageWrapper } from "~/components/ui/pageWrapper";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teem Commerce - Account Signup" },
    { name: "description", content: `Teem Commerce - Account Signup` },
  ];
}

export default function Signup() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible?.((prev) => !prev);
  const filterFields = formFields.filter((field) =>
    ["name", "email", "password"].includes(field.name),
  );
  const form = useForm<SignupFormSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const fetcher = useFetcher();
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
      <PageSection index={0}>
        <div className="grid grid-cols-12">
          <div className="hidden md:col-span-3 md:flex flex-col justify-between bg-BrightTealBlue rounded-r-none p-8 h-auto">
            <div>
              <h1 className="text-white text-2xl lg:text-3xl xl:text-4xl font-bold uppercase">
                Teem Commerce
              </h1>
              <p className="text-gray-200 text-sm">
                The Digital Concierge for modern retail excellence.
              </p>
            </div>
            <div className="flex flex-col gap-4 mt-4">
              {info.map((item, index) => (
                <div key={index} className="flex items-center gap-2 uppercase">
                  <div className="text-white">{item.icon}</div>
                  <p className="text-white text-sm">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-9 p-8 rounded-l-none h-auto items-center bg-white dark:bg-DarkBlue border">
            <div className="max-w-sm mx-auto space-y-4 flex flex-col justify-center h-full">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">Create Account</h1>
                <p className="text-muted-foreground text-sm">
                  Start your editorial commerce journey today.
                </p>
              </div>
              <Form
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
                      <div className="text-gray-500 cursor-pointer">{icon}</div>
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
                  classname="w-full font-medium uppercase bg-BrightTealBlue py-[22px] hover:bg-BrightTealBlue dark:bg-BrightTealBlue dark:text-white"
                />
              </Form>
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
        </div>
      </PageSection>
    </PageWrapper>
  );
}
