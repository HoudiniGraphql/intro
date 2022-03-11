<script>
	import { fragment, graphql } from '$houdini'

	export let species

	const data = fragment(graphql`
		fragment SpriteInfo on Species { 
			name
			sprites { 
				front
			}
		}
	`, species)
</script>

<div id={$$props.id} class="sprite">
	<img 
		height="100%" 
		src={$data.sprites.front} 
		alt={`${$data.name} sprite`} 
	/>
</div>
