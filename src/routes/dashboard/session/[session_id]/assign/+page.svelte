<script lang='ts'>
	import SessionConstraintsTable from "$lib/components/SessionConstraintsTable.svelte";

    export let data;
</script>

<SessionConstraintsTable serverForm={data.constraintForm} members={data.session.group.members} shiftTypes={data.session.shift_types} constraints={data.constraints} />
