import { expect, test } from "@playwright/test"

test("admin creates inventory and user books it", async ({ page }) => {
  const adminEmail = `admin-${Date.now()}@example.com`
  const email = `client-${Date.now()}@example.com`

  await page.goto("/register")
  await page.getByLabel("Name").fill("Studio Admin")
  await page.getByLabel("Email").fill(adminEmail)
  await page.getByLabel("Password").fill("password123")
  await page.getByLabel("Role").selectOption("admin")
  await page.getByRole("button", { name: "Register" }).click()

  await expect(page.getByRole("heading", { name: "Flash Booking Board" })).toBeVisible()
  await expect(page.getByText("admin", { exact: true })).toBeVisible()
  await expect(page.getByRole("tab", { name: "Flash Designs" })).toBeVisible()

  await page.getByRole("button", { name: "Create Design" }).click()
  const designDialog = page.getByRole("dialog").filter({ has: page.getByRole("heading", { name: "Create Design" }) })
  await expect(designDialog.getByRole("heading", { name: "Create Design" })).toBeVisible()
  await page.getByLabel("Name").fill("Black Rose")
  await page.getByLabel("Style").fill("Fine line botanical")
  await page.getByLabel("Duration").fill("90")
  await page.getByLabel("Price").fill("180")
  await page.getByLabel("Design image").selectOption("/designs/black-rose.svg")
  await designDialog.getByRole("button", { name: "Create Design" }).click()
  await expect(page.getByText("Design created.")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Black Rose" })).toBeVisible()

  await page.getByRole("button", { name: "Update" }).click()
  const updateDesignDialog = page.getByRole("dialog").filter({ has: page.getByRole("heading", { name: "Update Design" }) })
  await expect(updateDesignDialog.getByRole("heading", { name: "Update Design" })).toBeVisible()
  await updateDesignDialog.getByLabel("Price").fill("190")
  await updateDesignDialog.getByRole("button", { name: "Update Design" }).click()
  await expect(page.getByText("Design updated.")).toBeVisible()
  await expect(page.getByText("$190")).toBeVisible()

  await page.getByRole("button", { name: "Create Slot" }).click()
  const slotDialog = page.getByRole("dialog").filter({ has: page.getByRole("heading", { name: "Create Slot" }) })
  await expect(slotDialog.getByRole("heading", { name: "Create Slot" })).toBeVisible()
  await page.getByLabel("Date").fill("2026-07-01")
  await page.getByLabel("Time").fill("11:00 AM")
  await page.getByLabel("Artist").fill("Mara")
  await slotDialog.getByRole("button", { name: "Create Slot" }).click()
  await expect(page.getByText("Slot created.")).toBeVisible()
  await page.getByRole("tab", { name: "Studio Slots" }).click()
  await expect(page.getByRole("tabpanel").getByText("2026-07-01", { exact: true })).toBeVisible()
  await page.getByRole("button", { name: "Update" }).click()
  const updateSlotDialog = page.getByRole("dialog").filter({ has: page.getByRole("heading", { name: "Update Slot" }) })
  await expect(updateSlotDialog.getByRole("heading", { name: "Update Slot" })).toBeVisible()
  await updateSlotDialog.getByLabel("Time").fill("12:00 PM")
  await updateSlotDialog.getByRole("button", { name: "Update Slot" }).click()
  await expect(page.getByText("Slot updated.")).toBeVisible()
  await page.getByRole("tab", { name: "Studio Slots" }).click()
  await expect(page.getByText("12:00 PM with Mara")).toBeVisible()

  await page.getByRole("button", { name: "Logout" }).click()
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible()

  await page.getByLabel("Email").fill(adminEmail)
  await page.getByLabel("Password").fill("password123")
  await page.getByRole("button", { name: "Login" }).click()
  await expect(page.getByText("Invalid email or password.")).toBeVisible()

  await page.goto("/register")
  await page.getByLabel("Name").fill("Assignment Client")
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill("password123")
  await page.getByRole("button", { name: "Register" }).click()

  await expect(page.getByRole("heading", { name: "Flash Booking Board" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Book Flash" })).toBeVisible()
  await page.getByRole("tab", { name: "Flash Designs" }).click()
  await expect(page.getByRole("heading", { name: "Black Rose" })).toBeVisible()
  await page.getByRole("tab", { name: "Studio Slots" }).click()
  await expect(page.getByRole("tabpanel").getByText("2026-07-01", { exact: true })).toBeVisible()

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
