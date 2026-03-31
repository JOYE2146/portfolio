import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { HomePage, NotFoundPage } from "@/pages";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
