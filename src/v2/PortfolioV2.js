import React, { useEffect, useRef, useState } from "react";

import "./PortfolioV2.css";

const MascotAvatar = "/v2/mascot/bee-avatar.webp";
const HeroBee = "/v2/mascot/bee-coding.webp";

const interestAssets = {
  snowboarding: {
    src: "/v2/mascot/bee-snowboard.webp",
    alt: "A matte 3D bee snowboarding down a slope",
  },
  games: {
    src: "/v2/mascot/bee-shinobi.webp",
    alt: "A matte 3D bee in a rust-orange shinobi robe holding a katana",
  },
  coffee: {
    src: "/v2/mascot/bee-coffee.webp",
    alt: "A matte 3D bee pouring coffee",
  },
};

const INTEREST_TRANSITION_MS = 300;

const createInterestImage = (key) => ({
  key,
  ...interestAssets[key],
});

const prefersReducedMotion = () => (
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches
);

const sections = [
  { id: "top", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "off-duty", label: "About" },
  { id: "consulting", label: "Service" },
  { id: "contact", label: "Contact" },
];

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
  },
  {
    period: "2019",
    role: "Business Services Officer",
    company: "Bank of East Asia",
    summary:
      "Built RPA solutions with UiPath to automate internal workflows and documented requirements across departments.",
  },
  {
    period: "2017 - 2018",
    role: "Part-Time Software Engineer",
    company: "Future Solutions Laboratory",
    summary:
      "Moved the KMB admin dashboard from PowerBuilder to React and built an HKUST course-review system with AngularJS.",
  },
];

const interests = {
  snowboarding: {
    label: "Snowboard",
    heading: "Find the clean line.",
    copy: "Snowboarding is a clean line, cold air, and always one more run.",
  },
  games: {
    label: "Boss fights",
    heading: "One more attempt.",
    copy: "Sekiro is my signature pick. Learning a hard boss is half the fun.",
  },
  coffee: {
    label: "Coffee",
    heading: "A small ritual.",
    copy: "Coffee is one of my favourite small rituals.",
  },
};

const interestKeys = Object.keys(interests);

function PortfolioV2() {
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === "undefined") return "top";
    const hash = window.location.hash.replace(/^#/, "");
    return sections.some((section) => section.id === hash) ? hash : "top";
  });
  const [selectedInterest, setSelectedInterest] = useState("snowboarding");
  const [interestImage, setInterestImage] = useState(() => ({
    visible: createInterestImage("snowboarding"),
    incoming: null,
    phase: "idle",
  }));
  const rootRef = useRef(null);
  const mainRef = useRef(null);
  const interestTransitionTimerRef = useRef(null);
  const selected = interests[selectedInterest];

  const clearInterestTransitionTimer = () => {
    if (interestTransitionTimerRef.current !== null) {
      window.clearTimeout(interestTransitionTimerRef.current);
      interestTransitionTimerRef.current = null;
    }
  };

  useEffect(() => () => {
    clearInterestTransitionTimer();
  }, []);

  useEffect(() => {
    if (interestImage.phase !== "entering" || !interestImage.incoming) return undefined;

    const transitionKey = interestImage.incoming.key;
    interestTransitionTimerRef.current = window.setTimeout(() => {
      setInterestImage((current) => {
        if (
          current.phase !== "entering" ||
          !current.incoming ||
          current.incoming.key !== transitionKey
        ) {
          return current;
        }
        return {
          visible: current.incoming,
          incoming: null,
          phase: "idle",
        };
      });
      interestTransitionTimerRef.current = null;
    }, INTEREST_TRANSITION_MS);

    return clearInterestTransitionTimer;
  }, [interestImage.phase, interestImage.incoming]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const sectionElements = sections
      .map((section) => root.querySelector(`#${section.id}`))
      .filter(Boolean);
    const header = root.querySelector(".v2-header");
    let observer = null;
    const getReadingLine = () => Math.min(
      Math.max(header.getBoundingClientRect().height + 24, window.innerHeight * 0.28),
      window.innerHeight - 1
    );
    const markVisibleSection = () => {
      const line = getReadingLine();
      const current = sectionElements.find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= line && rect.bottom > line;
      });
      if (current) setActiveSection(current.id);
    };
    const updateLayout = () => {
      root.style.setProperty("--v2-header-offset", `${header.getBoundingClientRect().height + 16}px`);
      if (observer) observer.disconnect();
      markVisibleSection();
      if (window.IntersectionObserver) {
        const line = getReadingLine();
        observer = new window.IntersectionObserver(markVisibleSection, {
          rootMargin: `-${Math.max(0, line - 4)}px 0px -${Math.max(0, window.innerHeight - line)}px 0px`,
          threshold: 0,
        });
        sectionElements.forEach((section) => observer.observe(section));
      }
    };
    updateLayout();
    const resizeObserver = window.ResizeObserver ? new window.ResizeObserver(updateLayout) : null;
    if (resizeObserver) resizeObserver.observe(header);
    window.addEventListener("resize", updateLayout);
    const target = sectionElements.find((section) => `#${section.id}` === window.location.hash);
    const frame = target && target.scrollIntoView ? window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    }) : null;
    return () => {
      if (observer) observer.disconnect();
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayout);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  const focusMainContent = (event) => {
    event.preventDefault();
    if (mainRef.current) mainRef.current.focus();
  };

  const handleNavClick = (id) => {
    setActiveSection(id);
  };

  const handleInterestSelect = (key) => {
    setSelectedInterest(key);
    clearInterestTransitionTimer();

    setInterestImage((current) => {
      const currentImage = current.phase === "entering" && current.incoming
        ? current.incoming
        : current.visible;
      const nextImage = createInterestImage(key);

      if (
        prefersReducedMotion() ||
        (currentImage.key === key && currentImage.src === nextImage.src)
      ) {
        return {
          visible: currentImage.key === key ? currentImage : nextImage,
          incoming: null,
          phase: "idle",
        };
      }

      return {
        visible: currentImage,
        incoming: nextImage,
        phase: "waiting",
      };
    });
  };

  const handleMascotImageError = (event) => {
    const image = event.currentTarget;
    if (
      image.dataset.mascotFallback === "true" ||
      image.getAttribute("src") === MascotAvatar
    ) return;
    image.dataset.mascotFallback = "true";
    image.src = MascotAvatar;
  };

  const handleInterestImageLoad = (key) => {
    setInterestImage((current) => {
      if (
        current.phase !== "waiting" ||
        !current.incoming ||
        current.incoming.key !== key
      ) {
        return current;
      }
      return { ...current, phase: "entering" };
    });
  };

  const handleInterestImageError = (event, key) => {
    const image = event.currentTarget;
    if (
      image.dataset.mascotFallback === "true" ||
      image.getAttribute("src") === MascotAvatar
    ) return;
    image.dataset.mascotFallback = "true";
    image.src = MascotAvatar;
    setInterestImage((current) => {
      const updateSource = (candidate) => (
        candidate && candidate.key === key
          ? { ...candidate, src: MascotAvatar }
          : candidate
      );
      return {
        ...current,
        visible: updateSource(current.visible),
        incoming: updateSource(current.incoming),
      };
    });
  };

  return (
    <div className="v2-site" ref={rootRef}>
      <a className="v2-skip-link" href="#v2-main-content" onClick={focusMainContent}>
        Skip to content
      </a>

      <header className="v2-header">
        <a className="v2-wordmark" href="#top" aria-label="Jason Yau, back to top" onClick={() => handleNavClick("top")}>
          <span className="v2-wordmark-mark" aria-hidden="true">
            <img src={MascotAvatar} alt="" width="256" height="256" />
          </span>
          <span>Jason Yau</span>
        </a>

        <nav className="v2-nav" aria-label="Primary navigation">
          {sections.map((section) => (
            <a
              href={`#${section.id}`}
              key={section.id}
              aria-current={activeSection === section.id ? "location" : undefined}
              onClick={() => handleNavClick(section.id)}
            >
              {section.label}
            </a>
          ))}
        </nav>

      </header>

      <main id="v2-main-content" ref={mainRef} tabIndex="-1">
        <section className="v2-hero" id="top" aria-labelledby="v2-hero-title">
          <div className="v2-hero-copy">
            <p className="v2-eyebrow">A CURIOUS MIND. A STUBBORN STREAK.</p>
            <h1 id="v2-hero-title">
              Hi, I’m Jason<span className="v2-title-dot">.</span>
            </h1>
            <p className="v2-hero-lead">
              Software engineer, persistent problem solver, and the person bugs keep finding.
            </p>
            <div className="v2-hero-actions">
              <a className="v2-button v2-button--ink" href="#experience">
                My experience <span aria-hidden="true">↘</span>
              </a>
              <a className="v2-text-link" href="mailto:jason.yfyau@gmail.com">
                Email Jason <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>

          <div className="v2-hero-visual">
            <div className="v2-hero-sun" aria-hidden="true" />
            <div className="v2-hero-art">
              <img
                src={HeroBee}
                alt="A matte 3D bee coding at a laptop"
                width="960"
                height="960"
                loading="eager"
                fetchpriority="high"
                onError={handleMascotImageError}
              />
            </div>
          </div>
        </section>

        <section className="v2-experience v2-section" id="experience" aria-labelledby="v2-experience-title">
          <div className="v2-section-intro">
            <h2 id="v2-experience-title">Experience.</h2>
            <p>
              From mobile products to distributed systems, I like figuring out how the pieces fit together.
            </p>
          </div>

          <article className="v2-current-role">
            <div className="v2-current-role-topline">
              <span>NOW</span>
              <span>JUL 2025 → PRESENT</span>
            </div>
            <div className="v2-current-role-main">
              <span className="v2-current-role-company">Okta</span>
              <h3>Senior Software Engineer</h3>
            </div>
          </article>

          <div className="v2-career-list" aria-label="Previous experience">
            {experience.map((job) => (
              <details className="v2-career-item" key={`${job.company}-${job.period}`}>
                <summary>
                  <span className="v2-career-period">{job.period}</span>
                  <span className="v2-career-role">
                    <strong>{job.role}</strong>
                    <em>{job.company}</em>
                  </span>
                  <span className="v2-career-toggle" aria-hidden="true">+</span>
                </summary>
                <div className="v2-career-detail">
                  <p>{job.summary}</p>
                  {job.outcomes && job.outcomes.length > 0 ? (
                    <ul>
                      {job.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                    </ul>
                  ) : null}
                </div>
              </details>
            ))}
          </div>

          <p className="v2-education">B.E. Computer Engineering · Hong Kong University of Science and Technology · 2019</p>
        </section>

        <section className="v2-about v2-section" id="off-duty" aria-labelledby="v2-about-title">
          <div className="v2-about-intro">
            <h2 id="v2-about-title">Away from the keyboard.</h2>
            <p>Three reliable ways to reset the brain. Choose your own adventure.</p>
          </div>

          <div className="v2-interest-layout">
            <div className="v2-interest-tabs" role="group" aria-label="Interests outside work">
              {interestKeys.map((key) => (
                <button
                  className={`v2-interest-tab v2-interest-tab--${key}`}
                  key={key}
                  type="button"
                  aria-pressed={selectedInterest === key}
                  onClick={() => handleInterestSelect(key)}
                >
                  <span>{interests[key].label}</span>
                  <span aria-hidden="true">{selectedInterest === key ? "✓" : ""}</span>
                </button>
              ))}
            </div>

            <article className={`v2-interest-story v2-interest-story--${selectedInterest}`} aria-live="polite">
              <div className="v2-interest-art">
                <img
                  key={`visible-${interestImage.visible.key}-${interestImage.visible.src}`}
                  className={`v2-interest-art-image v2-interest-art-image--visible${interestImage.incoming && interestImage.phase === "entering" ? " v2-interest-art-image--leaving" : ""}`}
                  src={interestImage.visible.src}
                  alt={interestImage.incoming ? "" : interestImage.visible.alt}
                  aria-hidden={interestImage.incoming ? "true" : undefined}
                  width="768"
                  height="768"
                  loading="lazy"
                  onError={(event) => handleInterestImageError(event, interestImage.visible.key)}
                />
                {interestImage.incoming ? (
                  <img
                    key={`incoming-${interestImage.incoming.key}-${interestImage.incoming.src}`}
                    className={`v2-interest-art-image v2-interest-art-image--incoming${interestImage.phase === "entering" ? " v2-interest-art-image--ready" : ""}`}
                    src={interestImage.incoming.src}
                    alt={interestImage.incoming.alt}
                    width="768"
                    height="768"
                    loading="lazy"
                    onLoad={() => handleInterestImageLoad(interestImage.incoming.key)}
                    onError={(event) => handleInterestImageError(event, interestImage.incoming.key)}
                  />
                ) : null}
              </div>
              <div className="v2-interest-copy">
                <h3>{selected.heading}</h3>
                <p>{selected.copy}</p>
              </div>
            </article>
          </div>
        </section>

        <section className="v2-service v2-section" id="consulting" aria-labelledby="v2-service-title">
          <div className="v2-service-intro">
            <p className="v2-eyebrow">CONSULTING</p>
            <h2 id="v2-service-title">Bring me the difficult part.</h2>
            <p>
              I help teams make their software and data more dependable, simplify repetitive work, and turn mobile ideas into useful products. We start by understanding the problem and work toward a result people can use.
            </p>
          </div>

          <div className="v2-service-grid">
            <article className="v2-service-offer v2-service-offer--reliability" id="systems-data-reliability">
              <h3>Systems &amp; Data Reliability Review</h3>
              <p>If your systems or data keep causing disruption, I review where things go wrong and give you a clear, prioritized plan to make them more dependable.</p>
              <ul><li>Find weak points</li><li>Reduce disruption</li><li>Clear action plan</li></ul>
            </article>
            <article className="v2-service-offer v2-service-offer--workflow" id="workflow-automation">
              <h3>Workflow Automation</h3>
              <p>I map and automate repetitive, error-prone tasks so your team spends less time on manual steps and has a smoother way to work.</p>
              <ul><li>Save time</li><li>Reduce manual errors</li><li>Smoother handoffs</li></ul>
            </article>
            <article className="v2-service-offer v2-service-offer--mobile" id="mobile-app-development">
              <h3>Mobile Application Development</h3>
              <p>I take mobile app ideas from discovery to launch by understanding users and their pain points, shaping an intuitive experience, and building a product that fits their needs.</p>
              <ul><li>Understand users</li><li>Design the experience</li><li>Build &amp; launch</li></ul>
            </article>
          </div>

          <div className="v2-debug-note">
            <p className="v2-debug-note-mark" aria-hidden="true">↳</p>
            <div>
              <h3>Bugs keep finding me. I’ve learned to return the favour.</h3>
              <p>
                Years of odd failures and production surprises trained me to look past the obvious symptom, uncover hidden risks, and improve the whole system’s consistency.
              </p>
            </div>
            <a className="v2-button v2-button--yellow" href="mailto:jason.yfyau@gmail.com">
              Email Jason <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className="v2-contact v2-section" id="contact" aria-labelledby="v2-contact-title">
          <div className="v2-contact-copy">
            <h2 id="v2-contact-title">Got a tricky one?</h2>
            <p>Tell me what you’re working on, what’s getting stuck, and where you’d like a second pair of eyes.</p>
          </div>
          <div className="v2-contact-links">
            <a href="mailto:jason.yfyau@gmail.com"><span>Email</span><strong>jason.yfyau@gmail.com</strong><span aria-hidden="true">↗</span></a>
            <a href="https://github.com/yfyau" target="_blank" rel="noopener noreferrer"><span>GitHub</span><strong>github.com/yfyau</strong><span aria-hidden="true">↗</span></a>
            <a href="https://www.linkedin.com/in/yfyau/" target="_blank" rel="noopener noreferrer"><span>LinkedIn</span><strong>linkedin.com/in/yfyau</strong><span aria-hidden="true">↗</span></a>
          </div>
          <footer className="v2-footer">
            <span>© {new Date().getFullYear()} Jason Yau</span>
            <a href="#top" onClick={() => handleNavClick("top")}>Back to top ↑</a>
          </footer>
        </section>
      </main>
    </div>
  );
}

export default PortfolioV2;
