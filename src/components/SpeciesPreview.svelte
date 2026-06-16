<script>
	import { fragment, graphql } from '$houdini'
	import { Sprite, Display } from '.'
	import Number from './SpeciesPreviewNumber.svelte'

	let { species, number } = $props()

	const data = fragment(species, graphql(`
		fragment SpeciesPreview on Species {
			id
			name
			...SpriteInfo
		}
	`))
</script>

<a href="/{$data.id}">
	<Number value={number} />
	<Sprite species={$data} />
	<Display>{$data.name}</Display>
</a>

<style>
	:global(.preview-sprite) {
		height: 102px;
		width: 102px;
	}
</style>
