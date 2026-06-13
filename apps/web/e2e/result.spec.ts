import { test, expect } from "@playwright/test";

// Uses mock data from getResultData.ts — update codes when wired to real DB
const ADMITTED_URL = "/unmsm/2026-1/applicant/100001";
const NOT_ADMITTED_URL = "/unmsm/2026-1/applicant/100002";

test.describe("Result page — admitted", () => {
  test("renders score hero with admitted status", async ({ page }) => {
    await page.goto(ADMITTED_URL);
    await expect(page.getByTestId("score-hero")).toBeVisible();
    await expect(page.getByTestId("applicant-status")).toHaveText(/Ingresó/i);
  });

  test("shows position bar", async ({ page }) => {
    await page.goto(ADMITTED_URL);
    await expect(page.getByTestId("position-bar")).toBeVisible();
  });

  test("shows reachable programs list", async ({ page }) => {
    await page.goto(ADMITTED_URL);
    await expect(page.getByTestId("reachable-programs")).toBeVisible();
  });

  test("share button is present", async ({ page }) => {
    await page.goto(ADMITTED_URL);
    await expect(page.getByTestId("share-button")).toBeVisible();
  });
});

test.describe("Result page — not admitted", () => {
  test("shows amber deficit pill", async ({ page }) => {
    await page.goto(NOT_ADMITTED_URL);
    await expect(page.getByTestId("points-to-admission")).toBeVisible();
  });

  test("applicant status is not admitted", async ({ page }) => {
    await page.goto(NOT_ADMITTED_URL);
    await expect(page.getByTestId("applicant-status")).toHaveText(/No ingresó/i);
  });
});

test.describe("Result page — 404", () => {
  test("invalid code shows not-found", async ({ page }) => {
    await page.goto("/unmsm/2026-1/applicant/999999");
    await expect(page).toHaveURL(/unmsm\/2026-1\/applicant\/999999/);
    await expect(page.getByTestId("not-found")).toBeVisible();
  });
});
