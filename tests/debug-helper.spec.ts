import { test } from '@playwright/test';

test('debug - see what\'s on the page', async ({ page }) => {
  // Login - FIXED LOCATORS
  console.log('🔑 Logging in...');
  await page.goto('https://hris.sckholdings.com');
  await page.getByPlaceholder('Your NIC Number').fill('742761266V');
  await page.locator('input[type="password"]').fill('Sck@2593');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForLoadState('networkidle');
  
  console.log('\n========== PAGE DEBUG INFO ==========');
  
  // Get page title
  const title = await page.title();
  console.log(`📌 Page title: ${title}`);
  
  // Get current URL
  const url = page.url();
  console.log(`🔗 Current URL: ${url}`);
  
  // Get all text on page
  const bodyText = await page.textContent('body');
  console.log(`\n📄 First 1000 characters of page:\n`);
  console.log(bodyText?.substring(0, 1000));
  
  // Get all links
  const links = await page.locator('a').all();
  console.log(`\n🔗 Found ${links.length} links on page`);
  // Print first 5 links
  for (let i = 0; i < Math.min(5, links.length); i++) {
    const text = await links[i].textContent();
    const href = await links[i].getAttribute('href');
    console.log(`   Link ${i+1}: "${text?.trim()}" -> ${href}`);
  }
  
  // Get all buttons
  const buttons = await page.locator('button').all();
  console.log(`\n🔄 Found ${buttons.length} buttons on page`);
  // Print first 5 buttons
  for (let i = 0; i < Math.min(5, buttons.length); i++) {
    const text = await buttons[i].textContent();
    console.log(`   Button ${i+1}: "${text?.trim()}"`);
  }
  
  // Get all headings
  const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
  console.log(`\n📑 Found ${headings.length} headings`);
  for (let i = 0; i < headings.length; i++) {
    const text = await headings[i].textContent();
    console.log(`   Heading ${i+1}: ${text?.trim()}`);
  }
  
  // Get all inputs
  const inputs = await page.locator('input').all();
  console.log(`\n⌨️ Found ${inputs.length} input fields`);
  for (let i = 0; i < inputs.length; i++) {
    const type = await inputs[i].getAttribute('type');
    const placeholder = await inputs[i].getAttribute('placeholder');
    console.log(`   Input ${i+1}: type="${type}", placeholder="${placeholder}"`);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/debug-full-page.png', fullPage: true });
  console.log('\n📸 Full page screenshot saved');
  
  console.log('\n========== DEBUG COMPLETE ==========');
});