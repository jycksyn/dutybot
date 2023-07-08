import { fail, type Action } from "@sveltejs/kit";
import type { User } from "@prisma/client";
import { superValidate, message } from "sveltekit-superforms/server";
import { searchUsersSchema } from "./forms";
import { db } from "./server/db";

export type UserSearchResult = {
    user: User | null
}

const usersearch: Action = async ({request}) => {
    const searchForm = await superValidate<typeof searchUsersSchema, UserSearchResult>(request, searchUsersSchema);

    const { email } = searchForm.data;

    console.log({email})

    if (!searchForm.valid) return fail(400, { searchForm });

    try {
        const user = await db.user.findUnique({
            where: {email}
        });

        return message(searchForm, {user});
    } catch (e) {
        console.error(e);
    }
}

export default usersearch;