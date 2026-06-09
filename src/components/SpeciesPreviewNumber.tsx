export function SpeciesPreviewNumber({ value }: { value: number }) {
	const Is = Array.from({ length: value })
		.map(() => 'I')
		.join('')

	return (
		<div
			className="text-center text-[1.25em] tracking-[2px] bg-transparent border-none text-black"
			style={{ fontFamily: "'Staatliches', cursive", textShadow: '-1px 1px #e78181' }}
		>
			{Is}
		</div>
	)
}
