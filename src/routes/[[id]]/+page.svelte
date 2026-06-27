<script>
	import { InfoStore, ToggleFavoriteStore, isPending } from '$houdini'
	import { Container, Display, Sprite, Panel } from '~/components'
	import DownButton from '~/components/DownButton.svelte'
	import FavoritePreview from '~/components/FavoritePreview.svelte'
	import FavoritesContainer from '~/components/FavoritesContainer.svelte'
	import Icon from '~/components/Icon.svelte'
	import MoveDisplay from '~/components/MoveDisplay.svelte'
	import SpeciesPreview from '~/components/SpeciesPreview.svelte'
	import SpeciesPreviewPlaceholder from '~/components/SpeciesPreviewPlaceholder.svelte'
	import UpButton from '~/components/UpButton.svelte'

	let { data } = $props()

	const Info = new InfoStore()
	const toggleFavorite = new ToggleFavoriteStore()

	$effect(() => {
		Info.fetch({ variables: { id: data.id } })
	})

	const species = $derived($Info.data?.species)
	const isLoading = $derived(!species || isPending(species))

	const favorites = $derived($Info.data?.favorites ?? [])
	const evolutionChain = $derived(species?.evolution_chain ?? [])
	const placeholderCount = $derived(Math.max(0, 3 - evolutionChain.length))
	const firstMove = $derived(species?.moves?.edges?.[0]?.node)
	const pageInfo = $derived(isLoading ? null : species?.moves?.pageInfo)
	const pokedexNumber = $derived(!species || isLoading ? '-' : (species?.pokedexNumber ?? 1))
</script>

<FavoritesContainer>
	{#each favorites as favorite, i (!isPending(favorite) ? favorite.id : i)}
		<FavoritePreview species={favorite} />
	{:else}
		<p>No Favorites Selected</p>
	{/each}
</FavoritesContainer>

{#key data.id}
	<Container>
		{#snippet left()}
			<Panel>
				<button
					id="favorite"
					disabled={$toggleFavorite.fetching}
					onclick={() =>
						species && !isPending(species.id) && toggleFavorite.mutate({ id: species.id })}
				>
					<Icon
						name="star"
						id="favorite-star"
						fill={!isLoading && species?.favorite ? 'gold' : 'lightgrey'}
					/>
				</button>
				<Display id="species-name">
					{!isLoading ? species?.name : '...'}
					<span>{isLoading ? '...' : `no.${species?.pokedexNumber}`}</span>
				</Display>
				<Sprite id="species-sprite" species={species} />
				<Display id="species-flavor_text">
					{isLoading ? '...' : species?.flavor_text}
				</Display>
			</Panel>
		{/snippet}

		{#snippet right()}
			<Panel>
				<div id="species-evolution-chain">
					{#each evolutionChain as form, i (isPending(form) ? i : form.id)}
						<SpeciesPreview species={form} number={i + 1} />
					{/each}
					{#each Array.from({ length: placeholderCount }) as _, i}
						<SpeciesPreviewPlaceholder number={evolutionChain.length + i + 1} />
					{/each}
				</div>

				<div id="move-summary">
					{#key species?.moves?.pageInfo?.startCursor}
						<MoveDisplay move={firstMove} />
					{/key}
					<div id="move-controls">
						<UpButton
							disabled={!pageInfo?.hasPreviousPage}
							onclick={() => {
								if (isLoading) return
								Info.loadPreviousPage()
							}}
						/>
						<DownButton
							disabled={!pageInfo?.hasNextPage}
							onclick={() => {
								if (isLoading) return
								Info.loadNextPage()
							}}
						/>
					</div>
				</div>

				<nav>
					{#if !isLoading && typeof pokedexNumber === 'number'}
						<a
							href={pokedexNumber > 1 ? `/${pokedexNumber - 1}` : undefined}
							class={pokedexNumber <= 1 ? 'disabled' : undefined}
						>
							previous
						</a>
						<a href="/{pokedexNumber + 1}">next</a>
					{/if}
				</nav>
			</Panel>
		{/snippet}
	</Container>
{/key}
