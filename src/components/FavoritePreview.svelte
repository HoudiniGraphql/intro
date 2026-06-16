<script>
	let { species } = $props()
</script>

<a href="/{species.id}">
	<img src={species.sprites.front} alt={`${species.name} sprite`} />
</a>

<style>
	a {
		display: flex;
		flex-direction: column;
	}
</style>
