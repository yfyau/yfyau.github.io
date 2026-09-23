import React, { Suspense, lazy } from "react";
import App from "./App";

const PortfolioV2 = lazy(() => import("./v2/PortfolioV2"));

export function getSiteVersion(search) {
  return new URLSearchParams(search).get("version") === "1" ? 1 : 2;
}

class PreviewBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? (
      <main style={{ padding: "2rem" }}>
        <h1>The site could not load.</h1>
        <p><a href="/">Retry</a> or <a href="/?version=1">view the previous version</a>.</p>
      </main>
    ) : this.props.children;
  }
}

export default function SiteVersion() {
  if (getSiteVersion(window.location.search) !== 2) return <App />;

  return (
    <PreviewBoundary>
      <Suspense fallback={<p role="status" style={{ padding: "2rem" }}>Loading site…</p>}>
        <PortfolioV2 />
      </Suspense>
    </PreviewBoundary>
  );
}
