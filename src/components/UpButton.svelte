<script>
	import { Icon } from '.'

	let { disabled, onclick } = $props()
</script>

<button class="arrow-button" {onclick} {disabled}>
	<Icon name="arrow-up" />
</button>
