export default {
	name: 'SpeciesInfo',
	kind: 'HoudiniQuery',
	hash: '2e8505424d03eb097ae5d95180c5c9a52b3254eb10de7839b376a90de6605d9e',

	raw: `query SpeciesInfo($id: Int!) {
  species(id: $id) {
    name
    flavor_text
    sprites {
      front
      back
    }
    id
  }
}
`,

	rootType: 'Query',

	selection: {
		species: {
			type: 'Species',
			keyRaw: 'species(id: $id)',

			fields: {
				name: {
					type: 'String',
					keyRaw: 'name'
				},

				flavor_text: {
					type: 'String',
					keyRaw: 'flavor_text'
				},

				sprites: {
					type: 'SpeciesSprites',
					keyRaw: 'sprites',

					fields: {
						front: {
							type: 'String',
							keyRaw: 'front'
						},

						back: {
							type: 'String',
							keyRaw: 'back'
						}
					}
				},

				id: {
					type: 'Int',
					keyRaw: 'id'
				}
			}
		}
	},

	input: {
		fields: {
			id: 'Int'
		},

		types: {}
	},

	policy: 'NetworkOnly'
};
