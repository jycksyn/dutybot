import type { Session } from "@prisma/client";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

export default dayjs;

export const prettyDate = (date: Parameters<typeof dayjs>[0], timezone: string | undefined = undefined) => dayjs.tz(date, timezone).format('MMMM D, YYYY');
export const prettyAbstractTime = (time: Parameters<typeof dayjs>[0]) => dayjs.utc(time).format('LT');
export const prettyTime = (time: Parameters<typeof dayjs>[0]) => dayjs(time).format('LT');

export const sessionName = (session: Session, timezone: string | undefined = undefined) => `${prettyDate(session.start, timezone)} - ${prettyDate(session.end, timezone)}`;