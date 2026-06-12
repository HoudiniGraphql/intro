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
		<div id={id} className={`sprite${className ? ` ${className}` : ''}`}>
			<img height="100%" src={src} alt={`${speciesName} sprite`} />
		</div>
	)
}
