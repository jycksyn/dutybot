import { redirect, type Actions, error, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";
import type { User } from "@prisma/client";
import { message, superValidate } from "sveltekit-superforms/client";
import { membersUpdateSchema, searchUsersSchema } from "$lib/forms";
import usersearch from "$lib/usersearch";


export const load: PageServerLoad = async ({ url, locals, params }) => {
    const {user: authUser} = await locals.auth.validateUser();

    const user_id = authUser?.userId;

    if (!user_id) throw redirect(302, '/auth/login');

    const members = await db.groupMember.findMany({
        where: {
            group_id: params.group_id
        },
        include: {
            user: true
        }
    });

    const user = members.find(m => m.user_id == user_id)?.user;
    
    if (!user) throw error(403);

    const originalMembers = {
        members: members.map(m => ({
            user_id: m.user.id,
            name: m.user.name,
            email: m.user.email ?? '',
            is_admin: m.is_admin,
            is_respondent: m.is_respondent
        }))
    };

    const groupForm = await superValidate(originalMembers, membersUpdateSchema);
    const userSearchForm = await superValidate(searchUsersSchema);

    return { groupForm, userSearchForm, originalMembers, user };
}

export const actions: Actions = {
    usersearch,
    updategroup: async ({locals, request, params}) => {
        
        const {user: authUser} = await locals.auth.validateUser();
    
        const id = authUser?.userId;
        const {group_id} = params;
    
        if (!id)
            throw redirect(302, '/auth/login');

        const form = await superValidate(request, membersUpdateSchema);
        console.log("POST", form);

        if (!form.valid)
            return fail(400, {form});
        
        const member = await db.groupMember.findFirst({
            where: {
                user_id: id,
                group_id,
                is_admin: true
            },
            include: {
                group: true
            }
        });
        
        if (!member || !group_id) 
            throw redirect(302, '/dashboard/group');

        const {members} = form.data;
        
        try {
            var group = await db.group.update({
                where: {
                    id: group_id
                },
                data: {
                    members: {
                        upsert: members.map(({is_admin, is_respondent, user_id}) => ({
                            where: {
                                group_id_user_id: {
                                    user_id,
                                    group_id
                                }
                            },
                            update: {
                                is_admin,
                                is_respondent
                            },
                            create: {
                                user_id,
                                is_admin,
                                is_respondent
                            }
                        })),
                        deleteMany: {
                            user_id: {
                                notIn: members.map(m => m.user_id)
                            }
                        }
                    }
                }
            });
        } catch (e) {
            console.error(e);
            return message(form, "Internal Server Error", {
                status: 500
            });
        }
    }
}