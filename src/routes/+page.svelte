<script>
	import LinkButton from '$lib/components/ui/LinkButton.svelte';
	import Particles from '$lib/components/ui/hero/Particles.svelte';
</script>

<div class="bg-bg min-h-screen">
	<div class="bg-primary-500-400-token text-white relative isolate px-6 pt-8 lg:px-8 overflow-clip">
        <Particles />
		<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
			<div class="text-center">
				<h1 class="h1 font-bold tracking-tight sm:text-6xl">
					dutybot
				</h1>
				<p class="mt-6 text-xl leading-8">
					Your new yes-manager.
				</p>
				<div class="mt-10 flex items-center justify-center gap-x-6">
                    <!-- <Button intent="secondary">
                        Sign In
                    </Button> -->
                    <LinkButton href="/auth/login" intent="secondary">
                        Sign Up
                    </LinkButton>
				</div>
			</div>
		</div>
	</div>
</div>
