import { userInfoSchema } from '$lib/forms';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { Prisma } from '@prisma/client';

export const load: PageServerLoad = async ({ url, locals }) => {
    const form = await superValidate(url.searchParams, userInfoSchema);
    return { form };
}

export const actions = {
    default: async ({ request, locals }) => {
        const { user } = await locals.auth.validateUser();
        if (!user) throw redirect(302, '/auth/login');

        const form = await superValidate(request, userInfoSchema);
        console.log('POST', form);

        if (!form.valid) {
            return fail(400, { form });
        }
        try {
            await db.user.upsert({
                where: {
                    id: user.userId
                },
                create: {
                    id: user.userId,
                    ...form.data
                },
                update: form.data
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

        throw redirect(302, '/dashboard');
    }
}