// @vitest-environment node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import prerenderHelpers from "../scripts/prerender.js";
import { createServer } from "vite";

const {
  injectRenderedMarkup,
  prerenderHomepage,
  renderHomepage,
  resolveBuildYear,
  validateHomepageMarkup,
} = prerenderHelpers;

describe("homepage prerender helper", () => {
  it("renders SiteVersion and replaces only the empty root with its build year", async () => {
    const year = 2026;
    const template = '<!doctype html><html><head><title>site</title><script src="/static/js/main.js"></script></head><body><div id="root"></div></body></html>';
    const markup = await renderHomepage(year);
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

  // Coexistence smoke: preserve a dev module URL while a separate production
  // prerender server starts and closes. This does not reproduce cache invalidation.
  it("keeps the dev server's optimized React URL usable after prerender", async () => {
    const projectRoot = process.cwd();
    const originalNodeEnv = process.env.NODE_ENV;
    const devServer = await createServer({
      configFile: path.join(projectRoot, "vite.config.mjs"),
      root: projectRoot,
      mode: "development",
      server: { host: "127.0.0.1", port: 0, strictPort: false },
      logLevel: "error",
    });

    try {
      await devServer.listen();
      const address = devServer.httpServer.address();
      const origin = `http://127.0.0.1:${address.port}`;
      const entryResponse = await fetch(`${origin}/src/index.js`);
      expect(entryResponse.status).toBe(200);

      const entryModule = await entryResponse.text();
      const reactMatch = entryModule.match(/from\s*["']([^"']*\/react\.js(?:\?[^"']*)?)["']/);
      expect(reactMatch).not.toBeNull();
      const reactUrl = new URL(reactMatch[1], origin).toString();

      const assertReactModuleIsUsable = async () => {
        const response = await fetch(reactUrl);
        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toMatch(/javascript/);
        expect(await response.text()).toContain("createElement");
      };

      await assertReactModuleIsUsable();
      try {
        process.env.NODE_ENV = "production";
        await renderHomepage(2026);
      } finally {
        if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
        else process.env.NODE_ENV = originalNodeEnv;
      }
      await assertReactModuleIsUsable();
    } finally {
      await devServer.close();
    }
  }, 15_000);

  it.each([
    ["missing root", "<html><body></body></html>"],
    ["duplicate roots", '<div id="root"></div><div id="root"></div>'],
    ["populated root", '<div id="root"><main>already rendered</main></div>'],
    ["root with an unexpected attribute", '<div id="root" data-year="2026"></div>'],
  ])("fails closed for %s", (_description, template) => {
    expect(() => injectRenderedMarkup(template, "<main>content</main>", 2026)).toThrow(
      /exactly one empty/
    );
  });

  it("rejects invalid years and empty render output", () => {
    expect(() => resolveBuildYear(999)).toThrow(/Invalid homepage build year/);
    expect(() => injectRenderedMarkup('<div id="root"></div>', "", 2026)).toThrow(
      /produced no markup/
    );
  });

  it("rejects an error shell or homepage output missing required content", () => {
    expect(() => validateHomepageMarkup('<main><h1>The site could not load.</h1></main>')).toThrow(
      /error shell/
    );
    expect(() => validateHomepageMarkup('<main><h1>Incomplete page</h1></main>')).toThrow(
      /missing required content/
    );
  });

  it("does not overwrite a malformed build template", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "homepage-prerender-"));
    const outputPath = path.join(directory, "index.html");
    const malformedTemplate = '<div id="root"><main>existing content</main></div>';
    fs.writeFileSync(outputPath, malformedTemplate, "utf8");

    try {
      await expect(prerenderHomepage(outputPath)).rejects.toThrow(/exactly one empty/);
      expect(fs.readFileSync(outputPath, "utf8")).toBe(malformedTemplate);
    } finally {
      fs.rmSync(directory, { recursive: true, force: true });
    }
  });
});
