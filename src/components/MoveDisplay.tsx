import { useFragment, graphql } from '$houdini'
import type { MoveDisplay as MoveDisplayFragment } from '$houdini'

const padValue = (val: number | null) => {
	if (val === null) return '..0'
	return (
		Array.from({ length: 3 - val.toString().length })
			.map(() => '.')
			.join('') + val
	)
}

const padKey = (val: string) => {
	return (
		val +
		Array.from({ length: 8 - val.toString().length })
			.map(() => '.')
			.join('')
	)
}

export function MoveDisplay({ move }: { move: MoveDisplayFragment }) {
	const data = useFragment(
		move,
		graphql(`
			fragment MoveDisplay on SpeciesMove {
				learned_at
				method
				move {
					name
					accuracy
					power
					pp
					type
				}
			}
		`)
	)

	return (
		<div
			id="move-display"
			className="relative px-5 py-[10px] h-20 flex flex-row"
			style={{
				background: 'linear-gradient(14deg, rgb(165, 205, 83) 60%, rgb(193, 217, 144) 65%)',
				border: 'inset #879a65 3px',
				borderRadius: '3px',
				fontFamily: "'VT323'",
				color: 'black',
			}}
		>
			<div>
				<h3 className="m-0 font-normal text-2xl border-b-2 border-black px-1 w-[103px] text-center whitespace-nowrap">
					{data.move.name}
				</h3>
				<div className="mt-[3px]">{padKey('Accuracy')}.....{padValue(data.move.accuracy)}</div>
				<div className="mt-[3px]">{padKey('Power')}.....{padValue(data.move.power)}</div>
				<div className="mt-[3px]">{padKey('PP')}.....{padValue(data.move.pp)}</div>
			</div>
			<div className="flex flex-col items-end flex-grow">
				<div className="text-lg uppercase border-2 border-black rounded-[7px] px-[10px] py-[2px] text-center">
					Type: {data.move.type}
				</div>
				<div className="mr-[10px]">
					Learn: {data.method === 'level-up' ? `Lvl ${data.learned_at}` : 'TM'}
				</div>
			</div>
		</div>
	)
}
