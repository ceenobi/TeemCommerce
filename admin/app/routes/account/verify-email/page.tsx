import type { Route } from "./+types/page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Teem Commerce - Verify Email" },
    { name: "description", content: `Teem Commerce - Verify Email` },
  ];
}


const VerifyEmail = () => {
  return <div>VerifyEmail</div>;
};

export default VerifyEmail;