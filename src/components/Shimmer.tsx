export function Shimmer({
	width = "100%",
	height = "1em",
	radius = "4px",
	background = "rgba(40, 50, 20, 0.35)",
}: {
	width?: string;
	height?: string;
	radius?: string;
	background?: string;
}) {
	return (
		<span
			className="shimmer"
			style={{
				width,
				height,
				borderRadius: radius,
				backgroundColor: background,
			}}
		/>
	);
}
