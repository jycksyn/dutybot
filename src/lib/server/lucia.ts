// lib/server/lucia.ts
import { dev } from "$app/environment";
import { prisma } from "@lucia-auth/adapter-prisma";
import { lucia } from "lucia";
import { sveltekit } from "lucia/middleware";
import { db } from "./db";

export const auth = lucia({
	adapter: prisma(db, {
		user: "authUser",
		key: "authKey",
		session: "authSession"
	}),
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit()
});

export type Auth = typeof auth;