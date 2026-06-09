export function Sprite({
	src,
	speciesName,
	id,
	className,
}: {
	src: string
	speciesName: string
	id?: string
	className?: string
}) {
	return (
		<div
			id={id}
			className={`flex items-center justify-center rounded-[5px] my-[10px] box-border${className ? ` ${className}` : ''}`}
			style={{
				imageRendering: 'pixelated',
				border: 'inset #9aa28b 3px',
				background:
					'linear-gradient(15deg, #cad5b5 64%, #dde2d4 70%, #dde2d4 81%, #fff 86%, #dde2d4 89%, #dde2d4 100%)',
			}}
		>
			<img height="100%" src={src} alt={`${speciesName} sprite`} />
		</div>
	)
}
