export default {
    name: "Favorites",
    kind: "HoudiniQuery",
    hash: "b04d22008fbab25d3fccb65cb066574295811574625277d69dd5abbd0610fad6",

    raw: `query Favorites {
  favorites {
    ...FavoritePreview
    id
  }
}

fragment FavoritePreview on Species {
  id
  name
  sprites {
    front
  }
}
`,

    rootType: "Query",

    selection: {
        favorites: {
            type: "Species",
            keyRaw: "favorites",

            list: {
                name: "FavoriteSpecies",
                connection: false,
                type: "Species"
            },

            fields: {
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
        }
    },

    policy: "NetworkOnly"
};