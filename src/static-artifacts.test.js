import fs from "fs";
import path from "path";

const readProjectFile = (...segments) =>
  fs.readFileSync(path.join(process.cwd(), ...segments), "utf8");

const readPngDetails = (image) => {
  expect(image.toString("hex", 0, 8)).toBe("89504e470d0a1a0a");
  return {
    width: image.readUInt32BE(16),
    height: image.readUInt32BE(20),
    colorType: image[25],
  };
};

const readJpegDimensions = (image) => {
  expect(image.readUInt16BE(0)).toBe(0xffd8);

  let offset = 2;
  while (offset < image.length) {
    while (image[offset] === 0xff) offset += 1;
    const marker = image[offset];
    offset += 1;

    if (marker === 0xd9 || marker === 0xda) break;
    const segmentLength = image.readUInt16BE(offset);
    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (isStartOfFrame) {
      return {
        height: image.readUInt16BE(offset + 3),
        width: image.readUInt16BE(offset + 5),
      };
    }
    offset += segmentLength;
  }

  throw new Error("JPEG dimensions were not found");
};

const readWebpDimensions = (image) => {
  expect(image.toString("ascii", 0, 4)).toBe("RIFF");
  expect(image.toString("ascii", 8, 12)).toBe("WEBP");
  expect(image.toString("ascii", 12, 16)).toBe("VP8 ");
  expect(image.toString("hex", 23, 26)).toBe("9d012a");

  return {
    width: image.readUInt16LE(26) & 0x3fff,
    height: image.readUInt16LE(28) & 0x3fff,
  };
};

it("keeps the install identity encoding-safe and visually aligned", () => {
  const html = readProjectFile("public", "index.html");
  const manifest = JSON.parse(readProjectFile("public", "manifest.json"));
  const beeIcon = fs.readFileSync(
    path.join(process.cwd(), "public", "jason-bee-icon.png")
  );

  expect(manifest.short_name).toBe("Jason Yau");
  expect(manifest.name).toBe("Jason Yau | Senior Software Engineer");
  expect(manifest.background_color).toBe("#dcebf1");
  expect(manifest.theme_color).toBe("#dcebf1");
  expect(manifest.icons).toEqual([
    {
      src: "jason-bee-icon.png",
      sizes: "460x460",
      type: "image/png",
      purpose: "any",
    },
  ]);
  expect(manifest.name).not.toContain("??");
  expect(html).toContain('<meta name="theme-color" content="#dcebf1" />');
  expect(html).toContain(
    '<link rel="icon" type="image/png" sizes="460x460" href="%PUBLIC_URL%/jason-bee-icon.png" />'
  );
  expect(html).toContain(
    '<link rel="apple-touch-icon" href="%PUBLIC_URL%/jason-bee-icon.png" />'
  );
  expect(readPngDetails(beeIcon)).toEqual({
    width: 460,
    height: 460,
    colorType: 2,
  });
  ["favicon.svg", "favicon.ico", "apple-touch-icon.png", "icon-192.png", "icon-512.png"].forEach(
    (asset) => expect(fs.existsSync(path.join(process.cwd(), "public", asset))).toBe(false)
  );
});

it("keeps the Playful portfolio factual instead of performative", () => {
  const app = readProjectFile("src", "App.js");
  const css = readProjectFile("src", "App.css");
  const html = readProjectFile("public", "index.html");
  const visibleSources = `${app}\n${html}`;

  expect(visibleSources).not.toMatch(/[—–·]/);
  expect(visibleSources).not.toMatch(/&(?:m|n)dash;/);
  [
    "FIELD STUDY / 01",
    "CONTROLLED FLIGHT",
    "HONEYBEE / FLIGHT STUDY",
    "SELECTED WORK / OUTCOMES",
    "WIND / SNOW / PLAY",
    "OPEN CHANNEL",
    "WHY THE BEE STAYS",
    "01 / WINTER",
    "02 / GAMES",
    "YFYAU.COM / 02",
    "YFYAU.COM / ESSENTIALS",
  ].forEach((label) => expect(visibleSources).not.toContain(label));
  expect(app).not.toContain("site-edition");
  expect(css).not.toContain(".site-edition");
  expect(visibleSources).not.toContain(">YFYAU.COM<");
  expect(app).not.toContain('className="identity-kicker"');
  expect(app).not.toContain("View the track record");
  expect(app).not.toContain("Email me");
  expect(app).toContain("Email Jason");
  expect(app).not.toContain("BrokerBay outcomes");
  expect(app).toContain('href="https://www.linkedin.com/in/yfyau/"');
  expect(html).toContain('href="https://www.linkedin.com/in/yfyau/"');
  expect(app).not.toContain("proofPoints");
  expect(app).not.toContain("Prior-role track record");
  expect(app).toContain('<p className="hero-name">Jason Yau</p>');
  expect(app).not.toContain("Senior Software Engineer at Okta since Jul 2025");
  expect(app).toMatch(
    /className="hero-intro"[\s\S]*?I turn ambiguous product, platform, and mobile problems into[\s\S]*?reliable production systems\./
  );
  expect(app).not.toContain("I&rsquo;m Jason, a Senior Software Engineer at Okta");
  expect(css).toMatch(/\.hero\s*\{[^}]*background:\s*var\(--sky\);/s);
  expect(css).toMatch(
    /\.hero h1 span\s*\{[^}]*background:\s*linear-gradient\(transparent 62%, var\(--honey\) 62%\);/s
  );
  expect(app).not.toContain("One sound. Two meanings.");
  expect(app).not.toContain("My Chinese name includes");
  expect(app).not.toContain("That shared sound is why the bee became");
  expect(app).not.toContain('className="identity-copy"');
  expect(css).not.toContain(".identity-copy");
  expect(app).not.toContain("The bee stuck:");
  expect(app).not.toContain("The bee comes from my name.");
  expect(app).not.toContain('className="identity-story"');
  expect(app).not.toContain('className="name-study"');
  expect(css).not.toContain(".identity-story");
  expect(css).not.toContain(".name-study");
  expect(app).toContain(
    "For product engineering or complex systems, email me directly."
  );
  expect(app).toContain("My public code is on GitHub.");
  expect(app).toContain("What keeps me");
  expect(app).toContain("moving.");
  expect(app).toContain("Snowboarding, difficult games, and coffee.");
  expect(app).toContain("Have a difficult");
  expect(app).toContain("problem?");
  expect(app).toContain('<h2 id="experience-title">Experience.</h2>');
  expect(app).not.toContain("Frames to");
  expect(app).not.toContain("millions of events.");
  expect(app).not.toContain("Engineering that");
  expect(app).not.toContain("earns trust.");
  expect(app).not.toContain("explain most of the rest");
  expect(app).not.toContain("something solid");
  expect(app).not.toContain("good technical conversation");
  expect(app).not.toContain("fastest route");
  expect(app).not.toContain("longer trail");
  expect(app).not.toContain("Wind in the name. Bee in the frame.");
  expect(app).toContain(
    "I ride a snowboard. A clean line is reason enough for another run."
  );
  expect(app).toContain(
    "Sekiro is my pick. Learning a hard boss is half the fun."
  );
  expect(app).not.toContain("Mega Man");
  expect(app).not.toContain("One board, cold air");
  expect(app).not.toContain("Pattern, patience");
  [
    'role: "Business Services Officer"',
    'company: "Bank of East Asia"',
    'role: "Part-Time Software Engineer"',
    'company: "Future Solutions Laboratory"',
    'company: "Freelance"',
  ].forEach((fact) => expect(app).toContain(fact));
  expect(app).not.toContain("Early engineering chapters");
  expect(app).not.toContain("Future Solutions Lab / Bank of East Asia");
  expect(css).toMatch(
    /\.experience-list\s*\{[^}]*overflow:\s*hidden;[^}]*border:\s*2px solid var\(--ink\);[^}]*border-radius:\s*var\(--radius\);/s
  );
  expect(css).toMatch(
    /\.experience-item \+ \.experience-item\s*\{[^}]*border-top:\s*1px solid var\(--line\);/s
  );
  expect(app).toContain('job.outcomes.length === 0 ? " experience-item--compact" : ""');
  expect(css).toContain("--sky: #dcebf1;");
  expect(css).toContain("--honey: #f3c53b;");
  expect(css).toContain("--radius: 1.15rem;");
});

it("keeps the current-role poster factual and prominent", () => {
  const app = readProjectFile("src", "App.js");
  const css = readProjectFile("src", "App.css");

  ["NOW", "JUL 2025 - PRESENT", "Okta", "Senior Software Engineer"].forEach(
    (fact) => expect(app).toContain(fact)
  );
  expect(app).not.toContain("Details stay brief while the role is current");
  expect(app).not.toContain('className="current-job-note"');
  expect(css).not.toContain(".current-job-note");
  expect(css).toMatch(
    /\.current-job\s*\{[^}]*min-height:\s*19rem;[^}]*border:\s*2px solid var\(--ink\);[^}]*border-radius:\s*var\(--radius\);[^}]*background:\s*var\(--honey\);[^}]*box-shadow:\s*0\.45rem 0\.45rem 0 var\(--ink\);/s
  );
  expect(css).toMatch(
    /@media \(min-width: 48rem\)[\s\S]*?\.current-job\s*\{[^}]*grid-template-rows:\s*auto minmax\(0, 1fr\);[^}]*align-items:\s*stretch;[^}]*min-height:\s*22rem;/
  );
  expect(css).toMatch(
    /@media \(min-width: 48rem\)[\s\S]*?\.current-job-label\s*\{[^}]*grid-column:\s*1 \/ -1;[^}]*align-self:\s*start;/
  );
  expect(css).toMatch(
    /@media \(min-width: 48rem\)[\s\S]*?\.current-job-title\s*\{[^}]*grid-column:\s*1 \/ -1;[^}]*display:\s*grid;[^}]*grid-template-columns:\s*minmax\(0, 1fr\) minmax\(11rem, 0\.28fr\);[^}]*align-items:\s*end;/
  );
  expect(css).toMatch(
    /@media \(min-width: 48rem\)[\s\S]*?\.current-job h3\s*\{[^}]*justify-self:\s*end;[^}]*text-align:\s*right;/
  );
  expect(css).toMatch(
    /@media \(min-width: 64rem\)[\s\S]*?\.current-job\s*\{[^}]*min-height:\s*22rem;/
  );
  expect(css).not.toContain("min-height: 25rem;");
});

it("publishes a lightweight Playful social card at the declared dimensions", () => {
  const html = readProjectFile("public", "index.html");
  const socialCard = fs.readFileSync(
    path.join(process.cwd(), "public", "og-card-v3.png")
  );
  const dimensions = readPngDetails(socialCard);

  expect(html.match(/https:\/\/jason\.yfyau\.com\/og-card-v3\.png/g)).toHaveLength(2);
  expect(html).toContain('<meta property="og:image:type" content="image/png" />');
  expect(html).not.toContain('content="https://jason.yfyau.com/og-card.png"');
  expect(html).not.toContain('content="https://jason.yfyau.com/og-card-v2.png"');
  expect(html).not.toContain("og-card-v2.jpg");
  expect(fs.existsSync(path.join(process.cwd(), "public", "og-card.png"))).toBe(false);
  expect(fs.existsSync(path.join(process.cwd(), "public", "og-card-v2.jpg"))).toBe(false);
  expect(html).toContain('<meta property="og:image:width" content="960" />');
  expect(html).toContain('<meta property="og:image:height" content="504" />');
  expect(html.match(/Jason Yau: I build software that holds up/g)).toHaveLength(2);
  expect(dimensions).toEqual({ width: 960, height: 504, colorType: 6 });
  expect(socialCard.length).toBeLessThan(250000);
});

it("keeps useful identity and contact details available without JavaScript", () => {
  const html = readProjectFile("public", "index.html");
  const css = readProjectFile("src", "index.css");

  expect(html).toContain("<noscript>");
  expect(html).toContain('class="no-script-shell"');
  expect(html).toContain('class="no-script-monogram"');
  expect(html).toContain('src="%PUBLIC_URL%/jason-bee-icon.png"');
  expect(html).toContain("Jason Yau");
  expect(html).toContain("I build software");
  expect(html).toContain("that holds up.");
  expect(html).toContain("Senior Software Engineer at Okta");
  expect(html).toContain('href="mailto:jason.yfyau@gmail.com"');
  expect(html).toContain('href="https://github.com/yfyau"');
  expect(html).not.toContain("This site needs JavaScript enabled to run.");
  expect(css).toContain(".no-script-shell");
  expect(css).toContain("background: #dcebf1;");
  expect(css).toContain("#root:empty");
  expect(css).toMatch(
    /\.no-script-shell\s*\{[^}]*min-height:\s*100vh;[^}]*min-height:\s*100dvh;/s
  );
  expect(css).toMatch(
    /\.no-script-content h1 span\s*\{[^}]*background:\s*linear-gradient\(transparent 62%, #f3c53b 62%\);/s
  );
});

it("keeps the Playful type system native across major desktop and mobile platforms", () => {
  const appCss = readProjectFile("src", "App.css");
  const indexCss = readProjectFile("src", "index.css");

  expect(indexCss).toContain(
    '--font-serif: Constantia, ui-serif, "Iowan Old Style", "Palatino Linotype",'
  );
  expect(indexCss).toContain(
    '--font-mono: "Cascadia Mono", "Aptos Mono", ui-monospace,'
  );
  expect(indexCss).toContain('"SFMono-Regular", Menlo, Monaco, Consolas');
  expect(indexCss).toContain('"Liberation Mono", "Courier New",');
  expect(indexCss).toContain("font-family: var(--font-mono);");
  expect(indexCss).toContain('--font-sans: "Aptos Display", "Segoe UI Variable Display"');
  expect(indexCss.match(/font-family: var\(--font-sans\);/g)).toHaveLength(3);
  expect(appCss).toContain(
    '--sans: "Aptos Display", "Segoe UI Variable Display", "Trebuchet MS", Arial,'
  );
  expect(appCss).toContain("--mono: var(--font-mono);");
  expect(appCss).toContain("font-family: var(--sans);");
  expect(appCss).not.toContain("--serif:");
  expect(appCss).not.toContain("Constantia, Georgia, serif");
  expect(appCss).not.toContain(
    '"Cascadia Mono", "Aptos Mono", "Courier New", monospace'
  );
});

it("makes the supplied personal mark discoverable in the initial HTML", () => {
  const html = readProjectFile("public", "index.html");
  const app = readProjectFile("src", "App.js");
  const css = readProjectFile("src", "App.css");
  const personalMark = fs.readFileSync(
    path.join(process.cwd(), "public", "jason-bee-icon.png")
  );

  expect(html).toContain(
    '<link\n      rel="preload"\n      href="%PUBLIC_URL%/jason-bee-icon.png"\n      as="image"\n      type="image/png"\n      fetchpriority="high"\n    />'
  );
  expect(html.match(/jason-bee-icon\.png/g)).toHaveLength(4);
  expect(app).toContain('const PersonalBeeIcon = "/jason-bee-icon.png";');
  expect(readPngDetails(personalMark)).toEqual({
    width: 460,
    height: 460,
    colorType: 2,
  });
  expect(personalMark.length).toBeLessThan(250000);
  expect(app).toMatch(
    /className="wordmark-mark"[\s\S]*?src=\{PersonalBeeIcon\}[\s\S]*?width="460"[\s\S]*?height="460"/
  );
  expect(app).not.toContain('className="hero-mark"');
  expect(css).toMatch(
    /\.wordmark-mark img\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*object-fit:\s*cover;/s
  );
});

it("ships optimized imagery in an asymmetric Playful interest layout", () => {
  const app = readProjectFile("src", "App.js");
  const css = readProjectFile("src", "App.css");
  const snow = fs.readFileSync(
    path.join(process.cwd(), "public", "interest-snow-v3.webp")
  );
  const boss = fs.readFileSync(
    path.join(process.cwd(), "public", "interest-sekiro-v1.webp")
  );
  const coffee = fs.readFileSync(
    path.join(process.cwd(), "public", "interest-coffee-v2.webp")
  );

  expect(app).toContain('const InterestSnow = "/interest-snow-v3.webp";');
  expect(app).toContain('const InterestBoss = "/interest-sekiro-v1.webp";');
  expect(app).toContain('const InterestCoffee = "/interest-coffee-v2.webp";');
  expect(readWebpDimensions(snow)).toEqual({ width: 1280, height: 853 });
  expect(readWebpDimensions(boss)).toEqual({ width: 1280, height: 853 });
  expect(readWebpDimensions(coffee)).toEqual({ width: 1280, height: 853 });
  expect(snow.length).toBeLessThan(150000);
  expect(boss.length).toBeLessThan(150000);
  expect(coffee.length).toBeLessThan(150000);
  ["interest-snow-v2.webp", "interest-boss-v2.webp", "interest-coffee-v1.webp"].forEach(
    (asset) => expect(fs.existsSync(path.join(process.cwd(), "public", asset))).toBe(false)
  );
  expect(css).toMatch(
    /@media \(min-width: 64rem\)[\s\S]*?\.off-clock\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.28fr\) minmax\(18rem, 0\.72fr\);[^}]*grid-template-rows:\s*repeat\(2, minmax\(16rem, auto\)\);/
  );
  expect(css).toMatch(
    /@media \(min-width: 64rem\)[\s\S]*?\.interest-card--snow\s*\{[^}]*grid-row:\s*1 \/ 3;[^}]*grid-column:\s*1;/
  );
  expect(css).toMatch(
    /\.skill-rail ul\s*\{[^}]*display:\s*flex;[^}]*flex-wrap:\s*wrap;/s
  );
  expect(css).toMatch(
    /\.skill-rail li:not\(:last-child\)::after\s*\{[^}]*content:\s*"\/";/s
  );
  expect(css).not.toContain("grid-template-columns: repeat(3, minmax(0, 1fr));");
  expect(css).not.toContain(".skill-rail-hint");
  expect(css).not.toContain(".skill-rail ul[tabindex]");
  expect(css).toMatch(
    /@media \(hover:\s*hover\) and \(pointer:\s*fine\)\s*\{[\s\S]*?\.site-nav a:not\(\[aria-current="location"\]\):hover[\s\S]*?\.action-link:hover[\s\S]*?\.contact-link:not\(:first-of-type\):hover/
  );
  [
    ".wordmark:active",
    ".site-nav a:active",
    ".site-footer a:active",
    ".action-link:active",
    ".contact-link:active",
  ].forEach((selector) => expect(css).toContain(selector));
});

it("settles reduced-motion content without waiting for standard animation delays", () => {
  const css = readProjectFile("src", "index.css");

  expect(css).toContain("@media (prefers-reduced-motion: reduce)");
  expect(css).toContain("animation-delay: 0ms !important;");
  expect(css).toContain("animation-duration: 0.01ms !important;");
  expect(css).toContain("animation-iteration-count: 1 !important;");
  expect(css).toContain("transition-delay: 0ms !important;");
  expect(css).toContain("transition-duration: 0.01ms !important;");
  expect(css).toContain("scroll-behavior: auto !important;");
});

it("keeps keyboard focus visible across light and dark controls", () => {
  const globalCss = readProjectFile("src", "index.css");
  const appCss = readProjectFile("src", "App.css");

  expect(globalCss).toContain("--focus-dark: #172437;");
  expect(globalCss).toContain("--focus-light: #fffefa;");
  expect(globalCss).toMatch(
    /a:focus-visible,\s*button:focus-visible\s*\{[^}]*outline:\s*3px solid var\(--focus-light\);[^}]*outline-offset:\s*3px;[^}]*box-shadow:\s*0 0 0 6px var\(--focus-dark\);/s
  );
  expect(appCss).not.toContain(".bee-portrait:focus-visible");
});

it("keeps primary navigation available across the long single-page story", () => {
  const css = readProjectFile("src", "App.css");

  expect(css).toContain("--header-offset: 5.8rem;");
  expect(css).toMatch(/\.site-header\s*\{[^}]*position:\s*fixed;/s);
  expect(css).toMatch(
    /\.wordmark\s*\{[^}]*min-width:\s*2\.75rem;[^}]*min-height:\s*2\.75rem;/s
  );
  expect(css).toContain("scroll-margin-top: var(--header-offset);");
  expect(css).toContain("--header-offset: 6.5rem;");
});

it("keeps the full primary navigation on one row at the narrow mobile boundary", () => {
  const css = readProjectFile("src", "App.css");

  expect(css).toMatch(
    /@media \(max-width: 18\.75rem\)[\s\S]*?\.site-header\s*\{[^}]*gap:\s*0\.25rem;[^}]*padding-right:\s*0\.7rem;[^}]*padding-left:\s*0\.7rem;[\s\S]*?\.site-nav\s*\{[^}]*gap:\s*0;[\s\S]*?\.site-nav a\s*\{[^}]*font-size:\s*0\.625rem;/
  );
  expect(css).toMatch(
    /@media \(max-width: 15rem\)[\s\S]*?\.site-header\s*\{[^}]*padding-right:\s*0\.45rem;[^}]*padding-left:\s*0\.45rem;[\s\S]*?\.site-nav a\s*\{[^}]*font-size:\s*0\.575rem;/
  );
  expect(css).toMatch(/\.site-nav a,[\s\S]*?min-height:\s*2\.75rem;/);
});

it("keeps the text-led hero compact across medium landscape viewports", () => {
  const css = readProjectFile("src", "App.css");

  expect(css).toContain(
    "@media (min-width: 35rem) and (max-width: 63.99rem) and (orientation: landscape)"
  );
  expect(css).toContain(
    "grid-template-columns: minmax(0, 1.3fr) minmax(17rem, 0.7fr);"
  );
  expect(css).toContain("min-height: 100svh;");
  expect(css).toMatch(
    /@media \(min-width: 35rem\) and \(max-width: 63\.99rem\) and \(orientation: landscape\)[\s\S]*?\.hero h1\s*\{[^}]*font-size:\s*clamp\(2\.65rem, 7\.6vw, 4\.1rem\);[\s\S]*?\.action-link\s*\{[^}]*min-height:\s*2\.75rem;/
  );
});

it("keeps the mobile Playful hero concise while revealing the next chapter", () => {
  const css = readProjectFile("src", "App.css");

  expect(css).toMatch(
    /\.hero\s*\{[^}]*align-content:\s*start;[^}]*min-height:\s*min\(44rem, 80vh\);[^}]*min-height:\s*min\(44rem, 80svh\);/s
  );
  expect(css).not.toContain("min-height: min(44rem, 80dvh);");
  expect(css).toMatch(
    /\.hero h1\s*\{[^}]*max-width:\s*10ch;[^}]*font-size:\s*clamp\(3\.35rem, 15vw, 4\.75rem\);/s
  );
  expect(css).not.toContain(".hero-mark");
  expect(css).toMatch(
    /\.hero h1 span\s*\{[^}]*background:\s*linear-gradient\(transparent 62%, var\(--honey\) 62%\);/s
  );
  expect(css).not.toContain(".hero-proof");
});

it("ships only the selected Playful product path and its active assets", () => {
  const app = readProjectFile("src", "App.js");

  expect(app).not.toContain("ConceptLab");
  expect(app).not.toContain("URLSearchParams");
  expect(fs.existsSync(path.join(process.cwd(), "src", "ConceptLab.js"))).toBe(false);
  expect(fs.existsSync(path.join(process.cwd(), "src", "ConceptLab.css"))).toBe(false);
  expect(fs.existsSync(path.join(process.cwd(), "public", "bee-hero-v2.webp"))).toBe(false);
});

it("extends the Playful composition across wider portrait screens", () => {
  const css = readProjectFile("src", "App.css");

  expect(css).toMatch(
    /@media \(min-width: 36rem\)[\s\S]*?\.hero h1\s*\{[^}]*max-width:\s*9\.5ch;[^}]*font-size:\s*clamp\(4\.75rem, 13vw, 7\.25rem\);/
  );
  expect(css).toMatch(
    /@media \(min-width: 36rem\)[\s\S]*?\.hero-actions\s*\{[^}]*max-width:\s*20rem;/
  );
  expect(css).toMatch(
    /@media \(min-width: 36rem\)[\s\S]*?\.wordmark-name\s*\{[^}]*display:\s*inline;/
  );
});

it("uses the desktop hero and strengths rail as one centered viewport composition", () => {
  const css = readProjectFile("src", "App.css");

  expect(css).toMatch(
    /@media \(min-width: 64rem\)[\s\S]*?\.hero\s*\{[^}]*grid-template-columns:\s*minmax\(0, 1\.42fr\) minmax\(20rem, 0\.58fr\);[^}]*align-content:\s*center;[^}]*min-height:\s*calc\(100vh - 4\.15rem\);[^}]*padding-top:\s*6rem;[^}]*padding-bottom:\s*clamp\(4\.5rem, 8vh, 6rem\);[^}]*padding-bottom:\s*clamp\(4\.5rem, 8svh, 6rem\);[\s\S]*?\.hero h1\s*\{[^}]*max-width:\s*none;[^}]*font-size:\s*clamp\(5\.2rem, 7\.4vw, 7\.15rem\);/
  );
  expect(css).not.toMatch(
    /@media \(min-width: 64rem\)[\s\S]*?\.hero\s*\{[^}]*min-height:\s*clamp\(36rem, 62(?:d)?vh, 44rem\);/
  );
  expect(css).not.toMatch(
    /@media \(min-width: 64rem\)[\s\S]*?\.hero h1\s*\{[^}]*max-width:\s*8\.2ch;/
  );
});

it("keeps the personal mark in the wordmark and bounds the direct-contact action", () => {
  const app = readProjectFile("src", "App.js");
  const css = readProjectFile("src", "App.css");

  expect(app.match(/href="#experience"/g)).toHaveLength(1);
  expect(app).toContain('className="wordmark-mark"');
  expect(app).not.toContain('className="hero-mark"');
  expect(app).not.toContain("Follow the bee");
  expect(app).not.toContain("followBee");
  expect(app).not.toMatch(
    /className="action-link[^\n]*href="#experience"/
  );
  expect(app).toMatch(
    /className="action-link action-link--filled" href="mailto:jason\.yfyau@gmail\.com"/
  );
  expect(css).toMatch(
    /@media \(min-width: 36rem\)[\s\S]*?\.hero-actions\s*\{[^}]*max-width:\s*20rem;/
  );
  expect(css).not.toMatch(
    /@media \(min-width: 64rem\)[\s\S]*?\.hero-actions\s*\{[^}]*max-width:\s*40rem;/
  );
});

it("keeps chapter openings clear while Contact stays action-oriented", () => {
  const css = readProjectFile("src", "App.css");

  expect(css).toMatch(
    /\.section-heading h2\s*\{[^}]*max-width:\s*13ch;[^}]*font-size:\s*clamp\(3rem, 10vw, 6\.75rem\);/s
  );
  expect(css).toMatch(
    /\.section-heading > p\s*\{[^}]*max-width:\s*34rem;[^}]*margin:\s*1\.25rem 0 0;/s
  );
  expect(css).toMatch(
    /@media \(min-width: 48rem\)[\s\S]*?\.contact-heading\s*\{[^}]*display:\s*grid;[^}]*grid-template-columns:\s*minmax\(0, 1\.05fr\) minmax\(20rem, 0\.65fr\);/
  );
  expect(css).toMatch(
    /\.current-job\s*\{[^}]*margin-top:\s*clamp\(3\.5rem, 8vw, 6\.5rem\);/s
  );
  expect(css).toMatch(/\.off-duty\s*\{[^}]*background:\s*var\(--honey\);/s);
  expect(css).not.toContain(".identity-story");
  expect(css).not.toContain(".name-study");
});

it("tracks reading location without a per-scroll React update", () => {
  const app = readProjectFile("src", "App.js");

  expect(app).toContain("new window.IntersectionObserver(updateActiveSection");
  expect(app).toContain("rootMargin: `-${readingLine}px 0px -${bottomInset}px 0px`");
  expect(app).toContain("sections.forEach((section) => sectionObserver.observe(section))");
  expect(app).not.toContain('window.addEventListener("scroll"');
  expect(app).not.toContain('window.removeEventListener("scroll"');
});

it("publishes the static build to the configured GitHub Pages source branch", () => {
  const packageJson = JSON.parse(readProjectFile("package.json"));
  const cname = readProjectFile("public", "CNAME");

  expect(packageJson.scripts.deploy).toBe("gh-pages -d build -b build");
  expect(cname.trim()).toBe("jason.yfyau.com");
});

it("keeps every canonical discovery URL on jason.yfyau.com", () => {
  const packageJson = JSON.parse(readProjectFile("package.json"));
  const html = readProjectFile("public", "index.html");
  const robots = readProjectFile("public", "robots.txt");
  const sitemap = readProjectFile("public", "sitemap.xml");

  expect(packageJson.homepage).toBe("https://jason.yfyau.com/");
  expect(html).toContain('<link rel="canonical" href="https://jason.yfyau.com/" />');
  expect(html).toContain('<meta property="og:url" content="https://jason.yfyau.com/" />');
  expect(html).toContain(
    '<meta property="og:image" content="https://jason.yfyau.com/og-card-v3.png" />'
  );
  expect(html).toContain(
    '<meta name="twitter:image" content="https://jason.yfyau.com/og-card-v3.png" />'
  );
  expect(html).toContain('"url": "https://jason.yfyau.com/"');
  expect(robots).toContain("Sitemap: https://jason.yfyau.com/sitemap.xml");
  expect(sitemap).toContain("<loc>https://jason.yfyau.com/</loc>");
  expect(html).not.toContain('https://yfyau.com/');
  expect(robots).not.toContain('https://yfyau.com/');
  expect(sitemap).not.toContain('https://yfyau.com/');
});
