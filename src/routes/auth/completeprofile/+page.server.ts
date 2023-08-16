import { userInfoSchema } from '$lib/forms';
import { fail, redirect, type Action, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { Prisma } from '@prisma/client';

export const load: PageServerLoad = async ({ url, locals }) => {
    const form = await superValidate(url.searchParams, userInfoSchema);
    return { form };
}

export const actions: Actions = {
    default: async ({ request, locals, url }) => {
        const authSession = await locals.auth.validate();
    
        const user_id = authSession?.user.userId;
    
        if (!user_id) throw redirect(302, '/auth/login');

        const form = await superValidate(request, userInfoSchema);
        console.log('POST', form);

        const {name} = form.data;

        if (!form.valid) {
            return fail(400, { form });
        }
        try {
            await db.user.upsert({
                where: {
                    id: user_id
                },
                create: {
                    id: user_id,
                    name
                },
                update: {
                    name
                }
            });
        } catch (e) {
            console.error(e);
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                if (e.code === 'P2002') {
                    return message(form, `${
                        e.meta?.target instanceof Array ?
                        e.meta?.target?.join?.(", ") : "A value you entered "
                    } already exists.`, {status: 403});
                }
            }
            return message(form, "There was an unknown error", {status: 403});
        }

        const redirectURI = url.searchParams.get('redirect');

        throw redirect(302, redirectURI ?? '/dashboard');
    }
}