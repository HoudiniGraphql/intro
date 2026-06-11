<script>
	import { Sprite, Display } from '.'
	import Number from './SpeciesPreviewNumber.svelte'

	let { species, number } = $props()
</script>

<a href={species.id}>
	<Number value={number} />
	<Sprite species={species} />
	<Display>
		{species.name}
	</Display>
</a>

<style>
	:global(.preview-sprite) {
		height: 102px;
		width: 102px;
	}
</style>
