export default {
    name: "TrackSpeciesFavorite",
    kind: "HoudiniSubscription",
    hash: "5a1cfc22bd7ce46967795393a2b74a0d100246d661d39ce381fc9b0f6168314b",

    raw: `subscription TrackSpeciesFavorite {
  speciesFavoriteToggled {
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

    rootType: "Subscription",

    selection: {
        speciesFavoriteToggled: {
            type: "SpeciesFavoriteToggledOutput",
            keyRaw: "speciesFavoriteToggled",

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
    }
};