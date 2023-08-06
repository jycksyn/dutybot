import { membersUpdateSchema } from "$lib/forms";
import { db } from "$lib/server/db";
import usersearch from "$lib/usersearch";
import { fail, redirect } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms/client";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({parent}) => {
    const {is_admin} = await parent();
    if (!is_admin) throw redirect(303, './');
};

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
                    id: group_id,
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
};