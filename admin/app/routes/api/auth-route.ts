import { apiClient } from "~/lib/apiClient";
import type { SignupFormSchema } from "~/lib/schemaValidations";

export const signUpWithEmail = async ({
  validated,
  cookie,
}: {
  validated: SignupFormSchema;
  cookie: string;
}) => {
  return await (apiClient.auth.createUser as any)({
    body: validated,
    headers: cookie ? { Cookie: cookie } : undefined,
  });
};