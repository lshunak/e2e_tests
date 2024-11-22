require('dotenv').config();
const { test, expect } = require('@playwright/test');
test('e 2 e flow', async ({ page }) => {

    try {
            const appUrl = process.env.APP_URL;
            const username = process.env.USERNAME;
            const password = process.env.PASSWORD;
            const shippingAddress = process.env.SHIPPING_ADDRESS;

            // Go to the main page of the app
            console.log('Going to the main page of the app');
            await page.goto(appUrl);
        
            //Sign in
            console.log('Signing in');
            await page.waitForSelector('input[name="username"]');
            await page.waitForSelector('input[name="password"]');
            
            await page.fill('input[name="username"]', username);
            await page.fill('input[name="password"]', password);
            
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
            
            await addressBox.fill(shippingAddress);
            
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
            

            console.log('Navigating to the orders page');
            const ordersLink = page.locator('a[href="/orders"]');
            await ordersLink.click();
        
            // Verify the order
            console.log(`Verifying order ${orderNumber} details`);

            const orderHeadingSelector = `h2:has-text("Order ${orderNumber} to ${shippingAddress}")`;
            const orderHeading = page.locator(orderHeadingSelector);
            await expect(orderHeading).toBeVisible({ timeout: 5000 });
        
            const products = [
              { name: 'Product 1', quantity: 3 },
              { name: 'Product 4', quantity: 2 }
            ];

            for (const product of products) {
                const orderItemSelector = `h2:has-text("Order ${orderNumber} to ${shippingAddress}") + ul > li:has-text("${product.name} -")`;
                const orderItem = page.locator(orderItemSelector);
                await expect(orderItem).toBeVisible({ timeout: 5000 });
          
                const textContent = await orderItem.textContent();
                if (!textContent?.includes(`Quantity: ${product.quantity}`)) {
                  throw new Error(
                    `Expected quantity ${product.quantity} for "${product.name}", but found different quantity.`
                  );
                }
                console.log(`Product Verified: ${product.name}, Quantity: ${product.quantity}`);
              }

            }
    catch (error) {
        console.error("Test failed during the process:", error.message);

        console.log(error);
        throw error;
    }
});

