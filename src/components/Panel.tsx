import type { ReactNode } from 'react'

export function Panel({ children }: { children: ReactNode; side: 'left' | 'right' }) {
	return <>{children}</>
}
