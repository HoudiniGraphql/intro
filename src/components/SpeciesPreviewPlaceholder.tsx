import { Display } from "./Display";
import { SpeciesPreviewNumber } from "./SpeciesPreviewNumber";
import { Shimmer } from "./Shimmer";

export function SpeciesPreviewPlaceholder({
	number,
	loading,
}: {
	number: number;
	loading?: boolean;
}) {
	return (
		<div>
			<SpeciesPreviewNumber value={number} />
			<div
				className="flex justify-center items-center h-[102px] w-[102px] rounded-[5px] my-[10px] box-border"
				style={{
					imageRendering: "pixelated",
					border: "inset #9aa28b 3px",
					background:
						"linear-gradient(15deg, #83887b 64%, #8b8f81 70%, #8b8f81 81%, #babfb1 86%, #8b8f81 89%, #8b8f81 100%)",
				}}
			>
				<div className="border-[4px] border-solid border-black bg-black rounded-full h-[50px] w-[50px] flex flex-col overflow-hidden items-center relative opacity-80">
					<div className="bg-[#83887a] flex-1 w-full opacity-30" />
					<div className="flex w-[22px] h-[22px] border-[4px] border-solid border-black rounded-full items-center justify-center absolute top-[10px]" />
					<div className="bg-[#83887a] flex-1 w-full" />
				</div>
			</div>
			<Display>
				{loading ? <Shimmer width="70px" height="1em" /> : "No Data"}
			</Display>
		</div>
	);
}
