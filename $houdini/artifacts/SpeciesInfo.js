export default {
    name: "SpeciesInfo",
    kind: "HoudiniQuery",
    hash: "2edfc10f9f431228d83bad434566bb62fde38c8804cae61149d769bb05269cdf",

    raw: `query SpeciesInfo($id: Int!) {
  species(id: $id) {
    name
    flavor_text
    favorite
    evolution_chain {
      ...SpeciesPreview
      id
    }
    ...SpriteInfo
    id
  }
}

fragment SpeciesPreview on Species {
  name
  id
  ...SpriteInfo
}

fragment SpriteInfo on Species {
  name
  sprites {
    front
  }
}
`,

    rootType: "Query",

    selection: {
        species: {
            type: "Species",
            keyRaw: "species(id: $id)",

            fields: {
                name: {
                    type: "String",
                    keyRaw: "name"
                },

                flavor_text: {
                    type: "String",
                    keyRaw: "flavor_text"
                },

                favorite: {
                    type: "Boolean",
                    keyRaw: "favorite"
                },

                evolution_chain: {
                    type: "Species",
                    keyRaw: "evolution_chain",

                    fields: {
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
                },

                id: {
                    type: "Int",
                    keyRaw: "id"
                }
            }
        }
    },

    input: {
        fields: {
            id: "Int"
        },

        types: {}
    },

    policy: "NetworkOnly"
};