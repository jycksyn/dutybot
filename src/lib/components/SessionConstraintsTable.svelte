<script lang="ts">
	import { Prisma } from "@prisma/client";
	import { Table, tableSourceMapper, type TableSource, tableSourceValues } from "@skeletonlabs/skeleton";

	const constraintWithMembers = Prisma.validator<Prisma.SessionConstraintArgs>()({
		include: { 
            members: {
                include: {
                    member: {
                        include: {
                            user: true
                        }
                    }
                }
            },
            shift_type: true
        }
	});

	export let constraints: Prisma.SessionConstraintGetPayload<typeof constraintWithMembers>[];

    $: constraintDetails = constraints.map(constraint => ([
        constraint.members.length ? (
            constraint.members.length > 1 ? (
                `${constraint.members[0].member.user.name} and others...`
            ) : (
                constraint.members[0].member.user.name
            )
        ) : (
            'Everyone'
        ),
        constraint.shift_type.name,
        constraint.min ?? "None",
        constraint.max ?? "None"
    ]));

    let source: TableSource;
    $: source = {
        head: ['Respondents', 'Shift Type', 'Min', 'Max'],
        body: tableSourceValues(constraintDetails)
    };

</script>

<Table {source} />
