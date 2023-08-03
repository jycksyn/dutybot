<script>

	import Calendar from "$lib/components/calendar/Calendar.svelte";
	import dayjs from "dayjs";

    export let data;

    $: ({session} = data);
    $: start = dayjs.utc(session.start);
    $: end = dayjs.utc(session.end);
</script>
<Calendar {start} {end} />