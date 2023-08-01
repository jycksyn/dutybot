<script>
	import SidebarIcon from '$lib/components/SidebarIcon.svelte';
	import { AppRail, AppShell } from '@skeletonlabs/skeleton';
	import { Calendar, User, UserGroup } from '@steeze-ui/heroicons';

	
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

<div class="max-h-screen">
<div class="max-w-2xl m-auto">
<main class="p-6">
<slot />
</main>
</div>
</div>

</AppShell>