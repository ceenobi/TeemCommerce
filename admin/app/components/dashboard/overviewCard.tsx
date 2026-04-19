import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "~/lib/utils";

interface OverviewCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export default function OverviewCard({
  title,
  value,
  change,
  icon: Icon,
  trend = "up",
  className,
}: OverviewCardProps) {
  const isUp = trend === "up";
  const isDown = trend === "down";

  return (
    <Card className={cn(
      "@container/card group relative overflow-hidden  bg-white/2 backdrop-blur-3xl transition-all duration-500 hover:border-BrightTealBlue/30 hover:bg-white/5",
      className
    )}>
      {/* Dynamic Background Glow */}
      <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-BrightTealBlue/10 blur-[60px] transition-all duration-500 group-hover:bg-BrightTealBlue/20" />
      
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-BrightTealBlue shadow-sm transition-transform duration-500 group-hover:scale-110">
          <Icon size={22} strokeWidth={1.5} />
        </div>
        
        <Badge 
          variant="outline" 
          className={cn(
            "h-fit rounded-full border-none px-2.5 py-1 text-xs font-semibold tracking-tight",
            isUp && "bg-MediumJungle/10 text-MediumJungle",
            isDown && "bg-CottonCandy/10 text-CottonCandy",
            !isUp && !isDown && "bg-white/10 text-white"
          )}
        >
          <div className="flex items-center gap-1">
            {isUp && <TrendingUp size={12} />}
            {isDown && <TrendingDown size={12} />}
            {change}
          </div>
        </Badge>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-1 pb-6 pt-2">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 transition-colors duration-500 group-hover:text-BrightTealBlue/60">
          {title}
        </span>
        <CardTitle className="text-3xl font-bold tabular-nums tracking-tighter text-foreground @[250px]/card:text-4xl">
          {value}
        </CardTitle>
      </CardFooter>

      {/* Subtle indicator bar */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-BrightTealBlue/40 transition-all duration-700 ease-in-out group-hover:w-full" />
    </Card>
  );
}
