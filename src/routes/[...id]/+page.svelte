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
	import { graphql, subscription } from '$houdini';
	import { navigating } from '$app/stores';

	const SpeciesInfo = graphql`
		query SpeciesInfo($id: Int!) {
			species(id: $id) {
				name
				flavor_text
				favorite
				evolution_chain {
					...SpeciesPreview
				}
				moves(first: 1) @paginate {
					edges {
						node {
							...MoveDisplay
						}
					}
				}
				...SpriteInfo
			}
		}
	`;

	// this is a second query in the same route
	const Favorites = graphql`
		query Favorites {
			favorites @list(name: "FavoriteSpecies") {
				...FavoritePreview
			}
		}
	`;

	const toggleFavorite = graphql`
		mutation ToggleFavorite($id: Int!) {
			toggleFavorite(id: $id) {
				species {
					favorite
				}
			}
		}
	`;

	let moveIndex = 0;
	$: hasPrevMove = moveIndex > 0;
	$: hasNextMove =
		moveIndex < $SpeciesInfo.data.species.moves.edges.length - 1 ||
		$SpeciesInfo.pageInfo.hasNextPage;

	navigating.subscribe(() => {
		moveIndex = 0;
	});

	const loadNextMove = async () => {
		// if we haven't already seen this page
		if (
			!$SpeciesInfo.data.species.moves.edges[moveIndex + 1] &&
			$SpeciesInfo.pageInfo.hasNextPage
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

	subscription(graphql`
		subscription TrackSpeciesFavorite {
			speciesFavoriteToggled {
				species {
					favorite
					...FavoriteSpecies_toggle
				}
			}
		}
	`);
</script>

<FavoritesContainer>
	{#each $Favorites.data.favorites as favorite}
		<FavoritePreview species={favorite} />
	{:else}
		<p>No Favorites Selected</p>
	{/each}
</FavoritesContainer>

<Container>
	<Panel slot="left">
		<Display id="species-name">
			{$SpeciesInfo.data.species.name}
			<span>no.{$SpeciesInfo.data.species.id}</span>
		</Display>
		<Sprite id="species-sprite" species={$SpeciesInfo.data.species} />
		<Display id="species-flavor_text">
			{$SpeciesInfo.data.species.flavor_text}
		</Display>
		<button id="favorite" on:click={() => toggleFavorite({ id: $SpeciesInfo.data.species.id })}>
			<Icon
				name="star"
				id="favorite-star"
				fill={$SpeciesInfo.data.species.favorite ? 'gold' : 'lightgrey'}
			/>
		</button>
	</Panel>
	<Panel slot="right">
		<div id="species-evolution-chain">
			{#each $SpeciesInfo.data.species.evolution_chain as form, i}
				<SpeciesPreview species={form} number={i + 1} />
			{/each}
			<!-- if there are less than three species in the chain, leave a placeholder behind -->
			{#each Array.from({ length: 3 - $SpeciesInfo.data.species.evolution_chain?.length }) as _, i}
				<SpeciesPreviewPlaceholder
					number={$SpeciesInfo.data.species.evolution_chain.length + i + 1}
				/>
			{/each}
		</div>
		<div id="move-summary">
			<MoveDisplay move={$SpeciesInfo.data.species.moves.edges[moveIndex].node} />
			<div id="move-controls">
				<UpButton disabled={!hasPrevMove} on:click={loadPrevMove} />
				<DownButton disabled={!hasNextMove} on:click={loadNextMove} />
			</div>
		</div>
		<nav>
			<a href={$SpeciesInfo.data.species.id - 1} disabled={$SpeciesInfo.data.species.id <= 1}>
				previous
			</a>
			<a href={$SpeciesInfo.data.species.id + 1} disabled={$SpeciesInfo.data.species.id >= 151}>
				next
			</a>
		</nav>
	</Panel>
</Container>
