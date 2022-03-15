export default {
    name: "SpeciesPreview",
    kind: "HoudiniFragment",
    hash: "bef70c0d53a696ec5ff4b0141619750b8d04b417deefd802bc1b0a7b52aacae1",

    raw: `fragment SpeciesPreview on Species {
  name
  id
  sprites {
    front
  }
}
`,

    rootType: "Species",

    selection: {
        name: {
            type: "String",
            keyRaw: "name"
        },

        id: {
            type: "Int",
            keyRaw: "id"
        },

        sprites: {
            type: "SpeciesSprites",
            keyRaw: "sprites",

            fields: {
                front: {
                    type: "String",
                    keyRaw: "front"
                }
            }
        }
    }
};