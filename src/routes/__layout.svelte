<script context="module">
	import env from '../environment';
	import { setEnvironment } from '$houdini';

	setEnvironment(env);
</script>
<script>
    import '../styles/colors.css'
    import '../styles/elements.css'
</script>

<slot />
