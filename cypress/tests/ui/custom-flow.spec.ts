import LoginPage from "../../pages/LoginPage";
import TransactionPage from "../../pages/TransactionPage";

describe("Flujo Completo de Usuario", () => {
  const loginPage = new LoginPage();
  const transactionPage = new TransactionPage();

  // Datos de prueba
    const testUser = {
    username: "Katharina_Bernier",
    // 🔒 Evitamos hard-coded passwords:
    password: Cypress.env("TEST_USER_PASSWORD") || "default_password",
    };

  beforeEach(() => {
    // Limpiar cookies y visitar la app
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("Usuario puede hacer login exitoso", () => {
    loginPage.visit().login(testUser.username, testUser.password).shouldRedirectToDashboard();

    // Verificar elementos del dashboard
    cy.get('[data-test="sidenav-home"]').should("be.visible");
    cy.get('[data-test="sidenav-user-full-name"]').should("contain", "Katharina");
  });

  it("Muestra error con credenciales inválidas", () => {
    loginPage.visit().login("usuario_invalido", "password_invalida").shouldShowError();

    cy.url().should("include", "/signin");
  });

  it("Usuario puede crear una nueva transacción", () => {
    // Login
    cy.visit("/signin");
    loginPage.login(testUser.username, testUser.password);

    // Crear transacción
    transactionPage.createNewTransaction().searchUser("Devon").selectUser("t45AiwidW");

    // Ingresar detalles
    transactionPage.enterAmount("50.00").enterNote("Pago de prueba automatizado").submitPayment();

    // Verificar éxito
    cy.get('[data-test="alert-bar-success"]')
      .should("be.visible")
      .and("contain", "Transaction Submitted");
  });

  it("Validación de campo de monto", () => {
    cy.visit("/signin");
    loginPage.login(testUser.username, testUser.password);

    transactionPage.createNewTransaction().searchUser("Devon").selectUser("t45AiwidW");

    // Intentar monto inválido
    transactionPage.enterAmount("0");

    // Botones deberían estar deshabilitados
    transactionPage.elements.payButton().should("be.disabled");
    transactionPage.elements.requestButton().should("be.disabled");
  });

  it("Usuario puede navegar entre secciones", () => {
    cy.visit("/signin");
    loginPage.login(testUser.username, testUser.password);

    // Navegar a "My Account"
    cy.get('[data-test="sidenav-user-settings"]').click();
    cy.url().should("include", "/user/settings");

    // Navegar a "Notifications"
    cy.get('[data-test="sidenav-notifications"]').click();
    cy.url().should("include", "/notifications");

    // Volver a Home
    cy.get('[data-test="sidenav-home"]').click();
    cy.url().should("match", /\/$|\/home/);
  });

  it("Búsqueda de transacciones funciona correctamente", () => {
    cy.visit("/signin");
    loginPage.login(testUser.username, testUser.password);

    // Buscar transacción
    cy.get('[data-test="transaction-list-filter-date-range-button"]').click();
    cy.get('[data-test="transaction-list-filter-date-range-all"]').click();

    // Verificar que se muestran transacciones
    cy.get('[data-test^="transaction-item"]').should("have.length.greaterThan", 0);
  });
});

describe("Responsive Design Tests", () => {
  const viewports = [
    { device: "iphone-x", width: 375, height: 812 },
    { device: "ipad-2", width: 768, height: 1024 },
    { device: "macbook-15", width: 1440, height: 900 },
  ];

  viewports.forEach((viewport) => {
    it(`Debería funcionar correctamente en ${viewport.device}`, () => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit("/signin");

      // Verificar elementos visibles
      cy.get("#username").should("be.visible");
      cy.get("#password").should("be.visible");
      cy.get('[data-test="signin-submit"]').should("be.visible");
    });
  });
});
