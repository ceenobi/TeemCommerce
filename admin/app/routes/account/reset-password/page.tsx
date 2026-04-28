import type { Route } from "./+types/page";
import { formFields } from "~/lib/constants";
import { useFetcher, Form, Link, useNavigate } from "react-router";
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import { resetPasswordApi } from "~/routes/api/auth-route";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teem Commerce - Reset Password" },
    { name: "description", content: `Teem Commerce - Reset Password` },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("email") || "";
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;
  const response = await resetPasswordApi({
    validated: resetPasswordSchema.parse(data),
    query,
  });
  return response;
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const form = useForm<ResetPasswordFormSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";
  const toggleVisibility = () => setIsVisible?.((prev) => !prev);
  const filterFields = formFields.filter((field) =>
    ["otp", "newPassword"].includes(field.name),
  );

  const onSubmit: SubmitHandler<ResetPasswordFormSchema> = async (
    data: ResetPasswordFormSchema,
  ) => {
    if (!email) {
      toast.error("Email is required");
      return;
    }
    fetcher.submit(data, {
      method: "post",
      action: `/account/reset-password?email=${email}`,
    });
  };

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { status, body } = fetcher.data as any;
    if (!body) return;
    if (status !== 200) {
      toast.error(body.message || "Failed to reset password");
      return;
    }
    const message = body.message || "Password reset successfully";
    toast.success(message);
    navigate(`/account/signin`);
  }, [fetcher.data, fetcher.state, navigate]);

  return (
    <PageWrapper>
      <PageSection index={0}>
        <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center md:py-20 lg:py-0">
          <div className="bg-white dark:bg-DarkBlue p-6 border shadow space-y-4 rounded-sm">
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
                classname="mt-2 w-full font-medium uppercase bg-BrightTealBlue py-5.5 hover:bg-BrightTealBlue dark:bg-BrightTealBlue dark:text-white"
              />
            </Form>
            <div className="mt-4 w-full h-px bg-gray-200 dark:bg-gray-600" />
            <div className="flex items-center justify-center gap-2 text-center text-sm text-BrightTealBlue ">
              <ArrowLeft size={18} />
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
