import fs from "fs";
import path from "path";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import PortfolioV2 from "./v2/PortfolioV2";

const read = (...segments) => fs.readFileSync(path.join(process.cwd(), ...segments), "utf8");

it("keeps the three consulting offers, legacy links, and crawlable metadata consistent", () => {
  const html = read("public", "index.html");
  const shell = new DOMParser().parseFromString(html, "text/html");
  const canonical = shell.querySelector('link[rel="canonical"]').getAttribute("href");
  const schema = JSON.parse(shell.querySelector('script[type="application/ld+json"]').textContent);
  const person = schema["@graph"].find((item) => item["@type"] === "Person");
  const services = schema["@graph"].filter((item) => item["@type"] === "Service");
  const container = document.createElement("div");
  document.body.appendChild(container);
  act(() => {
    ReactDOM.render(<PortfolioV2 />, container);
  });

  const cards = Array.from(container.querySelectorAll(".v2-service-offer"));
  expect(cards).toHaveLength(3);
  expect(services).toHaveLength(3);
  expect(canonical).toBe("https://jason.yfyau.com/");
  expect(person.name).toBe("Jason Yau");
  expect(cards.map((card) => card.id)).toEqual([
    "workflow-automation",
    "systems-data-reliability",
    "mobile-app-development",
  ]);
  expect(cards.map((card) => card.querySelector("h3").textContent)).toEqual([
    "Practical AI Transformation",
    "From Prototype to Product",
    "Custom Digital Products",
  ]);

  services.forEach((service, index) => {
    const card = cards[index];
    const currentAnchor = card.querySelector(".v2-service-anchor");
    const slug = ["ai-transformation", "prototype-to-product", "custom-digital-products"][index];
    const detailPath = "/services/" + slug + "/";
    expect(currentAnchor).not.toBeNull();
    expect(service.name).toBe(card.querySelector("h3").textContent);
    expect(service.description).toBe(card.querySelector("p").textContent);
    expect(service.provider["@id"]).toBe(person["@id"]);
    expect(card.querySelector(".v2-service-detail-link").getAttribute("href")).toBe(detailPath);
    expect(service.url).toBe(canonical + detailPath.slice(1));
    expect(service["@id"]).toBe(service.url + "#service");
    expect(html).toContain(service.name);
    expect(html).toContain('href="' + detailPath + '"');
  });

  const consultingCopy = container.querySelector("#consulting").textContent;
  expect(consultingCopy).not.toMatch(/\b(Flutter|Android|Swift|Kotlin|React Native)\b/i);
  expect(cards[0].textContent).toMatch(/AI.*automations/i);
  expect(cards[1].textContent).toMatch(/review.*fix.*dependable.*maintain/i);
  expect(cards[2].textContent).toMatch(/web or mobile product.*understanding users/i);

  const description = shell.querySelector('meta[name="description"]').getAttribute("content");
  expect(description).toContain("AI");
  expect(description).toContain("workflow automation");
  expect(description).toContain("prototypes");
  expect(description).toContain("web and mobile");
  expect(shell.title).toContain("Consultant");
  expect(html).not.toMatch(/name="robots"[^>]*noindex/i);

  const sitemap = read("public", "sitemap.xml");
  expect(sitemap).toContain("<loc>" + canonical + "</loc>");
  expect(sitemap).toContain("<lastmod>2026-09-23</lastmod>");
  expect(read("public", "robots.txt")).toContain("Sitemap: " + canonical + "sitemap.xml");

  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
});

it("publishes three distinct, linked, crawlable service briefs", () => {
  const home = new DOMParser().parseFromString(read("public", "index.html"), "text/html");
  const homeServices = JSON.parse(home.querySelector('script[type="application/ld+json"]').textContent)["@graph"]
    .filter((item) => item["@type"] === "Service");
  const slugs = ["ai-transformation", "prototype-to-product", "custom-digital-products"];
  const sitemap = read("public", "sitemap.xml");
  const llmsIndex = read("public", "llms.txt");

  expect((sitemap.match(/<loc>/g) || [])).toHaveLength(4);
  slugs.forEach((slug, index) => {
    const path = "/services/" + slug + "/";
    const url = "https://jason.yfyau.com" + path;
    const page = new DOMParser().parseFromString(read("public", "services", slug, "index.html"), "text/html");
    const service = JSON.parse(page.querySelector('script[type="application/ld+json"]').textContent);

    expect(page.querySelector('link[rel="canonical"]').getAttribute("href")).toBe(url);
    expect(page.querySelector('meta[property="og:url"]').getAttribute("content")).toBe(url);
    expect(page.querySelector('meta[name="description"]').getAttribute("content").length).toBeGreaterThan(80);
    expect(page.querySelectorAll("h1")).toHaveLength(1);
    expect(page.querySelector("h1").textContent).toBe(homeServices[index].name);
    expect(page.querySelectorAll(".plain-list li")).toHaveLength(3);
    expect(page.querySelectorAll(".steps li")).toHaveLength(3);
    expect(page.querySelector('.service-nav a[aria-current="page"]').getAttribute("href")).toBe(path);
    expect(page.querySelector('a[href^="mailto:"]')).not.toBeNull();
    expect(service.url).toBe(url);
    expect(service["@id"]).toBe(homeServices[index]["@id"]);
    expect(service.name).toBe(homeServices[index].name);
    expect(service.description).toBe(homeServices[index].description);
    expect(page.body.textContent).toContain(service.description);
    expect(sitemap).toContain("<loc>" + url + "</loc>");
    expect(llmsIndex).toContain(url);
  });
});
