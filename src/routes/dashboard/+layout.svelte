<script>
	import { AppRail, AppRailAnchor, AppShell } from '@skeletonlabs/skeleton';
	import { Calendar, User, UserGroup } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
    import { page } from '$app/stores';
	import SidebarIcon from '$lib/components/SidebarIcon.svelte';
</script>

<AppShell>

<AppRail slot="sidebarLeft" class="h-screen">
	<SidebarIcon icon={Calendar} href="/dashboard/session">
			Sessions
	</SidebarIcon>
	<SidebarIcon icon={UserGroup} href="/dashboard/group">
			Groups
	</SidebarIcon>
	<SidebarIcon slot="trail" icon={User} href="/dashboard/user" />
</AppRail>

<div class="max-w-2xl m-auto">
<main class="p-6">
<slot />
</main>
</div>

</AppShell>