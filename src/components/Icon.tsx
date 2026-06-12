import feather from 'feather-icons'
import type { CSSProperties, SVGAttributes } from 'react'

const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const
type Direction = (typeof directions)[number]

export function Icon({
	name,
	direction = 'n',
	strokeWidth,
	stroke,
	width = '1em',
	height = '1em',
	fill = '',
	id,
	className,
	style: styleProp,
}: {
	name: string
	direction?: Direction
	strokeWidth?: number
	stroke?: string
	width?: string
	height?: string
	fill?: string
	id?: string
	className?: string
	style?: CSSProperties
}) {
	const icon = (feather.icons as Record<string, feather.FeatherIcon | undefined>)[name]
	if (!icon) return null

	const {
		class: _class,
		'stroke-width': svgStrokeWidth,
		'stroke-linecap': svgStrokeLinecap,
		'stroke-linejoin': svgStrokeLinejoin,
		...attrs
	} = { ...icon.attrs }
	const svgAttrs = {
		...attrs,
		strokeWidth: strokeWidth ?? svgStrokeWidth,
		strokeLinecap: svgStrokeLinecap as SVGAttributes<SVGSVGElement>['strokeLinecap'],
		strokeLinejoin: svgStrokeLinejoin as SVGAttributes<SVGSVGElement>['strokeLinejoin'],
	}
	if (stroke) svgAttrs['stroke'] = stroke
	if (fill) svgAttrs['fill'] = fill

	const rotation = directions.indexOf(direction) * 45

	return (
		<svg
			{...svgAttrs}
			style={{ width, height, transform: `rotate(${rotation}deg)`, ...styleProp }}
			className={`overflow-visible origin-[50%_50%]${className ? ` ${className}` : ''}`}
			id={id}
			dangerouslySetInnerHTML={{ __html: `<g>${icon.contents}</g>` }}
		/>
	)
}
