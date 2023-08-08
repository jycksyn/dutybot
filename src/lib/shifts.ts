import { Repeat, type GroupMember, type Shift, type ShiftType, type ShiftTypeRepeat, type SessionConstraint, type SessionConstraintPayload } from "@prisma/client";
import dayjs from "./dates";
import { db } from "./server/db";

type Dayjs = dayjs.Dayjs;

export const generateShifts = (start: Dayjs, end: Dayjs, shiftTypes: (ShiftType & {
    repeat_days: ShiftTypeRepeat[]
})[]) => {
    const types = shiftTypes.map(type => ({
        ...type,
        start_date: type.start_date ? dayjs(type.start_date) : undefined,
        end_date: type.end_date ? dayjs(type.end_date) : undefined,
    }))
    
    const shifts: Omit<Shift, 'id' | 'session_id'>[] = [];
    for (let i = 0; i <= end.diff(start, 'day'); i++) {
        const date = start.add(i, 'day');
        for (let type of types) {
            const in_range = (
                !type.start_date || type.start_date.isSameOrBefore(date, 'date')
            ) && (
                !type.end_date || type.end_date.isSameOrAfter(date, 'date')
            );

            switch(type.repeat) {
                case Repeat.DAILY:
                    var occurs = true;
                    break;
                case Repeat.WEEKLY:
                    var occurs = type.repeat_days.some(d => d.weekday == date.day());
                    break;
                case Repeat.MONTHLY:
                    var occurs = date.date() == type.start_date?.date();
                    break;
                default:
                    var occurs = date.isSame(type.start_date, 'date');
            }

            const offset = (dayjs(type.end_time).isBefore(type.start_time)) ? 0 : 1000 * 60 * 60 * 24;
            const start = dayjs(date.valueOf() + dayjs.utc(type.start_time).valueOf()).toDate();
            const end = dayjs(date.valueOf() + dayjs.utc(type.end_time).valueOf() + offset).toDate();

            if (in_range && occurs) {
                shifts.push({
                    type_id: type.id,
                    date: date.toDate(),
                    start,
                    end
                });
            }
        }
    }

    return shifts;
}

export const generateEveryoneConstraints = (types: ShiftType[], shifts: Omit<Shift, 'id' | 'session_id'>[], members: GroupMember[]) => {
    const typeCount = new Map<string, number>();
    for (let shift of shifts) {
        const ct = typeCount.get(shift.type_id) ?? 0;
        typeCount.set(shift.type_id, ct + 1);
    }
    const constraints: Omit<SessionConstraint, 'id' | 'session_id'>[] = types.map(type => {
        const ratio = typeCount.get(type.id) ?? 0 / members.length;
        return {
            type_id: type.id,
            everyone: true,
            min: Math.floor(ratio),
            max: Math.ceil(ratio),
        }
    });
    return constraints;
}