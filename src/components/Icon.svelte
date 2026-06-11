<script>
	import feather from 'feather-icons'
	export const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

	let {
		name,
		direction = 'n',
		strokeWidth = undefined,
		stroke = undefined,
		width = '1em',
		height = '1em',
		fill = '',
		class: className,
		id
	} = $props()

	const icon = $derived(feather.icons[name])
	const rotation = $derived(directions.indexOf(direction) * 45)
	const attrs = $derived.by(() => {
		if (!icon) return {}

		return {
			...icon.attrs,
			...(stroke ? { stroke } : {}),
			...(strokeWidth ? { 'stroke-width': strokeWidth } : {}),
			...(fill ? { fill } : {})
		}
	})
</script>

{#if icon}
	<svg
		{...attrs}
		style="width: {width}; height: {height}; transform: rotate({rotation}deg);"
		class={className}
		{id}
	>
		<g>
			{@html icon.contents}
		</g>
	</svg>
{/if}

<style>
	svg {
		width: 1em;
		height: 1em;
		overflow: visible;
		transform-origin: 50% 50%;
	}
</style>
