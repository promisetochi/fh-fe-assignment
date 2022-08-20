import { describe, expect, it } from "vitest"
import { RoomsLexer } from "../src/lib/RoomsLexer"

describe("Rooms Lexer", () => {
  describe("parsing", () => {
    it("should parse single room with adults only", () => {
      const rm = new RoomsLexer()
      const singleAdultAst = rm.parse("1")
      const multiAdultAst = rm.parse("5")

      expect(singleAdultAst).toStrictEqual({
        type: "Rooms",
        configuration: [
          {
            type: "Room",
            configuration: [
              {
                type: "Adults",
                count: 1,
              },
              {
                type: "Children",
                configuration: [],
              },
            ],
          },
        ],
      })

      expect(multiAdultAst).toStrictEqual({
        type: "Rooms",
        configuration: [
          {
            type: "Room",
            configuration: [
              {
                type: "Adults",
                count: 5,
              },
              {
                type: "Children",
                configuration: [],
              },
            ],
          },
        ],
      })
    })

    it("should parse single room with multiple generations", () => {
      const rm = new RoomsLexer()
      const singleAdultChildAst = rm.parse("1:2")

      expect(singleAdultChildAst).toStrictEqual({
        type: "Rooms",
        configuration: [
          {
            type: "Room",
            configuration: [
              {
                type: "Adults",
                count: 1,
              },
              {
                type: "Children",
                configuration: [
                  {
                    type: "Child",
                    age: 2,
                  },
                ],
              },
            ],
          },
        ],
      })

      const multipleAdultChildAst = rm.parse("5:8,5,38,9,0")
      expect(multipleAdultChildAst).toStrictEqual({
        type: "Rooms",
        configuration: [
          {
            type: "Room",
            configuration: [
              {
                type: "Adults",
                count: 5,
              },
              {
                type: "Children",
                configuration: [
                  {
                    type: "Child",
                    age: 8,
                  },
                  {
                    type: "Child",
                    age: 5,
                  },
                  {
                    type: "Child",
                    age: 38,
                  },
                  {
                    type: "Child",
                    age: 9,
                  },
                  {
                    type: "Child",
                    age: 0,
                  },
                ],
              },
            ],
          },
        ],
      })
    })

    it("should parse multiple rooms with multiple generations", () => {
      const rm = new RoomsLexer()
      const singleAdultChildAst = rm.parse("4:2,0|8|1:0,0,2")

      expect(singleAdultChildAst).toStrictEqual({
        type: "Rooms",
        configuration: [
          {
            type: "Room",
            configuration: [
              {
                type: "Adults",
                count: 4,
              },
              {
                type: "Children",
                configuration: [
                  {
                    type: "Child",
                    age: 2,
                  },
                  {
                    type: "Child",
                    age: 0,
                  },
                ],
              },
            ],
          },
          {
            type: "Room",
            configuration: [
              {
                type: "Adults",
                count: 8,
              },
              {
                type: "Children",
                configuration: [],
              },
            ],
          },
          {
            type: "Room",
            configuration: [
              {
                type: "Adults",
                count: 1,
              },
              {
                type: "Children",
                configuration: [
                  {
                    type: "Child",
                    age: 0,
                  },
                  {
                    type: "Child",
                    age: 0,
                  },
                  {
                    type: "Child",
                    age: 2,
                  },
                ],
              },
            ],
          },
        ],
      })
    })

    it("should not parse empty configuration", () => {
      expect(() => {
        const rm = new RoomsLexer()
        rm.parse("")
      }).toThrow()
    })

    it("should not parse empty room", () => {
      expect(() => {
        const rm = new RoomsLexer()
        rm.parse("1|")
      }).toThrow()
    })

    it("should not parse no adults", () => {
      expect(() => {
        const rm = new RoomsLexer()
        rm.parse("1|:8,3,24")
      }).toThrow()
    })

    it("should not parse invalid child age", () => {
      expect(() => {
        const rm = new RoomsLexer()
        rm.parse("1|:8,a3,,24")
      }).toThrow()
    })

    it("should throw descriptive error", () => {
      expect(() => {
        const rm = new RoomsLexer()
        rm.parse("1|3:1a")
      }).toThrowError("Unexpected token a")
    })
  })

  describe("compiling", () => {
    it("should compile single room and single adult", () => {
      const rm = new RoomsLexer()
      const configuration = rm.compile({
        type: "Rooms",
        configuration: [
          {
            type: "Room",
            configuration: [
              {
                type: "Adults",
                count: 5,
              },
              {
                type: "Children",
                configuration: [],
              },
            ],
          },
        ],
      })

      expect(configuration).toBe("5")
    })

    it("should compile singe room and multi generations", () => {
      const rm = new RoomsLexer()
      const configuration = rm.compile({
        type: "Rooms",
        configuration: [
          {
            type: "Room",
            configuration: [
              {
                type: "Adults",
                count: 5,
              },
              {
                type: "Children",
                configuration: [
                  {
                    type: "Child",
                    age: 8,
                  },
                  {
                    type: "Child",
                    age: 5,
                  },
                  {
                    type: "Child",
                    age: 38,
                  },
                  {
                    type: "Child",
                    age: 9,
                  },
                  {
                    type: "Child",
                    age: 0,
                  },
                ],
              },
            ],
          },
        ],
      })

      expect(configuration).toBe("5:8,5,38,9,0")
    })

    it("should compile multi room and multi generations", () => {
      const rm = new RoomsLexer()
      const configuration = rm.compile({
        type: "Rooms",
        configuration: [
          {
            type: "Room",
            configuration: [
              {
                type: "Adults",
                count: 4,
              },
              {
                type: "Children",
                configuration: [
                  {
                    type: "Child",
                    age: 2,
                  },
                  {
                    type: "Child",
                    age: 0,
                  },
                ],
              },
            ],
          },
          {
            type: "Room",
            configuration: [
              {
                type: "Adults",
                count: 8,
              },
              {
                type: "Children",
                configuration: [],
              },
            ],
          },
          {
            type: "Room",
            configuration: [
              {
                type: "Adults",
                count: 1,
              },
              {
                type: "Children",
                configuration: [
                  {
                    type: "Child",
                    age: 0,
                  },
                  {
                    type: "Child",
                    age: 0,
                  },
                  {
                    type: "Child",
                    age: 2,
                  },
                ],
              },
            ],
          },
        ],
      })

      expect(configuration).toBe("4:2,0|8|1:0,0,2")
    })
  })
})
