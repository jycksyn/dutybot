<script>
	import { page } from '$app/stores';
	import SidebarIcon from '$lib/components/SidebarIcon.svelte';
	import { href } from '$lib/href';
	import { AppRail, AppShell, TabAnchor, TabGroup } from '@skeletonlabs/skeleton';
	import { Calendar, User, UserGroup } from '@steeze-ui/heroicons';
	import Icon from '$lib/components/Icon.svelte';

	
</script>

<AppShell>

<AppRail slot="sidebarLeft" class="h-screen hidden md:grid">
	<SidebarIcon icon={Calendar} href="/dashboard/session">
			Sessions
	</SidebarIcon>
	<SidebarIcon icon={UserGroup} href="/dashboard/group">
			Groups
	</SidebarIcon>
	<SidebarIcon slot="trail" icon={User} href="/dashboard/user" />
</AppRail>

<div class="max-h-screen flex-1">
<div class="max-w-2xl m-auto">
<main class="p-6">
<slot />
</main>
</div>
</div>

<TabGroup
	slot="footer"
	justify="justify-center"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded=""
	border=""
	class="bg-surface-100-800-token w-full md:hidden"
>
	<TabAnchor {...href("/dashboard/session", $page)}>
		<svelte:fragment slot="lead">
			<Icon class="h-6 w-full" src={Calendar} />
		</svelte:fragment>
	</TabAnchor>
	<TabAnchor {...href("/dashboard/group", $page)}>
		<svelte:fragment slot="lead">
			<Icon class="h-6 w-full" src={UserGroup} />
		</svelte:fragment>
	</TabAnchor>
	<TabAnchor {...href("/dashboard/user", $page)}>
		<svelte:fragment slot="lead">
			<Icon class="h-6 w-full" src={User} />
		</svelte:fragment>
	</TabAnchor>
</TabGroup>

</AppShell>