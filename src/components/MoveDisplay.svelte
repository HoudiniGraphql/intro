<script>
	import { Display } from '.'
	import { fragment, graphql } from '$houdini'

	export let move

	const data = fragment(
		move,
		graphql`
			fragment MoveDisplay on SpeciesMove {
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
		`
	)

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
		<h3>
			{$data.move.name}
		</h3>
		<div class="stat">
			{padKey('Accuracy')}.....{padValue($data.move.accuracy)}
		</div>
		<div class="stat">
			{padKey('Power')}.....{padValue($data.move.power)}
		</div>
		<div class="stat">
			{padKey('PP')}.....{padValue($data.move.pp)}
		</div>
	</div>
	<div class="right-column">
		<div class="type-pill">
			Type: {$data.move.type}
		</div>
		<div class="learn-data">
			Learn:
			{#if $data.method === 'level-up'}
				Lvl {$data.learned_at}
			{:else}
				TM
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
