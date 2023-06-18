// lib/server/lucia.ts
import lucia from "lucia-auth";
import { sveltekit } from "lucia-auth/middleware";
import prisma from "@lucia-auth/adapter-prisma";
import { PrismaClient } from "@prisma/client";
import { dev } from "$app/environment";
import { db } from "./db";

export const auth = lucia({
	adapter: prisma(db),
	env: dev ? "DEV" : "PROD",
	middleware: sveltekit()
});

export type Auth = typeof auth;