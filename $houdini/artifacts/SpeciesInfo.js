export default {
    name: "SpeciesInfo",
    kind: "HoudiniQuery",
    hash: "b569cf055083bbfe8f63dd8e732e51140177dd214bfa05db16251802d8f07beb",

    refetch: {
        update: "append",
        path: ["species", "moves"],
        method: "cursor",
        pageSize: 1,
        embedded: false
    },

    raw: `query SpeciesInfo($id: Int!, $first: Int = 1, $after: String) {
  species(id: $id) {
    name
    flavor_text
    favorite
    evolution_chain {
      ...SpeciesPreview
      id
    }
    moves(first: $first, after: $after) {
      edges {
        node {
          ...MoveDisplay
        }
      }
      edges {
        cursor
        node {
          __typename
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
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

fragment MoveDisplay on SpeciesMove {
  learned_at
  move {
    name
  }
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

                moves: {
                    type: "SpeciesMoveConnection",
                    keyRaw: "moves::paginated",

                    fields: {
                        edges: {
                            type: "SpeciesMoveEdge",
                            keyRaw: "edges",

                            fields: {
                                cursor: {
                                    type: "String",
                                    keyRaw: "cursor"
                                },

                                node: {
                                    type: "SpeciesMove",
                                    keyRaw: "node",

                                    fields: {
                                        __typename: {
                                            type: "String",
                                            keyRaw: "__typename"
                                        },

                                        learned_at: {
                                            type: "Int",
                                            keyRaw: "learned_at"
                                        },

                                        move: {
                                            type: "Move",
                                            keyRaw: "move",

                                            fields: {
                                                name: {
                                                    type: "String",
                                                    keyRaw: "name"
                                                }
                                            }
                                        }
                                    }
                                }
                            },

                            update: "append"
                        },

                        pageInfo: {
                            type: "PageInfo",
                            keyRaw: "pageInfo",

                            fields: {
                                hasPreviousPage: {
                                    type: "Boolean",
                                    keyRaw: "hasPreviousPage"
                                },

                                hasNextPage: {
                                    type: "Boolean",
                                    keyRaw: "hasNextPage"
                                },

                                startCursor: {
                                    type: "String",
                                    keyRaw: "startCursor"
                                },

                                endCursor: {
                                    type: "String",
                                    keyRaw: "endCursor"
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
            id: "Int",
            first: "Int",
            after: "String"
        },

        types: {}
    },

    policy: "NetworkOnly"
};