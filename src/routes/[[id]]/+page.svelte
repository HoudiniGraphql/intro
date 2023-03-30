<script>
	import { Container, Display, Sprite, Panel } from '~/components'
	import DownButton from '~/components/DownButton.svelte'
	import FavoritePreview from '~/components/FavoritePreview.svelte'
	import FavoritesContainer from '~/components/FavoritesContainer.svelte'
	import Icon from '~/components/Icon.svelte'
	import MoveDisplay from '~/components/MoveDisplay.svelte'
	import SpeciesPreview from '~/components/SpeciesPreview.svelte'
	import SpeciesPreviewPlaceholder from '~/components/SpeciesPreviewPlaceholder.svelte'
	import UpButton from '~/components/UpButton.svelte'

	/* @type { import('./$houdini').PageData } */
	export let data

	$: ({ Info } = data)

	const toggleFavorite = graphql(`
		mutation ToggleFavorite($id: Int!) {
			toggleFavorite(id: $id) {
				species {
					id
					favorite
					...FavoriteSpecies_toggle
				}
			}
		}
	`)
</script>

{#if $Info.fetching}
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
				on:click={() =>
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
						disabled={!$Info.pageInfo.hasPreviousPage}
						on:click={async () => await Info.loadPreviousPage()}
					/>
					<DownButton
						disabled={!$Info.pageInfo.hasNextPage}
						on:click={async () => await Info.loadNextPage()}
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
