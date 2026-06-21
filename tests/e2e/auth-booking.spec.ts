import { expect, test } from "@playwright/test"

test("register, logout, login, and submit booking", async ({ page }) => {
  const email = `client-${Date.now()}@example.com`

  await page.goto("/register")
  await page.getByLabel("Name").fill("Assignment Client")
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill("password123")
  await page.getByRole("button", { name: "Register" }).click()

  await expect(page.getByRole("heading", { name: "Flash Booking Board" })).toBeVisible()
  await expect(page.getByText(email)).toBeVisible()

  await page.getByRole("button", { name: "Logout" }).click()
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible()

  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill("password123")
  await page.getByRole("button", { name: "Login" }).click()

  await expect(page.getByRole("heading", { name: "Flash Booking Board" })).toBeVisible()
  await page.getByLabel("Design", { exact: true }).selectOption("black-rose")
  await page.getByLabel("Date and time").selectOption({ index: 0 })
  await page.getByRole("button", { name: "Submit Booking" }).click()

  await expect(page.getByText("Booking confirmed.")).toBeVisible()
  await expect(page.getByTestId("user-booking").getByText("Black Rose")).toBeVisible()
})

test("dashboard redirects anonymous users to login", async ({ page }) => {
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible()
})
