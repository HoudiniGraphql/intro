<script>
	import { graphql, fragment } from '$houdini'
	import { Sprite, Display } from '.'
	import Number from './SpeciesPreviewNumber.svelte'

	export let species
	export let number

	$: preview = fragment(
		species,
		graphql`
			fragment SpeciesPreview on Species {
				name
				id
				sprites {
					front
				}
			}
		`
	)
</script>

<a href={$preview.id}>
	<Number value={number} />
	<Sprite src={$preview.sprites.front} speciesName={$preview.name} class="preview-sprite" />
	<Display>
		{$preview.name}
	</Display>
</a>

<style>
	:global(.preview-sprite) {
		height: 102px;
		width: 102px;
	}
</style>
