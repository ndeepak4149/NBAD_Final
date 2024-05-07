describe('Login Component Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login'); // Adjust URL based on your routing
  });

  it('should display login form', () => {
    cy.get('h4').should('contain', 'Login');
    cy.get('form').should('exist');
  });

  it('should allow a user to login', () => {
    cy.get('input[formControlName=username]').type('testuser');
    cy.get('input[formControlName=password]').type('password');
    cy.get('form').submit();
    cy.url().should('include', '/'); // Assuming successful login redirects to dashboard
  });
});

describe('Signup Component Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/signUp'); // Adjust URL based on your routing
  });

  it('should display signup form', () => {
    cy.get('h4').should('contain', 'SignUp');
    cy.get('form').should('exist');
  });

  it('should allow a user to create an account', () => {
    cy.get('input[formControlName=username]').type('newuser');
    cy.get('input[formControlName=password]').type('newpassword');
    cy.get('form').submit();
    cy.url().should('include', '/login'); // Assuming successful signup redirects to dashboard
  });
});


describe('Home Access ', () => {
  beforeEach(() => {
    // Visit login page and perform login
    cy.visit('http://localhost:4200/login');
    cy.get('input[formControlName=username]').type('validUsername');
    cy.get('input[formControlName=password]').type('validPassword');
    cy.get('form').submit();
  });

  it('should redirect to home after successful login', () => {
   
    cy.url().should('include', '/');
  
  });
});

describe('Login Component Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should display login form', () => {
    cy.eyesOpen({
      appName: 'Budget Tracker',
      testName: 'Login Form Display'
    });
    cy.eyesCheckWindow('Login Page View'); // Description here acts like a step name
    cy.get('h4').should('contain', 'Login');
    cy.get('form').should('exist');
    cy.eyesClose();
  });

  it('should allow a user to login', () => {
    cy.eyesOpen({
      appName: 'Budget Tracker',
      testName: 'User Login Test'
    });
    cy.get('input[formControlName=username]').type('testuser');
    cy.get('input[formControlName=password]').type('password');
    cy.get('form').submit();
    cy.url().should('include', '/');
    cy.eyesCheckWindow('Dashboard View'); // Description here acts like a step name
    cy.eyesClose();
  });
});