export default {
    name: "ToggleFavorite",
    kind: "HoudiniMutation",
    hash: "2d03c0b021898c8114b2befcdf8ec838936105a8af0fc484adf59f87210c39b2",

    raw: `mutation ToggleFavorite($id: Int!) {
  toggleFavorite(id: $id) {
    species {
      id
      favorite
      ...FavoriteSpecies_toggle
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
                        id: {
                            type: "Int",
                            keyRaw: "id"
                        },

                        favorite: {
                            type: "Boolean",
                            keyRaw: "favorite"
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