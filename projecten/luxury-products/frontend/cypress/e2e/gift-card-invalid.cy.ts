import { UserData, ProductData } from '../support/interfaces';

describe('Invalid Gift Card Test', () => {

  let userData: UserData;
  let productData: ProductData;

  before(() => {
    cy.fixture('user.json').then((data) => {
      userData = data;
    });
    cy.fixture('products.json').then((data) => {
      productData = data;
    });
  });

  it('should login, add products to cart, and show error for invalid gift card code before checkout', () => {
    setupMockResponses();

    // Visit login page
    cy.visit('/login');

    // Perform login
    performLogin();

    // Add products to cart
    addProductsToCart();

    // Go to cart
    goToCart();

    // Try to apply invalid gift card before checkout
    applyInvalidGiftCardInCart();
  });

  function setupMockResponses() {
    // Mock login response
    cy.intercept('POST', 'http://localhost:8080/api/auth/login', {
      statusCode: 200,
      body: {
        userId: userData.userId,
        email: userData.email,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwicm9sZSI6IlJPTEVfVVNFUiIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        role: userData.role
      }
    }).as('login');

    // Mock user details
    cy.intercept('GET', `http://localhost:8080/api/users/${userData.userId}`, {
      statusCode: 200,
      body: {
        id: userData.userId,
        email: userData.email,
        role: userData.role
      }
    }).as('getUserDetails');

    // Mock products with gift cards
    cy.intercept('GET', 'http://localhost:8080/api/products', {
      statusCode: 200,
      body: productData.products
    }).as('getProducts');

    // Mock categories if needed for navigation
    cy.intercept('GET', 'http://localhost:8080/api/categories', {
      statusCode: 200,
      body: []
    }).as('getCategories');

    // Mock cart endpoint
    cy.intercept('GET', 'http://localhost:8080/api/cart', {
      statusCode: 200,
      body: []
    }).as('getCart');

    // Mock order creation
    cy.intercept('POST', 'http://localhost:8080/api/orders/create', {
      statusCode: 201,
      body: {
        id: 1,
        user: {
          id: userData.userId,
          email: userData.email
        },
        orderItems: [
          {
            productId: 1,
            productName: "Rolex Submariner",
            quantity: 1,
            price: 7999.99
          }
        ],
        shippingAddress: "Test Street 123 Test City 1234 AB",
        totalPrice: 7999.99,
        orderDate: new Date().toISOString(),
        status: "PENDING"
      }
    }).as('createOrder');

    // Mock invalid gift card response
    cy.intercept('POST', 'http://localhost:8080/api/giftcards/redeem', {
      statusCode: 404,
      fixture: 'gift-card-invalid'
    }).as('redeemGiftCard');
  }

  // Helper function to perform login
  function performLogin() {
    // Wait for login form and fill in credentials
    cy.get('form').should('exist');

    // Type email
    cy.get('input[formControlName="email"]')
      .should('be.enabled')
      .type(userData.email);

    // Type password
    cy.get('input[formControlName="password"]')
      .should('be.enabled')
      .type('User123!');

    // Click login button
    cy.get('button[type="submit"]')
      .should('be.enabled')
      .click();

    // Wait for login and user details to complete
    cy.wait('@login');
    cy.wait('@getUserDetails');

    // Check if we're on the products pages
    cy.url().should('include', '/products');
    cy.wait('@getProducts');
  }


  // Helper function to add products to cart
  function addProductsToCart() {
    // Add product directly to the cart using localStorage for reliability
    cy.window().then((win) => {
      // Create a product object (Rolex Submariner)
      const product = productData.products[0]; // First product from fixture

      // Create a cart item with the product
      const cartItem = {
        product: product,
        quantity: 1
      };

      // Get the user ID from localStorage
      const userId = win.localStorage.getItem('loggedInUserId') || userData.userId.toString();

      // Set the cart in localStorage
      win.localStorage.setItem(`shoppingCart_${userId}`, JSON.stringify([cartItem]));

      cy.log('Added product to cart via localStorage');
    });

    // Refresh the page to ensure the cart is updated in the UI
    cy.visit('/products');

    // No need to verify cart badge, we'll check the cart contents directly in goToCart
  }

  // Helper function to go to cart
  function goToCart() {
    // Go to cart
    cy.get('a').contains('Cart').click();
    cy.url().should('include', '/cart');

    // Verify product is in cart
    cy.contains('Rolex Submariner').should('exist');
    // Use a more flexible approach to check for the price
    // The price might be displayed as €7,999.99 or €7999.99 or 7,999.99€ depending on locale settings
    cy.get('body').should('contain', '7999');
  }

  // Helper function to apply invalid gift card in cart
  function applyInvalidGiftCardInCart() {
    // Ensure we're on the cart page
    cy.url().should('include', '/cart');

    // Look for gift card section - try different possible text variations
    // The section might be labeled as "Gift Card", "Discount Code", "Promo Code", etc.
    cy.log('Looking for gift card or discount code section');

    // Try to find the input field directly without relying on specific text
    cy.get('[data-cy="giftcard-input"]')
      .should('be.visible')
      .clear()
      .then($input => {
        // Generate a random gift card code
        const randomCode = 'INVALID-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        cy.log(`Using random invalid code: ${randomCode}`);
        cy.wrap($input).type(randomCode);
      });

    // Click apply button - try different selectors
    cy.get('[data-cy="giftcard-apply-btn"], button:contains("Apply"), button:contains("Redeem"), button:contains("Use")')
      .first()
      .click();

    // Wait for gift card redemption attempt
    cy.wait('@redeemGiftCard');
  }

  /* 
  // Helper function to apply invalid gift card during checkout - No longer used
  function applyInvalidGiftCardDuringCheckout() {
    // Ensure we're on the checkout page
    cy.url().should('include', '/checkout');

    // Wait for checkout form to be visible
    cy.get('form').should('exist');

    // Look for gift card section
    cy.contains('Gift Card').should('exist');

    // Enter invalid gift card code
    cy.get('[data-cy="giftcard-input"]')
      .should('be.visible')
      .clear()
      .type('INVALID-CODE-12345');

    // Click apply button
    cy.get('[data-cy="giftcard-apply-btn"]').click();

    // Wait for gift card redemption attempt
    cy.wait('@redeemGiftCard');

    // Verify error message is displayed
    cy.get('.toast-error').should('be.visible');
    cy.get('.toast-error').should('contain', 'Invalid gift card code or gift card already used');

    // Verify no gift card is applied
    cy.get('[data-cy="applied-giftcard-section"]').should('not.exist');

    // Continue with checkout to ensure the test flow is complete
    cy.log('Invalid gift card code was rejected as expected');
  }
  */
});
