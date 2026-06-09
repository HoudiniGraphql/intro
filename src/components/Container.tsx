import React from 'react'
import type { ReactNode } from 'react'

export function Container({ children }: { children: ReactNode }) {
	const childArray = React.Children.toArray(children)
	const left = childArray.find(
		(child) => React.isValidElement(child) && (child.props as { side?: string }).side === 'left'
	)
	const right = childArray.find(
		(child) => React.isValidElement(child) && (child.props as { side?: string }).side === 'right'
	)

	return (
		<div id="pokedex">
			<div id="left-panel" className="panel">
				{left}
			</div>
			<div id="middle-panel" className="panel">
				<div id="divider">
					<div className="gap" />
					<div className="hinge" />
					<div className="gap" />
					<div className="hinge" />
					<div className="gap" />
					<div className="hinge" />
					<div className="gap" />
				</div>
			</div>
			<div id="right-panel" className="panel">
				{right}
			</div>
			<div>
				<div id="ball-highlight" />
				<div id="ball" />
				<div id="highlights">
					<div className="highlight" />
					<div className="highlight" />
					<div className="highlight" />
				</div>
				<div id="light-container">
					<div id="red-light" className="light" />
					<div id="yellow-light" className="light" />
					<div id="green-light" className="light" />
				</div>
				<div id="left-header" />
				<div id="left-cap" />
				<div id="left-cap-border" />
				<div id="left-cap-shadow" />
				<div id="right-cap" />
				<div id="right-cap-shadow" />
				<div id="outer-line" />
				<div id="border-spacing" />
				<div id="inner-border" />
				<div id="top-left-corner" className="corner" />
				<div id="middle-corner" className="corner" />
				<div id="bottom-right-corner" className="corner" />
				<div id="bottom-left-corner" className="corner" />
				<div id="right-panel-shadow" />
				<div id="background" />
			</div>
		</div>
	)
}
