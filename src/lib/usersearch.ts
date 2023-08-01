import { fail, type Action } from "@sveltejs/kit";
import type { User } from "@prisma/client";
import { superValidate, message } from "sveltekit-superforms/server";
import { searchUsersSchema } from "./forms";
import { db } from "./server/db";

export type UserSearchResult = {
    user: User | null
}

const usersearch: Action = async ({request}) => {
    const userSearchForm = await superValidate<typeof searchUsersSchema, UserSearchResult>(request, searchUsersSchema);

    const { email } = userSearchForm.data;

    console.log({email})

    if (!userSearchForm.valid) return fail(400, { userSearchForm });

    try {
        const user = await db.user.findUnique({
            where: {email}
        });

        return message(userSearchForm, {user});
    } catch (e) {
        console.error(e);
        return fail(500, {userSearchForm});
    }
}

export default usersearch;