import { Icon } from './Icon'

export function UpButton({ disabled, onClick }: { disabled?: boolean; onClick?: () => void }) {
	return (
		<button
			className="h-10 w-10 text-[37px] rounded-full flex justify-center items-center cursor-pointer rotate-[60deg] bg-transparent"
			style={{ border: 'groove grey 3px', textShadow: '-1px 1px #e78181' }}
			onClick={onClick}
			disabled={disabled}
		>
			<Icon name="arrow-up" style={{ transform: 'rotate(-60deg)' }} />
		</button>
	)
}
