import {
  ChartNoAxesCombined,
  LayoutDashboard,
  Package2,
  Settings,
  ShoppingCart,
  Tags,
  UsersRound,
} from "lucide-react";

export const formFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter legal name",
  },
  {
    name: "storeName",
    label: "Store Name",
    type: "text",
    placeholder: "Eg: Modern Fashion",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "name@company.com",
  },
  {
    name: "newEmail",
    label: "New Email",
    type: "email",
    placeholder: "Your new email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "******",
  },
  {
    name: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "+000(phone-number)",
  },
  {
    name: "newPassword",
    label: "New Password",
    type: "password",
    placeholder: "******",
  },
  {
    name: "confirmPassword",
    label: "Confirm New Password",
    type: "password",
    placeholder: "******",
  },
  {
    name: "currentPassword",
    label: "Current Password",
    type: "password",
    placeholder: "Your current password",
  },
  {
    name: "newsletter",
    label: "I would like to receive updates and promotions",
    type: "checkbox",
    placeholder: "Subscribe to our newsletter",
  },
  {
    name: "occupation",
    label: "Occupation",
    type: "text",
    placeholder: "Your occupation",
  },
  {
    name: "location",
    label: "Location",
    type: "text",
    placeholder: "Enter location",
  },
  {
    name: "description",
    label: "Description",
    type: "editor",
    placeholder: "Describe event",
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    placeholder: "Select event date",
  },
  {
    name: "time",
    label: "Time",
    type: "time",
    placeholder: "Select event time",
  },
  {
    name: "isPublic",
    label: "Is Public",
    type: "checkbox",
    placeholder: "Is event public?",
  },
  {
    name: "fees",
    label: "Fees: ₦(optional)",
    type: "number",
    placeholder: "Event fees",
  },
  {
    name: "paymentType",
    label: "Payment Type",
    type: "select",
    placeholder: "Select payment type",
    options: [
      { id: "donation", name: "donation" },
      { id: "event", name: "event" },
      { id: "membership_dues", name: "membership_dues" },
    ],
  },
  {
    name: "amount",
    label: "Amount",
    type: "number",
    placeholder: "Enter amount",
  },
  {
    name: "note",
    label: "Note (optional)",
    type: "textarea",
    placeholder: "Enter short description about the paymnent",
  },
];

export const onboardingStoreFields = [
  {
    name: "storeName",
    label: "Store Name",
    type: "text",
    placeholder: "e.g. Stellar Threads",
  },
  {
    name: "industry",
    label: "Industry",
    type: "select",
    placeholder: "Select your industry",
    options: [
      { id: "fashion", name: "Fashion & Apparel" },
      { id: "electronics", name: "Electronics & Gadgets" },
      { id: "beauty", name: "Beauty & Cosmetics" },
      { id: "home", name: "Home & Decor" },
      { id: "food", name: "Food & Beverage" },
      { id: "health", name: "Health & Fitness" },
      { id: "toys", name: "Toys & Kids" },
      { id: "sports", name: "Sports & Outdoors" },
      { id: "books", name: "Books & Stationery" },
      { id: "art", name: "Art & Crafts" },
      { id: "other", name: "Other" },
    ],
  },
  {
    name: "storeUrl",
    label: "Store URL",
    type: "text",
    placeholder: "your-store",
  },
];

export const onboardingBrandingFields = [
  {
    name: "brandPrimary",
    label: "Primary Brand Color",
    type: "text",
    placeholder: "#006b2f",
  },
  {
    name: "brandSecondary",
    label: "Secondary Brand Color",
    type: "text",
    placeholder: "#fdc003",
  },
];

export const onboardingShippingFields = [
  {
    name: "shippingStandard",
    label: "Standard Delivery (3-5 days)",
    type: "number",
    placeholder: "12.00",
  },
  {
    name: "shippingExpress",
    label: "Express Shipping (1-2 days)",
    type: "number",
    placeholder: "25.00",
  },
  {
    name: "freeShippingThreshold",
    label: "Free Shipping Threshold",
    type: "number",
    placeholder: "150.00",
  },
];

export const sideBarLinks = [
  {
    id: "home",
    title: "Main Menu",
    children: [
      {
        name: "Overview",
        href: "/",
        icon: LayoutDashboard,
      },
      {
        name: "Products",
        href: "/products",
        icon: Package2,
      },
      {
        name: "Orders",
        href: "/orders",
        icon: ShoppingCart,
      },
    ],
  },
  {
    id: "finance",
    title: "Finance",
    children: [
      {
        name: "Customers",
        href: "/customers",
        icon: UsersRound,
      },
      {
        name: "Analytics",
        href: "/analytics",
        icon: ChartNoAxesCombined,
      },
      {
        name: "Marketing",
        href: "/marketing",
        icon: Tags,
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    children: [
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export const orderTableColumns = [
  { name: "Order ID", uid: "orderId" },
  { name: "Customer", uid: "customer" },
  { name: "Date", uid: "date" },
  { name: "Status", uid: "status" },
  { name: "Amount", uid: "amount" },
  { name: "Action", uid: "action" },
];

export const orderData = [
  {
    _id: 1,
    orderId: "#123456789",
    customer: "John Doe",
    date: "2022-01-01",
    status: "pending",
    amount: 123456789,
  },
  {
    _id: 2,
    orderId: "#123456789",
    customer: "John Doe",
    date: "2022-01-01",
    status: "pending",
    amount: 123456789,
  },
  {
    _id: 3,
    orderId: "#123456789",
    customer: "John Doe",
    date: "2022-01-01",
    status: "pending",
    amount: 123456789,
  },
  {
    _id: 4,
    orderId: "#123456789",
    customer: "John Doe",
    date: "2022-01-01",
    status: "pending",
    amount: 123456789,
  },
];
