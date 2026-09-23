import { UserData } from '../support/interfaces';

describe('Valid Gift Card Redemption Test', () => {

  let userData: UserData;

  before(() => {
    cy.fixture('user.json').then((data) => {
      userData = data;
    });
  });

  it('should login, add products to cart, and apply a valid gift card', () => {
    setupMockResponses();

    // Visit login page
    cy.visit('/login');

    // Perform login
    performLogin();

    // Add products to cart
    addProductsToCart();

    // Go to cart
    goToCart();

    // Apply valid gift card in cart
    applyValidGiftCardInCart();
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

    // Mock products
    cy.intercept('GET', 'http://localhost:8080/api/products', {
      statusCode: 200,
      fixture: 'products'
    }).as('getProducts');

    // Mock valid gift card response
    cy.intercept('POST', 'http://localhost:8080/api/giftcards/redeem', {
      statusCode: 200,
      body: {
        id: 1,
        value: 50,
        used: false,
        balance: 50,
        code: 'GIFT-1234-5678-9ABC',
        categoryId: 1
      }
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

    // Check if we're on the products page
    cy.url().should('include', '/products');
    cy.wait('@getProducts');
  }

  // Helper function to add products to cart
  function addProductsToCart() {
    // Add product directly to the cart using localStorage for reliability
    cy.window().then((win) => {
      // Create a product object (Rolex Submariner)
      const product = {
        id: 1,
        name: "Rolex Submariner",
        description: "Luxury watch",
        price: 7999.99,
        stock: 5,
        category: "Watches",
        imageUrl: "assets/images/rolex.jpg"
      };

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
  }

  // Helper function to go to cart
  function goToCart() {
    // Go to cart
    cy.get('a').contains('Cart').click();
    cy.url().should('include', '/cart');

    // Verify product is in cart
    cy.contains('Rolex Submariner').should('exist');
    cy.get('body').should('contain', '7999');
  }

  // Helper function to apply valid gift card in cart
  function applyValidGiftCardInCart() {
    // Ensure we're on the cart page
    cy.url().should('include', '/cart');

    // Enter valid gift card code
    cy.get('[data-cy="giftcard-input"]')
      .should('be.visible')
      .clear()
      .type('GIFT-1234-5678-9ABC');

    // Click apply button
    cy.get('[data-cy="giftcard-apply-btn"], button:contains("Apply"), button:contains("Redeem"), button:contains("Use")')
      .first()
      .click();

    // Wait for gift card redemption
    cy.wait('@redeemGiftCard');

    // Add a small delay to ensure UI updates
    cy.wait(500);

    // Verify gift card is applied - using more flexible selectors and text matching
    // Try multiple possible text variations that might appear in the UI
    cy.get('body').then($body => {
      const successTexts = [
        'Gift Card Applied', 
        'Gift card applied', 
        'Cadeaubon toegepast', 
        'Gift card successfully applied',
        'Discount applied'
      ];

      // Check if any of the success texts exist
      const textExists = successTexts.some(text => $body.text().includes(text));
      expect(textExists, 'Gift card success message should be visible').to.be.true;

      // Log which text was found for debugging
      if (textExists) {
        successTexts.forEach(text => {
          if ($body.text().includes(text)) {
            cy.log(`Found success message: "${text}"`);
          }
        });
      }
    });

    // Verify discount amount - using more flexible approach
    cy.get('body').then($body => {
      const discountTexts = [
        '€50.00 discount', 
        '€50,00 discount',
        '50.00€ discount',
        '50,00€ discount',
        'Discount: €50.00',
        'Discount: 50.00€',
        '-€50.00',
        '-50.00€'
      ];

      // Check if any of the discount texts exist
      const textExists = discountTexts.some(text => $body.text().includes(text));
      expect(textExists, 'Discount amount should be visible').to.be.true;

      // Log which text was found for debugging
      if (textExists) {
        discountTexts.forEach(text => {
          if ($body.text().includes(text)) {
            cy.log(`Found discount text: "${text}"`);
          }
        });
      }
    });
  }

});
