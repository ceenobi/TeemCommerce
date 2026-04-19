import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/account/layout.tsx", [
    ...prefix("account", [
      route("signup", "routes/account/signup/page.tsx"),
      route("signin", "routes/account/signin/page.tsx"),
      route("reset-password", "routes/account/reset-password/page.tsx"),
      route("forgot-password", "routes/account/forgot-password/page.tsx"),
    ]),
  ]),
  layout("routes/dashboard/layout.tsx", [index("routes/dashboard/page.tsx")]),
  layout("routes/onboarding/layout.tsx", [
    ...prefix("onboarding", [
      index("routes/onboarding/page.tsx"),
      route("branding", "routes/onboarding/branding/page.tsx"),
      route("inventory", "routes/onboarding/inventory/page.tsx"),
      route("payments", "routes/onboarding/payments/page.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
