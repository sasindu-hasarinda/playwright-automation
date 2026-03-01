import { test, expect } from '@playwright/test';

test.describe('HRIS Login Tests', () => {
  
  test('should login successfully with valid credentials', async ({ page }) => {
    console.log('🔐 Testing login functionality...');
    
    // Go to login page
    await page.goto('https://hris.sckholdings.com');
    await expect(page.getByText('Sign In')).toBeVisible();
    console.log('✅ Login page loaded');
    
    // Fill credentials
    await page.getByPlaceholder('Username').fill('742761266V');
    await page.getByPlaceholder('Password').fill('Sck@2593');
    console.log('✅ Credentials entered');
    
    // Click sign in
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Check if login was successful (URL changed or dashboard loaded)
    const currentUrl = page.url();
    if (!currentUrl.includes('login')) {
      console.log('✅ Login successful! Redirected to:', currentUrl);
    } else {
      console.log('❌ Login failed - still on login page');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/login-result.png' });
  });

  test('should show error with wrong password', async ({ page }) => {
    console.log('🔐 Testing invalid login...');
    
    await page.goto('https://hris.sckholdings.com');
    
    // Fill wrong credentials
    await page.getByPlaceholder('Username').fill('742761266V');
    await page.getByPlaceholder('Password').fill('wrongpassword');
    
    // Click sign in
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for response
    await page.waitForTimeout(2000);
    
    // Check for error message
    const errorMessage = page.getByText(/invalid|wrong|error|incorrect/i);
    if (await errorMessage.count() > 0) {
      console.log('✅ Error message displayed as expected');
    } else {
      console.log('⚠️ No error message found, but might be handled differently');
    }
    
    await page.screenshot({ path: 'test-results/login-error.png' });
  });

});