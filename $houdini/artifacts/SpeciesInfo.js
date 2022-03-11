export default {
    name: "SpeciesInfo",
    kind: "HoudiniQuery",
    hash: "5ec78607485aacb872fd6a669f63a8344c4e34b197c9564980343e96c1e1f0a8",

    raw: `query SpeciesInfo($id: Int!) {
  species(id: $id) {
    name
    flavor_text
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