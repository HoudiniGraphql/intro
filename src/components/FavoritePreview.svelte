<script>
	import { fragment, graphql } from '$houdini';

	export let species;

	const data = fragment(
		species,
		graphql`
			fragment FavoritePreview on Species {
				id
				name
				sprites {
					front
				}
			}
		`
	);
</script>

<a href={$data.id}>
	<img src={$data.sprites.front} alt={`${$data.name} sprite`} />
</a>

<style>
	a {
		display: flex;
		flex-direction: column;
	}
</style>
