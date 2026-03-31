import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section id="center" style={{ padding: "48px 24px" }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <p>
        <Link to="/">Back home</Link>
      </p>
    </section>
  );
}
