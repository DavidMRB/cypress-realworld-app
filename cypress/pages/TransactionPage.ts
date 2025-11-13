/**
 * Page Object para gestión de transacciones
 */
class TransactionPage {
  elements = {
    newTransactionButton: () => cy.getBySel("nav-top-new-transaction"),
    userSearchInput: () => cy.getBySel("user-list-search-input"),
    userListItem: (userId?: string) => {
      if (userId) {
        return cy.getBySel(`user-list-item-${userId}`);
      }
      return cy.getBySelLike("user-list-item");
    },
    amountInput: () => cy.getBySelLike("transaction-create-amount-input"),
    noteInput: () => cy.getBySelLike("transaction-create-description-input"),
    requestButton: () => cy.getBySel("transaction-create-submit-request"),
    payButton: () => cy.getBySel("transaction-create-submit-payment"),
    returnToTransactions: () => cy.getBySel("new-transaction-return-to-transactions"),
    // Cambiado para aceptar opciones
    alertSuccess: (options?: Partial<Cypress.Loggable & Cypress.Timeoutable>) =>
      cy.getBySel("alert-bar-success", options),
  };

  createNewTransaction() {
    this.elements.newTransactionButton().click();
    return this;
  }

  searchUser(username: string) {
    this.elements.userSearchInput().type(username);
    // Esperar a que los resultados de búsqueda aparezcan
    this.elements.userListItem().should("have.length.greaterThan", 0);
    return this;
  }

  selectUser(userId?: string) {
    if (userId) {
      this.elements.userListItem(userId).click({ force: true });
    } else {
      // Seleccionar el primer usuario disponible
      this.elements.userListItem().first().click({ force: true });
    }
    return this;
  }

  enterAmount(amount: string | number) {
    this.elements.amountInput().type(String(amount));
    return this;
  }

  enterNote(note: string) {
    this.elements.noteInput().type(note);
    return this;
  }

  submitPayment() {
    this.elements.payButton().click();
    return this;
  }

  submitRequest() {
    this.elements.requestButton().click();
    return this;
  }

  returnToTransactionsList() {
    this.elements.returnToTransactions().click();
    return this;
  }

  shouldShowSuccessAlert() {
    this.elements
      .alertSuccess({ timeout: 10000 })
      .should("be.visible")
      .and("contain", "Transaction Submitted");
    return this;
  }

  shouldHaveDisabledButtons() {
    this.elements.payButton().should("be.disabled");
    this.elements.requestButton().should("be.disabled");
    return this;
  }

  shouldHaveEnabledButtons() {
    this.elements.payButton().should("not.be.disabled");
    this.elements.requestButton().should("not.be.disabled");
    return this;
  }
}

export default TransactionPage;
