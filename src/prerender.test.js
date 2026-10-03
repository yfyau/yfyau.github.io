const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  injectRenderedMarkup,
  prerenderHomepage,
  renderHomepage,
  resolveBuildYear,
  validateHomepageMarkup,
} = require("../scripts/prerender.js");

describe("homepage prerender helper", () => {
  test("renders SiteVersion and replaces only the empty root with its build year", () => {
    const year = 2026;
    const template = '<!doctype html><html><head><title>site</title><script src="/static/js/main.js"></script></head><body><div id="root"></div></body></html>';
    const markup = renderHomepage(year);
    const output = injectRenderedMarkup(template, markup, year);

    expect(markup).toContain("<main");
    expect(markup).toContain("<h1");
    expect(markup).toContain('href="/services/ai-transformation/"');
    expect(markup).toContain('href="/services/prototype-to-product/"');
    expect(markup).toContain('href="/services/custom-digital-products/"');
    expect(output).toContain(`<div id="root" data-year="${year}">${markup}</div>`);
    expect(output).toContain('<title>site</title>');
    expect(output).toContain('<script src="/static/js/main.js"></script>');
  });

  test.each([
    ["missing root", "<html><body></body></html>"],
    ["duplicate roots", '<div id="root"></div><div id="root"></div>'],
    ["populated root", '<div id="root"><main>already rendered</main></div>'],
    ["root with an unexpected attribute", '<div id="root" data-year="2026"></div>'],
  ])("fails closed for %s", (_description, template) => {
    expect(() => injectRenderedMarkup(template, "<main>content</main>", 2026)).toThrow(
      /exactly one empty/
    );
  });

  test("rejects invalid years and empty render output", () => {
    expect(() => resolveBuildYear(999)).toThrow(/Invalid homepage build year/);
    expect(() => injectRenderedMarkup('<div id="root"></div>', "", 2026)).toThrow(
      /produced no markup/
    );
  });

  test("rejects an error shell or homepage output missing required content", () => {
    expect(() => validateHomepageMarkup('<main><h1>The site could not load.</h1></main>')).toThrow(
      /error shell/
    );
    expect(() => validateHomepageMarkup('<main><h1>Incomplete page</h1></main>')).toThrow(
      /missing required content/
    );
  });

  test("does not overwrite a malformed build template", () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "homepage-prerender-"));
    const outputPath = path.join(directory, "index.html");
    const malformedTemplate = '<div id="root"><main>existing content</main></div>';
    fs.writeFileSync(outputPath, malformedTemplate, "utf8");

    try {
      expect(() => prerenderHomepage(outputPath)).toThrow(/exactly one empty/);
      expect(fs.readFileSync(outputPath, "utf8")).toBe(malformedTemplate);
    } finally {
      fs.unlinkSync(outputPath);
      fs.rmdirSync(directory);
    }
  });
});
