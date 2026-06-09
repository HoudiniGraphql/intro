declare namespace App {
	// user-specific information passed to each query
	interface Session {}
}

// CSS imports
declare module '*.css' {
	const content: Record<string, string>
	export default content
}
declare module '*.css?url' {
	const url: string
	export default url
}
