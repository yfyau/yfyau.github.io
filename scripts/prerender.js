const fs = require("fs");
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");

const projectRoot = path.resolve(__dirname, "..");
const emptyRootPlaceholder = '<div id="root"></div>';

function resolveBuildYear(value) {
  const year = value === undefined ? new Date().getFullYear() : value;
  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    throw new Error(`Invalid homepage build year: ${String(year)}`);
  }
  return year;
}

async function renderHomepage(explicitYear) {
  const buildYear = resolveBuildYear(explicitYear);
  let vite;
  try {
    const { createServer } = await import("vite");
    vite = await createServer({
      configFile: path.join(projectRoot, "vite.config.mjs"),
      root: projectRoot,
      // Prerender must not invalidate a concurrently running dev server's
      // optimized browser dependencies when its mode differs or it closes.
      cacheDir: path.join(projectRoot, "node_modules", ".vite-prerender"),
      mode: process.env.NODE_ENV === "production" ? "production" : "test",
      server: { middlewareMode: true, hmr: false, watch: null },
      appType: "custom",
      logLevel: "error",
    });
    const SiteVersionModule = await vite.ssrLoadModule("/src/SiteVersion.js");
    const SiteVersion = SiteVersionModule.default || SiteVersionModule;
    const markup = ReactDOMServer.renderToString(
      React.createElement(SiteVersion, { initialYear: buildYear })
    );
    return validateHomepageMarkup(markup);
  } finally {
    if (vite) {
      await vite.close();
    }
  }
}

function validateHomepageMarkup(markup) {
  if (typeof markup !== "string" || markup.trim() === "") {
    throw new Error("Homepage prerender produced no markup.");
  }
  if (/<h1\b[^>]*>\s*The site could not load\./i.test(markup)) {
    throw new Error("Homepage prerender rendered SiteVersion's error shell.");
  }

  const requiredContent = [
    ["the Jason Yau identity", /Jason Yau/],
    ["the Toronto location", /Toronto-based/],
    ["a main landmark", /<main(?:\s|>)/],
    ["a primary heading", /<h1(?:\s|>)/],
    ["the AI Transformation service link", /href="\/services\/ai-transformation\/"/],
    ["the Prototype to Product service link", /href="\/services\/prototype-to-product\/"/],
    ["the Digital Products service link", /href="\/services\/custom-digital-products\/"/],
    ["an email contact link", /href="mailto:jason\.yfyau@gmail\.com"/],
  ];
  const missingContent = requiredContent
    .filter(([, pattern]) => !pattern.test(markup))
    .map(([description]) => description);

  if (missingContent.length > 0) {
    throw new Error(
      `Homepage prerender is missing required content: ${missingContent.join(", ")}.`
    );
  }

  return markup;
}

function injectRenderedMarkup(template, markup, explicitYear) {
  if (typeof template !== "string") {
    throw new Error("Homepage build output must be a UTF-8 HTML string.");
  }
  if (typeof markup !== "string" || markup.trim() === "") {
    throw new Error("Homepage prerender produced no markup.");
  }

  const rootOpenings = template.match(/<div\b[^>]*\bid=["']root["'][^>]*>/gi) || [];
  const placeholders = template.split(emptyRootPlaceholder).length - 1;
  if (rootOpenings.length !== 1 || placeholders !== 1) {
    throw new Error(
      `Expected exactly one empty ${emptyRootPlaceholder} in build/index.html.`
    );
  }

  const buildYear = resolveBuildYear(explicitYear);
  return template.replace(
    emptyRootPlaceholder,
    `<div id="root" data-year="${buildYear}">${markup}</div>`
  );
}

async function prerenderHomepage(htmlPath) {
  const outputPath = htmlPath || path.join(projectRoot, "build", "index.html");
  const template = fs.readFileSync(outputPath, "utf8");
  const buildYear = resolveBuildYear();
  const markup = await renderHomepage(buildYear);
  const renderedHtml = injectRenderedMarkup(template, markup, buildYear);
  fs.writeFileSync(outputPath, renderedHtml, "utf8");
  return renderedHtml;
}

if (require.main === module) {
  prerenderHomepage().catch((error) => {
    console.error(error && error.stack ? error.stack : error);
    process.exitCode = 1;
  });
}

module.exports = {
  injectRenderedMarkup,
  prerenderHomepage,
  renderHomepage,
  resolveBuildYear,
  validateHomepageMarkup,
};
