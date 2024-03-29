import {google} from "@lucia-auth/oauth/providers";
import { auth } from "./lucia";
import { GOOGLE_CLIENT_SECRET as clientSecret, GOOGLE_CLIENT_ID as clientId } from "$env/static/private";
import { dev } from "$app/environment";

export const googleAuth = google(auth, {
    clientId, clientSecret,
    redirectUri: `${dev ? "http://localhost:5173" : "https://" + (process.env.VERCEL_URL == 'dutybot.vercel.app' ? 'dutybot.vercel.app' : 'dutybot-jycksyn.vercel.app')}/api/oauth/callbacks/google`,
    scope: ["https://www.googleapis.com/auth/userinfo.email"]
});