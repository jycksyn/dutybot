<script lang="ts">
	import type { ConstraintWithMembers } from '$lib/dbtypes';
	import type { GroupMember, SessionConstraint, ShiftType } from '@prisma/client';
	import { Table, modalStore, tableSourceValues, type TableSource, type ModalSettings } from '@skeletonlabs/skeleton';
	import ModalUpdateConstraint from './modals/ModalUpdateConstraint.svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm, type SuperForm } from 'sveltekit-superforms/client';
	import { updateConstraintSchema } from '$lib/forms';
	import Icon from './Icon.svelte';
	import { Plus } from '@steeze-ui/heroicons';

	export let constraints: ConstraintWithMembers[];
	export let members: GroupMember[];
	export let shiftTypes: ShiftType[];
	export let serverForm: SuperValidated<typeof updateConstraintSchema>;

	const constraintForm = superForm(serverForm, {
		validators: updateConstraintSchema,
		async onUpdated({ form }) {
			console.log("onupdated")
			if (form.valid) {
				modalStore.clear();
			}
		}
	});

	const { form } = constraintForm;

	$: constraintDetails = constraints.map((constraint) => [
		constraint.members.length
			? constraint.members.length > 1
				? `${constraint.members[0].member.user.name} and others...`
				: constraint.members[0].member.user.name
			: 'Everyone',
		constraint.shift_type.name,
		constraint.min ?? 'None',
		constraint.max ?? 'None'
	]);

	let source: TableSource;
	$: source = {
		head: ['Respondents', 'Shift Type', 'Min', 'Max'],
		body: tableSourceValues(constraintDetails),
		meta: tableSourceValues(constraints.map((c, i) => [c.id, i]))
	};

	let modalUpdateConstraint: ModalSettings;

	$: modalUpdateConstraint = {
		type: 'component',
		component: {
			ref: ModalUpdateConstraint,
			props: {
				members,
				shiftTypes,
				constraintForm
			}
		}
	};

	const handleUpdateConstraint = (e: CustomEvent<string[]>) => {
		const [id, i] = e.detail;
		const constraint: ConstraintWithMembers = constraints[parseInt(i)];
		console.log({constraint});
		$form = {
			id: constraint.id,
			members: constraint.members.map((m) => m.user_id),
			type_id: constraint.type_id,
			max: constraint.max,
			min: constraint.min
		};
		modalStore.trigger(modalUpdateConstraint);
	};

	const handleNewConstraint = () => {
		$form = {
			members: [],
			type_id: shiftTypes[0].id ?? '',
			max: null,
			min: null
		};
		modalStore.trigger(modalUpdateConstraint);
	};
</script>

<Table interactive on:selected={handleUpdateConstraint} {source} />
<button class="btn variant-soft-primary" on:click={handleNewConstraint}>
	<Icon src={Plus} class="w-4" />
	Add Constraint
</button>
