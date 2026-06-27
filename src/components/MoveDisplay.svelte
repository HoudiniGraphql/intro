<script>
	import { fragment, graphql, isPending } from '$houdini'
	import { Display } from '.'
	import Shimmer from './Shimmer.svelte'

	let { move } = $props()

	const data = $derived(
		fragment(
			move,
			graphql(`
		fragment MoveDisplay on SpeciesMove @loading {
			learned_at
			method
			move {
				name
				accuracy
				power
				pp
				type
			}
		}
	`)
		)
	)

	const loading = $derived(!$data || isPending($data))

	const padValue = (val) => {
		if (val === null) {
			return '..0'
		}

		return (
			Array.from({ length: 3 - val.toString().length })
				.map(() => '.')
				.join('') + val
		)
	}

	const padKey = (val) => {
		return (
			val +
			Array.from({ length: 8 - val.toString().length })
				.map(() => '.')
				.join('')
		)
	}
</script>

<Display id="move-display">
	<div>
		<h3 class:bare={loading}>
			{#if loading}
				<Shimmer width="90px" height="22px" />
			{:else}
				{$data.move.name}
			{/if}
		</h3>
		{#if loading}
			<div class="stat"><Shimmer width="150px" height="0.85em" /></div>
			<div class="stat"><Shimmer width="150px" height="0.85em" /></div>
			<div class="stat"><Shimmer width="150px" height="0.85em" /></div>
		{:else}
			<div class="stat">
				{padKey('Accuracy')}.....{padValue($data.move.accuracy)}
			</div>
			<div class="stat">
				{padKey('Power')}.....{padValue($data.move.power)}
			</div>
			<div class="stat">
				{padKey('PP')}.....{padValue($data.move.pp)}
			</div>
		{/if}
	</div>
	<div class="right-column">
		<div class="type-pill" class:bare={loading}>
			{#if loading}
				<Shimmer width="84px" height="18px" />
			{:else}
				Type: {$data.move.type}
			{/if}
		</div>
		<div class="learn-data">
			{#if loading}
				<Shimmer width="70px" height="0.85em" />
			{:else}
				Learn:
				{#if $data.method === 'level-up'}
					Lvl {$data.learned_at}
				{:else}
					TM
				{/if}
			{/if}
		</div>
	</div>
</Display>

<style>
	:global(#move-display) {
		position: relative;
		padding: 10px 20px;
		height: 80px;
		flex-direction: row;
		display: flex;
		min-width: 0;
		overflow: hidden;
	}

	h3 {
		margin: 0;
		font-weight: normal;
		font-size: 24px;
		border-bottom: 2px solid black;
		padding: 0 4px;
		width: 103px;
		text-align: center;
		white-space: nowrap;
	}

	h3.bare {
		border-bottom: none;
	}

	.type-pill.bare {
		border-color: transparent;
	}

	.type-pill {
		font-size: 18px;
		text-transform: uppercase;
		border: solid black 2px;
		border-radius: 7px;
		padding: 2px 10px;
		text-align: center;
	}

	.right-column {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		flex-grow: 1;
	}

	.learn-data {
		margin-right: 10px;
	}

	.stat {
		margin-top: 3px;
	}
</style>
