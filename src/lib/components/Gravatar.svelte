<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import md5 from 'md5';
	import type { ComponentProps } from "svelte";

    type GravatarProps = {
        email: String
    };

    interface $$Props extends GravatarProps, ComponentProps<Avatar> {
        class?: String
    };

    export let email: String;

    $: src = email ? `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}` : "";
</script>

<Avatar {src} initials="?" {...$$props} />