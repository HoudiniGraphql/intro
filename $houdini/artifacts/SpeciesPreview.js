export default {
    name: "SpeciesPreview",
    kind: "HoudiniFragment",
    hash: "e2da9bc5d6dddd23bd7199c9c07f4a48f24f9b01b69fe8e766c97946d7990597",

    raw: `fragment SpeciesPreview on Species {
  name
  id
  ...SpriteInfo
}
`,

    rootType: "Species",

    selection: {
        name: {
            type: "String",
            keyRaw: "name"
        },

        id: {
            type: "Int",
            keyRaw: "id"
        }
    }
};