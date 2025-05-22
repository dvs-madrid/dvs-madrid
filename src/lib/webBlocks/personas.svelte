<script>
	let { personas } = $props();

	let sortedPersonas = personas.sort((a, b) =>
		a.nombre.localeCompare(b.nombre, 'es', { ignorePunctuation: true })
	);
</script>

<div style="display: flex; flex-direction: column; gap: 1rem;margin-bottom: 50px">
	<h2>Quiénes somos</h2>

	<div
		style="display: grid;grid-template-columns: repeat(auto-fill, 300px);column-gap: 10px;row-gap: 20px"
	>
		{#each sortedPersonas as persona}
			<div class="persona">
				— {persona.nombre}
				{#if persona.bsky}
					<a href="https://bsky.app/profile/{persona.bsky}" target="_blank">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
							<!--!Font Awesome Free 6.7.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
							<path
								d="M123.6 34.5c66.4 50.1 137.9 151.5 164.2 206C314 186 385.5 84.5 452 34.5c48-36.1 125.6-64.1 125.6 24.9c0 17.8-10.1 149.2-16.1 170.5c-20.7 74.2-96.1 93.1-163.1 81.6c117.2 20 147 86.3 82.6 152.6C358.7 590 305.2 432.5 291.5 392.1c-2.5-7.5-3.7-10.9-3.7-7.9c0-3.1-1.2 .4-3.7 7.9C270.4 432.5 216.9 590 94.6 464.1C30.2 397.8 60 331.5 177.2 311.5C110.2 322.9 34.8 304 14.1 229.8C8.1 208.5-2 77.1-2 59.3c0-88.9 77.7-61 125.6-24.9z"
							/>
						</svg>
					</a>
				{/if}
				{#if persona.tw}
					<a href="https://x.com/{persona.tw}" target="_blank">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
							<!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
							<path
								d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
							/>
						</svg>
					</a>
				{/if}

				{#if persona.web}
					<a href={persona.web} target="_blank">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
							<!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
							<path
								d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C206.5 251.2 213 330 263 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372 74 321 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C433.5 260.8 427 182 377 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z"
							/>
						</svg>
					</a>
				{/if}

				{#if persona.linkedin}
					<a href={persona.linkedin} target="_blank">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
							<!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
							<path
								d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
							/>
						</svg>
					</a>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	svg {
		height: 1.2cap;
	}

	.persona {
		display: flex;
		gap: 0.5cap;
	}

	.persona a {
		display: flex;
		align-items: center;
	}
</style>
