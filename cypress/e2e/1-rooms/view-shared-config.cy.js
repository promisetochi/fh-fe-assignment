/// <reference types="cypress" />

// To test these properly, I think adding test ids like data-test-id to elements would help
// But I think that's outside the scope of this assignment
describe(``, () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/?rooms=2:1|2:14|1:16,1,1,0|1|1|1|1|1")
  })

  it("displays rooms", () => {
    Array(8)
      .fill("")
      .forEach((_, index) => {
        cy.findByText(`Room ${index + 1}`).should("exist")
      })
  })

  it("displays correct summary", () => {
    cy.findByText(`8 room(s)`).should("exist")
    cy.findByText(`16 guest(s)`).should("exist")
  })

  it("displays generations", () => {
    cy.findAllByText("Adults").should("have.length.of.at.least", 8)
    cy.findAllByText("Children").should("have.length.of.at.least", 8)
  })
})
