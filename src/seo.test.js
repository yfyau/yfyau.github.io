import fs from "fs";
import path from "path";
import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import PortfolioV2 from "./v2/PortfolioV2";

const read = (...segments) => fs.readFileSync(path.join(process.cwd(), ...segments), "utf8");

it("keeps all three visible consulting services consistent with crawlable metadata", () => {
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

  services.forEach((service, index) => {
    const card = cards[index];
    expect(service.name).toBe(card.querySelector("h3").textContent);
    expect(service.description).toBe(card.querySelector("p").textContent);
    expect(service.provider["@id"]).toBe(person["@id"]);
    expect(service.url).toBe(`${canonical}#${card.id}`);
    expect(html).toContain(service.name.replace("&", "&amp;"));
  });

  const consultingCopy = container.querySelector("#consulting").textContent;
  const mobileCopy = cards[2].textContent;
  expect(consultingCopy).not.toMatch(/\b(Flutter|Android|Swift|Kotlin|React Native)\b/i);
  expect(mobileCopy).toMatch(/discovery to launch/i);
  expect(mobileCopy).toMatch(/users and their pain points/i);
  expect(mobileCopy).toMatch(/intuitive experience/i);
  const description = shell.querySelector('meta[name="description"]').getAttribute("content");
  expect(description).toContain("systems and data reliability");
  expect(description).toContain("workflow automation");
  expect(description).toContain("mobile application development");
  expect(shell.title).toContain("Consultant");
  expect(html).not.toMatch(/name="robots"[^>]*noindex/i);

  const sitemap = read("public", "sitemap.xml");
  expect(sitemap).toContain(`<loc>${canonical}</loc>`);
  expect(sitemap).toContain("<lastmod>2026-09-22</lastmod>");
  expect(read("public", "robots.txt")).toContain(`Sitemap: ${canonical}sitemap.xml`);

  ReactDOM.unmountComponentAtNode(container);
  document.body.removeChild(container);
});
