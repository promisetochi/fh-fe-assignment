/**
 * Rooms language
 *
 * start: rooms
 * rooms: room[]
 * room: generations
 * generations: adult | children
 * children: child
 *
 * adult: number
 * child: number
 */

type TokenType = "number" | "," | ":" | "|"
type Token = { type: TokenType; result: string; newStr: string }

export type Adult = {
  type: "Adults"
  count: number
}

export type Child = {
  type: "Child"
  age: number
}

export type Children = {
  type: "Children"
  configuration: Child[]
}

export type Room = {
  type: "Room"
  configuration: [Adult, Children]
}

export type Rooms = {
  type: "Rooms"
  configuration: Room[]
}

/**
 * This is a BNF lexer: https://cs61a.org/study-guide/bnf
 * Tokenization happens like a simple state machine and parsing follows the formal language definition
 * I did not implement configurability for this Lexer. Already did quite a lot, I hope you understand.
 */
export class RoomsLexer {
  private rules: [RegExp, TokenType][]
  constructor(
    // For configurability but not implemented
    private terminals = {
      room: "|",
      ageGroup: ":",
      children: ",",
    }
  ) {
    this.rules = [
      [/^\|/, "|"],
      [/^:/, ":"],
      [/^,/, ","],
      [/^\d+/, "number"],
    ]
  }

  private tokenize(configuration: string): Token | null {
    // if end of string, return null
    if (configuration.length === 0) return null

    // match next token/rule against string
    for (const [regex, type] of this.rules) {
      const token = regex.exec(configuration)
      if (token !== null) {
        return {
          type: type,
          result: token[0],
          newStr: configuration.slice(token[0].length),
        }
      }
    }

    // if there's no match, the language is not valid, throw an error
    throw new SyntaxError(`Unexpected token ${configuration[0]}`)
  }

  private start(str: string) {
    return {
      type: "Rooms",
      configuration: this.rooms(str),
    }
  }

  private rooms(str: string) {
    let [room, token] = this.room(str)
    const rooms = [room]

    // Keep parsing for more rooms
    while (token.newStr) {
      // When all other terminals have been parsed, the next has to be | for the next room
      const { newStr } = this.accept(["|"], this.tokenize(token.newStr))
      ;[room, token] = this.room(newStr)
      rooms.push(room)
    }

    return rooms
  }

  private room(str: string) {
    let [generations, token] = this.generation(str)
    return [
      {
        type: "Room",
        configuration: generations,
      },
      token,
    ] as const
  }

  private generation(str: string) {
    const [adults, token] = this.adult(str)
    const genToken = this.tokenize(token.newStr)
    if (genToken === null || genToken.type === "|")
      return [[adults, { type: "Children", configuration: [] }], token] as const

    const { newStr: childrenConfig } = this.accept([":"], genToken)
    const [children, childrenToken] = this.children(childrenConfig)
    return [[adults, children], childrenToken] as const
  }

  private adult(str: string) {
    const token = this.accept(["number"], this.tokenize(str))
    return [
      {
        type: "Adults",
        count: Number(token?.result),
      },
      token,
    ] as const
  }

  private children(str: string) {
    let [child, token] = this.child(str)
    let genzs = [child]

    // While there are more kids, keep parsing them
    while (this.tokenize(token.newStr)?.type === ",") {
      const { newStr } = this.accept([","], this.tokenize(token.newStr))
      ;[child, token] = this.child(newStr)
      genzs.push(child)
    }

    return [
      {
        type: "Children",
        configuration: genzs,
      },
      token,
    ] as const
  }

  private child(str: string) {
    const token = this.accept(["number"], this.tokenize(str))
    return [
      {
        type: "Child",
        age: Number(token.result),
      },
      token,
    ] as const
  }

  private accept(types: TokenType[], token: Token | null) {
    if (!token || !types.includes(token.type))
      throw new Error(
        `Unexpected token ${token?.result} expected type(s) ${types.join(", ")}`
      )

    return token
  }

  public parse(configuration: string) {
    return this.start(configuration)
  }

  // public deparse() {}
  public compile(rooms: Rooms) {
    return rooms.configuration
      .map(({ configuration: [adults, children] }) => {
        const childrenConfig = children.configuration
          .map(({ age }) => age)
          .join(",")
        const adultsConfig = adults.count
        return childrenConfig
          ? `${adultsConfig}:${childrenConfig}`
          : adultsConfig
      })
      .join("|")
  }

  static createRoom(): Room {
    return {
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
    }
  }

  static createChild(): Child {
    return {
      type: "Child",
      age: 0,
    }
  }
}
