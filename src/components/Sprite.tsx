import { useFragment, graphql, isPending } from "$houdini";
import type { SpriteInfo } from "$houdini";
import { Shimmer } from "./Shimmer";

export function Sprite({
	species,
	id,
	className,
}: {
	species: SpriteInfo | null;
	id?: string;
	className?: string;
}) {
	const info = useFragment(
		species,
		graphql(`
			fragment SpriteInfo on Species @loading {
				name
				sprites {
					front
				}
			}
		`),
	);

	return (
		<div id={id} className={`sprite${className ? ` ${className}` : ""}`}>
			{!info || isPending(info) ? (
				<Shimmer width="90%" height="90%" radius="5px" background="transparent" />
			) : (
				<img height="100%" src={info.sprites.front} alt={`${info.name} sprite`} />
			)}
		</div>
	);
}
