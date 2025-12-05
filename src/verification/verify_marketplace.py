from playwright.sync_api import sync_playwright, expect

def verify_marketplace(page):
    print("Navigating to Marketplace...")
    # Adjust URL if needed, assuming default route or I need to navigate
    # I'll start at root and look for navigation or go directly
    page.goto("http://localhost:4200/#/marketplace")

    # Wait for the page to load
    print("Waiting for page content...")
    expect(page.get_by_text("Actionable Marketplace")).to_be_visible(timeout=30000)

    # Check if providers are listed
    print("Checking providers...")
    expect(page.get_by_text("GrowthHacker Agency")).to_be_visible()

    # Test Modal to ensure no infinite loop
    print("Testing Modal...")
    add_btn = page.get_by_role("button", name="Add My Own Resource")
    add_btn.click()

    modal_title = page.get_by_role("heading", name="Add Manual Resource")
    expect(modal_title).to_be_visible()

    # Close modal
    close_btn = page.get_by_role("button", name="Close") # Or whatever the close button text/label is. CoreUI usually has an 'x' or 'Close'
    # The template has <button cButtonClose (click)="toggleResourceModal()"></button> inside header
    # and Cancel button in footer.

    page.get_by_role("button", name="Cancel").click()
    expect(modal_title).not_to_be_visible()

    print("Modal verification passed.")
    page.screenshot(path="/home/jules/verification/marketplace_verified.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_marketplace(page)
            print("Verification Successful!")
        except Exception as e:
            print(f"Verification Failed: {e}")
            page.screenshot(path="/home/jules/verification/failure.png")
        finally:
            browser.close()
