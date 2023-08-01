import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({params}) => {
    throw redirect(303, `/dashboard/group/${params.group_id}/sessions`);
}