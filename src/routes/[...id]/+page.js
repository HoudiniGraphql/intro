export function _SpeciesInfoVariables({ params }) {
	// if we were given an id, convert the string to a number
	const id = params.id ? parseInt(params.id) : 1;

	// check that the id falls between 1 and 151
	if (id < 1 || id > 151) {
		return this.error(400, 'id must be between 1 and 151');
	}

	return {
		id
	};
}
