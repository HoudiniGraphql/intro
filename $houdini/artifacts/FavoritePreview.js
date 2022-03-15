export default {
    name: "FavoritePreview",
    kind: "HoudiniFragment",
    hash: "0598e92e30e3eafdbee6669bbaee2e7d600cdc5aefd6a24b67d97a67c4763457",

    raw: `fragment FavoritePreview on Species {
  id
  name
  sprites {
    front
  }
}
`,

    rootType: "Species",

    selection: {
        id: {
            type: "Int",
            keyRaw: "id"
        },

        name: {
            type: "String",
            keyRaw: "name"
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