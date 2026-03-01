import { test } from '@playwright/test';

test('find dashboard URL', async ({ page }) => {
  console.log('\n🔍 Searching for your dashboard...\n');
  
  // Common local development URLs to try
  const urlsToTry = [
    'https://hris.sckholdings.com/#/',
    
  ];
  
  for (const url of urlsToTry) {
    console.log(`Trying: ${url}`);
    try {
      await page.goto(url, { timeout: 3000 });
      console.log(`✅ SUCCESS! Page loaded from: ${url}`);
      
      // Get page title and some text to verify
      const title = await page.title();
      console.log(`   Page title: ${title}`);
      
      // Check if it might be your dashboard
      const pageText = await page.textContent('body');
      if (pageText?.includes('Kathurusinghe')) {
        console.log(`   🎯 FOUND YOUR DASHBOARD! Contains "Kathurusinghe"`);
      }
      
      // Take screenshot
      await page.screenshot({ path: `test-results/url-found.png` });
      console.log(`   📸 Screenshot saved`);
      
      break;
    } catch (error) {
      console.log(`❌ Failed: ${url}`);
    }
  }
});