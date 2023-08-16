import { fail, type Action } from "@sveltejs/kit";
import type { User } from "@prisma/client";
import { superValidate, message } from "sveltekit-superforms/server";
import { searchUsersSchema } from "./forms";
import { db } from "./server/db";
import type { UserWithAuthUser } from "./dbtypes";

export type UserSearchResult = {
    user: UserWithAuthUser | null
}

const usersearch: Action = async ({ request }) => {
    const userSearchForm = await superValidate<typeof searchUsersSchema, UserSearchResult>(request, searchUsersSchema);

    const { email } = userSearchForm.data;

    console.log({ email })

    if (!userSearchForm.valid) return fail(400, { userSearchForm });

    try {
        const authUser = await db.authUser.findUnique({
            where: {
                email
            },
            include: {
                user: {
                    include: {
                        auth_user: true
                    }
                }
            }
        });

        return message(userSearchForm, { user: authUser?.user });
    } catch (e) {
        console.error(e);
        return fail(500, { userSearchForm });
    }
}

export default usersearch;