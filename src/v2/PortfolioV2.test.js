import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

import PortfolioV2 from "./PortfolioV2";

const renderV2 = () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    ReactDOM.render(<PortfolioV2 />, container);
  });
  return container;
};

const cleanup = (container) => {
  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
};

it("renders the v2 playful structure and all five destinations", () => {
  const container = renderV2();

  expect(container.querySelector(".v2-site")).not.toBeNull();
  expect(container.querySelector("#v2-hero-title").textContent).toBe("Hi, I’m Jason.");
  expect(container.textContent).toContain("Software engineer, persistent problem solver, and the person bugs keep finding.");
  expect(Array.from(container.querySelectorAll(".v2-nav a"), (link) => link.getAttribute("href"))).toEqual([
    "#top",
    "#experience",
    "#off-duty",
    "#consulting",
    "#contact",
  ]);
  expect(Array.from(container.querySelectorAll("main > section"), (section) => section.id)).toEqual([
    "top",
    "experience",
    "off-duty",
    "consulting",
    "contact",
  ]);
  expect(container.querySelector(".v2-compare-link").getAttribute("href")).toBe("/?version=1");
  expect(container.querySelector(".v2-wordmark-mark img").getAttribute("src")).toBe("/v2/mascot/bee-avatar.webp");
  expect(container.querySelector(".v2-hero-art img").getAttribute("src")).toBe("/v2/mascot/bee-coding.webp");
  expect(container.querySelector(".v2-hero-art img").getAttribute("loading")).toBe("eager");

  cleanup(container);
});

it("keeps the current Okta role truthful and older career details discoverable", () => {
  const container = renderV2();

  const currentRole = container.querySelector(".v2-current-role");
  expect(currentRole.textContent).toContain("Okta");
  expect(currentRole.textContent).toContain("Senior Software Engineer");
  expect(currentRole.textContent).toContain("JUL 2025");
  expect(currentRole.textContent).not.toContain("at Okta since Jul 2025");
  expect(container.querySelectorAll(".v2-career-item")).toHaveLength(5);
  expect(container.textContent).toContain("PubSub job reliability");
  expect(container.textContent).not.toContain("BrokerBay outcomes");

  const details = container.querySelector(".v2-career-item");
  expect(details.querySelector("summary")).not.toBeNull();
  expect(details.querySelector(".v2-career-detail")).not.toBeNull();

  cleanup(container);
});

it("switches the selected off-duty interest and its matching mascot art", () => {
  const container = renderV2();
  const buttons = Array.from(container.querySelectorAll(".v2-interest-tab"));
  const story = container.querySelector(".v2-interest-story");
  const getArt = () => container.querySelector('.v2-interest-art img:not([aria-hidden="true"])');

  expect(buttons).toHaveLength(3);
  expect(buttons.map((button) => button.getAttribute("aria-pressed"))).toEqual([
    "true",
    "false",
    "false",
  ]);
  expect(story.getAttribute("aria-live")).toBe("polite");
  expect(story.textContent).toContain("Find the clean line.");
  expect(getArt().getAttribute("src")).toBe("/v2/mascot/bee-snowboard.webp");
  expect(getArt().getAttribute("alt")).toContain("snowboarding");

  act(() => {
    buttons[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(buttons.map((button) => button.getAttribute("aria-pressed"))).toEqual([
    "false",
    "true",
    "false",
  ]);
  expect(story.textContent).toContain("One more attempt.");
  expect(story.textContent).toContain("Sekiro");
  expect(getArt().getAttribute("src")).toBe("/v2/mascot/bee-shinobi.webp");
  expect(getArt().getAttribute("alt")).toContain("shinobi robe");

  act(() => {
    buttons[2].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(buttons.map((button) => button.getAttribute("aria-pressed"))).toEqual([
    "false",
    "false",
    "true",
  ]);
  expect(story.textContent).toContain("A small ritual.");
  expect(getArt().getAttribute("src")).toBe("/v2/mascot/bee-coffee.webp");
  expect(getArt().getAttribute("alt")).toContain("pouring coffee");

  cleanup(container);
});

it("falls back once and remounts the next selected mascot after a load failure", () => {
  const container = renderV2();
  const buttons = Array.from(container.querySelectorAll(".v2-interest-tab"));
  const getArt = () => container.querySelector('.v2-interest-art img:not([aria-hidden="true"])');

  act(() => {
    getArt().dispatchEvent(new Event("error"));
  });

  expect(getArt().getAttribute("src")).toBe("/v2/mascot/bee-avatar.webp");

  act(() => {
    getArt().dispatchEvent(new Event("error"));
  });

  expect(getArt().getAttribute("src")).toBe("/v2/mascot/bee-avatar.webp");

  act(() => {
    buttons[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(getArt().getAttribute("src")).toBe("/v2/mascot/bee-shinobi.webp");

  act(() => {
    buttons[0].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(getArt().getAttribute("src")).toBe("/v2/mascot/bee-snowboard.webp");

  cleanup(container);
});

it("crossfades from the loaded outgoing art while keeping one accessible active image", () => {
  jest.useFakeTimers();
  const container = renderV2();
  const button = container.querySelectorAll(".v2-interest-tab")[1];

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  const outgoing = container.querySelector('.v2-interest-art img[aria-hidden="true"]');
  const incoming = container.querySelector('.v2-interest-art img:not([aria-hidden="true"])');
  expect(outgoing).not.toBeNull();
  expect(outgoing.getAttribute("alt")).toBe("");
  expect(incoming.getAttribute("src")).toBe("/v2/mascot/bee-shinobi.webp");
  expect(incoming.getAttribute("alt")).toContain("shinobi robe");
  expect(incoming.className).toContain("v2-interest-art-image--incoming");

  act(() => {
    incoming.dispatchEvent(new Event("load"));
  });

  expect(incoming.className).toContain("v2-interest-art-image--ready");

  act(() => {
    jest.advanceTimersByTime(300);
  });

  expect(container.querySelectorAll(".v2-interest-art img")).toHaveLength(1);
  expect(container.querySelector('.v2-interest-art img:not([aria-hidden="true"])').getAttribute("src")).toBe("/v2/mascot/bee-shinobi.webp");

  cleanup(container);
  jest.useRealTimers();
});

it("lets the latest rapid interest selection win", () => {
  const container = renderV2();
  const buttons = container.querySelectorAll(".v2-interest-tab");

  act(() => {
    buttons[1].dispatchEvent(new MouseEvent("click", { bubbles: true }));
    buttons[2].dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  expect(buttons[0].getAttribute("aria-pressed")).toBe("false");
  expect(buttons[1].getAttribute("aria-pressed")).toBe("false");
  expect(buttons[2].getAttribute("aria-pressed")).toBe("true");
  expect(container.querySelector(".v2-interest-story").textContent).toContain("A small ritual.");
  expect(container.querySelector('.v2-interest-art img:not([aria-hidden="true"])').getAttribute("src")).toBe("/v2/mascot/bee-coffee.webp");
  expect(container.querySelectorAll(".v2-interest-art img")).toHaveLength(2);
  expect(container.querySelector('.v2-interest-art img[aria-hidden="true"]').getAttribute("src")).toBe("/v2/mascot/bee-snowboard.webp");

  cleanup(container);
});

it("updates immediately without a lingering outgoing image when reduced motion is preferred", () => {
  const previousMatchMedia = window.matchMedia;
  window.matchMedia = () => ({
    matches: true,
    media: "(prefers-reduced-motion: reduce)",
    addListener: () => {},
    removeListener: () => {},
  });

  const container = renderV2();
  const button = container.querySelectorAll(".v2-interest-tab")[1];

  act(() => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  const active = container.querySelector('.v2-interest-art img:not([aria-hidden="true"])');
  expect(container.querySelectorAll(".v2-interest-art img")).toHaveLength(1);
  expect(active.getAttribute("src")).toBe("/v2/mascot/bee-shinobi.webp");
  expect(active.getAttribute("alt")).toContain("shinobi robe");

  cleanup(container);
  window.matchMedia = previousMatchMedia;
});

it("keeps contact routes functional and avoids invented proof", () => {
  const container = renderV2();

  expect(container.querySelector('a[href="mailto:jason.yfyau@gmail.com"]')).not.toBeNull();
  const github = container.querySelector('a[href="https://github.com/yfyau"]');
  const linkedin = container.querySelector('a[href="https://www.linkedin.com/in/yfyau/"]');
  expect(github.getAttribute("target")).toBe("_blank");
  expect(github.getAttribute("rel")).toBe("noopener noreferrer");
  expect(linkedin.getAttribute("target")).toBe("_blank");
  expect(linkedin.getAttribute("rel")).toBe("noopener noreferrer");
  expect(container.textContent).not.toContain("testimonials");
  expect(container.textContent).not.toContain("guaranteed");
  expect(container.querySelectorAll("h1")).toHaveLength(1);
  expect(container.querySelectorAll("h2")).toHaveLength(4);

  cleanup(container);
});
