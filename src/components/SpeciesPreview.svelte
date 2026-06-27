<script>
	import { fragment, graphql, isPending } from '$houdini'
	import { Sprite, Display } from '.'
	import Number from './SpeciesPreviewNumber.svelte'

	let { species, number } = $props()

	const data = fragment(species, graphql(`
		fragment SpeciesPreview on Species @loading {
			id
			pokedexNumber
			name
			...SpriteInfo
		}
	`))
</script>

{#if $data && !isPending($data)}
	<a href="/{$data.pokedexNumber}">
		<Number value={number} />
		<Sprite species={$data} />
		<Display>{$data.name}</Display>
	</a>
{/if}

<style>
	:global(.preview-sprite) {
		height: 102px;
		width: 102px;
	}
</style>
