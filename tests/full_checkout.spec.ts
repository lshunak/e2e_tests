const { test, expect } = require('@playwright/test');

test('e 2 e flow', async ({ page }) => {

    try {

            // Go to the main page of the app
            console.log('Going to the main page of the app');
            await page.goto('https://main.d2t1pk7fjag8u6.amplifyapp.com/');
        
            //Sign in
            console.log('Signing in');
            await page.waitForSelector('input[name="username"]');
            await page.waitForSelector('input[name="password"]');
            
            await page.fill('input[name="username"]', 'liranshunak@gmail.com');
            await page.fill('input[name="password"]', 'LiranShunak1!');
            
            await page.click('button[type="submit"]');
        
            await page.waitForSelector('div.App', { timeout: 10000 }); 
        
            // Check that the app is visible
            const appDiv = await page.locator('div.App');
            await expect(appDiv).toBeVisible();
        
            // Add Product 1 to the cart 3 times
            console.log('Adding Product 1 to the cart 3 times');
            const quantityDropdown1 = page.locator('#product_id_1-product-quantity-select');
            await quantityDropdown1.selectOption({ value: '3' });
            const product1 = page.locator('li:has-text("Product 1")');
            const addToCartButton1 = product1.locator('button');
            await addToCartButton1.click();
            
            // Add Product 4 to the cart 2 times
            console.log('Adding Product 4 to the cart 2 times');
            const quantityDropdown4 = page.locator('#product_id_4-product-quantity-select');
            await quantityDropdown4.selectOption({ value: '2' });
            const product4 = page.locator('li:has-text("Product 4")');
            const addToCartButton4 = product4.locator('button');
            await addToCartButton4.click();
        
            // Go to the cart page
            console.log('checking cart');
            const goToCartLink = page.locator('a[href="/cart"]');
        
            await goToCartLink.click();
        
            // Check cart content
            const product1CartItem = page.locator('li:has-text("Product 1")');
            await expect(product1CartItem).toContainText('Quantity: 3');  
        
            const product4CartItem = page.locator('li:has-text("Product 4")');
            await expect(product4CartItem).toContainText('Quantity: 2');  
        
            // Checkout
            console.log('Checking out');
            const checkoutButton = page.locator('a[href="/checkout"]');
            await checkoutButton.click();
        
            const addressBox = page.locator('input[id="shipping-address-text"]');
            await addressBox.waitFor({ state: 'visible' });
            
            await addressBox.fill('Rehovot 1, Tel Aviv');
            
            let orderNumber;
        
            const dialogPromise = page.waitForEvent('dialog', { timeout: 90000 })
                .then(async dialog => {
                const message = dialog.message();
                const match = message.match(/checkout complete: (\S+)/i);
                if (match && match[1]) {
                    orderNumber = match[1];
                    console.log('Extracted Order Number:', orderNumber);
                    await dialog.accept();
                } else {
                    console.error('Order number not found in the dialog message');
                }
            })
                .catch(error => {
                console.error('Dialog did not appear in time:', error);
            });

            
            const checkoutButtonFinal = page.locator('button[id="checkout-button"]');
            await checkoutButtonFinal.click();
            
            await dialogPromise;
           
            expect(orderNumber).toBeDefined();
            
            const orderLocator = page.locator(`h2:has-text("${orderNumber}")`);
            await orderLocator.waitFor({ state: 'attached', timeout: 300000 }); 
            const orderExists = await orderLocator.count() > 0;
            expect(orderExists).toBe(true);

    }
    catch (error) {
        console.error("Test failed during the process:", error.message);

        console.log(error);
        throw error;
    }
});

