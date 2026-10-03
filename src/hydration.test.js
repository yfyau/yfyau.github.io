import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import { act } from "react-dom/test-utils";
import SiteVersion from "./SiteVersion";

it.each(["/", "/#consulting", "/#contact"])("hydrates the same initial homepage at %s without replacing it", (url) => {
  const previousUrl = window.location.pathname + window.location.search + window.location.hash;
  const container = document.createElement("div");
  // An older build year must match the first client render, even after New Year.
  const initialYear = 2000;
  container.innerHTML = ReactDOMServer.renderToString(<SiteVersion initialYear={initialYear} />);
  document.body.appendChild(container);
  const main = container.querySelector("main");
  const heading = container.querySelector("h1");
  const errors = jest.spyOn(console, "error").mockImplementation(() => {});
  const warnings = jest.spyOn(console, "warn").mockImplementation(() => {});

  try {
    window.history.replaceState({}, "", url);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(heading.textContent).toBe("Hi, I’m Jason Yau.");
    expect(container.querySelector(".v2-hero-lead").textContent.trim()).toBe("The person bugs keep finding.");
    expect(container.querySelector("#experience .v2-section-intro p").textContent).toContain("I’m a Toronto-based software engineer and consultant.");
    expect(container.textContent).toContain("2000 Jason Yau");
    expect(container.querySelectorAll('.v2-service-detail-link[href^="/services/"]')).toHaveLength(3);
    expect(container.querySelector('a[href="mailto:jason.yfyau@gmail.com"]')).not.toBeNull();

    act(() => { ReactDOM.hydrate(<SiteVersion initialYear={initialYear} />, container); });

    expect(container.querySelector("main")).toBe(main);
    expect(container.querySelector("h1")).toBe(heading);
    expect(container.querySelectorAll("main")).toHaveLength(1);
    expect(container.textContent).toContain(new Date().getFullYear() + " Jason Yau");
    const coffee = container.querySelectorAll(".v2-interest-tab")[2];
    act(() => { coffee.dispatchEvent(new MouseEvent("click", { bubbles: true })); });
    expect(coffee.getAttribute("aria-pressed")).toBe("true");
    expect(container.querySelector(".v2-interest-copy").textContent).toContain("A small ritual.");
    expect(errors).not.toHaveBeenCalled();
    expect(warnings).not.toHaveBeenCalled();
  } finally {
    act(() => { ReactDOM.unmountComponentAtNode(container); });
    container.remove();
    window.history.replaceState({}, "", previousUrl);
    errors.mockRestore();
    warnings.mockRestore();
  }
});
