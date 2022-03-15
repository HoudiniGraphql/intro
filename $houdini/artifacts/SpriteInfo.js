export default {
    name: "SpriteInfo",
    kind: "HoudiniFragment",
    hash: "2e40872edc984898adb7deb62ff3e0d6c157a8eb6b49639fda61d88b1b3558ea",

    raw: `fragment SpriteInfo on Species {
  name
  sprites {
    front
  }
}
`,

    rootType: "Species",

    selection: {
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