import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import { expect, it, vi } from "vitest";
import SiteVersion from "./SiteVersion";

vi.mock("./v2/PortfolioV2", async () => {
  const ReactModule = await import("react");
  const React = ReactModule.default || ReactModule;
  return {
    default: function MockPortfolioV2() {
      return React.createElement("main", { "data-testid": "portfolio-v2" }, "V2 portfolio");
    },
  };
});

it.each(["/", "/?version=1"])("renders v2 at %s", (url) => {
  const previousUrl = window.location.pathname + window.location.search + window.location.hash;
  const container = document.createElement("div");
  document.body.appendChild(container);
  window.history.replaceState({}, "", url);

  act(() => {
    ReactDOM.render(<SiteVersion />, container);
  });

  expect(container.querySelector('[data-testid="portfolio-v2"]')).not.toBeNull();
  expect(container.textContent).not.toContain("previous version");

  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
  window.history.replaceState({}, "", previousUrl);
});
