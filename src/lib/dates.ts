import type { Session } from "@prisma/client";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

export const prettyDate = (date: Parameters<typeof dayjs>[0]) => dayjs(date).format('MMMM DD, YYYY');
export const prettyTime = (time: Parameters<typeof dayjs>[0]) => dayjs.utc(time).format('LT');

export const sessionName = (session: Session) => `${prettyDate(session.start)} - ${prettyDate(session.end)}`;