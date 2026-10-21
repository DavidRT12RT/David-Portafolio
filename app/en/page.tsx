import Home from "@/app/components/Home";
import { pageMetadata } from "@/app/lib/seo";

export const metadata = pageMetadata("en");

export default function Page() {
  return <Home language="en" />;
}
