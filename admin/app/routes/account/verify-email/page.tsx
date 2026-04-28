import type { Route } from "./+types/page";
import { PageSection, PageWrapper } from "~/components/ui/pageWrapper";
import { useNavigate, useFetcher, useSearchParams } from "react-router";
import { formFields } from "~/lib/constants";
import { useForm, type SubmitHandler } from "react-hook-form";
import FormBox from "~/components/ui/formBox";
import { zodResolver } from "@hookform/resolvers/zod";
import ActionButton from "~/components/ui/actionButton";
import {
  verifyEmailSchema,
  type VerifyEmailTypeSchema,
} from "~/lib/schemaValidations";
import {
  verifyEmailAccount,
  resendEmailVerification,
} from "~/routes/api/auth-route";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teem Commerce - Verify Email" },
    { name: "description", content: `Teem Commerce - Verify Email` },
  ];
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("email") || "";
  const type = url.searchParams.get("type") || "";
  const formData = await request.formData();
  const data = Object.fromEntries(formData) as Record<string, string>;
  if (type === "email-verification") {
    const response = await resendEmailVerification({
      validated: { email: data.email },
    });
    return response;
  } else {
    const response = await verifyEmailAccount({
      validated: verifyEmailSchema.parse(data),
      query,
    });
    const setCookieHeader = response.headers?.get("set-cookie");
    const headers: Record<string, string> = {};
    if (setCookieHeader) {
      headers["Set-Cookie"] = setCookieHeader;
    }
    return response;
  }
}

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("query");
  const fetcher = useFetcher<typeof verifyEmailSchema>();
  const form = useForm({
    resolver: zodResolver(verifyEmailSchema),
  });
  const navigate = useNavigate();
  const isSubmitting =
    fetcher.state === "submitting" &&
    fetcher.formAction !== `/account/verify-email?type=email-verification`;
  const lastActionRef = useRef<"verify" | "resend" | null>(null);

  const filterFields = formFields.filter((field) =>
    ["otp"].includes(field.name),
  );

  const onSubmit: SubmitHandler<VerifyEmailTypeSchema> = (data) => {
    lastActionRef.current = "verify";
    fetcher.submit(data, {
      method: "post",
      action: `/account/verify-email?email=${email}`,
    });
  };

  const handleResend = () => {
    lastActionRef.current = "resend";
    fetcher.submit(
      { email },
      {
        method: "post",
        action: "/account/verify-email?type=email-verification",
      },
    );
  };

  useEffect(() => {
    if (!fetcher.data || fetcher.state !== "idle") return;

    const { status, body } = fetcher.data as any;
    if (!body) return;

    if (status !== 200) {
      toast.error(body.message || "Something went wrong during verification");
      return;
    }

    const message = body.message || "Operation successful";

    if (lastActionRef.current === "verify") {
      toast.success(message);
      navigate("/");
    } else if (lastActionRef.current === "resend") {
      toast.success(message);
    }
  }, [fetcher.data, fetcher.state, navigate]);

  return (
    <PageWrapper>
      <PageSection index={0}>
        <div className="max-w-sm mx-auto min-h-screen flex items-center justify-center md:py-20 lg:py-0">
          {/* <img
            src="/EnterOTP.svg"
            alt="OTP illustration"
            className="w-50 h-50 mx-auto md:hidden"
          /> */}
          <div className="mt-4 rounded-sm bg-white dark:bg-DarkBlue p-6 border shadow space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">
                Email <br />
                <span className="text-BrightTealBlue">Verification</span>
              </h1>
              <p className="text-muted-foreground text-sm">
                Please enter the verification code sent to your email -{" "}
                <span className="font-semibold">{email}</span>
              </p>
            </div>
            <fetcher.Form
              className="space-y-2"
              onSubmit={form.handleSubmit(onSubmit)}
              action={`/account/verify-email?email=${email}`}
            >
              <FormBox
                form={form}
                data={filterFields}
                classname="max-w-full mx-auto"
              />
              <ActionButton
                text={<>Verify Email</>}
                type="submit"
                loading={isSubmitting}
                size="lg"
                classname="w-full font-medium uppercase bg-BrightTealBlue py-5.5 hover:bg-BrightTealBlue dark:bg-BrightTealBlue dark:text-white"
              />
            </fetcher.Form>
            <div className="my-4 w-full h-px bg-gray-200 dark:bg-WhiteNeutral/20" />
            <p className="text-muted-foreground text-center text-sm">
              Didn't receive the OTP?{" "}
              <span
                className="border-b border-BrightTealBlue cursor-pointer text-BrightTealBlue"
                onClick={handleResend}
              >
                {fetcher.state === "submitting" &&
                lastActionRef.current === "resend"
                  ? "Resending..."
                  : "Resend"}
              </span>
            </p>
          </div>
        </div>
      </PageSection>
    </PageWrapper>
  );
};

export default VerifyEmail;
