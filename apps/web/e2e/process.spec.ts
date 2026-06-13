import { test, expect } from "@playwright/test";

const PROCESS_URL = "/unmsm/2026-1";

test.describe("Process page", () => {
  test("renders process header", async ({ page }) => {
    await page.goto(PROCESS_URL);
    await expect(page.getByTestId("process-header")).toBeVisible();
  });

  test("area filter changes visible programs", async ({ page }) => {
    await page.goto(PROCESS_URL);
    const initialCount = await page.getByTestId("program-row").count();
    await page.getByTestId("area-filter-A").click();
    const filteredCount = await page.getByTestId("program-row").count();
    expect(filteredCount).toBeLessThan(initialCount);
  });

  test("search filters applicant table", async ({ page }) => {
    await page.goto(PROCESS_URL);
    await page.getByTestId("program-row").first().click();
    const search = page.getByTestId("applicant-search");
    await search.fill("García");
    await expect(page.getByTestId("applicant-row").first()).toContainText("García");
  });

  test("clicking applicant row navigates to result page", async ({ page }) => {
    await page.goto(PROCESS_URL);
    await page.getByTestId("program-row").first().click();
    await page.getByTestId("applicant-row").first().click();
    await expect(page).toHaveURL(/applicant\/\d{6}/);
  });
});

test.describe("Process page — home", () => {
  test("home renders hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("hero-section")).toBeVisible();
    await expect(page.getByTestId("universities-grid")).toBeVisible();
  });

  test("proximos examenes renders timeline", async ({ page }) => {
    await page.goto("/proximos-examenes");
    await expect(page.getByTestId("calendar-timeline")).toBeVisible();
  });
});
