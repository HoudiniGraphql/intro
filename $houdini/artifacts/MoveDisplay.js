export default {
    name: "MoveDisplay",
    kind: "HoudiniFragment",
    hash: "7857de909b81e032bd8def5a6914078e68e1c9cde9c9cc5c1b78414331ce96b1",

    raw: `fragment MoveDisplay on SpeciesMove {
  learned_at
  move {
    name
  }
}
`,

    rootType: "SpeciesMove",

    selection: {
        learned_at: {
            type: "Int",
            keyRaw: "learned_at"
        },

        move: {
            type: "Move",
            keyRaw: "move",

            fields: {
                name: {
                    type: "String",
                    keyRaw: "name"
                }
            }
        }
    }
};