import { useFragment, graphql, isPending } from "$houdini";
import type { MoveDisplay as MoveDisplayFragment } from "$houdini";
import { Display } from "./Display";
import { Shimmer } from "./Shimmer";

const padValue = (val: number | null) => {
	if (val === null) return "..0";
	return (
		Array.from({ length: 3 - val.toString().length })
			.map(() => ".")
			.join("") + val
	);
};

const padKey = (val: string) => {
	return (
		val +
		Array.from({ length: 8 - val.toString().length })
			.map(() => ".")
			.join("")
	);
};

export function MoveDisplay({ move }: { move: MoveDisplayFragment | null }) {
	const data = useFragment(
		move,
		graphql(`
			fragment MoveDisplay on SpeciesMove @loading {
				learned_at
				method
				move {
					name
					accuracy
					power
					pp
					type
				}
			}
		`),
	);

	const loading = !data || isPending(data);

	return (
		<Display
			id="move-display"
			style={{
				padding: "10px 20px",
				display: "flex",
				flexDirection: "row",
				position: "relative",
				lineHeight: "1",
				minWidth: 0,
				overflow: "hidden",
			}}
		>
			<div>
				<h3
					style={{
						margin: 0,
						fontWeight: "normal",
						fontSize: "24px",
						borderBottom: loading ? "none" : "2px solid black",
						padding: "0 4px",
						width: "103px",
						textAlign: "center",
						whiteSpace: "nowrap",
					}}
				>
					{loading ? <Shimmer width="90px" height="22px" /> : data.move.name}
				</h3>
				{loading ? (
					<>
						<div style={{ marginTop: "3px" }}>
							<Shimmer width="150px" height="0.85em" />
						</div>
						<div style={{ marginTop: "3px" }}>
							<Shimmer width="150px" height="0.85em" />
						</div>
						<div style={{ marginTop: "3px" }}>
							<Shimmer width="150px" height="0.85em" />
						</div>
					</>
				) : (
					<>
						<div style={{ marginTop: "3px" }}>
							{padKey("Accuracy")}.....{padValue(data.move.accuracy)}
						</div>
						<div style={{ marginTop: "3px" }}>
							{padKey("Power")}.....{padValue(data.move.power)}
						</div>
						<div style={{ marginTop: "3px" }}>
							{padKey("PP")}.....{padValue(data.move.pp)}
						</div>
					</>
				)}
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					flexGrow: 1,
				}}
			>
				<div
					style={{
						fontSize: "18px",
						textTransform: "uppercase",
						border: loading ? "solid transparent 2px" : "solid black 2px",
						borderRadius: "7px",
						padding: "2px 10px",
						textAlign: "center",
					}}
				>
					{loading ? <Shimmer width="84px" height="18px" /> : <>Type: {data.move.type}</>}
				</div>
				<div style={{ marginRight: "10px" }}>
					{loading ? (
						<Shimmer width="70px" height="0.85em" />
					) : (
						<>Learn: {data.method === "level-up" ? `Lvl ${data.learned_at}` : "TM"}</>
					)}
				</div>
			</div>
		</Display>
	);
}
