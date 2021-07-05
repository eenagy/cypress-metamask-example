describe("User can load page", () => {
  function connect() {
    cy.get("[data-cy=connect]").click();
    cy.acceptMetamaskAccess();
  }
  // TODO this case cannot be tested as the plugin installs metamask before the browser startsup
  // it("is expected to display an install message", () => {
  //   cy.switchToCypressWindow()
  //   cy.get("[data-cy=title]").should("contain.text", "No MetaMask Detected - please install the extension!");
  // });

  describe("and metamask is installed", ()=>{
    before(() => {
      cy.setupMetamask();
      cy.changeMetamaskNetwork("localhost");
      cy.visit("/");
      // this is happening to fail the tests
      // it's possible that the user connected the account, which should automatically reconnect
      // but current metamask implementation doesn't give us a way to query isSiteConnected
      // alternate localstorage implementation could work, but the user could clear the cache
      // so it's not a full solution
      // sticking with connect/disconnect now
      connect();
      cy.disconnectAccounts([ 1 ]);
      cy.wait(2000);
    });
    describe("no details should be shown with account disconnected", () => {
      it("is expected to display a metamask message", () => {
        cy.get("[data-cy=title]").should("contain.text", "MetaMask Detected");
      });
  
      it("is expected to display no address", () => {
        cy.get("[data-cy=address").should("contain.text", "Your address is: -");
      });
  
      it("is expected to display empty balance", () => {
        cy.get("[data-cy=balance").should("contain.text", "Balance: -");
      });
    });
    describe("should show account details after connect", () => {
      before(() => {
        connect();
      });
  
      it("is expected to display a success message", () => {
        cy.get("[data-cy=title]").should("contain.text", "MetaMask Detected");
      });
  
      it("is expected to display the local wallet address", () => {
        cy.get("[data-cy=address").should(
          "contain.text",
          "Your address is: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
        );
      });
  
      it("is expected to display the local wallet  balance", () => {
        cy.get("[data-cy=balance").should(
          "contain.text",
          "Balance: 10000000000000000000000"
        );
      });
    });
  })

});
