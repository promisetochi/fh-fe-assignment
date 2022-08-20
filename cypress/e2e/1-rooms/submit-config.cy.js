/// <reference types="cypress" />

// To test these properly, I think adding test ids like data-test-id to elements would help
// But I think that's outside the scope of this assignment
describe(``, () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173")
  })

  it("allows changing adults count", () => {
    const adultsValueEl = cy.contains("Adults").next()

    adultsValueEl.should("contain.text", 1)
    adultsValueEl.find("button:last-child").click()

    adultsValueEl.prev().should("contain.text", 2)

    cy.contains("Search1 room(s)2 guest(s)").click()
    cy.url().should("eq", "http://localhost:5173/?rooms=2")
  })

  it("allows adding rooms", () => {
    const addRoomButton = cy.contains("button", "Add Room")

    addRoomButton.click()

    cy.contains("Search2 room(s)2 guest(s)").click()
    cy.url().should("eq", "http://localhost:5173/?rooms=1|1")
  })

  it("allows adding children", () => {
    const childrenValueContainer = cy.contains("Children").next()

    childrenValueContainer.should("contain.text", 0)
    childrenValueContainer.find("button:last-child").click()

    childrenValueContainer.prev().should("contain.text", 1)

    cy.contains("Search1 room(s)2 guest(s)").click()
    cy.url().should("eq", "http://localhost:5173/?rooms=1:0")
  })
})
