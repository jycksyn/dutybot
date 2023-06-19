import { userInfoSchema } from '$lib/forms';
import type { Load } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({url, locals}) => {
    const form = await superValidate(url.searchParams, userInfoSchema);
    return {form};
}