import { dueDateSchema, updateConstraintSchema } from "$lib/forms";
import { fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/server";
import type { PageServerLoad } from "../$types";
import { db } from "$lib/server/db";
import type { Actions } from "./$types";

export const load: PageServerLoad = async ({ parent, params }) => {
    const { is_admin, session: { id: session_id } } = await parent();
    if (!is_admin) {
        throw redirect(303, `/dashboard/session/${params.session_id}/calendar`)
    }

    var constraints = await db.sessionConstraint.findMany({
        where: {
            session_id,
        },
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

    const constraintForm = await superValidate(updateConstraintSchema);

    return { constraints, constraintForm };
}

export const actions: Actions = {
    updateconstraint: async ({ locals, request, params }) => {
        const authSession = await locals.auth.validate();

        const user_id = authSession?.user.userId;

        if (!user_id) throw redirect(302, '/auth/login');
        const { session_id } = params;

        const form = await superValidate(request, updateConstraintSchema);
        console.log("POST", form);

        if (!form.valid)
            return fail(400, { form });

        let session = await db.session.findUnique({
            where: {
                id: session_id
            },
            include: {
                group: {
                    include: {
                        members: true
                    }
                },
                shift_types: {
                    include: {
                        repeat_days: true
                    }
                },
            }
        });

        const is_admin = !!session?.group.members.find(m => m.is_admin && m.user_id == user_id);

        if (!session || !is_admin)
            throw redirect(302, '/dashboard/group');

        const { members, type_id, max, min, id } = form.data;

        try {
            if (id) {
                await db.sessionConstraint.update({
                    where: { id },
                    data: {
                        type_id,
                        max,
                        min,
                        members: {
                            deleteMany: {},
                            createMany: {
                                data: members.map(user_id => ({
                                    user_id,
                                    group_id: session!.group_id
                                }))
                            }
                        }
                    }
                })
            } else {
                await db.sessionConstraint.create({
                    data: {
                        session_id,
                        type_id,
                        max,
                        min,
                        members: {
                            createMany: {
                                data: members.map(user_id => ({
                                    user_id,
                                    group_id: session!.group_id
                                }))
                            }
                        }
                    }
                })
            }
        } catch (e) {
            console.error(e);
            return message(form, "Internal Server Error", {
                status: 500
            });
        }

        return {form};
    },
    
    deleteconstraint: async ({ locals, request, params }) => {
        const authSession = await locals.auth.validate();

        const user_id = authSession?.user.userId;

        if (!user_id) throw redirect(302, '/auth/login');
        const { session_id } = params;

        const form = await superValidate(request, updateConstraintSchema);
        console.log("POST", form);

        if (!form.valid)
            return fail(403, { form });

        let session = await db.session.findUnique({
            where: {
                id: session_id
            },
            include: {
                group: {
                    include: {
                        members: true
                    }
                },
                shift_types: {
                    include: {
                        repeat_days: true
                    }
                },
            }
        });

        const is_admin = !!session?.group.members.find(m => m.is_admin && m.user_id == user_id);

        if (!session || !is_admin)
            throw redirect(302, '/dashboard/group');

        console.log(form.data);

        const { members, type_id, max, min, id } = form.data;

        if (!id)
            return fail(403, {form});

        try {
            await db.sessionConstraint.delete({
                where: { id },
            })
        } catch (e) {
            console.error(e);
            return message(form, "Internal Server Error", {
                status: 500
            });
        }

        return {form};
    }
}