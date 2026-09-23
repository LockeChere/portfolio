import { UserData } from '../support/interfaces';

describe('Gift Card Purchase Test', () => {

  let userData: UserData;

  before(() => {
    cy.fixture('user.json').then((data) => {
      userData = data;
    });
  });

  it('should login, purchase a gift card, and complete checkout', () => {
    setupMockResponses();

    // Visit login pages
    cy.visit('/login');

    // Perform login
    performLogin();

    // Add gift card to cart and checkout
    addGiftCardToCartAndCheckout();

    // Fill shipping details and place order
    fillShippingDetailsAndPlaceOrder();

    // Verify order success
    cy.url().should('include', '/user/2');
    cy.get('.order-item').should('exist');
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
      fixture: 'products'
    }).as('getProducts');

    // No need to mock categories for gift card purchase
    // Removed category mock as it's not needed

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
            productId: 10,
            productName: "Gift Card €50",
            quantity: 1,
            price: 50.00
          }
        ],
        shippingAddress: "Test Street 123 Test City 1234 AB",
        totalPrice: 50.00,
        orderDate: new Date().toISOString(),
        status: "PENDING"
      }
    }).as('createOrder');

    // Mock user orders
    cy.intercept('GET', `http://localhost:8080/api/orders/${userData.userId}`, {
      statusCode: 200,
      body: [
        {
          id: 1,
          user: {
            id: userData.userId,
            email: userData.email
          },
          orderItems: [
            {
              productId: 10,
              productName: "Gift Card €50",
              quantity: 1,
              price: 50.00
            }
          ],
          shippingAddress: "Test Street 123 Test City 1234 AB",
          totalPrice: 50.00,
          orderDate: new Date().toISOString(),
          status: "PENDING"
        }
      ]
    }).as('getUserOrders');
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

  // Helper function to add gift card to cart and go to checkout
  function addGiftCardToCartAndCheckout() {
    // Directly add the gift card to the cart by manipulating localStorage
    cy.window().then((win) => {
      // Create a gift card product
      const giftCardProduct = {
        id: 10,
        name: "Gift Card €50",
        description: "Gift card with a value of €50",
        price: 50.00,
        stock: 10,
        category: "Gift Cards",
        imageUrl: "assets/images/gift-card.jpg"
      };

      // Create a cart item with the gift card
      const cartItem = {
        product: giftCardProduct,
        quantity: 1
      };

      // Get the user ID from localStorage
      const userId = win.localStorage.getItem('loggedInUserId') || userData.userId.toString();

      // Set the cart in localStorage
      win.localStorage.setItem(`shoppingCart_${userId}`, JSON.stringify([cartItem]));

      cy.log('Added gift card to cart via localStorage');
    });

    // Go to cart page (with a reload to ensure the cart is loaded from localStorage)
    cy.visit('/cart');

    // Verify gift card is in cart
    cy.contains('Gift Card €50').should('exist');
    cy.contains('€50.00').should('exist');

    // Proceed to checkout
    cy.get('button').contains('Checkout').click();
  }

  // Helper function to fill shipping details and place order
  function fillShippingDetailsAndPlaceOrder() {
    // Wait for shipping form and fill in details
    cy.get('form').should('exist');

    // Fill in shipping details
    cy.get('input[formControlName="street"]')
      .should('be.visible')
      .should('be.enabled')
      .type('Test Street 123');

    cy.get('input[formControlName="city"]')
      .should('be.visible')
      .should('be.enabled')
      .type('Test City');

    cy.get('input[formControlName="zip_code"]')
      .should('be.visible')
      .should('be.enabled')
      .type('1234 AB');

    // Submit order
    cy.get('button[type="submit"]').click();
    cy.wait('@createOrder');
  }
});
