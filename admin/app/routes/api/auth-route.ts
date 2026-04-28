import { cache } from "react";
import { apiClient } from "~/lib/apiClient";
import type {
  ForgotPasswordFormSchema,
  ResetPasswordFormSchema,
  SignInFormSchema,
  SignupFormSchema,
  VerifyEmailTypeSchema,
} from "~/lib/schemaValidations";

export const signUpWithEmail = async ({
  validated,
}: {
  validated: SignupFormSchema;
}) => {
  return await (apiClient.auth.createUser as any)({
    body: validated,
  });
};

export const verifyEmailAccount = async ({
  validated,
  query,
}: {
  validated: VerifyEmailTypeSchema;
  query: string;
}) => {
  const queryParams: any = {
    email: query,
  };
  return await (apiClient.auth.verifyEmail as any)({
    body: validated,
    query: queryParams,
  });
};

export const signInWithEmail = async ({
  validated,
}: {
  validated: SignInFormSchema;
}) => {
  return await (apiClient.auth.loginUser as any)({
    body: validated,
  });
};

export const resendEmailVerification = async ({
  validated,
}: {
  validated: { email: string };
}) => {
  return await (apiClient.auth.resendEmailVerification as any)({
    body: validated,
  });
};

export const getUserSession = cache(async ({ cookie }: { cookie: string }) => {
  return await (apiClient.auth.getSession as any)({
    headers: cookie ? { Cookie: cookie } : undefined,
  });
});

export const logOutUserApi = async ({ cookie }: { cookie: string }) => {
  return await (apiClient.auth.logOutUser as any)({
    body: {},
    headers: cookie ? { Cookie: cookie } : undefined,
  });
};

export const forgotPasswordApi = async ({
  validated,
}: {
  validated: ForgotPasswordFormSchema;
}) => {
  return await (apiClient.auth.forgotPassword as any)({
    body: validated,
  });
};

export const resetPasswordApi = async ({
  validated,
  query,
}: {
  validated: ResetPasswordFormSchema;
  query: string;
}) => {
  const queryParams: any = {
    email: query,
  };
  return await (apiClient.auth.resetPassword as any)({
    body: validated,
    query: queryParams,
  });
};
