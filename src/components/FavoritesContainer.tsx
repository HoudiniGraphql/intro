import type { ReactNode } from 'react'

export function FavoritesContainer({ children }: { children: ReactNode }) {
	return (
		<div
			id="favorites-container"
			className="absolute left-0 right-0 top-0 flex flex-col border-[10px] border-double border-black bg-white rounded-[15px] h-[130px]"
		>
			<h2 className="p-0 m-0 ml-[10px] mt-[3px] text-2xl"
				style={{ fontFamily: "'VT323'" }}>
				Favorites
			</h2>
			<div className="flex flex-row overflow-x-auto overflow-y-hidden h-full">{children}</div>
		</div>
	)
}
