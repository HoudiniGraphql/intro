export default {
    name: "MoveDisplayInfo",
    kind: "HoudiniFragment",
    hash: "01af3fbf75e8f95aa5483764eae6ced9568ffe0edeb5b9e8964e6a95369b6e42",

    raw: `fragment MoveDisplayInfo on SpeciesMove {
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