<script context="module">
	export function SpeciesInfoVariables({ params }) {
		// if we were given an id, convert the string to a number
		const id = params.id ? parseInt(params.id) : 1;

		// check that the id falls between 1 and 151
		if (id < 1 || id > 151) {
			return this.error(400, 'id must be between 1 and 151');
		}

		return {
			id
		};
	}
</script>

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
	import { query, paginatedQuery, graphql, mutation, subscription } from '$houdini';
	import { navigating } from '$app/stores';

	const { data, loadNextPage, pageInfo } = paginatedQuery(graphql`
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
	`);

	// this is a second query in the same route
	const { data: favoriteData } = query(graphql`
		query Favorites {
			favorites @list(name: "FavoriteSpecies") {
				...FavoritePreview
			}
		}
	`);

	const toggleFavorite = mutation(graphql`
		mutation ToggleFavorite($id: Int!) {
			toggleFavorite(id: $id) {
				species {
					favorite
				}
			}
		}
	`);

	let moveIndex = 0;
	$: hasPrevMove = moveIndex > 0;
	$: hasNextMove = moveIndex < $data.species.moves.edges.length - 1 || $pageInfo.hasNextPage;

	navigating.subscribe(() => {
		moveIndex = 0;
	});

	const loadNextMove = async () => {
		// if we haven't already seen this page
		if (!$data.species.moves.edges[moveIndex + 1] && $pageInfo.hasNextPage) {
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
	{#each $favoriteData.favorites as favorite}
		<FavoritePreview species={favorite} />
	{:else}
		<p>No Favorites Selected</p>
	{/each}
</FavoritesContainer>

<Container>
	<Panel slot="left">
		<Display id="species-name">
			{$data.species.name}
			<span>no.{$data.species.id}</span>
		</Display>
		<Sprite id="species-sprite" species={$data.species} />
		<Display id="species-flavor_text">
			{$data.species.flavor_text}
		</Display>
		<button id="favorite" on:click={() => toggleFavorite({ id: $data.species.id })}>
			<Icon name="star" id="favorite-star" fill={$data.species.favorite ? 'gold' : 'lightgrey'} />
		</button>
	</Panel>
	<Panel slot="right">
		<div id="species-evolution-chain">
			{#each $data.species.evolution_chain as form, i}
				<SpeciesPreview species={form} number={i + 1} />
			{/each}
			<!-- if there are less than three species in the chain, leave a placeholder behind -->
			{#each Array.from({ length: 3 - $data.species.evolution_chain?.length }) as _, i}
				<SpeciesPreviewPlaceholder number={$data.species.evolution_chain.length + i + 1} />
			{/each}
		</div>
		<div id="move-summary">
			<MoveDisplay move={$data.species.moves.edges[moveIndex].node} />
			<div id="move-controls">
				<UpButton disabled={!hasPrevMove} on:click={loadPrevMove} />
				<DownButton disabled={!hasNextMove} on:click={loadNextMove} />
			</div>
		</div>
		<nav>
			<a href={$data.species.id - 1} disabled={$data.species.id <= 1}> previous </a>
			<a href={$data.species.id + 1} disabled={$data.species.id >= 151}> next </a>
		</nav>
	</Panel>
</Container>
