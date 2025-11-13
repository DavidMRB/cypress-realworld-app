/**
 * Page Object para gestión de transacciones
 */
class TransactionPage {
  elements = {
    newTransactionButton: () => cy.get('[data-test="nav-top-new-transaction"]'),
    userSearchInput: () => cy.get('[data-test="user-list-search-input"]'),
    userListItem: (username) => cy.get(`[data-test="user-list-item-${username}"]`),
    amountInput: () => cy.get("#amount"),
    noteInput: () => cy.get("#transaction-create-description-input"),
    requestButton: () => cy.get('[data-test="transaction-create-submit-request"]'),
    payButton: () => cy.get('[data-test="transaction-create-submit-payment"]'),
    returnToTransactions: () => cy.get('[data-test="new-transaction-return-to-transactions"]'),
  };

  createNewTransaction() {
    this.elements.newTransactionButton().click();
    return this;
  }

  searchUser(username) {
    this.elements.userSearchInput().type(username);
    return this;
  }

  selectUser(username) {
    this.elements.userListItem(username).click();
    return this;
  }

  enterAmount(amount) {
    this.elements.amountInput().type(amount);
    return this;
  }

  enterNote(note) {
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
}

export default TransactionPage;
