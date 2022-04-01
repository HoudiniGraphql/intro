export default {
    name: "MoveDisplay",
    kind: "HoudiniFragment",
    hash: "f531d0b97e32bed7bf18ece292d7dd1e2305cf78b724b58447ace6ebc40147f9",

    raw: `fragment MoveDisplay on SpeciesMove {
  learned_at
  method
  move {
    name
    accuracy
    power
    pp
    type
  }
}
`,

    rootType: "SpeciesMove",

    selection: {
        learned_at: {
            type: "Int",
            keyRaw: "learned_at"
        },

        method: {
            type: "String",
            keyRaw: "method"
        },

        move: {
            type: "Move",
            keyRaw: "move",

            fields: {
                name: {
                    type: "String",
                    keyRaw: "name"
                },

                accuracy: {
                    type: "Int",
                    keyRaw: "accuracy",
                    nullable: true
                },

                power: {
                    type: "Int",
                    keyRaw: "power",
                    nullable: true
                },

                pp: {
                    type: "Int",
                    keyRaw: "pp"
                },

                type: {
                    type: "Type",
                    keyRaw: "type",
                    nullable: true
                }
            }
        }
    }
};