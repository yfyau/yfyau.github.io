const fs = require("fs");
const path = require("path");

const DEFAULT_BUILD_ROOT = path.resolve(__dirname, "..", "build");
const CANONICAL_URL = "https://jason.yfyau.com/";
const EXPECTED_TITLE = "Jason Yau | Senior Software Engineer & Consultant";
const SERVICES = [
  { slug: "ai-transformation", name: "Practical AI Transformation" },
  { slug: "prototype-to-product", name: "From Prototype to Product" },
  { slug: "custom-digital-products", name: "Custom Digital Products" },
];

function fail(message) {
  throw new Error(message);
}

function readRequiredFile(filePath, label) {
  let stats;
  try {
    stats = fs.statSync(filePath);
  } catch (_error) {
    fail(`Required build output is missing: ${label}`);
  }
  if (!stats.isFile()) {
    fail(`Required build output is not a file: ${label}`);
  }
  return fs.readFileSync(filePath, "utf8");
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function getAttribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`\\b${escapedName}\\s*=\\s*(["'])(.*?)\\1`, "i").exec(tag);
  return match ? decodeHtml(match[2]) : null;
}

function getTagText(html, tagName) {
  const match = new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i").exec(html);
  return match ? decodeHtml(match[1].replace(/<[^>]*>/g, "").trim()) : null;
}

function resolveLocalReference(buildRoot, documentPath, reference) {
  const value = reference.trim();
  if (!value || value.startsWith("#") || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) {
    return null;
  }

  const pathname = value.split(/[?#]/, 1)[0];
  if (!pathname) return null;

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch (_error) {
    fail(`Invalid encoded local reference in ${path.relative(buildRoot, documentPath)}: ${value}`);
  }

  const resolvedPath = decodedPath.startsWith("/")
    ? path.resolve(buildRoot, `.${decodedPath}`)
    : path.resolve(path.dirname(documentPath), decodedPath);
  const relativePath = path.relative(buildRoot, resolvedPath);
  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    fail(`Local reference escapes the build directory in ${path.relative(buildRoot, documentPath)}: ${value}`);
  }

  return resolvedPath;
}

function requireReference(buildRoot, documentPath, reference, cssFiles, referenceCount) {
  const targetPath = resolveLocalReference(buildRoot, documentPath, reference);
  if (!targetPath) return;

  let stats;
  try {
    stats = fs.statSync(targetPath);
  } catch (_error) {
    fail(`Missing local reference in ${path.relative(buildRoot, documentPath)}: ${reference}`);
  }

  let filePath = targetPath;
  if (stats.isDirectory()) {
    filePath = path.join(targetPath, "index.html");
    try {
      stats = fs.statSync(filePath);
    } catch (_error) {
      fail(`Local route has no index.html in ${path.relative(buildRoot, documentPath)}: ${reference}`);
    }
  }
  if (!stats.isFile()) {
    fail(`Local reference is not a file in ${path.relative(buildRoot, documentPath)}: ${reference}`);
  }

  if (path.extname(filePath).toLowerCase() === ".css") cssFiles.add(filePath);
  referenceCount.count += 1;
}

function checkDocumentReferences(buildRoot, documentPath, html, cssFiles, referenceCount) {
  const tags = html.match(/<(?:script|img|source|link|a)\b[^>]*>/gi) || [];
  tags.forEach((tag) => {
    const tagName = /^<([a-z]+)/i.exec(tag)[1].toLowerCase();
    const attributeNames = tagName === "a" || tagName === "link" ? ["href"] : ["src"];
    attributeNames.forEach((attributeName) => {
      const reference = getAttribute(tag, attributeName);
      if (reference) {
        requireReference(buildRoot, documentPath, reference, cssFiles, referenceCount);
      }
    });
  });
}

function checkCssReferences(buildRoot, cssPath, cssFiles, referenceCount) {
  const css = readRequiredFile(cssPath, path.relative(buildRoot, cssPath));
  const urlPattern = /url\(\s*(?:(["'])(.*?)\1|([^)]*?))\s*\)/gi;
  let match;
  while ((match = urlPattern.exec(css)) !== null) {
    const reference = (match[2] || match[3] || "").trim();
    if (reference) {
      requireReference(buildRoot, cssPath, reference, cssFiles, referenceCount);
    }
  }
}

function validateHomepage(buildRoot, html) {
  const title = getTagText(html, "title");
  if (title !== EXPECTED_TITLE) {
    fail(`Built homepage title did not match the expected title: ${title || "missing"}`);
  }

  const canonicalLinks = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi) || [];
  if (canonicalLinks.length !== 1 || getAttribute(canonicalLinks[0], "href") !== CANONICAL_URL) {
    fail(`Built homepage must have one canonical link to ${CANONICAL_URL}`);
  }

  const rootOpening = /<div\b[^>]*\bid=["']root["'][^>]*>/i.exec(html);
  if (!rootOpening || !/\bdata-year=["']\d{4}["']/.test(rootOpening[0])) {
    fail("Built homepage root is missing the prerender build-year marker.");
  }
  const rootContents = html.slice(rootOpening.index + rootOpening[0].length);
  const firstRuntimeScript = rootContents.indexOf("<script");
  const prerenderedMarkup = firstRuntimeScript < 0
    ? rootContents
    : rootContents.slice(0, firstRuntimeScript);
  if (!/<main\b/i.test(prerenderedMarkup) || !/<h1\b/i.test(prerenderedMarkup)) {
    fail("Built homepage root does not contain its prerendered main landmark and heading.");
  }

  const decodedHtml = decodeHtml(html);
  SERVICES.forEach(({ slug, name }) => {
    if (!decodedHtml.includes(`href="/services/${slug}/"`) || !decodedHtml.includes(name)) {
      fail(`Built homepage is missing its ${name} service link.`);
    }
  });
}

function validateServicePage(buildRoot, service) {
  const relativePath = path.join("services", service.slug, "index.html");
  const html = readRequiredFile(path.join(buildRoot, relativePath), relativePath);
  const title = getTagText(html, "title");
  const heading = getTagText(html, "h1");
  if (!title || !title.includes(service.name) || heading !== service.name) {
    fail(`Generated service page is missing its expected title or heading: ${relativePath}`);
  }
  return { relativePath, html };
}

function validateBuild(buildRoot = DEFAULT_BUILD_ROOT) {
  const absoluteBuildRoot = path.resolve(buildRoot);
  let rootStats;
  try {
    rootStats = fs.statSync(absoluteBuildRoot);
  } catch (_error) {
    fail(`Build output directory was not found: ${absoluteBuildRoot}`);
  }
  if (!rootStats.isDirectory()) fail(`Build output path is not a directory: ${absoluteBuildRoot}`);

  const homepagePath = path.join(absoluteBuildRoot, "index.html");
  const homepage = readRequiredFile(homepagePath, "index.html");
  validateHomepage(absoluteBuildRoot, homepage);

  const robots = readRequiredFile(path.join(absoluteBuildRoot, "robots.txt"), "robots.txt");
  if (!/User-agent:\s*\*/i.test(robots) || !/Allow:\s*\//i.test(robots)) {
    fail("Built robots.txt is missing its public crawl rules.");
  }

  const sitemap = readRequiredFile(path.join(absoluteBuildRoot, "sitemap.xml"), "sitemap.xml");
  if (!/<urlset\b/i.test(sitemap) || !sitemap.includes(CANONICAL_URL)) {
    fail("Built sitemap.xml is missing its URL set or canonical homepage.");
  }
  SERVICES.forEach(({ slug }) => {
    if (!sitemap.includes(`${CANONICAL_URL}services/${slug}/`)) {
      fail(`Built sitemap.xml is missing the ${slug} service URL.`);
    }
  });

  const documents = [{ relativePath: "index.html", html: homepage }];
  SERVICES.forEach((service) => documents.push(validateServicePage(absoluteBuildRoot, service)));

  const cssFiles = new Set();
  const referenceCount = { count: 0 };
  documents.forEach(({ relativePath, html }) => {
    checkDocumentReferences(
      absoluteBuildRoot,
      path.join(absoluteBuildRoot, relativePath),
      html,
      cssFiles,
      referenceCount
    );
  });

  const scannedCss = new Set();
  while (cssFiles.size > 0) {
    const [cssPath] = cssFiles;
    cssFiles.delete(cssPath);
    if (scannedCss.has(cssPath)) continue;
    scannedCss.add(cssPath);
    checkCssReferences(absoluteBuildRoot, cssPath, cssFiles, referenceCount);
  }

  return { documents: documents.length, localReferences: referenceCount.count };
}

if (require.main === module) {
  try {
    const result = validateBuild();
    console.log(
      `Built output verified (${result.documents} HTML documents, ${result.localReferences} local references).`
    );
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    process.exitCode = 1;
  }
}

module.exports = { validateBuild };
