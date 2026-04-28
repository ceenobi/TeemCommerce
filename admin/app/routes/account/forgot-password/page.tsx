import type { Route } from "./+types/page";
import { formFields } from "~/lib/constants";
import { useFetcher, Form, Link, useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormSchema,
} from "~/lib/schemaValidations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import FormBox from "~/components/ui/formBox";
import ActionButton from "~/components/ui/actionButton";
import { PageSection, PageWrapper } from "~/components/ui/pageWrapper";
import { forgotPasswordApi } from "~/routes/api/auth-route";
import { useEffect } from "react";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teem Commerce - Forgot Password" },
    { name: "description", content: `Teem Commerce - Forgot Password` },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;
  const response = await forgotPasswordApi({
    validated: forgotPasswordSchema.parse(data),
  });
  return response;
}

export default function ForgotPassword() {
  const form = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const filterFields = formFields.filter((field) =>
    ["email"].includes(field.name),
  );
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";

  const onSubmit: SubmitHandler<ForgotPasswordFormSchema> = async (
    data: ForgotPasswordFormSchema,
  ) => {
    fetcher.submit(data, {
      method: "post",
      action: `/account/forgot-password`,
    });
  };

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;
    const { status, body } = fetcher.data as any;
    if (!body) return;
    if (status !== 200) {
      toast.error(body.message || "Failed to send reset otp code");
      return;
    }
    const message = body.message || "Reset otp code sent successfully";
    toast.success(message);
    navigate(`/account/reset-password?email=${form.getValues("email")}`);
  }, [fetcher.data, fetcher.state, navigate, form]);

  return (
    <PageWrapper>
      <PageSection index={0}>
        <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center md:py-20 lg:py-0">
          <div className="rounded-sm bg-white dark:bg-DarkBlue p-6 border shadow space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Forgot Password</h1>
              <p className="text-muted-foreground text-sm">
                Enter the email address associated with your account and we'll
                send you a code to reset your password.
              </p>
            </div>
            <Form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormBox
                form={form}
                data={filterFields}
                classname="w-full"
                icon={true}
                inputIconPosition={"inline-start"}
                inputIcon={<Mail className="text-gray-500 cursor-pointer" />}
              />
              <ActionButton
                text={
                  <>
                    Get Reset Code <ArrowRight />
                  </>
                }
                type="submit"
                loading={isSubmitting}
                size="lg"
                classname="w-full font-medium uppercase bg-BrightTealBlue py-5.5 hover:bg-BrightTealBlue dark:bg-BrightTealBlue dark:text-white"
              />
            </Form>
            <div className="mt-4 w-full h-px bg-gray-200 dark:bg-WhiteNeutral/20" />
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
