import React from 'react'
import './app.css'

export default function App({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="description" content="" />
				<link rel="icon" type="image/png" href="https://houdinigraphql.com/images/logo.png" />
				<title>Houdini • React • Pokédex</title>
				<link rel="stylesheet" href="/styles/colors.css" />
				<link rel="stylesheet" href="/styles/elements.css" />
				<link rel="stylesheet" href="/styles/pokedex.css" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link
					href="https://fonts.googleapis.com/css2?family=Staatliches&family=VT323&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body>
				<ErrorBoundary>{children}</ErrorBoundary>
			</body>
		</html>
	)
}

class ErrorBoundary extends React.Component<
	{ children: React.ReactNode },
	{ hasError: boolean }
> {
	constructor(props: { children: React.ReactNode }) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error('ErrorBoundary caught an error:', error, info)
	}

	render() {
		if (this.state.hasError) {
			return <h1>Something went wrong.</h1>
		}
		return this.props.children
	}
}
