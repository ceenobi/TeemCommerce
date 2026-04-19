import { PageSection, PageWrapper } from "~/components/ui/pageWrapper";
import type { Route } from "./+types/home";
import { getTimeOfDay } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Calendar,
  Download,
  Banknote,
  ShoppingCart,
  Users,
  Target,
  Rocket,
  CirclePlus,
  NotebookPen,
} from "lucide-react";
import OverviewCard from "~/components/dashboard/overviewCard";
import { Link } from "react-router";
import { orderData, orderTableColumns } from "~/lib/constants";
import CustomTable from "~/components/dashboard/customTable";
import { Badge } from "~/components/ui/badge";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard | Teem Commerce" },
    { name: "description", content: "Teem Commerce Admin Dashboard" },
  ];
}

export default function Home() {
  return (
    <PageWrapper className="py-20 px-4 lg:px-8 space-y-8">
      <PageSection index={0} className="md:flex justify-between items-center">
        <div>
          <h1 className="font-bold uppercase text-BrightTealBlue text-sm tracking-widest">
            overview
          </h1>
          <h1 className="text-lg md:text-2xl font-bold text-foreground truncate uppercase tracking-tight lg:text-3xl">
            {getTimeOfDay("Alex")}.
          </h1>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button
            variant="outline"
            size="lg"
            className="py-[22px] bg-white/5 border backdrop-blur-3xl cursor-pointer hover:bg-white/10"
          >
            <Calendar size={18} className="mr-2" /> LAST 30 DAYS
          </Button>
          <Button
            size="lg"
            className="bg-BrightTealBlue text-white py-[22px] cursor-pointer hover:bg-BrightTealBlue/90 shadow-lg shadow-BrightTealBlue/20"
          >
            <Download size={18} className="mr-2" /> EXPORT REPORT
          </Button>
        </div>
      </PageSection>
      <PageSection
        index={1}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <OverviewCard
          title="Total sales"
          value="$128,430.00"
          change="+12.5%"
          icon={Banknote}
          trend="up"
        />
        <OverviewCard
          title="Active Orders"
          value="456"
          change="+18%"
          icon={ShoppingCart}
          trend="up"
        />
        <OverviewCard
          title="Total Customers"
          value="2,840"
          change="-2.4%"
          icon={Users}
          trend="down"
        />
        <OverviewCard
          title="Conversion Rate"
          value="3.2%"
          change="+0.5%"
          icon={Target}
          trend="up"
        />
      </PageSection>
      <div className="grid grid-cols-12 gap-4">
        <PageSection
          index={2}
          className="col-span-12 md:col-span-8 border border-BrightTealBlue/20 p-4 dark:bg-DarkBlue/30 backdrop-blur-3xl"
        >
          <div className="flex justify-between items-center uppercase ">
            <h1 className="font-semibold">Recent orders</h1>
            <Link
              to="/orders"
              className="text-sm hover:text-BrightTealBlue text-BrightTealBlue"
            >
              VIEW ALL
            </Link>
          </div>
          <div className="mt-4">
            <CustomTable columns={orderTableColumns} data={orderData} />
          </div>
        </PageSection>
        <PageSection index={3} className="col-span-12 md:col-span-4 space-y-6">
          <div className="border border-BrightTealBlue dark:bg-DarkBlue/30 bg-slate-50 p-8 space-y-4 shadow-sm dark:shadow-none">
            <Rocket className="text-BrightTealBlue" size={30} />
            <div className="uppercase space-y-2">
              <h1 className="font-bold text-2xl text-foreground dark:text-White">Grow your sales</h1>
              <p className="text-muted-foreground/80 text-xs leading-relaxed">
                Launch marketing campaigns to reach more customers and increase
                sales.
              </p>
              <Button className="bg-BrightTealBlue text-white py-[22px] cursor-pointer hover:bg-BrightTealBlue/90 shadow-lg shadow-BrightTealBlue/20 uppercase w-full">
                Launch campaign
              </Button>
            </div>
          </div>
          <div className="border border-slate-200 dark:border-BrightTealBlue/20 dark:bg-DarkBlue/30 bg-white/50 backdrop-blur-3xl p-8 space-y-4 shadow-sm dark:shadow-none">
            <h1 className="font-bold text-xl text-foreground dark:text-White uppercase">
              Quick actions
            </h1>
            <div className="border border-slate-100 dark:border-BrightTealBlue/30 flex p-4 gap-6 items-center hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
              <Button size="lg" variant="outline" className="dark:bg-white/5">
                <CirclePlus className="text-BrightTealBlue" />
              </Button>
              <div className="uppercase">
                <h1 className="font-bold text-xs text-foreground dark:text-White">
                  ADD NEW PRODUCT
                </h1>
                <p className="text-muted-foreground/80 text-xs">
                  inventory & pricing
                </p>
              </div>
            </div>
            <div className="border border-slate-100 dark:border-BrightTealBlue/30 flex p-4 gap-6 items-center hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
              <Button size="lg" variant="outline" className="dark:bg-white/5">
                <NotebookPen className="text-BrightTealBlue" />
              </Button>
              <div className="uppercase">
                <h1 className="font-bold text-xs text-foreground dark:text-White">
                  Create manual order
                </h1>
                <p className="text-muted-foreground/80 text-xs">
                  phone or store order
                </p>
              </div>
            </div>
          </div>
          <div className="border border-slate-200 dark:border-BrightTealBlue/20 dark:bg-DarkBlue/30 bg-white/50 backdrop-blur-3xl p-8 space-y-4 shadow-sm dark:shadow-none">
            <div className="flex justify-between w-full">
              <h1 className="font-bold text-xl text-foreground dark:text-White uppercase">
                stock alerts
              </h1>
              <Badge
                variant="outline"
                className={
                  "capitalize border-none px-3 py-1 text-[10px] font-bold tracking-widest leading-none bg-red-500/20 text-red-500"
                }
              >
                URGENT
              </Badge>
            </div>
            <div className="border border-slate-100 dark:border-BrightTealBlue/30 flex p-4 gap-6 items-center hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
                <img
                  src="https://res.cloudinary.com/ceenobi/image/upload/v1761575472/Clinicare/avatars/orgjzwxdurpehb9ayxgf.webp"
                  alt="product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="uppercase">
                <h1 className="font-bold text-xs text-foreground dark:text-White truncate">FLORAL DRESS</h1>
                <p className="text-red-500 text-xs">Only 2 left in stock</p>
              </div>
            </div>
            <Button className="bg-slate-900 dark:bg-DarkBlue text-white py-[22px] cursor-pointer hover:bg-slate-800 dark:hover:bg-DarkBlue/90 shadow-lg dark:shadow-DarkBlue/20 uppercase w-full">
              resolve all alerts
            </Button>
          </div>
        </PageSection>
      </div>
    </PageWrapper>
  );
}
