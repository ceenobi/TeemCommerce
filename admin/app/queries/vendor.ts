import { getVendorProfile } from "~/routes/api/vendor-route";

export const getVendorProfileQuery = ({
  cookie,
}: {
  cookie?: string;
}) => ({
  queryKey: ["vendorProfile"],
  queryFn: () => getVendorProfile({ cookie: cookie! }),
});
