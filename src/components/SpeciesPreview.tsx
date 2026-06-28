import { useFragment, graphql, Link, isPending } from "$houdini";
import type { SpeciesPreview as SpeciesPreviewFragment } from "$houdini";
import { Sprite } from "./Sprite";
import { Display } from "./Display";
import { SpeciesPreviewNumber } from "./SpeciesPreviewNumber";
import { SpeciesPreviewPlaceholder } from "./SpeciesPreviewPlaceholder";

export function SpeciesPreview({
	species,
	number,
}: {
	species: SpeciesPreviewFragment;
	number: number;
}) {
	const data = useFragment(
		species,
		graphql(`
			fragment SpeciesPreview on Species @loading {
				name
				id
				pokedexNumber
				...SpriteInfo
			}
		`),
	);

	if (!data) return null;

	if (isPending(data)) {
		return <SpeciesPreviewPlaceholder number={number} loading />;
	}

	return (
		<Link
			to="/[[id]]"
			params={{ id: data.pokedexNumber }}
			className="no-underline"
		>
			<SpeciesPreviewNumber value={number} />
			<Sprite species={data} className="h-[102px] w-[102px]" />
			<Display>{data.name}</Display>
		</Link>
	);
}
