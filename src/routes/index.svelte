<script>
    import { Container } from '~/components'
</script>

<Container>
    <div slot="left">
        hello   
    </div>
    <div slot="right">
        world
    </div>
</Container>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background: linear-gradient(
            15deg,
            rgba(41, 41, 41, 1) 4%,
            rgba(49, 49, 49, 1) 24%,
            rgba(128, 128, 128, 1) 64%,
            rgba(138, 138, 138, 1) 70%,
            rgba(230, 230, 230, 1) 81%,
            rgba(255, 255, 255, 1) 86%,
            rgba(220, 220, 220, 1) 89%,
            rgba(230, 230, 230, 1) 100%
        );
        background-color: #09a8ff;
        background-blend-mode: overlay;
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
    }
</style>