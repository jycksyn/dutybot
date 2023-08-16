import { superValidate } from "sveltekit-superforms/client";
import type { Actions, PageServerLoad } from "./$types";
import { emailUserLoginSchema } from "$lib/forms";
import { auth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";
import { LuciaError } from "lucia";


export const load: PageServerLoad = async ({ }) => {
    const form = await superValidate(emailUserLoginSchema);
    return { form };
}

export const actions: Actions = {
    default: async ({ request, locals }) => {
        try {
            const form = await superValidate(request, emailUserLoginSchema);
            console.log("POST", form);
    
            if (!form.valid)
                return fail(400, {form});
    
            const {email, password} = form.data;

            const user = await auth.useKey(
                "email",
                email,
                password
            );
            const session = await auth.createSession({
                userId: user.userId,
                attributes: {}
            });
            locals.auth.setSession(session); // set session cookie
        } catch (e) {
            if (
                e instanceof LuciaError &&
                (e.message === "AUTH_INVALID_KEY_ID" ||
                    e.message === "AUTH_INVALID_PASSWORD")
            ) {
                // user does not exist
                // or invalid password
                return fail(400, {
                    message: "Incorrect username of password"
                });
            }
            return fail(500, {
                message: "An unknown error occurred"
            });
        }
        // redirect to
        // make sure you don't throw inside a try/catch block!
        throw redirect(302, "/dashboard");
    }
}