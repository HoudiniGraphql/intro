export default {
    name: "ToggleFavorite",
    kind: "HoudiniMutation",
    hash: "050518647715410b1a5b013046380888e356ec17b0afe3970c04bf5169f8737e",

    raw: `mutation ToggleFavorite($id: Int!) {
  toggleFavorite(id: $id) {
    species {
      id
      favorite
    }
  }
}
`,

    rootType: "Mutation",

    selection: {
        toggleFavorite: {
            type: "ToggleFavoriteOutput",
            keyRaw: "toggleFavorite(id: $id)",

            fields: {
                species: {
                    type: "Species",
                    keyRaw: "species",

                    fields: {
                        id: {
                            type: "Int",
                            keyRaw: "id"
                        },

                        favorite: {
                            type: "Boolean",
                            keyRaw: "favorite"
                        }
                    }
                }
            }
        }
    },

    input: {
        fields: {
            id: "Int"
        },

        types: {}
    }
};