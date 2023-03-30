<script>
	import { fragment, graphql } from '$houdini'

	/* @type { import('$houdini').SpriteInfo } */
	export let species

	$: info = fragment(
		species,
		graphql(`
			fragment SpriteInfo on Species {
				name
				sprites {
					front
				}
			}
		`)
	)
</script>

<div id={$$props.id} class="sprite">
	<img src={$info.sprites.front} alt={`${$info.name} sprite`} height="100%" />
</div>

<style>
	div {
		display: flex;
		image-rendering: pixelated;
		border: inset #9aa28b 3px;
		border-radius: 5px;
		margin: 10px 0;
		box-sizing: border-box;
		background: linear-gradient(
			15deg,
			#cad5b5 64%,
			#dde2d4 70%,
			#dde2d4 81%,
			#fff 86%,
			#dde2d4 89%,
			#dde2d4 100%
		);
		align-items: center;
		justify-content: center;
	}
</style>
