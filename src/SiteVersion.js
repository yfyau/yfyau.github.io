import React from "react";
import PortfolioV2 from "./v2/PortfolioV2";

class SiteBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? (
      <main style={{ padding: "2rem" }}>
        <h1>The site could not load.</h1>
        <p><a href="/">Retry</a>.</p>
      </main>
    ) : this.props.children;
  }
}

export default function SiteVersion() {
  return (
    <SiteBoundary>
      <PortfolioV2 />
    </SiteBoundary>
  );
}
