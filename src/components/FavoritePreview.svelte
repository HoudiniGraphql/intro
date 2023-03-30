<script>
	import { graphql, fragment } from '$houdini'
	import { Sprite } from '.'

	export let species

	$: preview = fragment(
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
	)
</script>

<a href={$preview.id}>
	<img src={$preview.sprites.front} alt={`${$preview.name} sprite`} />
</a>

<style>
	a {
		display: flex;
		flex-direction: column;
	}
</style>
