import { graphql, useMutation } from "$houdini";
import {
	Container,
	Display,
	FavoritePreview,
	FavoritesContainer,
	MoveDisplay,
	Panel,
	SpeciesPreview,
	SpeciesPreviewPlaceholder,
	Sprite,
	UpButton,
	DownButton,
	Icon,
} from "~/components";
import type { PageProps } from "./$types";

const toggleFavoriteMutation = graphql(`
	mutation ToggleFavorite($id: Int!) {
		toggleFavorite(id: $id) {
			species {
				id
				favorite
				...FavoriteSpecies_toggle
			}
		}
	}
`);

export default function Page({ Info$handle }: PageProps) {
	const Info = Info$handle.data;
	const species = Info.species;
	const id = species?.id ?? 1;
	const favorites = Info.favorites ?? [];

	const [toggleFavorite] = useMutation(toggleFavoriteMutation);

	const evolutionChain = species?.evolution_chain ?? [];
	const placeholderCount = Math.max(0, 3 - evolutionChain.length);

	const moves = species?.moves.edges ?? [];
	const firstMove = moves[0]!.node;
	const pageInfo = species?.moves.pageInfo;

	return (
		<>
			<FavoritesContainer>
				{favorites.length > 0 ? (
					favorites.map((fav) => <FavoritePreview key={fav.id} species={fav} />)
				) : (
					<p>No Favorites Selected</p>
				)}
			</FavoritesContainer>
			<Container>
				<Panel side="left">
					<button
						id="favorite"
						onClick={() =>
							species && toggleFavorite({ variables: { id: species.id } })
						}
					>
						<Icon
							id="favorite-star"
							name="star"
							style={
								species?.favorite
									? { fill: "goldenrod", stroke: "goldenrod" }
									: undefined
							}
						/>
					</button>
					<Display id="species-name">
						{species?.name}
						<span>no.{species?.id}</span>
					</Display>
					<Sprite
						id="species-sprite"
						src={species?.sprites.front ?? ""}
						speciesName={species?.name ?? ""}
					/>
					<Display id="species-flavor_text">{species?.flavor_text}</Display>
				</Panel>
				<Panel side="right">
					<div id="species-evolution-chain">
						{evolutionChain.map((s, i) => (
							<SpeciesPreview key={s.id} species={s} number={i + 1} />
						))}
						{Array.from({ length: placeholderCount }).map((_, i) => (
							<SpeciesPreviewPlaceholder
								key={evolutionChain.length + i}
								number={evolutionChain.length + i + 1}
							/>
						))}
					</div>
					<div id="move-summary">
						<MoveDisplay move={firstMove} />
						<div id="move-controls">
							<UpButton
								disabled={!pageInfo?.hasPreviousPage}
								onClick={() => Info$handle.loadPrevious?.()}
							/>
							<DownButton
								disabled={!pageInfo?.hasNextPage}
								onClick={() => Info$handle.loadNext?.()}
							/>
						</div>
					</div>
					<nav>
						<a
							href={id - 1 <= 0 ? undefined : `/${id - 1}`}
							className={id - 1 <= 0 ? "disabled" : undefined}
						>
							previous
						</a>
						<a href={`/${id + 1}`}>next</a>
					</nav>
				</Panel>
			</Container>
		</>
	);
}
