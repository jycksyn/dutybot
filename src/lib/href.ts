import type { Page } from "@sveltejs/kit"

export const href = <T extends Record<string, string>>(href: string, page: Page<T>) => ({
    href,
    selected: page.url.pathname.slice(0, href.length) === href
})