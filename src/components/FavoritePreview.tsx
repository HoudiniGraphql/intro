import { useFragment, graphql, isPending } from "$houdini";
import type { FavoritePreview as FavoritePreviewFragment } from "$houdini";

export function FavoritePreview({
	species,
}: {
	species: FavoritePreviewFragment;
}) {
	const data = useFragment(
		species,
		graphql(`
			fragment FavoritePreview on Species @loading {
				id
				pokedexNumber
				name
				sprites {
					front
				}
			}
		`),
	);

	return isPending(data) ? null : (
		<a
			href={`/${data.pokedexNumber}`}
			className="flex flex-col no-underline h-full"
		>
			<img
				src={data.sprites.front}
				alt={`${data.name} sprite`}
				className="h-full w-auto"
			/>
		</a>
	);
}
