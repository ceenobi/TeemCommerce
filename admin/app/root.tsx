import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useMatches,
} from "react-router";
import {
  QueryClientProvider,
  HydrationBoundary,
  type DehydratedState,
} from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import type { Route } from "./+types/root";
import "./app.css";
import "react-phone-number-input/style.css";
import "easymde/dist/easymde.min.css";
import { ThemeProvider } from "./components/provider/theme";
import ToastProvider from "./components/provider/toast";
import { TooltipProvider } from "./components/ui/tooltip";
import { ProgressBar } from "./components/ui/progressBar";
import { getQueryClientRsc } from "./lib/getQueryClient";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storageKey = "TeemCommerce-theme";
                  var defaultTheme = "system";
                  var theme = localStorage.getItem(storageKey) || defaultTheme;
                  var supportDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  
                  var root = document.documentElement;
                  root.classList.remove("light", "dark");
                  
                  if (theme === "dark" || (theme === "system" && supportDarkMode)) {
                    root.classList.add("dark");
                  } else {
                    root.classList.add("light");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ProgressBar />
        <ThemeProvider defaultTheme="system" storageKey="TeemCommerce-theme">
          <TooltipProvider>{children}</TooltipProvider>
          <ToastProvider />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const queryClient = getQueryClientRsc();
  const matches = useMatches();
  const dehydratedState = matches.reduce(
    (acc, match) => {
      const state = (match.loaderData as any)
        ?.dehydratedState as DehydratedState;
      if (state) {
        return {
          ...acc,
          queries: [...(acc?.queries || []), ...(state.queries || [])],
          mutations: [...(acc?.mutations || []), ...(state.mutations || [])],
        };
      }
      return acc;
    },
    { queries: [], mutations: [] } as DehydratedState,
  );

  if (import.meta.env.DEV && dehydratedState.queries.length > 0) {
    console.log(
      "Global Hydration State merged for queries:",
      dehydratedState.queries.map((q) => q.queryKey),
    );
  }
  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydratedState}>
        <Outlet />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "000";
  let title = "SYSTEM ANOMALY";
  let details = "An unexpected error occurred.";
  let showHome = true;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      message = "404";
      title = "LOST IN SPACE";
      details = "The page you're searching for has drifted into deep space.";
    } else {
      message = String(error.status);
      title = error.statusText || "UNKNOWN ERROR";
    }
  } else if (error && error instanceof Error) {
    title = error.name;
    details = error.message;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center relative overflow-hidden selection:bg-AmberFlame selection:text-DarkNight">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] bg-[radial-gradient(circle_at_center,var(--color-foreground)_0%,transparent_60%)]/3 animate-pulse-slow" />
      </div>

      <main className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl animate-slide-up opacity-0">
        {/* Large Decorative Number */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45vw] font-black tracking-[-0.08em] opacity-0 select-none pointer-events-none mix-blend-multiply dark:mix-blend-overlay text-foreground/5 dark:text-white/10 animate-scale-up">
          {message}
        </div>

        {/* Content */}
        <div className="space-y-4 animate-content-fade opacity-0">
          <p className="text-CottonCandy text-sm font-bold tracking-[0.5em] uppercase mb-4">
            {title}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-none">
            STRANDED
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light max-w-lg mx-auto">
            {details}
          </p>
        </div>

        {/* Navigation Action */}
        {showHome && (
          <div className="mt-16 animate-in fade-in duration-1000 delay-500 fill-mode-forwards">
            <a
              href="/"
              className="group relative inline-flex items-center gap-4 bg-primary text-primary-foreground px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Recalibrate Home
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-BrightTealBlue rounded-full -z-10 group-hover:scale-110 opacity-0 group-hover:opacity-20 transition-all duration-500" />
            </a>
          </div>
        )}
      </main>

      {/* Decorative Branding */}
      <div className="absolute bottom-10 left-10 hidden md:flex items-center gap-4 opacity-30 select-none">
        <div className="w-12 h-px bg-foreground/20" />
        <span className="text-[10px] font-bold tracking-[0.4em] uppercase">
          SYSTEM.LOG
        </span>
      </div>
    </div>
  );
}
