import { HerbalHub, HERBAL_HUB_META } from "@/components/HerbalPages";
import { pageMetadata } from "@/lib/page-metadata";
export const metadata = pageMetadata({ path: "/herbal/tonic", ...HERBAL_HUB_META.tonic, routeOgImage: true });
export default function Page() { return <HerbalHub category="tonic" />; }
