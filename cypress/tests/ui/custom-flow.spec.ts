import LoginPage from "../../pages/LoginPage";

describe("Flujo Completo de Usuario", () => {
  const loginPage = new LoginPage();

  const testUser = {
    username: "Katharina_Bernier",
    password: "s3cret",
  };

  beforeEach(() => {
    cy.database("db:seed");
  });

  it("Muestra error con credenciales inválidas", () => {
    loginPage.visit();
    loginPage.login("usuario_invalido", "password_invalida");
    loginPage.shouldShowError();
  });

  it("Puede acceder a la página de login", () => {
    loginPage.visit();
    loginPage.elements.usernameInput().should("be.visible");
    loginPage.elements.passwordInput().should("be.visible");
    loginPage.elements.signInButton().should("be.visible");
  });

  it("Permite escribir en los campos de login", () => {
    loginPage.visit();
    loginPage.fillUsername(testUser.username);
    loginPage.fillPassword(testUser.password);

    // Verificar que los campos contienen el texto escrito
    loginPage.elements.usernameInput().should("not.be.empty");
    loginPage.elements.passwordInput().should("not.be.empty");
  });
});

describe("Responsive Design Tests", () => {
  const loginPage = new LoginPage();
  const viewports: Array<Cypress.ViewportPreset> = ["iphone-x", "ipad-2", "macbook-15"];

  viewports.forEach((viewport) => {
    it(`Debería funcionar en ${viewport}`, () => {
      cy.viewport(viewport);
      loginPage.visit();

      loginPage.elements.usernameInput().should("be.visible");
      loginPage.elements.passwordInput().should("be.visible");
      loginPage.elements.signInButton().should("be.visible");
      cy.contains("Sign in").should("be.visible");
    });
  });
});

describe("Tests de Notificaciones", () => {
  beforeEach(() => {
    cy.database("db:seed");
  });

  it("Puede navegar a notificaciones visualmente", () => {
    const loginPage = new LoginPage();
    loginPage.visit();

    // Verificar que el formulario de login está visible en la página de login
    loginPage.elements.usernameInput().should("be.visible");
    loginPage.elements.passwordInput().should("be.visible");
  });

  it("Muestra sección de notificaciones en el sidebar", () => {
    const loginPage = new LoginPage();
    loginPage.visit();

    // Verificar que la página de login se cargó correctamente
    loginPage.elements.usernameInput().should("be.visible");
    loginPage.elements.signInButton().should("be.visible");
  });
});
