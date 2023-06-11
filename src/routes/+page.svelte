<script>
	import Button from '../components/ui/Button.svelte';
	import Particles from '../components/ui/hero/Particles.svelte';
</script>

<div class="bg-bg min-h-screen">
	<div class="bg-primary-900 text-white relative isolate px-6 pt-8 lg:px-8 overflow-clip">
        <Particles />
		<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
			<div class="text-center">
				<h1 class="text-4xl font-sans font-bold tracking-tight text-gray-900 sm:text-6xl">
					dutybot
				</h1>
				<p class="mt-6 text-xl leading-8 text-gray-600">
					Your new yes-manager.
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6">
                    <Button intent="secondary">
                        Get started
                    </Button>
                    <Button intent="tertiary">
                        Learn more
                    </Button>
				</div>
			</div>
		</div>
	</div>
</div>
