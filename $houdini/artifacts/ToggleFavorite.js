export default {
    name: "ToggleFavorite",
    kind: "HoudiniMutation",
    hash: "a31ed248da7d709e3fc1e8da2c2ebf6979ebb33e64f518ca02c55ada58e1adc8",

    raw: `mutation ToggleFavorite($id: Int!) {
  toggleFavorite(id: $id) {
    species {
      favorite
      ...FavoriteSpecies_toggle
      id
    }
  }
}

fragment FavoriteSpecies_toggle on Species {
  ...FavoritePreview
  id
  id
}

fragment FavoritePreview on Species {
  id
  name
  sprites {
    front
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

                    operations: [{
                        action: "toggle",
                        list: "FavoriteSpecies",
                        position: "last"
                    }],

                    fields: {
                        favorite: {
                            type: "Boolean",
                            keyRaw: "favorite"
                        },

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