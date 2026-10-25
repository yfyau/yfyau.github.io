// @vitest-environment node
import { vi } from "vitest";
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  runNpmStage,
  runVerification,
  VERIFICATION_STAGES,
} = require("../scripts/verify.js");
const { validateBuild } = require("../scripts/verify-build.js");

const SERVICES = [
  { slug: "ai-transformation", name: "Practical AI Transformation" },
  { slug: "prototype-to-product", name: "From Prototype to Product" },
  { slug: "custom-digital-products", name: "Custom Digital Products" },
];

function createBuildFixture() {
  const buildRoot = fs.mkdtempSync(path.join(os.tmpdir(), "yfyau-build-verifier-"));
  fs.mkdirSync(path.join(buildRoot, "static", "css"), { recursive: true });
  fs.mkdirSync(path.join(buildRoot, "static", "js"), { recursive: true });
  fs.mkdirSync(path.join(buildRoot, "images"), { recursive: true });
  fs.mkdirSync(path.join(buildRoot, "fonts"), { recursive: true });

  SERVICES.forEach(({ slug, name }) => {
    const serviceDirectory = path.join(buildRoot, "services", slug);
    fs.mkdirSync(serviceDirectory, { recursive: true });
    fs.writeFileSync(
      path.join(serviceDirectory, "index.html"),
      `<!doctype html><html><head><title>${name} | Jason Yau</title></head><body><main><h1>${name}</h1></main></body></html>`,
      "utf8"
    );
  });

  fs.writeFileSync(
    path.join(buildRoot, "static", "css", "site.css"),
    "body { background-image: url('../../images/bee.svg'); font-family: url('../../fonts/site.woff2'); }",
    "utf8"
  );
  fs.writeFileSync(path.join(buildRoot, "static", "js", "main.js"), "window.site = true;", "utf8");
  fs.writeFileSync(path.join(buildRoot, "images", "bee.svg"), "<svg></svg>", "utf8");
  fs.writeFileSync(path.join(buildRoot, "fonts", "site.woff2"), "font", "utf8");
  fs.writeFileSync(
    path.join(buildRoot, "robots.txt"),
    "User-agent: *\nAllow: /\nSitemap: https://jason.yfyau.com/sitemap.xml\n",
    "utf8"
  );
  fs.writeFileSync(
    path.join(buildRoot, "sitemap.xml"),
    `<urlset>${[CANONICAL_URL, ...SERVICES.map(({ slug }) => `${CANONICAL_URL}services/${slug}/`)]
      .map((url) => `<url><loc>${url}</loc></url>`)
      .join("")}</urlset>`,
    "utf8"
  );

  const serviceLinks = SERVICES.map(
    ({ slug, name }) => `<a href="/services/${slug}/">${name}</a>`
  ).join("");
  fs.writeFileSync(
    path.join(buildRoot, "index.html"),
    `<!doctype html><html><head><link rel="canonical" href="${CANONICAL_URL}"/><title>Jason Yau | Senior Software Engineer &amp; Consultant</title><link rel="stylesheet" href="/static/css/site.css"/><link rel="manifest" href="/manifest.json"/></head><body><div id="root" data-year="2026"><main><h1>Jason Yau</h1><img src="/images/bee.svg"/>${serviceLinks}</main></div><script src="/static/js/main.js"></script></body></html>`,
    "utf8"
  );
  fs.writeFileSync(path.join(buildRoot, "manifest.json"), "{}", "utf8");
  return buildRoot;
}

const CANONICAL_URL = "https://jason.yfyau.com/";

describe("shared local verification gate", () => {
  test("uses the active Node runtime to invoke npm without a shell", () => {
    const spawn = vi.fn(() => ({ status: 0 }));
    const nodePath = "C:\\Node Runtime\\node.exe";
    const npmExecPath = "C:\\Node Runtime\\node_modules\\npm\\bin\\npm-cli.js";

    expect(runNpmStage("build", spawn, nodePath, npmExecPath)).toBe(0);

    const [command, args, options] = spawn.mock.calls[0];
    expect(command).toBe(nodePath);
    expect(args).toEqual([npmExecPath, "run", "build"]);
    expect(options.stdio).toBe("inherit");
    expect(options.env.CI).toBe("true");
    expect(options).not.toHaveProperty("shell");
  });

  test("fails closed if the current npm CLI path is unavailable", () => {
    const spawn = vi.fn();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(runNpmStage("build", spawn, "node.exe", null)).toBe(1);
    expect(spawn).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  test("runs lint, tests, production build, and artifact checks in order", () => {
    const completedStages = [];

    expect(
      runVerification((stage) => {
        completedStages.push(stage);
        return 0;
      })
    ).toBe(0);
    expect(completedStages).toEqual(["lint", "test:ci", "build", "verify:build"]);
  });

  test.each([
    ["lint", 1],
    ["test:ci", 2],
    ["build", 3],
    ["verify:build", 4],
  ])("stops immediately when %s fails", (failedStage, exitCode) => {
    const attemptedStages = [];
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = runVerification((stage) => {
      attemptedStages.push(stage);
      return stage === failedStage ? exitCode : 0;
    });
    errorSpy.mockRestore();

    expect(result).toBe(exitCode);
    expect(attemptedStages).toEqual(
      VERIFICATION_STAGES.slice(0, VERIFICATION_STAGES.indexOf(failedStage) + 1)
    );
  });
});

describe("generated build verification", () => {
  let buildRoot;

  beforeEach(() => {
    buildRoot = createBuildFixture();
  });

  afterEach(() => {
    fs.rmSync(buildRoot, { recursive: true, force: true });
  });

  test("accepts prerendered homepage, service pages, discovery files, and local assets", () => {
    expect(validateBuild(buildRoot)).toEqual({ documents: 4, localReferences: 9 });
  });

  test.each([
    ["empty render root", (root) => {
      const htmlPath = path.join(root, "index.html");
      const html = fs.readFileSync(htmlPath, "utf8").replace(/<main>[\s\S]*?<\/main>/, "");
      fs.writeFileSync(htmlPath, html, "utf8");
    }, /prerendered main landmark and heading/],
    ["wrong canonical host", (root) => {
      const htmlPath = path.join(root, "index.html");
      const html = fs.readFileSync(htmlPath, "utf8").replace(
        `href="${CANONICAL_URL}"`,
        'href="https://example.com/"'
      );
      fs.writeFileSync(htmlPath, html, "utf8");
    }, /one canonical link/],
    ["wrong homepage title", (root) => {
      const htmlPath = path.join(root, "index.html");
      const html = fs.readFileSync(htmlPath, "utf8").replace(
        "Senior Software Engineer &amp; Consultant",
        "Different title"
      );
      fs.writeFileSync(htmlPath, html, "utf8");
    }, /expected title/],
    ["missing robots file", (root) => fs.unlinkSync(path.join(root, "robots.txt")), /robots\.txt/],
    ["missing sitemap file", (root) => fs.unlinkSync(path.join(root, "sitemap.xml")), /sitemap\.xml/],
    ["missing sitemap service URL", (root) => {
      const sitemapPath = path.join(root, "sitemap.xml");
      const sitemap = fs.readFileSync(sitemapPath, "utf8").replace(
        /<url><loc>https:\/\/jason\.yfyau\.com\/services\/prototype-to-product\/<\/loc><\/url>/,
        ""
      );
      fs.writeFileSync(sitemapPath, sitemap, "utf8");
    }, /prototype-to-product service URL/],
    ["missing generated service page", (root) => {
      fs.rmSync(path.join(root, "services", "custom-digital-products"), { recursive: true });
    }, /services[\\/]custom-digital-products[\\/]index\.html/],
    ["missing local font referenced by CSS", (root) => {
      fs.unlinkSync(path.join(root, "fonts", "site.woff2"));
    }, /Missing local reference.*site\.css.*fonts[\\/]site\.woff2/],
    ["missing local homepage asset", (root) => {
      fs.unlinkSync(path.join(root, "static", "js", "main.js"));
    }, /Missing local reference.*index\.html.*main\.js/],
  ])("rejects %s", (_description, mutateBuild, expectedError) => {
    mutateBuild(buildRoot);
    expect(() => validateBuild(buildRoot)).toThrow(expectedError);
  });
});
