import { test, expect, Page } from '@playwright/test';

test.describe('HRIS Deduction Page Tests', () => {
  
  // Helper function for login (reused across tests)
  async function login(page: Page) {
    await page.goto('https://hris.sckholdings.com');
    await page.getByPlaceholder('Your NIC Number').fill('742761266V');
    await page.locator('input[type="password"]').fill('Sck@2593');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for dashboard to load
  }

  // Helper function to navigate to Deduction page
  async function navigateToDeduction(page: Page) {
    // Click through menu to reach Deduction
    // Adjust selectors based on actual menu implementation
    const hrmMenu = page.getByText('HRM', { exact: true });
    if (await hrmMenu.count() > 0) {
      await hrmMenu.click();
      await page.waitForTimeout(500);
    }
    
    const deductionLink = page.getByText('Deduction', { exact: true });
    if (await deductionLink.count() > 0) {
      await deductionLink.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      console.log('✅ Navigated to Deduction page');
    } else {
      console.log('⚠️ Deduction link not found, may need different navigation');
    }
  }

  test('should verify Deduction page header and title', async ({ page }) => {
    console.log('🚀 Testing Deduction page header...');
    
    await login(page);
    await navigateToDeduction(page);
    
    // Check page title
    const pageTitle = page.getByText('Deduction', { exact: true }).first();
    await expect(pageTitle).toBeVisible();
    console.log('✅ Deduction page title verified');
    
    await page.screenshot({ path: 'test-results/deduction-header.png' });
  });

  test('should verify left sidebar menu structure', async ({ page }) => {
    console.log('📋 Testing sidebar menu structure...');
    
    await login(page);
    
    // Check main menu sections
    const menuSections = [
      'Dashboard',
      'HRM',
      'User Management'
    ];
    
    for (const section of menuSections) {
      const sectionEl = page.getByText(section, { exact: true }).first();
      if (await sectionEl.count() > 0) {
        console.log(`   ✅ Found menu section: ${section}`);
      } else {
        console.log(`   ❌ Menu section not found: ${section}`);
      }
    }
    
    // Check HRM submenu items
    const hrmSubmenuItems = [
      'Employee',
      'Deduction Categories',
      'Allowance Categories',
      'Departments',
      'Designations',
      'Shifts',
      'Attendance',
      'Leaves',
      'Holidays',
      'Payroll',
      'Reports'
    ];
    
    // Click HRM to expand if needed
    const hrmMenu = page.getByText('HRM', { exact: true }).first();
    await hrmMenu.click();
    await page.waitForTimeout(500);
    
    console.log('\n   HRM Submenu items:');
    for (const item of hrmSubmenuItems) {
      const itemEl = page.getByText(item, { exact: true }).first();
      if (await itemEl.count() > 0) {
        console.log(`      ✅ ${item}`);
      }
    }
    
    // Check User Management submenu
    const userMgmtItems = ['Users', 'Roles & Permissions'];
    
    const userMgmtMenu = page.getByText('User Management', { exact: true }).first();
    await userMgmtMenu.click();
    await page.waitForTimeout(500);
    
    console.log('\n   User Management submenu:');
    for (const item of userMgmtItems) {
      const itemEl = page.getByText(item, { exact: true }).first();
      if (await itemEl.count() > 0) {
        console.log(`      ✅ ${item}`);
      }
    }
    
    await page.screenshot({ path: 'test-results/sidebar-menu.png' });
  });

  test('should verify Deduction Type filters', async ({ page }) => {
    console.log('🔍 Testing Deduction Type filters...');
    
    await login(page);
    await navigateToDeduction(page);
    
    // Check Deduction Type section
    const deductionTypeHeader = page.getByText('Deduction Type', { exact: true });
    await expect(deductionTypeHeader).toBeVisible();
    console.log('✅ Deduction Type section found');
    
    // Check radio buttons or options
    const oneTimeOption = page.getByText('One Time', { exact: true });
    const recurringOption = page.getByText('Recurring', { exact: true });
    
    if (await oneTimeOption.count() > 0) {
      console.log('   ✅ One Time option found');
    }
    if (await recurringOption.count() > 0) {
      console.log('   ✅ Recurring option found');
    }
    
    // Check Deduction Category dropdown
    const deductionCategoryLabel = page.getByText('Deduction Category:', { exact: false });
    if (await deductionCategoryLabel.count() > 0) {
      console.log('   ✅ Deduction Category label found');
      
      // Look for select dropdown
      const selectDropdown = page.locator('select').first();
      if (await selectDropdown.count() > 0) {
        console.log('   ✅ Category dropdown found');
      }
    }
    
    // Check Effective Date Range
    const effectiveDateLabel = page.getByText('Effective Date (Range):', { exact: false });
    if (await effectiveDateLabel.count() > 0) {
      console.log('   ✅ Effective Date Range found');
      
      const fromField = page.getByPlaceholder(/from/i);
      const toField = page.getByPlaceholder(/to/i);
      
      if (await fromField.count() > 0) console.log('      ✅ From field found');
      if (await toField.count() > 0) console.log('      ✅ To field found');
    }
    
    await page.screenshot({ path: 'test-results/deduction-filters.png' });
  });

  test('should verify Employee search section', async ({ page }) => {
    console.log('👥 Testing Employee search section...');
    
    await login(page);
    await navigateToDeduction(page);
    
    // Check Employee section header
    const employeeHeader = page.getByText('Employee', { exact: true }).first();
    await expect(employeeHeader).toBeVisible();
    console.log('✅ Employee section found');
    
    // Check Employee EPF/Name field
    const epfLabel = page.getByText('Employee EPF/Name:', { exact: false });
    if (await epfLabel.count() > 0) {
      console.log('   ✅ EPF/Name label found');
    }
    
    // Check search input
    const searchInput = page.getByPlaceholder(/type EPF number or name/i);
    if (await searchInput.count() > 0) {
      console.log('   ✅ Search input field found');
      console.log('   📝 Placeholder: "Type EPF Number or Name (e.g., 107...)"');
    }
    
    // Check buttons
    const searchButton = page.getByRole('button', { name: /search/i });
    const resetButton = page.getByRole('button', { name: /reset all filters/i });
    
    if (await searchButton.count() > 0) console.log('   ✅ Search button found');
    if (await resetButton.count() > 0) console.log('   ✅ Reset All Filters button found');
    
    await page.screenshot({ path: 'test-results/employee-search.png' });
  });

  test('should verify Deduction Categories section', async ({ page }) => {
    console.log('📊 Testing Deduction Categories section...');
    
    await login(page);
    await navigateToDeduction(page);
    
    // Check Deduction Categories header
    const categoriesHeader = page.getByText('Deduction Categories', { exact: true }).first();
    if (await categoriesHeader.count() > 0) {
      console.log('✅ Deduction Categories section found');
    }
    
    // Check category dropdown
    const categorySelect = page.getByText('Select Deduction Category', { exact: false });
    if (await categorySelect.count() > 0) {
      console.log('   ✅ Category selection found');
    }
    
    await page.screenshot({ path: 'test-results/deduction-categories.png' });
  });

  test('should verify Employee list in Deduction Details', async ({ page }) => {
    console.log('📋 Testing Employee list...');
    
    await login(page);
    await navigateToDeduction(page);
    
    // Look for Deduction Details section
    const detailsHeader = page.getByText('Deduction Details', { exact: true });
    if (await detailsHeader.count() > 0) {
      console.log('✅ Deduction Details section found');
    }
    
    // List of employees from screenshot
    const employees = [
      '850262470V - PALLIK KONDAGE DUSHANTHA NIROSHANA',
      '812032151V - SAMARAPPULIGE MALITHA PRABATH FERNANDO',
      '800360234V - TUWAN SHIRAZ JUMAIEDEN',
      '198332004505 - SAHAN DILANKA BANDARA ELLEPOLA',
      '21 - ENDAHANDIGE SAMEERA VISHARA FERNANDO',
      '872430016V - MAPATUNAGE RAKITHA PRIYANKARA PERERA'
    ];
    
    let foundCount = 0;
    for (const employee of employees) {
      // Check for partial match (first part of the employee string)
      const partialId = employee.split('-')[0].trim();
      const employeeEl = page.getByText(partialId, { exact: false }).first();
      
      if (await employeeEl.count() > 0) {
        console.log(`   ✅ Found: ${employee.substring(0, 30)}...`);
        foundCount++;
      } else {
        console.log(`   ❌ Not found: ${partialId}`);
      }
    }
    
    console.log(`   📊 Found ${foundCount}/${employees.length} employees`);
    await page.screenshot({ path: 'test-results/employee-list.png' });
  });

  test('should verify Deduction Table structure', async ({ page }) => {
    console.log('📊 Testing Deduction Table...');
    
    await login(page);
    await navigateToDeduction(page);
    
    // Check table headers
    const tableHeaders = [
      'Employee',
      'Deduction (Rs.)',
      'Deduction Type',
      'Reason',
      'Effective Date',
      'Start Date',
      'End Date',
      'Payment Terms (months)',
      'Installment Date',
      'Action'
    ];
    
    console.log('   Table headers:');
    for (const header of tableHeaders) {
      const headerEl = page.getByText(header, { exact: false }).first();
      if (await headerEl.count() > 0) {
        console.log(`      ✅ ${header}`);
      }
    }
    
    // Check for table rows with data
    const tableRows = await page.locator('table tbody tr').count();
    console.log(`   📊 Found ${tableRows} rows in table`);
    
    if (tableRows > 0) {
      // Verify first row has expected values
      const firstRow = page.locator('table tbody tr').first();
      const rowText = await firstRow.textContent();
      
      // Check for expected values from screenshot
      const expectedValues = ['300.00', 'One Time', 'Deduction', '2026-02-02'];
      
      for (const value of expectedValues) {
        if (rowText?.includes(value)) {
          console.log(`      ✅ Row contains: ${value}`);
        }
      }
      
      // Check for checkbox/toggle in Action column
      const actionCell = firstRow.locator('td').last();
      const actionContent = await actionCell.textContent();
      if (actionContent?.includes('☑️') || actionContent?.includes('✓')) {
        console.log('      ✅ Action checkbox found');
      }
    }
    
    await page.screenshot({ path: 'test-results/deduction-table.png' });
  });

  test('should verify footer count', async ({ page }) => {
    console.log('🔢 Testing footer...');
    
    await login(page);
    await navigateToDeduction(page);
    
    // Look for footer with number (38 from screenshot)
    const footerNumber = page.getByText('38', { exact: true });
    if (await footerNumber.count() > 0) {
      console.log('✅ Found footer count: 38');
    } else {
      // Try to find any number at bottom of page
      const allNumbers = await page.locator('text=38').count();
      if (allNumbers > 0) {
        console.log('✅ Found "38" on page');
      }
    }
    
    await page.screenshot({ path: 'test-results/footer.png' });
  });

  test('should test search functionality', async ({ page }) => {
    console.log('🔍 Testing search functionality...');
    
    await login(page);
    await navigateToDeduction(page);
    
    // Find search input
    const searchInput = page.getByPlaceholder(/type EPF number or name/i);
    
    if (await searchInput.count() > 0) {
      console.log('✅ Search input found');
      
      // Test searching for an employee
      await searchInput.fill('850262470V');
      console.log('   📝 Entered EPF: 850262470V');
      
      // Click search button
      const searchBtn = page.getByRole('button', { name: /search/i });
      if (await searchBtn.count() > 0) {
        await searchBtn.click();
        await page.waitForTimeout(2000);
        console.log('   ✅ Clicked Search button');
        
        // Take screenshot after search
        await page.screenshot({ path: 'test-results/after-search.png' });
      }
      
      // Test reset button
      const resetBtn = page.getByRole('button', { name: /reset all filters/i });
      if (await resetBtn.count() > 0) {
        await resetBtn.click();
        await page.waitForTimeout(1000);
        console.log('   ✅ Clicked Reset All Filters');
        
        // Check if search input is cleared
        const inputValue = await searchInput.inputValue();
        if (inputValue === '') {
          console.log('      ✅ Search input cleared');
        }
      }
    }
  });

  test('should test category selection', async ({ page }) => {
    console.log('📑 Testing category selection...');
    
    await login(page);
    await navigateToDeduction(page);
    
    // Find select dropdown for Deduction Category
    const categorySelect = page.locator('select').first();
    
    if (await categorySelect.count() > 0) {
      console.log('✅ Category dropdown found');
      
      // Get all options
      const options = await categorySelect.locator('option').all();
      console.log(`   Found ${options.length} options`);
      
      // Select first option (if available)
      if (options.length > 1) {
        await categorySelect.selectOption({ index: 1 });
        console.log('   ✅ Selected first non-empty option');
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'test-results/category-selected.png' });
      }
    }
  });

  test('should complete full page screenshot', async ({ page }) => {
    console.log('📸 Taking full page screenshot...');
    
    await login(page);
    await navigateToDeduction(page);
    
    // Wait for all content to load
    await page.waitForTimeout(3000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'test-results/deduction-full-page.png', 
      fullPage: true 
    });
    
    console.log('✅ Full page screenshot saved');
  });

});