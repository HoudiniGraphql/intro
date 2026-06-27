<script>
	let { width = '100%', height = '1em', radius = '4px', background = 'rgba(40, 50, 20, 0.35)' } =
		$props()
</script>

<span
	class="shimmer"
	style="width: {width}; height: {height}; border-radius: {radius}; background-color: {background};"
></span>

<style>
	.shimmer {
		display: inline-block;
		background-image: linear-gradient(
			100deg,
			transparent 25%,
			rgba(255, 255, 255, 0.55) 45%,
			rgba(255, 255, 255, 0.55) 55%,
			transparent 75%
		);
		background-size: 200% 100%;
		background-repeat: no-repeat;
		animation: shimmer 1.2s linear infinite;
	}

	@keyframes shimmer {
		from {
			background-position: 200% 0;
		}
		to {
			background-position: -200% 0;
		}
	}
</style>
