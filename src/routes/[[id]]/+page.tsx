import { graphql, useMutation, Link, isPending } from "$houdini";
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
	Shimmer,
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

export default function Page({ Info, Info$handle }: PageProps) {
	const species = Info.species;

	const isLoading = isPending(species);

	const [toggleFavorite, pending] = useMutation(toggleFavoriteMutation);

	const pokedexNumber =
		!species || isLoading || isPending(species.pokedexNumber)
			? "-"
			: species.pokedexNumber;

	const favorites = Info.favorites ?? [];

	const evolutionChain = species?.evolution_chain ?? [];
	const placeholderCount = Math.max(0, 3 - evolutionChain.length);

	const moves = species?.moves.edges ?? [];
	const firstMove = moves[0]?.node;
	const pageInfo = isLoading ? null : species?.moves.pageInfo;

	return (
		<>
			<FavoritesContainer>
				{favorites.length > 0 ? (
					favorites.map((fav, i) => (
						<FavoritePreview
							key={isPending(fav.id) ? i : fav.id}
							species={fav}
						/>
					))
				) : (
					<p>No Favorites Selected</p>
				)}
			</FavoritesContainer>
			<Container>
				<Panel side="left">
					<button
						id="favorite"
						disabled={pending}
						onClick={() =>
							species &&
							!isPending(species.id) &&
							toggleFavorite({ variables: { id: species.id } })
						}
					>
						<Icon
							id="favorite-star"
							name="star"
							style={
								!isLoading && !isPending(species?.favorite) && species?.favorite
									? { fill: "goldenrod", stroke: "goldenrod" }
									: undefined
							}
						/>
					</button>
					<Display id="species-name">
						{isLoading || isPending(species?.name) ? (
							<Shimmer width="55%" height="30px" />
						) : (
							species?.name
						)}
						{isLoading ? (
							<Shimmer width="64px" height="20px" />
						) : (
							<span>no.{species?.pokedexNumber}</span>
						)}
					</Display>
					<Sprite id="species-sprite" species={species ?? null} />
					<Display id="species-flavor_text">
						{isLoading || isPending(species?.flavor_text) ? (
							<div
								style={{ display: "flex", flexDirection: "column", gap: "6px" }}
							>
								<Shimmer height="0.8em" />
								<Shimmer width="92%" height="0.8em" />
								<Shimmer width="60%" height="0.8em" />
							</div>
						) : (
							species?.flavor_text
						)}
					</Display>
				</Panel>
				<Panel side="right">
					<div id="species-evolution-chain">
						{evolutionChain.map((s, i) => (
							<SpeciesPreview
								key={isPending(s.id) ? i : s.id}
								species={s}
								number={i + 1}
							/>
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
								onClick={() => {
									if (isLoading) return;
									Info$handle.loadPrevious?.();
								}}
							/>
							<DownButton
								disabled={!pageInfo?.hasNextPage}
								onClick={() => {
									if (isLoading) return;
									Info$handle.loadNext?.();
								}}
							/>
						</div>
					</div>
					<nav>
						{isLoading || typeof pokedexNumber == "string" ? (
							<>
								<a className="disabled">previous</a>
								<a className="disabled">next</a>
							</>
						) : (
							<>
								<Link
									to="/[[id]]"
									params={{ id: pokedexNumber - 1 }}
									disabled={pokedexNumber <= 1}
									className={pokedexNumber <= 1 ? "disabled" : undefined}
								>
									previous
								</Link>
								<Link to="/[[id]]" params={{ id: pokedexNumber + 1 }}>
									next
								</Link>
							</>
						)}
					</nav>
				</Panel>
			</Container>
		</>
	);
}
