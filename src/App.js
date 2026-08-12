import React, { useLayoutEffect, useRef, useState } from "react";

import "./App.css";

const PersonalBeeIcon = "/jason-bee-icon.png";
const InterestSnow = "/interest-snow-v3.webp";
const InterestBoss = "/interest-sekiro-v1.webp";
const InterestCoffee = "/interest-coffee-v2.webp";

const experience = [
  {
    period: "2022 - 2025",
    role: "Full-Stack Engineer",
    company: "BrokerBay",
    summary:
      "Owned product and platform work across web, mobile, distributed processing, and developer experience.",
    outcomes: [
      "Improved PubSub job reliability from 99% to 99.99% while supporting more than 4.5 million daily events.",
      "Built tracing with New Relic that cut root-cause analysis time by 50%.",
      "Moved parallel test runners to GCP and reduced CI cost by 20%.",
    ],
  },
  {
    period: "2020 - 2021",
    role: "Senior Programmer",
    company: "Hundsun Ayers",
    summary:
      "Built mobile trading products and integrations across Flutter, Android, WebSocket, SAML, and CI/CD.",
    outcomes: [
      "Re-architected a stock-trading app and improved render frame rate by 55%.",
      "Delivered secure mobile features and backend integrations for brokerage products.",
    ],
  },
  {
    period: "2019 - 2020",
    role: "Software Engineer",
    company: "Freelance",
    summary:
      "Developed MERN mobile products and modernized the KMB Duty Registration System.",
    outcomes: [],
  },
  {
    period: "2019",
    role: "Business Services Officer",
    company: "Bank of East Asia",
    summary:
      "Built RPA solutions with UiPath to automate internal workflows and documented requirements across departments.",
    outcomes: [],
  },
  {
    period: "2017 - 2018",
    role: "Part-Time Software Engineer",
    company: "Future Solutions Laboratory",
    summary:
      "Moved the KMB admin dashboard from PowerBuilder to React and built an HKUST course-review system with AngularJS.",
    outcomes: [],
  },
];

const skills = [
  "TypeScript",
  "Node.js",
  "React",
  "Distributed systems",
  "Kubernetes",
  "GCP",
  "Mobile",
  "Observability",
];

function PortfolioSite() {
  const [activeSection, setActiveSection] = useState("");
  const wordmarkRef = useRef(null);

  useLayoutEffect(() => {
    const header = document.querySelector(".site-header");
    const root = document.documentElement;
    const sections = ["experience", "off-duty", "contact"]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!header || sections.length === 0) return undefined;

    let sectionObserver = null;

    const updateHeaderOffset = () => {
      const headerHeight = Math.ceil(header.getBoundingClientRect().height);
      root.style.setProperty("--header-offset", `${headerHeight + 16}px`);
    };

    const getReadingLine = () => {
      const headerBottom = header.getBoundingClientRect().bottom;
      const preferredLine = Math.max(headerBottom + 24, window.innerHeight * 0.28);
      return Math.min(preferredLine, Math.max(0, window.innerHeight - 1));
    };

    const updateActiveSection = () => {
      const readingLine = getReadingLine();
      const currentSection = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.height > 0 && bounds.top <= readingLine && bounds.bottom > readingLine;
      });
      const nextSection = currentSection ? currentSection.id : "";

      setActiveSection((current) => (current === nextSection ? current : nextSection));
    };

    const observeReadingLine = () => {
      if (sectionObserver) sectionObserver.disconnect();
      updateActiveSection();
      if (!window.IntersectionObserver) return;

      const readingLine = getReadingLine();
      const bottomInset = Math.max(0, window.innerHeight - readingLine - 1);
      sectionObserver = new window.IntersectionObserver(updateActiveSection, {
        root: null,
        rootMargin: `-${readingLine}px 0px -${bottomInset}px 0px`,
        threshold: 0,
      });
      sections.forEach((section) => sectionObserver.observe(section));
    };

    const updateLayoutState = () => {
      updateHeaderOffset();
      observeReadingLine();
    };

    updateLayoutState();
    const headerObserver = window.ResizeObserver
      ? new window.ResizeObserver(updateLayoutState)
      : null;
    if (headerObserver) headerObserver.observe(header);

    const hashTarget = sections.find((section) => `#${section.id}` === window.location.hash);
    const alignmentFrame = hashTarget && typeof hashTarget.scrollIntoView === "function"
      ? window.requestAnimationFrame(() => {
          hashTarget.scrollIntoView({ behavior: "auto", block: "start" });
        })
      : null;

    window.addEventListener("resize", updateLayoutState);

    return () => {
      window.removeEventListener("resize", updateLayoutState);
      if (headerObserver) headerObserver.disconnect();
      if (sectionObserver) sectionObserver.disconnect();
      if (alignmentFrame !== null) window.cancelAnimationFrame(alignmentFrame);
      root.style.removeProperty("--header-offset");
    };
  }, []);

  const focusMainContent = () => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) mainContent.focus();
  };

  const returnToTop = (event) => {
    event.preventDefault();
    const heroSection = document.getElementById("top");
    const wordmark = wordmarkRef.current;
    if (!heroSection || !wordmark) return;

    const prefersReducedMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (window.location.hash !== "#top") {
      window.history.pushState(null, "", "#top");
    }
    wordmark.focus({ preventScroll: true });
    heroSection.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content" onClick={focusMainContent}>
        Skip to content
      </a>

      <header className="site-header">
        <a
          ref={wordmarkRef}
          className="wordmark"
          href="#top"
          aria-label="Jason Yau, back to top"
          onClick={returnToTop}
        >
          <span className="wordmark-mark" aria-hidden="true">
            <img
              src={PersonalBeeIcon}
              alt=""
              width="460"
              height="460"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
          </span>
          <span className="wordmark-name">Jason Yau</span>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a
            href="#experience"
            aria-current={activeSection === "experience" ? "location" : undefined}
          >
            Experience
          </a>
          <a
            href="#off-duty"
            aria-current={activeSection === "off-duty" ? "location" : undefined}
          >
            About
          </a>
          <a
            href="#contact"
            aria-current={activeSection === "contact" ? "location" : undefined}
          >
            Contact
          </a>
        </nav>
      </header>

      <main id="main-content" tabIndex="-1">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-title-block">
            <p className="hero-name">Jason Yau</p>

            <h1 id="hero-title">
              I build software{" "}
              <span>that holds up.</span>
            </h1>
          </div>

          <div className="hero-body">
            <p className="hero-intro">
              I turn ambiguous product, platform, and mobile problems into
              reliable production systems.
            </p>

            <div className="hero-actions">
              <a className="action-link action-link--filled" href="mailto:jason.yfyau@gmail.com">
                Email Jason <span aria-hidden="true">{"\u2197"}</span>
              </a>
            </div>
          </div>
        </section>

        <aside className="skill-rail" aria-labelledby="skill-rail-title">
          <span className="skill-rail-label" id="skill-rail-title">CORE STRENGTHS</span>
          <ul aria-label="Core technical strengths">
            {skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </aside>

        <section className="experience section-pad" id="experience" aria-labelledby="experience-title">
          <div className="section-heading experience-heading">
            <h2 id="experience-title">Experience.</h2>
          </div>

          <article className="current-job">
            <div className="current-job-label">
              <span>NOW</span>
              <span>JUL 2025 - PRESENT</span>
            </div>
            <div className="current-job-title">
              <p className="current-job-company">Okta</p>
              <h3>Senior Software Engineer</h3>
            </div>
          </article>

          <div className="experience-list">
            {experience.map((job) => (
              <article
                className={`experience-item${
                  job.outcomes.length === 0 ? " experience-item--compact" : ""
                }`}
                key={`${job.company}-${job.period}`}
              >
                <p className="experience-period">{job.period}</p>
                <div className="experience-role">
                  <h3>{job.role}</h3>
                  <p>{job.company}</p>
                </div>
                <div className="experience-detail">
                  <p>{job.summary}</p>
                  {job.outcomes.length > 0 && (
                    <ul>
                      {job.outcomes.map((outcome) => (
                        <li key={outcome}>{outcome}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="education-note">
            <span>EDUCATION</span>
            <p>B.E. Computer Engineering</p>
            <p>Hong Kong University of Science and Technology, 2019</p>
          </div>
        </section>

        <section className="off-duty section-pad" id="off-duty" aria-labelledby="off-duty-title">
          <div className="section-heading off-duty-heading">
            <h2 id="off-duty-title">What keeps me moving.</h2>
            <p>Snowboarding, difficult games, and coffee.</p>
          </div>

          <div className="off-clock" role="list" aria-label="Interests outside work">
            <article className="interest-card interest-card--snow" role="listitem">
              <div className="interest-art interest-art--snow" aria-hidden="true">
                <img
                  src={InterestSnow}
                  alt=""
                  width="1280"
                  height="853"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="interest-copy">
                <h3>Snowboarding</h3>
                <p>I ride a snowboard. A clean line is reason enough for another run.</p>
              </div>
            </article>
            <article className="interest-card interest-card--games" role="listitem">
              <div className="interest-art interest-art--games" aria-hidden="true">
                <img
                  src={InterestBoss}
                  alt=""
                  width="1280"
                  height="853"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="interest-copy">
                <h3>Boss fights</h3>
                <p>Sekiro is my pick. Learning a hard boss is half the fun.</p>
              </div>
            </article>
            <article className="interest-card interest-card--coffee" role="listitem">
              <div className="interest-art interest-art--coffee" aria-hidden="true">
                <img
                  src={InterestCoffee}
                  alt=""
                  width="1280"
                  height="853"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="interest-copy">
                <h3>Coffee</h3>
                <p>Coffee is one of my favourite small rituals.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="contact section-pad" id="contact" aria-labelledby="contact-title">
          <div className="section-heading contact-heading">
            <h2 id="contact-title">
              Have a difficult{" "}
              <span>problem?</span>
            </h2>
            <div className="contact-copy">
              <p>
                For product engineering or complex systems, email me directly.
                My public code is on GitHub.
              </p>
              <a className="contact-link" href="mailto:jason.yfyau@gmail.com">
                <span>Email</span>
                <strong>jason.yfyau@gmail.com</strong>
                <span aria-hidden="true">{"\u2197"}</span>
              </a>
              <a className="contact-link" href="https://github.com/yfyau" target="_blank" rel="noopener noreferrer">
                <span>GitHub</span>
                <strong>github.com/yfyau</strong>
                <span aria-hidden="true">{"\u2197"}</span>
              </a>
              <a className="contact-link" href="https://www.linkedin.com/in/yfyau/" target="_blank" rel="noopener noreferrer">
                <span>LinkedIn</span>
                <strong>linkedin.com/in/yfyau</strong>
                <span aria-hidden="true">{"\u2197"}</span>
              </a>
            </div>
          </div>

          <footer className="site-footer">
            <span>&copy; {new Date().getFullYear()} Jason Yau</span>
            <a href="#top" onClick={returnToTop}>Back to top &uarr;</a>
          </footer>
        </section>
      </main>
    </div>
  );
}

function App() {
  return <PortfolioSite />;
}

export default App;
