import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main-content" className="frame docs-loading">
      <h1 className="doc-title">Document not found</h1>
      <p className="docs-lead">
        This page may have moved. Browse the reference to find the current
        document.
      </p>
      <Link href="/docs" className="primary-button">
        Browse documentation
      </Link>
    </main>
  );
}
