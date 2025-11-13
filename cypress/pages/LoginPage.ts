/**
 * Page Object Model para la página de Login
 * Encapsula selectores y acciones relacionadas con autenticación
 */
class LoginPage {
  // Selectores usando data-test attributes
  elements = {
    usernameInput: () => cy.getBySel("signin-username"),
    passwordInput: () => cy.getBySel("signin-password"),
    signInButton: () => cy.getBySel("signin-submit"),
    errorMessage: () => cy.getBySel("signin-error"),
    rememberMeCheckbox: () => cy.getBySel("signin-remember-me"),
    signUpLink: () => cy.contains("a", "Sign Up"),
    // Selectores para verificación post-login con soporte para opciones
    sidenav: (options?: Partial<Cypress.Loggable & Cypress.Timeoutable>) =>
      cy.getBySel("sidenav", options),
    sidenavHome: () => cy.getBySel("sidenav-home"),
    sidenavUsername: () => cy.getBySel("sidenav-username"),
  };

  // Acciones básicas
  visit() {
    cy.visit("/signin");
    // Esperar a que la página cargue completamente
    this.elements.usernameInput().should("be.visible");
    this.elements.passwordInput().should("be.visible");
    return this;
  }

  fillUsername(username: string) {
    this.elements.usernameInput().type(username);
    return this;
  }

  fillPassword(password: string) {
    this.elements.passwordInput().type(password);
    return this;
  }

  checkRememberMe() {
    this.elements.rememberMeCheckbox().find("input").check();
    return this;
  }

  clickSignIn() {
    // Asegurarse de que el botón está habilitado antes de hacer clic
    this.elements.signInButton().should("not.be.disabled").click();
    return this;
  }

  clickSignUp() {
    this.elements.signUpLink().click();
    return this;
  }

  // Métodos compuestos
  login(username: string, password: string, rememberMe = false) {
    this.fillUsername(username);
    this.fillPassword(password);

    if (rememberMe) {
      this.checkRememberMe();
    }

    this.clickSignIn();
    return this;
  }

  loginAndWait(username: string, password: string, rememberMe = false) {
    this.login(username, password, rememberMe);
    // Esperar a que la redirección ocurra
    cy.location("pathname", { timeout: 10000 }).should("eq", "/");
    // Esperar a que desaparezca el skeleton
    cy.getBySel("list-skeleton").should("not.exist");
    return this;
  }

  // Verificaciones
  shouldShowError(errorText?: string) {
    this.elements.errorMessage().should("be.visible");
    if (errorText) {
      this.elements.errorMessage().should("contain", errorText);
    }
    return this;
  }

  shouldRedirectToDashboard() {
    // Esperar redirección con timeout mayor
    cy.location("pathname", { timeout: 10000 }).should("eq", "/");

    // Verificar que el sidenav está visible (ahora acepta opciones)
    this.elements.sidenav({ timeout: 10000 }).should("be.visible");

    return this;
  }

  shouldBeOnSigninPage() {
    cy.url().should("include", "/signin");
    this.elements.signInButton().should("be.visible");
    return this;
  }

  shouldHaveDisabledSubmitButton() {
    this.elements.signInButton().should("be.disabled");
    return this;
  }

  shouldHaveEnabledSubmitButton() {
    this.elements.signInButton().should("not.be.disabled");
    return this;
  }

  // Helpers
  clearForm() {
    this.elements.usernameInput().clear();
    this.elements.passwordInput().clear();
    return this;
  }
}

export default LoginPage;
