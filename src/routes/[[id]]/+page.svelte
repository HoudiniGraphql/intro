<script>
	import {
		Panel,
		Container,
		Display,
		Sprite,
		SpeciesPreview,
		SpeciesPreviewPlaceholder,
		Icon,
		FavoritesContainer,
		FavoritePreview,
		MoveDisplay,
		UpButton,
		DownButton
	} from '~/components';
	import { graphql } from '$houdini';
	import { navigating } from '$app/stores';
    import type { PageData } from './$houdini'

    export let data: PageData

    $: ({ Info } = data)

	const toggleFavorite = graphql`
		mutation ToggleFavorite($id: Int!) {
			toggleFavorite(id: $id) {
				species {
					id
					favorite
            		...FavoriteSpecies_toggle
				}
			}
		}
	`;

	let moveIndex = 0;
	$: hasPrevMove = moveIndex > 0;
	$: hasNextMove =
		moveIndex < $Info.data.species.moves.edges.length - 1 ||
		$Info.pageInfo.hasNextPage;

	navigating.subscribe(() => {
		moveIndex = 0;
	});

	const loadNextMove = async () => {
		// if we haven't already seen this page
		if (
			!$Info.data.species.moves.edges[moveIndex + 1] &&
			$Info.pageInfo.hasNextPage
		) {
			// load the next page of data
			await loadNextPage();
		}

		// its safe to increment the move index
		moveIndex = moveIndex + 1;
	};

	const loadPrevMove = () => {
		moveIndex--;
	};
</script>

{#if $Info.isFetching}
	<FavoritesContainer/>
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
			<Display id="species-name">
				{$Info.data.species.name}
				<span>no.{$Info.data.species.id}</span>
			</Display>
			<Sprite id="species-sprite" species={$Info.data.species} />
			<Display id="species-flavor_text">
				{$Info.data.species.flavor_text}
			</Display>
			<button id="favorite" on:click={() => toggleFavorite({ id: $Info.data.species.id })}>
				<Icon
					name="star"
					id="favorite-star"
					fill={$Info.data.species.favorite ? 'gold' : 'lightgrey'}
				/>
			</button>
		</Panel>
		<Panel slot="right">
			<div id="species-evolution-chain">
				{#each $Info.data.species.evolution_chain as form, i}
					<SpeciesPreview species={form} number={i + 1} />
				{/each}
				<!-- if there are less than three species in the chain, leave a placeholder behind -->
				{#each Array.from({ length: 3 - $Info.data.species.evolution_chain?.length }) as _, i}
					<SpeciesPreviewPlaceholder
						number={$Info.data.species.evolution_chain.length + i + 1}
					/>
				{/each}
			</div>
			<div id="move-summary">
				<MoveDisplay move={$Info.data.species.moves.edges[moveIndex].node} />
				<div id="move-controls">
					<UpButton disabled={!hasPrevMove} on:click={loadPrevMove} />
					<DownButton disabled={!hasNextMove} on:click={loadNextMove} />
				</div>
			</div>
			<nav>
				<a href={$Info.data.species.id - 1} disabled={$Info.data.species.id <= 1}>
					previous
				</a>
				<a href={$Info.data.species.id + 1} disabled={$Info.data.species.id >= 151}>
					next
				</a>
			</nav>
		</Panel>
	</Container>
{/if}
