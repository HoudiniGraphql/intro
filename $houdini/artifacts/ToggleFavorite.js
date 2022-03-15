export default {
    name: "ToggleFavorite",
    kind: "HoudiniMutation",
    hash: "dda13d49e97f0fd0eee817fa172f22d181de352bbbe7311e80c3b135b1ba0a7a",

    raw: `mutation ToggleFavorite($id: Int!) {
  toggleFavorite(id: $id) {
    species {
      favorite
      id
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
                        favorite: {
                            type: "Boolean",
                            keyRaw: "favorite"
                        },

                        id: {
                            type: "Int",
                            keyRaw: "id"
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