import { Container, Display, FavoritesContainer, Panel } from "~/components";
import { ErrorProps } from "./$types";

export default function ErrorView({ errors }: ErrorProps) {
	const message =
		errors?.map((e) => e.message).join("\n") || "Something went wrong";

	return (
		<>
			<FavoritesContainer>
				<p>No Favorites Selected</p>
			</FavoritesContainer>
			<Container>
				<Panel side="left">
					<Display
						id="species-error"
						style={{
							flexGrow: 1,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							textAlign: "center",
							fontSize: "32px",
							padding: "24px",
							whiteSpace: "pre-wrap",
						}}
					>
						{message}
					</Display>
				</Panel>
				<Panel side="right">{null}</Panel>
			</Container>
		</>
	);
}
