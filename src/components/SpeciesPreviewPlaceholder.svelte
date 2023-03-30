<script>
	import { Display } from '.'
	import Number from './SpeciesPreviewNumber.svelte'

	export let number
</script>

<div class="">
	<Number value={number} />
	<div class="sprite placeholder-background">
		<div class="poke-ball">
			<div class="poke-ball-top" />
			<div class="poke-ball-center" />
			<div class="poke-ball-bottom" />
		</div>
	</div>
	<Display>No Data</Display>
</div>

<style>
	.placeholder-background {
		background: linear-gradient(
			15deg,
			#83887b 64%,
			#8b8f81 70%,
			#8b8f81 81%,
			#babfb1 86%,
			#8b8f81 89%,
			#8b8f81 100%
		);
		display: flex;
		justify-content: center;
		align-items: center;
		width: 102px;
		height: 102px;
	}

	.poke-ball {
		border: solid black 4px;
		background: black;
		border-radius: 50%;
		height: 50px;
		width: 50px;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		align-items: center;
		position: relative;
		opacity: 0.8;
	}

	.poke-ball-top {
		background: #83887a;
		flex: 1;
		width: 100%;
		opacity: 0.3;
	}

	.poke-ball-center {
		display: flex;
		width: 22px;
		height: 22px;
		border: solid black 4px;
		border-radius: 50%;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 10px;
	}

	.poke-ball-bottom {
		background: #83887a;
		flex: 1;
		width: 100%;
	}
</style>
