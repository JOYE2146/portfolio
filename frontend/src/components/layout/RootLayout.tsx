import { Outlet } from "react-router-dom";
import { FirebaseStatus } from "@/components/firebase/FirebaseStatus";

export function RootLayout() {
  return (
    <>
      <div className="firebase-strip">
        <FirebaseStatus />
      </div>
      <Outlet />
    </>
  );
}
