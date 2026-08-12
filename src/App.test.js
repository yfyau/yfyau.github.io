import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import App from "./App";

const installIntersectionObserverMock = () => {
  const original = window.IntersectionObserver;
  const instances = [];

  window.IntersectionObserver = jest.fn((callback, options) => {
    const observer = {
      callback,
      options,
      observe: jest.fn(),
      disconnect: jest.fn(),
    };
    instances.push(observer);
    return observer;
  });

  return {
    instances,
    restore() {
      window.IntersectionObserver = original;
    },
  };
};

it("renders the selected Playful hero and keeps career detail in Experience", () => {
  const container = document.createElement("div");
  ReactDOM.render(<App />, container);

  expect(container.textContent).toContain("I build software");
  expect(container.textContent).toContain("that holds up.");
  expect(container.querySelector("#hero-title").textContent).toBe(
    "I build software that holds up."
  );
  expect(container.querySelector(".hero-name").textContent).toBe("Jason Yau");
  expect(container.querySelector(".hero-title-block").textContent).not.toContain(
    "Senior Software Engineer at Okta since Jul 2025"
  );
  expect(container.querySelector(".hero-intro").textContent).toBe(
    "I turn ambiguous product, platform, and mobile problems into reliable production systems."
  );
  expect(container.querySelector(".hero-intro").textContent).not.toContain(
    "I’m Jason"
  );
  expect(container.querySelector("#experience-title").textContent).toBe("Experience.");
  expect(container.querySelector(".experience-heading p")).toBeNull();
  expect(container.querySelector("#off-duty-title").textContent).toBe(
    "What keeps me moving."
  );
  expect(container.querySelector("#contact-title").textContent).toBe(
    "Have a difficult problem?"
  );
  expect(container.textContent).toContain("JUL 2025");
  expect(container.textContent).not.toContain("BrokerBay outcomes");
  expect(container.textContent).toContain("PubSub job reliability");
  expect(container.textContent).not.toContain("less RCA time");
  expect(container.textContent).not.toContain("faster diagnosis");
  const currentJob = container.querySelector(".current-job");
  expect(currentJob.textContent).toContain("NOW");
  expect(currentJob.textContent).toContain("JUL 2025 - PRESENT");
  expect(currentJob.textContent).toContain("Okta");
  expect(currentJob.textContent).toContain("Senior Software Engineer");
  expect(container.querySelector(".current-job-note")).toBeNull();
  expect(container.textContent).not.toContain(
    "Details stay brief while the role is current"
  );
  expect(container.textContent).toContain(
    "For product engineering or complex systems, email me directly."
  );
  expect(container.textContent).toContain("I turn ambiguous product, platform, and mobile problems");
  expect(container.textContent).toContain("Built mobile trading products and integrations");
  expect(container.textContent).not.toContain("from ambiguous problem to reliable production system");
  expect(container.textContent).not.toContain("then stayed for the");
  expect(container.textContent).not.toContain("trading-mobile");
  expect(container.textContent).not.toContain("hard systems");
  expect(container.textContent).not.toContain("Fresh domain, same person");
  expect(container.textContent).not.toContain("THE NEW HOME");
  expect(container.textContent).not.toContain("FIELD STUDY / 01");
  expect(container.textContent).not.toContain("CONTROLLED FLIGHT");
  expect(container.textContent).not.toContain("HONEYBEE / FLIGHT STUDY");
  expect(container.textContent).not.toContain("SELECTED WORK / OUTCOMES");
  expect(container.textContent).not.toContain("WIND / SNOW / PLAY");
  expect(container.textContent).not.toContain("OPEN CHANNEL");
  expect(container.textContent).not.toContain("One sound. Two meanings.");
  expect(container.textContent).not.toContain("My Chinese name includes");
  expect(container.textContent).not.toContain(
    "That shared sound is why the bee became my mark."
  );
  expect(container.querySelector(".identity-copy")).toBeNull();
  expect(container.textContent).not.toContain(
    "The bee stuck: focused, resilient, and built to work as part of something larger."
  );
  expect(container.textContent).toContain(
    "For product engineering or complex systems, email me directly. My public code is on GitHub."
  );
  expect(container.textContent).not.toContain(
    "email is the fastest route. GitHub has the longer trail."
  );
  expect(container.textContent).not.toContain("Wind in the name. Bee in the frame.");
  const footer = container.querySelector(".site-footer");
  const footerSpans = Array.from(footer.children).filter(
    (element) => element.tagName === "SPAN"
  );
  expect(footerSpans).toHaveLength(1);
  expect(footerSpans[0].textContent).toContain("Jason Yau");
  expect(footer.querySelector('a[href="#top"]').textContent).toBe("Back to top \u2191");
  expect(container.textContent).toContain(
    "Snowboarding, difficult games, and coffee."
  );
  expect(container.textContent).not.toContain("The bee comes from my name.");
  expect(container.querySelector(".identity-story")).toBeNull();
  expect(container.querySelector(".name-study")).toBeNull();
  expect(container.textContent).not.toContain("explain most of the rest");
  expect(container.textContent).not.toContain("something solid");
  expect(container.textContent).not.toContain("good technical conversation");
  expect(container.textContent).not.toContain("More than a job title.");
  expect(container.textContent).not.toContain("Snow and difficult games");
  expect(container.textContent).not.toContain("WHY THE BEE STAYS");
  expect(container.querySelector(".identity-kicker")).toBeNull();
  expect(container.textContent).not.toContain("ENGINEERED BY NATURE");
  expect(container.textContent).not.toContain("THE CONCISE VERSION");
  expect(container.textContent).not.toContain("A LITTLE MORE HUMAN");
  expect(container.textContent).not.toContain("Designed with intent");
  expect(container.querySelectorAll(".experience-item")).toHaveLength(5);
  expect(container.querySelector(".hero-proof")).toBeNull();
  const wordmarkImage = container.querySelector(".wordmark-mark img");
  expect(wordmarkImage.getAttribute("alt")).toBe("");
  expect(wordmarkImage.getAttribute("width")).toBe("460");
  expect(wordmarkImage.getAttribute("height")).toBe("460");
  expect(wordmarkImage.getAttribute("loading")).toBe("eager");
  expect(wordmarkImage.getAttribute("decoding")).toBe("async");
  expect(wordmarkImage.getAttribute("fetchpriority")).toBe("high");
  expect(container.querySelector(".css-bee")).toBeNull();
  expect(container.querySelector(".current-role-dot")).toBeNull();
  expect(container.querySelector(".section-index")).toBeNull();
  expect(container.querySelector(".current-job-mark")).toBeNull();
  expect(container.querySelector(".hero-mark")).toBeNull();
  expect(container.querySelector(".site-edition")).toBeNull();
  const linkedIn = container.querySelector(
    '.contact-link[href="https://www.linkedin.com/in/yfyau/"]'
  );
  expect(linkedIn.textContent).toContain("LinkedIn");
  expect(linkedIn.getAttribute("target")).toBe("_blank");
  expect(linkedIn.getAttribute("rel")).toBe("noopener noreferrer");
  expect(container.textContent).not.toMatch(/[—–·]/);

  ReactDOM.unmountComponentAtNode(container);
});

it("keeps the verified prior-role chronology explicit", () => {
  const container = document.createElement("div");
  ReactDOM.render(<App />, container);

  expect(
    Array.from(container.querySelectorAll(".experience-period"), (item) => item.textContent)
  ).toEqual(["2022 - 2025", "2020 - 2021", "2019 - 2020", "2019", "2017 - 2018"]);
  expect(
    Array.from(container.querySelectorAll(".experience-role h3"), (item) => item.textContent)
  ).toEqual([
    "Full-Stack Engineer",
    "Senior Programmer",
    "Software Engineer",
    "Business Services Officer",
    "Part-Time Software Engineer",
  ]);
  expect(
    Array.from(container.querySelectorAll(".experience-role p"), (item) => item.textContent)
  ).toEqual([
    "BrokerBay",
    "Hundsun Ayers",
    "Freelance",
    "Bank of East Asia",
    "Future Solutions Laboratory",
  ]);
  expect(
    Array.from(
      container.querySelectorAll(".experience-item--compact .experience-role h3"),
      (item) => item.textContent
    )
  ).toEqual([
    "Software Engineer",
    "Business Services Officer",
    "Part-Time Software Engineer",
  ]);
  expect(
    Array.from(container.querySelectorAll(".experience-item:not(.experience-item--compact)"))
  ).toHaveLength(2);
  expect(container.textContent).toContain(
    "Built RPA solutions with UiPath to automate internal workflows and documented requirements across departments."
  );
  expect(container.textContent).toContain(
    "Moved the KMB admin dashboard from PowerBuilder to React and built an HKUST course-review system with AngularJS."
  );
  expect(container.textContent).not.toContain("Early engineering chapters");
  expect(container.textContent).not.toContain("Future Solutions Lab / Bank of East Asia");

  ReactDOM.unmountComponentAtNode(container);
});

it("keeps the one-page navigation and personal mark semantic", () => {
  const container = document.createElement("div");
  ReactDOM.render(<App />, container);

  expect(container.querySelector(".skip-link").getAttribute("href")).toBe("#main-content");
  expect(container.querySelector("main").getAttribute("tabindex")).toBe("-1");

  const navigationLinks = Array.from(container.querySelectorAll(".site-nav a"));
  expect(navigationLinks.map((link) => link.getAttribute("href"))).toEqual([
    "#experience",
    "#off-duty",
    "#contact",
  ]);
  expect(navigationLinks.map((link) => link.textContent)).toEqual([
    "Experience",
    "About",
    "Contact",
  ]);

  const wordmarkMark = container.querySelector(".wordmark-mark");
  expect(wordmarkMark.tagName).toBe("SPAN");
  expect(wordmarkMark.getAttribute("aria-hidden")).toBe("true");
  expect(wordmarkMark.querySelector("img").getAttribute("src")).toBe(
    "/jason-bee-icon.png"
  );
  expect(container.querySelector(".hero-mark")).toBeNull();
  expect(container.querySelectorAll('.hero a[href="#experience"]')).toHaveLength(0);

  const heroActions = container.querySelectorAll(".hero-actions .action-link");
  expect(heroActions).toHaveLength(1);
  expect(heroActions[0].getAttribute("href")).toBe(
    "mailto:jason.yfyau@gmail.com"
  );
  expect(heroActions[0].textContent).toBe("Email Jason ↗");
  expect(heroActions[0].classList.contains("action-link--filled")).toBe(true);
  expect(container.textContent).not.toContain("View the track record");
  expect(container.textContent).not.toContain("Email me");

  expect(container.querySelector(".hero-proof")).toBeNull();

  const skillsRail = container.querySelector(".skill-rail");
  expect(skillsRail.tagName).toBe("ASIDE");
  expect(skillsRail.getAttribute("aria-labelledby")).toBe("skill-rail-title");
  expect(skillsRail.querySelector("#skill-rail-title").textContent).toBe(
    "CORE STRENGTHS"
  );

  const skillsList = skillsRail.querySelector("ul");
  expect(skillsList.getAttribute("aria-label")).toBe("Core technical strengths");
  expect(skillsList.hasAttribute("tabindex")).toBe(false);
  expect(skillsList.hasAttribute("aria-describedby")).toBe(false);
  expect(container.querySelector("#skill-rail-hint")).toBeNull();

  const interests = container.querySelector(".off-clock");
  expect(interests.getAttribute("role")).toBe("list");
  expect(interests.querySelectorAll('[role="listitem"]')).toHaveLength(3);
  expect(interests.querySelectorAll(".interest-art")).toHaveLength(3);
  interests.querySelectorAll(".interest-art").forEach((art) => {
    expect(art.getAttribute("aria-hidden")).toBe("true");
  });
  const interestImages = Array.from(interests.querySelectorAll(".interest-art img"));
  expect(interestImages.map((image) => image.getAttribute("src"))).toEqual([
    "/interest-snow-v3.webp",
    "/interest-sekiro-v1.webp",
    "/interest-coffee-v2.webp",
  ]);
  interestImages.forEach((image) => {
    expect(image.getAttribute("alt")).toBe("");
    expect(image.getAttribute("loading")).toBe("lazy");
    expect(image.getAttribute("decoding")).toBe("async");
  });
  expect(interests.textContent).toContain(
    "I ride a snowboard. A clean line is reason enough for another run."
  );
  expect(interests.textContent).toContain(
    "Sekiro is my pick. Learning a hard boss is half the fun."
  );
  expect(interests.textContent).not.toContain("Mega Man");
  expect(interests.textContent).toContain(
    "Coffee is one of my favourite small rituals."
  );
  expect(interests.textContent).not.toContain("One board, cold air");
  expect(interests.textContent).not.toContain("Pattern, patience");
  expect(container.querySelectorAll('div[aria-label]:not([role])')).toHaveLength(0);

  const githubLink = container.querySelector('a[href="https://github.com/yfyau"]');
  expect(githubLink.getAttribute("target")).toBe("_blank");
  expect(githubLink.getAttribute("rel")).toBe("noopener noreferrer");

  ReactDOM.unmountComponentAtNode(container);
});

it("renders every core strength as static scannable content", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    ReactDOM.render(<App />, container);
  });

  const skillsList = container.querySelector('[aria-label="Core technical strengths"]');
  expect(Array.from(skillsList.children).map((item) => item.textContent)).toEqual([
    "TypeScript",
    "Node.js",
    "React",
    "Distributed systems",
    "Kubernetes",
    "GCP",
    "Mobile",
    "Observability",
  ]);
  expect(skillsList.hasAttribute("tabindex")).toBe(false);
  expect(skillsList.hasAttribute("aria-describedby")).toBe(false);
  expect(container.querySelector("#skill-rail-hint")).toBeNull();

  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
});

it("marks the current reading location in the persistent navigation", () => {
  const intersectionMock = installIntersectionObserverMock();
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    ReactDOM.render(<App />, container);
  });

  const createBounds = (top, bottom) => ({
    top,
    bottom,
    height: bottom - top,
    left: 0,
    right: 320,
    width: 320,
  });
  const header = container.querySelector(".site-header");
  const experienceSection = container.querySelector("#experience");
  const aboutSection = container.querySelector("#off-duty");
  const contactSection = container.querySelector("#contact");

  header.getBoundingClientRect = jest.fn(() => createBounds(0, 77));
  experienceSection.getBoundingClientRect = jest.fn(() => createBounds(-500, 120));
  aboutSection.getBoundingClientRect = jest.fn(() => createBounds(120, 1200));
  contactSection.getBoundingClientRect = jest.fn(() => createBounds(1200, 2100));

  act(() => {
    window.dispatchEvent(new Event("resize"));
  });
  const readingObserver = intersectionMock.instances[intersectionMock.instances.length - 1];
  expect(readingObserver.observe).toHaveBeenCalledTimes(3);
  expect(readingObserver.options.root).toBeNull();
  expect(readingObserver.options.threshold).toBe(0);
  expect(readingObserver.options.rootMargin).toMatch(/^-\d+(?:\.\d+)?px 0px -\d+(?:\.\d+)?px 0px$/);
  act(() => readingObserver.callback([]));

  const navigationLinks = Array.from(container.querySelectorAll(".site-nav a"));
  expect(navigationLinks.map((link) => link.getAttribute("aria-current"))).toEqual([
    null,
    "location",
    null,
  ]);

  aboutSection.getBoundingClientRect.mockReturnValue(createBounds(-900, 90));
  contactSection.getBoundingClientRect.mockReturnValue(createBounds(90, 1000));
  act(() => readingObserver.callback([]));

  expect(navigationLinks.map((link) => link.getAttribute("aria-current"))).toEqual([
    null,
    null,
    "location",
  ]);

  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
  expect(readingObserver.disconnect).toHaveBeenCalled();
  intersectionMock.restore();
});

it("marks an anchored section below the header in short landscape viewports", () => {
  const intersectionMock = installIntersectionObserverMock();
  const originalInnerHeight = Object.getOwnPropertyDescriptor(window, "innerHeight");
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: 320,
  });

  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    ReactDOM.render(<App />, container);
  });

  const createBounds = (top, bottom) => ({
    top,
    bottom,
    height: bottom - top,
    left: 0,
    right: 568,
    width: 568,
  });
  const header = container.querySelector(".site-header");
  const experienceSection = container.querySelector("#experience");
  const aboutSection = container.querySelector("#off-duty");
  const contactSection = container.querySelector("#contact");

  header.getBoundingClientRect = jest.fn(() => createBounds(0, 75));
  experienceSection.getBoundingClientRect = jest.fn(() => createBounds(93, 700));
  aboutSection.getBoundingClientRect = jest.fn(() => createBounds(700, 1200));
  contactSection.getBoundingClientRect = jest.fn(() => createBounds(1200, 1700));

  act(() => {
    window.dispatchEvent(new Event("resize"));
  });
  const readingObserver = intersectionMock.instances[intersectionMock.instances.length - 1];
  expect(readingObserver.options.rootMargin).toBe("-99px 0px -220px 0px");
  act(() => readingObserver.callback([]));

  const navigationLinks = Array.from(container.querySelectorAll(".site-nav a"));
  expect(navigationLinks.map((link) => link.getAttribute("aria-current"))).toEqual([
    "location",
    null,
    null,
  ]);

  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
  Object.defineProperty(window, "innerHeight", originalInnerHeight);
  intersectionMock.restore();
});

it("keeps anchor clearance aligned with a header that grows when text wraps", () => {
  const setProperty = jest.spyOn(document.documentElement.style, "setProperty");
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    ReactDOM.render(<App />, container);
  });

  const header = container.querySelector(".site-header");
  header.getBoundingClientRect = jest.fn(() => ({
    top: 0,
    bottom: 244,
    height: 244,
    left: 0,
    right: 390,
    width: 390,
  }));

  act(() => {
    window.dispatchEvent(new Event("resize"));
  });

  expect(setProperty).toHaveBeenCalledWith("--header-offset", "260px");

  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
  expect(document.documentElement.style.getPropertyValue("--header-offset")).toBe("");
  setProperty.mockRestore();
});

it("moves focus to main content when the skip link is activated", () => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  ReactDOM.render(<App />, container);

  const click = new MouseEvent("click", { bubbles: true, cancelable: true });
  click.preventDefault();
  container.querySelector(".skip-link").dispatchEvent(click);

  expect(document.activeElement).toBe(container.querySelector("main"));

  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
});

it("returns to the hero and restores focus to the visible wordmark", () => {
  const originalMatchMedia = window.matchMedia;
  let reduceMotion = true;
  window.matchMedia = jest.fn(() => ({ matches: reduceMotion }));
  window.history.replaceState(null, "", "/#contact");
  const pushState = jest.spyOn(window.history, "pushState");

  const container = document.createElement("div");
  document.body.appendChild(container);
  ReactDOM.render(<App />, container);

  const hero = container.querySelector("#top");
  hero.scrollIntoView = jest.fn();
  const wordmark = container.querySelector(".wordmark");
  const footerLink = container.querySelector('.site-footer a[href="#top"]');

  act(() => {
    footerLink.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true })
    );
  });

  expect(window.location.hash).toBe("#top");
  expect(pushState).toHaveBeenCalledTimes(1);
  expect(document.activeElement).toBe(wordmark);
  expect(hero.scrollIntoView).toHaveBeenCalledWith({
    behavior: "auto",
    block: "start",
  });

  reduceMotion = false;
  act(() => {
    wordmark.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true })
    );
  });
  expect(pushState).toHaveBeenCalledTimes(1);
  expect(hero.scrollIntoView).toHaveBeenCalledTimes(2);
  expect(hero.scrollIntoView).toHaveBeenLastCalledWith({
    behavior: "smooth",
    block: "start",
  });
  expect(document.activeElement).toBe(wordmark);

  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
  window.history.replaceState(null, "", "/");
  pushState.mockRestore();
  window.matchMedia = originalMatchMedia;
});
