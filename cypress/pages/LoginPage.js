/**
 * Page Object Model para la página de Login
 * Encapsula selectores y acciones relacionadas con autenticación
 */
class LoginPage {
  // Selectores
  elements = {
    usernameInput: () => cy.get('#username'),
    passwordInput: () => cy.get('#password'),
    signInButton: () => cy.get('[data-test="signin-submit"]'),
    errorMessage: () => cy.get('[data-test="signin-error"]'),
    rememberMeCheckbox: () => cy.get('[name="remember"]'),
    signUpLink: () => cy.contains('a', 'Sign Up')
  }

  // Acciones
  visit() {
    cy.visit('/signin');
    return this;
  }

  fillUsername(username) {
    this.elements.usernameInput().clear().type(username);
    return this;
  }

  fillPassword(password) {
    this.elements.passwordInput().clear().type(password);
    return this;
  }

  checkRememberMe() {
    this.elements.rememberMeCheckbox().check();
    return this;
  }

  clickSignIn() {
    this.elements.signInButton().click();
    return this;
  }

  // Métodos compuestos
  login(username, password, rememberMe = false) {
    this.fillUsername(username);
    this.fillPassword(password);
    
    if (rememberMe) {
      this.checkRememberMe();
    }
    
    this.clickSignIn();
    return this;
  }

  // Verificaciones
  shouldShowError() {
    this.elements.errorMessage().should('be.visible');
    return this;
  }

  shouldRedirectToDashboard() {
    cy.url().should('include', '/');
    cy.get('[data-test="sidenav"]').should('be.visible');
    return this;
  }
}

export default LoginPage;