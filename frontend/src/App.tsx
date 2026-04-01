import { PageLoadFallback } from "@/components/seo";
import { MainLayout } from "@/layouts";
import { HomePage } from "@/pages/HomePage";
import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const AddProjectPage = lazy(() =>
  import("@/pages/AddProjectPage").then((m) => ({ default: m.AddProjectPage }))
);
const BlogListPage = lazy(() =>
  import("@/pages/BlogListPage").then((m) => ({ default: m.BlogListPage }))
);
const BlogPostPage = lazy(() =>
  import("@/pages/BlogPostPage").then((m) => ({ default: m.BlogPostPage }))
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
);
const ProjectDetailPage = lazy(() =>
  import("@/pages/ProjectDetailPage").then((m) => ({ default: m.ProjectDetailPage }))
);
const ResumePage = lazy(() =>
  import("@/pages/ResumePage").then((m) => ({ default: m.ResumePage }))
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoadFallback />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="add-project" element={<AddProjectPage />} />
            <Route path="projects/:projectId" element={<ProjectDetailPage />} />
            <Route path="blog" element={<BlogListPage />} />
            <Route path="blog/:slug" element={<BlogPostPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
