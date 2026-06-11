<script>
	import { InfoStore, ToggleFavoriteStore } from '$houdini'
	import { Container, Display, Sprite, Panel } from '~/components'
	import DownButton from '~/components/DownButton.svelte'
	import FavoritePreview from '~/components/FavoritePreview.svelte'
	import FavoritesContainer from '~/components/FavoritesContainer.svelte'
	import Icon from '~/components/Icon.svelte'
	import MoveDisplay from '~/components/MoveDisplay.svelte'
	import SpeciesPreview from '~/components/SpeciesPreview.svelte'
	import SpeciesPreviewPlaceholder from '~/components/SpeciesPreviewPlaceholder.svelte'
	import UpButton from '~/components/UpButton.svelte'

	/* @type { import('./$types').PageData } */
	let { data } = $props()

	const Info = new InfoStore()
	const toggleFavorite = new ToggleFavoriteStore()

	const fetchInfo = $derived.by(() => {
		if (data.id) {
			Info.fetch({
				variables: { id: data.id }
			})
		}

		return data.id
	})

	const loadPreviousMove = async () => {
		const pageInfo = $Info.data.species.moves.pageInfo

		await Info.fetch({
			variables: {
				id: data.id,
				before: pageInfo.startCursor,
				last: 1,
				first: null,
				after: null
			}
		})
	}

	const loadNextMove = async () => {
		const pageInfo = $Info.data.species.moves.pageInfo

		await Info.fetch({
			variables: {
				id: data.id,
				after: pageInfo.endCursor,
				first: 1,
				before: null,
				last: null
			}
		})
	}

</script>

{#if fetchInfo && ($Info.fetching || !$Info.data)}
	<FavoritesContainer />
	<Container />
{:else}
	<FavoritesContainer>
		{#each $Info.data.favorites as favorite}
			<FavoritePreview species={favorite} />
		{:else}
			<p>No Favorites Selected</p>
		{/each}
	</FavoritesContainer>

	<Container>
		<Panel slot="left">
			<button
				id="favorite"
				onclick={() =>
					toggleFavorite.mutate({
						id: $Info.data.species.id
					})}
			>
				<Icon
					name="star"
					id="favorite-star"
					fill={$Info.data.species.favorite ? 'gold' : 'lightgrey'}
				/>
			</button>
			<Display id="species-name">
				{$Info.data.species.name}
				<span>no.{$Info.data.species.id}</span>
			</Display>
			<Sprite id="species-sprite" species={$Info.data.species} />
			<Display id="species-flavor_text">
				{$Info.data.species.flavor_text}
			</Display>
		</Panel>

		<Panel slot="right">
			<div id="species-evolution-chain">
				{#each $Info.data.species.evolution_chain as form, i}
					<SpeciesPreview species={form} number={i + 1} />
				{/each}
				<!-- if there are less than three species in the chain, leave a placeholder behind -->
				{#each Array.from({ length: 3 - $Info.data.species.evolution_chain?.length }) as _, i}
					<SpeciesPreviewPlaceholder number={$Info.data.species.evolution_chain.length + i + 1} />
				{/each}
			</div>

			<div id="move-summary">
				<MoveDisplay move={$Info.data.species.moves.edges[0].node} />
				<div id="move-controls">
					<UpButton
						disabled={!$Info.data.species.moves.pageInfo.hasPreviousPage}
						onclick={loadPreviousMove}
					/>
					<DownButton
						disabled={!$Info.data.species.moves.pageInfo.hasNextPage}
						onclick={loadNextMove}
					/>
				</div>
			</div>

			<nav>
				<a href={$Info.data.species.id - 1} disabled={$Info.data.species.id <= 1}> previous </a>
				<a href={$Info.data.species.id + 1} disabled={$Info.data.species.id >= 151}> next </a>
			</nav>
		</Panel>
	</Container>
{/if}
