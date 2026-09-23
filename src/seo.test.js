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
    expect(currentAnchor).not.toBeNull();
    expect(service.name).toBe(card.querySelector("h3").textContent);
    expect(service.description).toBe(card.querySelector("p").textContent);
    expect(service.provider["@id"]).toBe(person["@id"]);
    expect(service.url).toBe(canonical + "#" + currentAnchor.id);
    expect(service["@id"]).toBe(service.url);
    expect(html).toContain(service.name);
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
