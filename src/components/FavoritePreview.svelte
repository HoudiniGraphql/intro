<script>
	import { fragment, graphql, isPending } from '$houdini'

	let { species } = $props()

	const data = $derived(
		fragment(
			species,
			graphql(`
		fragment FavoritePreview on Species @loading {
			id
			pokedexNumber
			name
			sprites {
				front
			}
		}
	`)
		)
	)
</script>

{#if $data && !isPending($data)}
	<a href="/{$data.pokedexNumber}">
		<img src={$data.sprites.front} alt="{$data.name} sprite" />
	</a>
{/if}

<style>
	a {
		display: flex;
		flex-direction: column;
	}
</style>
