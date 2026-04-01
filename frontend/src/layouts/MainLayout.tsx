import { FirebaseStatus } from "@/components/firebase/FirebaseStatus";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";
import { RouteAnalytics } from "@/components/seo";
import { Outlet } from "react-router-dom";

/**
 * App shell: optional dev/status strip, sticky header, scrollable main, footer.
 * Page content renders inside <Outlet /> — keep pages layout-agnostic.
 */
export function MainLayout() {
  return (
    <>
      <RouteAnalytics />
      <SkipLink />
      <div className="firebase-strip">
        <FirebaseStatus />
      </div>
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
