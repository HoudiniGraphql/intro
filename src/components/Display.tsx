import type { CSSProperties, ReactNode } from 'react'

export function Display({
	id,
	className,
	style,
	children,
}: {
	id?: string
	className?: string
	style?: CSSProperties
	children: ReactNode
}) {
	return (
		<div
			id={id}
			className={className}
			style={{
				background: 'linear-gradient(14deg, rgb(165, 205, 83) 60%, rgb(193, 217, 144) 65%)',
				padding: '5px',
				borderRadius: '3px',
				fontFamily: "'VT323'",
				border: 'inset #879a65 3px',
				color: 'black',
				...style,
			}}
		>
			{children}
		</div>
	)
}
