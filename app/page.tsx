import Home from "@/app/components/Home";
import { pageMetadata } from "@/app/lib/seo";

export const metadata = pageMetadata("es");

export default function Page() {
  return <Home language="es" />;
}
