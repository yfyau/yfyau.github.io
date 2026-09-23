import { getSiteVersion } from "./SiteVersion";

it("serves v2 by default and keeps the frozen version available by query", () => {
  expect(getSiteVersion("")).toBe(2);
  expect(getSiteVersion("?version=1")).toBe(1);
  expect(getSiteVersion("?version=3")).toBe(2);
  expect(getSiteVersion("?rev=2")).toBe(2);
  expect(getSiteVersion("?version=2")).toBe(2);
  expect(getSiteVersion("?rev=preview&version=2")).toBe(2);
});
