const fs = require("fs");
const Module = require("module");
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");

const projectRoot = path.resolve(__dirname, "..");
const sourceRoot = path.join(projectRoot, "src");
const siteVersionPath = path.join(sourceRoot, "SiteVersion.js");
const reactScriptsRoot = path.dirname(require.resolve("react-scripts/package.json"));
const emptyRootPlaceholder = '<div id="root"></div>';

function resolveReactScriptsDependency(name) {
  return require.resolve(name, { paths: [reactScriptsRoot] });
}

const babel = require(resolveReactScriptsDependency("@babel/core"));
const reactAppPresetPath = resolveReactScriptsDependency("babel-preset-react-app");

function transformSource(source, filename) {
  const previousBabelEnv = process.env.BABEL_ENV;
  process.env.BABEL_ENV = "test";
  try {
    return babel.transformSync(source, {
      filename,
      babelrc: false,
      configFile: false,
      envName: "test",
      caller: {
        name: "homepage-prerender",
        supportsStaticESM: false,
      },
      presets: [[reactAppPresetPath, { useESModules: false }]],
      sourceType: "unambiguous",
    });
  } finally {
    if (previousBabelEnv === undefined) {
      delete process.env.BABEL_ENV;
    } else {
      process.env.BABEL_ENV = previousBabelEnv;
    }
  }
}

function resolveBuildYear(value) {
  const year = value === undefined ? new Date().getFullYear() : value;
  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    throw new Error(`Invalid homepage build year: ${String(year)}`);
  }
  return year;
}

function isSourceFile(filename) {
  const relativePath = path.relative(sourceRoot, filename);
  return relativePath !== ".." &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath);
}

function installSourceLoaders() {
  const extensions = Module._extensions;
  const originalJavaScriptLoader = extensions[".js"];
  const hadCssLoader = Object.prototype.hasOwnProperty.call(extensions, ".css");
  const originalCssLoader = extensions[".css"];

  extensions[".js"] = function loadSourceJavaScript(module, filename) {
    if (!isSourceFile(filename)) {
      return originalJavaScriptLoader(module, filename);
    }

    const source = fs.readFileSync(filename, "utf8");
    const transformed = transformSource(source, filename);
    module._compile(transformed.code, filename);
  };

  extensions[".css"] = function loadSourceCss(module, filename) {
    if (isSourceFile(filename)) {
      return module._compile("", filename);
    }
    if (originalCssLoader) {
      return originalCssLoader(module, filename);
    }
    throw new Error(`Cannot load CSS outside src during homepage prerender: ${filename}`);
  };

  return function restoreSourceLoaders() {
    extensions[".js"] = originalJavaScriptLoader;
    if (hadCssLoader) {
      extensions[".css"] = originalCssLoader;
    } else {
      delete extensions[".css"];
    }
  };
}

function renderHomepage(explicitYear) {
  const buildYear = resolveBuildYear(explicitYear);
  const restoreLoaders = installSourceLoaders();
  try {
    const SiteVersionModule = require(siteVersionPath);
    const SiteVersion = SiteVersionModule.default || SiteVersionModule;
    const markup = ReactDOMServer.renderToString(
      React.createElement(SiteVersion, { initialYear: buildYear })
    );
    return validateHomepageMarkup(markup);
  } finally {
    restoreLoaders();
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

function prerenderHomepage(htmlPath) {
  const outputPath = htmlPath || path.join(projectRoot, "build", "index.html");
  const template = fs.readFileSync(outputPath, "utf8");
  const buildYear = resolveBuildYear();
  const markup = renderHomepage(buildYear);
  const renderedHtml = injectRenderedMarkup(template, markup, buildYear);
  fs.writeFileSync(outputPath, renderedHtml, "utf8");
  return renderedHtml;
}

if (require.main === module) {
  try {
    prerenderHomepage();
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    process.exitCode = 1;
  }
}

module.exports = {
  injectRenderedMarkup,
  prerenderHomepage,
  renderHomepage,
  resolveBuildYear,
  validateHomepageMarkup,
};
