import { Container } from "@/components/layout/Container";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <Container className="py-16 text-center sm:py-24">
      <h1 className="text-4xl font-semibold text-foreground">404</h1>
      <p className="mx-auto mt-4 max-w-md text-muted">Page not found.</p>
      <p className="mt-8">
        <Link
          to="/"
          className="font-medium text-accent underline-offset-4 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Back home
        </Link>
      </p>
    </Container>
  );
}
