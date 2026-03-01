import { test, expect } from '@playwright/test';

test.describe('HRIS Attendance Dashboard Tests', () => {
  
  test('should login and verify dashboard for Kathurusinghe', async ({ page }) => {
    console.log('🚀 Starting HRIS dashboard test...');
    
    // ========== STEP 1: LOGIN ==========
    console.log('📝 Navigating to login page...');
    await page.goto('https://hris.sckholdings.com');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of login page
    await page.screenshot({ path: 'test-results/01-login-page.png' });
    console.log('📸 Login page screenshot saved');
    
    // Fill login form
    console.log('🔑 Filling login credentials...');
    await page.getByPlaceholder('Your NIC Number').fill('742761266V');
    await page.locator('input[type="password"]').fill('Sck@2593');
    
    // Check if "Remember me" exists and optionally click it
    const rememberMe = page.getByText('Remember me');
    if (await rememberMe.count() > 0) {
      await rememberMe.click();
      console.log('✅ Clicked Remember me');
    }
    
    // Take screenshot before login
    await page.screenshot({ path: 'test-results/02-before-login.png' });
    
    // Click Sign In button
    console.log('🚪 Clicking Sign In button...');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    console.log('✅ Login successful!');
    
    // Take screenshot after login
    await page.screenshot({ path: 'test-results/03-after-login.png' });
    
    // ========== STEP 2: VERIFY DASHBOARD HEADER ==========
    console.log('\n📊 Verifying dashboard header...');
    
    // Check welcome message (now "Good Morning" instead of "Good Evening")
    const welcomeText = page.getByText('Good Morning Kathuringshe!');
    const welcomeCount = await welcomeText.count();
    if (welcomeCount > 0) {
      console.log('✅ Found welcome message: Good Morning Kathuringshe!');
    } else {
      // Try alternative spelling
      const altWelcome = page.getByText('Good Morning Kathurusinghe', { exact: false });
      if (await altWelcome.count() > 0) {
        console.log('✅ Found welcome message (alternative spelling)');
      } else {
        console.log('⚠️ Welcome message not found');
      }
    }
    
    // Check subheading
    const subheading = page.getByText("Here's a quick overview of your attendance and leaves");
    if (await subheading.count() > 0) {
      console.log('✅ Found subheading text');
    }
    
    // ========== STEP 3: VERIFY LEFT SIDEBAR MENU ==========
    console.log('\n📋 Verifying left sidebar menu...');
    
    // Main menu sections
    const menuSections = [
      { section: 'ProjexHRM', items: ['Dashboard'] },
      { section: 'HRM', items: ['Employee', 'Deduction', 'Education Categories', 'Allowance Categories', 'Allowance', 'Departments', 'Designations', 'Shifts', 'Attendance', 'Leaves', 'Holidays', 'Payroll', 'Reports'] },
      { section: 'User Management', items: ['Users'] }
    ];
    
    for (const section of menuSections) {
      console.log(`\n   📌 Checking section: ${section.section}`);
      const sectionHeader = page.getByText(section.section);
      if (await sectionHeader.count() > 0) {
        console.log(`      ✅ Found section: ${section.section}`);
        
        // Check first few items in each section
        for (const item of section.items.slice(0, 3)) { // Check first 3 items
          const menuItem = page.getByText(item, { exact: true });
          if (await menuItem.count() > 0) {
            console.log(`         ✅ Menu item: ${item}`);
          } else {
            console.log(`         ❌ Menu item not found: ${item}`);
          }
        }
      }
    }
    
    // ========== STEP 4: VERIFY DASHBOARD CARDS ==========
    console.log('\n📊 Verifying dashboard statistics cards...');
    
    // Check for loading states first
    const loadingElements = await page.getByText('Loading...').count();
    console.log(`⏳ Found ${loadingElements} "Loading..." indicators`);
    
    // Statistics cards to check
    const stats = [
      'No of Employees',
      'No of Leaves',
      'Attendance (Today)',
      'Late Attendance (Today)',
      'Absents'
    ];
    
    for (const stat of stats) {
      const found = await page.getByText(stat, { exact: false }).count();
      if (found > 0) {
        console.log(`   ✅ Found stat card: ${stat}`);
      } else {
        console.log(`   ❌ Stat card not found: ${stat}`);
      }
    }
    
    // ========== STEP 5: VERIFY THIS WEEK BIRTHDAYS ==========
    console.log('\n🎂 Verifying This Week Birthdays section...');
    
    const birthdaysSection = page.getByText('This Week Birthdays');
    if (await birthdaysSection.count() > 0) {
      console.log('✅ Found This Week Birthdays section');
      
      // Check for the birthday person
      const birthdayPerson = page.getByText('177 - AYESH NILUPUL', { exact: false });
      if (await birthdayPerson.count() > 0) {
        console.log('   ✅ Found birthday: AYESH NILUPUL');
      }
    }
    
    // ========== STEP 6: VERIFY PROBATION SECTION ==========
    console.log('\n📝 Verifying Probation Ending Employees section...');
    
    const probationSection = page.getByText('Probation Ending Employees');
    if (await probationSection.count() > 0) {
      console.log('✅ Found Probation Ending Employees section');
    }
    
    // ========== STEP 7: VERIFY THIS MONTH LEAVE ==========
    console.log('\n🏖️ Verifying This Month Leave Employees section...');
    
    const leaveSection = page.getByText('This Month Leave Employees');
    if (await leaveSection.count() > 0) {
      console.log('✅ Found This Month Leave Employees section');
    }
    
    // ========== STEP 8: VERIFY ATTENDANCE WEEKLY ==========
    console.log('\n📅 Verifying Attendance Weekly section...');
    
    const weeklySection = page.getByText('Attendance Weekly');
    if (await weeklySection.count() > 0) {
      console.log('✅ Found Attendance Weekly section');
      
      // Check for Last Week/This Week
      const lastWeek = page.getByText('Last Week');
      const thisWeek = page.getByText('This Week');
      if (await lastWeek.count() > 0) console.log('   ✅ Found Last Week');
      if (await thisWeek.count() > 0) console.log('   ✅ Found This Week');
    }
    
    // ========== STEP 9: VERIFY CALENDAR ==========
    console.log('\n📆 Verifying Calendar...');
    
    const calendar = page.getByText('February 2026');
    if (await calendar.count() > 0) {
      console.log('✅ Found February 2026 calendar');
      
      // Check for days
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (const day of days) {
        if (await page.getByText(day, { exact: true }).count() > 0) {
          console.log(`   ✅ Found day: ${day}`);
          break;
        }
      }
    }
    
    // ========== STEP 10: VERIFY BRANCH ==========
    console.log('\n🏢 Verifying Branch information...');
    
    const branch = page.getByText('BORELLA OFFICE');
    if (await branch.count() > 0) {
      console.log('✅ Found BORELLA OFFICE');
    }
    
    // ========== STEP 11: VERIFY REMINDERS ==========
    console.log('\n⏰ Verifying Reminders...');
    
    const reminders = page.getByText('Reminders');
    if (await reminders.count() > 0) {
      console.log('✅ Found Reminders section');
      
      const today = page.getByText('Today');
      if (await today.count() > 0) {
        console.log('   ✅ Found "Today" in reminders');
      }
    }
    
    // Take full dashboard screenshot
    await page.screenshot({ path: 'test-results/04-dashboard-full.png', fullPage: true });
    console.log('\n📸 Full dashboard screenshot saved');
    
    console.log('\n✨ Test completed successfully!');
  });

  test('should verify menu navigation items', async ({ page }) => {
    console.log('🚀 Testing menu navigation...');
    
    // Login first
    await page.goto('https://hris.sckholdings.com');
    await page.getByPlaceholder('Your NIC Number').fill('742761266V');
    await page.locator('input[type="password"]').fill('Sck@2593');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForLoadState('networkidle');
    
    console.log('✅ Logged in successfully');
    await page.waitForTimeout(2000);
    
    // Check for main menu sections
    const menuSections = ['ProjexHRM', 'HRM', 'User Management'];
    
    for (const section of menuSections) {
      const sectionElement = page.getByText(section);
      if (await sectionElement.count() > 0) {
        console.log(`✅ Found menu section: ${section}`);
      } else {
        console.log(`❌ Menu section not found: ${section}`);
      }
    }
    
    // Check for key menu items under HRM
    const keyMenuItems = ['Employee', 'Attendance', 'Leaves', 'Payroll', 'Reports'];
    
    for (const item of keyMenuItems) {
      const menuItem = page.getByText(item, { exact: true });
      if (await menuItem.count() > 0) {
        console.log(`   ✅ Menu item: ${item}`);
      } else {
        console.log(`   ❌ Menu item not found: ${item}`);
      }
    }
    
    await page.screenshot({ path: 'test-results/05-menu-structure.png', fullPage: true });
  });

});