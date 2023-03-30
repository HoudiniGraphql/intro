<div id="favorites-container">
	<h2>Favorites</h2>
	<div>
		<slot />
	</div>
</div>

<style>
	h2 {
		padding: 0;
		margin: 0;
		margin-left: 10px;
		margin-top: 3px;
	}

	#favorites-container {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		display: flex;
		flex-direction: column;
		border: 10px double black;
		background: white;
		border-radius: 15px;
		height: 130px;
	}

	#favorites-container div {
		display: flex;
		flex-direction: row;
		overflow-x: auto;
		overflow-y: hidden;
		height: 100%;
	}

	:global(#favorites-container ~ #pokedex) {
		margin-top: 200px;
	}

	:global(#favorites-container p) {
		padding: 0;
		margin: 0;
		margin-top: -10px;
		margin-left: 10px;
		display: flex;
		flex-grow: 1;
		flex-direction: row;
		align-items: center;
	}

	:global(#favorites-container p),
	h2 {
		font-size: 24px;
		font-family: 'VT323';
	}
</style>
