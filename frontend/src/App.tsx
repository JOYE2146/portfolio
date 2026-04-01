import { MainLayout } from "@/layouts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage, NotFoundPage } from "@/pages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
