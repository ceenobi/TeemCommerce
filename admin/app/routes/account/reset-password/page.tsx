import type { Route } from "./+types/page";
import { formFields } from "~/lib/constants";
import { useFetcher, Form, Link } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  resetPasswordSchema,
  type ResetPasswordFormSchema,
} from "~/lib/schemaValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ArrowLeft, LockOpen } from "lucide-react";
import FormBox from "~/components/ui/formBox";
import ActionButton from "~/components/ui/actionButton";
import { PageSection, PageWrapper } from "~/components/ui/pageWrapper";
import { useState } from "react";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teem Commerce - Reset Password" },
    { name: "description", content: `Teem Commerce - Reset Password` },
  ];
}

export default function ResetPassword() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const form = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const toggleVisibility = () => setIsVisible?.((prev) => !prev);
  const filterFields = formFields.filter((field) =>
    ["newPassword", "confirmPassword"].includes(field.name),
  );

  const onSubmit: SubmitHandler<ResetPasswordFormSchema> = async (
    data: ResetPasswordFormSchema,
  ) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    fetcher.submit(data, {
      method: "post",
      action: `/account/reset-password`,
    });
  };
  return (
    <PageWrapper>
      <PageSection index={0}>
        <div className="max-w-sm mx-auto">
          <div className="bg-white dark:bg-DarkBlue p-6 border shadow space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                Security <br />
                <span className="text-BrightTealBlue">First</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Create a roburst new password to protect your commercial
                ecosystem and data.
              </p>
            </div>
            <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormBox
                form={form}
                data={filterFields}
                isVisible={isVisible}
                toggleVisibility={toggleVisibility}
                classname="w-full"
                icon={true}
                inputIconPosition={"inline-start"}
                inputIcon={
                  <LockOpen
                    className="text-gray-500 cursor-pointer"
                    onClick={toggleVisibility}
                  />
                }
              />
              <div className="bg-WhiteNeutral dark:bg-gray-900 p-4">
                <h1 className="text-sm font-semibold mb-1">Requirements</h1>
                <ul className="text-xs dark:text-muted-foreground">
                  <li>Minimum 8 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>
              <ActionButton
                text={
                  <>
                    Reset Password <ArrowRight />
                  </>
                }
                type="submit"
                loading={isSubmitting}
                size="lg"
                classname="mt-2 w-full font-medium uppercase bg-BrightTealBlue py-[22px] hover:bg-BrightTealBlue dark:bg-BrightTealBlue dark:text-white"
              />
            </Form>
            <div className="mt-4 w-full h-px bg-gray-200 dark:bg-gray-600" />
            <div className="flex items-center justify-center gap-2 text-center text-sm text-BrightTealBlue ">
              <ArrowLeft />
              <Link to="/account/signin" className="font-semibold">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </PageSection>
    </PageWrapper>
  );
}
