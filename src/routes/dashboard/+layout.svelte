<script>
	import { AppRail, AppRailAnchor, AppShell } from '@skeletonlabs/skeleton';
	import { Calendar, User, UserGroup } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
    import { page } from '$app/stores';
</script>

<AppShell>

<AppRail slot="sidebarLeft" class="h-screen">
	<AppRailAnchor href={'/dashboard/session'} selected={$page.url.pathname === '/dashboard/session'}>
		<svelte:fragment slot="lead">
			<Icon class="h-6" src={Calendar} />
		</svelte:fragment>
		<span>Sessions</span>
	</AppRailAnchor>
	<AppRailAnchor>
		<svelte:fragment slot="lead">
			<Icon class="h-6" src={UserGroup} />
		</svelte:fragment>
		<span>Groups</span>
	</AppRailAnchor>
	<svelte:fragment slot="trail">
		<AppRailAnchor>
			<svelte:fragment slot="lead">
				<Icon class="h-6" src={User} />
			</svelte:fragment>
		</AppRailAnchor>
	</svelte:fragment>
</AppRail>

<div class="max-w-2xl m-auto">
<main class="p-6">
<slot />
</main>
</div>

</AppShell>