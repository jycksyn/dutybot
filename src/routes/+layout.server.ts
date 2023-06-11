import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({fetch}) => {
    const seed = await fetch('/api/seed')
        .then(res => res.json())
        .then(o => o.seed)
        .catch(console.error);
    
    return {seed};
}