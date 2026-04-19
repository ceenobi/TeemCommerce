import { Outlet, useLocation, Link } from "react-router";
import { Store, Palette, Package, CreditCard, Check, Tent } from "lucide-react";
import { ThemeToggle } from "~/components/nav/theme-toggle";
import { cn } from "~/lib/utils";
import "./onboarding.css";

const STEPS = [
  {
    path: "/onboarding",
    label: "Store Setup",
    sublabel: "Identity & URL",
    icon: Store,
  },
  {
    path: "/onboarding/branding",
    label: "Branding & Design",
    sublabel: "Logo & Colors",
    icon: Palette,
  },
  {
    path: "/onboarding/inventory",
    label: "Inventory Import",
    sublabel: "Products & Catalog",
    icon: Package,
  },
  {
    path: "/onboarding/payments",
    label: "Payments & Shipping",
    sublabel: "Merchant & Logistics",
    icon: CreditCard,
  },
];

function getStepIndex(pathname: string) {
  const idx = STEPS.findIndex((s) => s.path === pathname);
  return idx === -1 ? 0 : idx;
}

export default function OnboardingLayout() {
  const location = useLocation();
  const currentStep = getStepIndex(location.pathname);
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] min-h-screen bg-background">
      {/* ─── Sidebar ─── */}
      <aside className="sticky top-0 h-auto lg:h-screen overflow-y-auto bg-muted/40 dark:bg-card p-5 lg:p-6 flex flex-row lg:flex-col gap-5 lg:gap-8 items-center lg:items-stretch justify-between lg:justify-start border-b lg:border-b-0 lg:border-r border-border z-30">
        {/* Brand */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <Tent className="text-BrightTealBlue" size={22} />
            <h2 className="text-base font-bold text-foreground tracking-tight">
              Teem Commerce
            </h2>
          </div>
          <span className="hidden lg:block text-[0.6875rem] font-medium uppercase tracking-widest text-muted-foreground">
            Onboarding Phase
          </span>
        </div>

        {/* Step Navigation */}
        <nav className="flex flex-row lg:flex-col gap-1">
          {STEPS.map((step, i) => {
            const isActive = i === currentStep;
            const isCompleted = i < currentStep;

            return (
              <div key={step.path}>
                <Link
                  to={step.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-muted-foreground no-underline",
                    isActive &&
                      "bg-card dark:bg-muted text-foreground shadow-sm",
                    isCompleted && "text-MediumJungle",
                  )}
                >
                  <span
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 border-[1.5px] border-border transition-all",
                      isActive &&
                        "bg-BrightTealBlue border-transparent text-white",
                      isCompleted &&
                        "bg-MediumJungle border-transparent text-white",
                    )}
                  >
                    {isCompleted ? <Check size={14} /> : i + 1}
                  </span>
                  <div className="hidden lg:block">
                    <div className="text-[0.8125rem] font-medium leading-tight">
                      {step.label}
                    </div>
                    <div className="text-[0.6875rem] text-muted-foreground mt-0.5">
                      {step.sublabel}
                    </div>
                  </div>
                </Link>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "onboarding-connector-line bg-border hidden lg:block",
                      isCompleted && "bg-MediumJungle",
                    )}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Progress */}
        <div className="hidden lg:block mt-auto">
          <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-BrightTealBlue transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-[0.6875rem] font-medium uppercase tracking-widest text-muted-foreground">
            Step {currentStep + 1} of {STEPS.length} · {Math.round(progress)}%
            Completed
          </p>
        </div>
      </aside>

      {/* ─── Main Area ─── */}
      <main className="overflow-y-auto p-6 lg:p-10 max-w-[960px]">
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
