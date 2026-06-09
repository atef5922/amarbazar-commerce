import { Clock, Mail, MapPin, Phone } from "lucide-react";

export const contactInfo = [
  {
    title: "Phone Support",
    value: "123-456-789",
    description: "Saturday to Thursday, 10:00 AM - 8:00 PM",
    icon: Phone
  },
  {
    title: "Email Support",
    value: "support@amarbazar.com",
    description: "Replies usually arrive within one business day.",
    icon: Mail
  },
  {
    title: "Store Location",
    value: "AmarBazar Store, Dhaka, Bangladesh",
    description: "Demo storefront address for future business setup.",
    icon: MapPin
  },
  {
    title: "Business Hours",
    value: "Saturday - Thursday",
    description: "10:00 AM - 8:00 PM",
    icon: Clock
  }
];

export const supportTypes = ["Order Support", "Product Inquiry", "Return Request", "Payment Issue", "General Question"];
