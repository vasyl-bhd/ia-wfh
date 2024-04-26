import dayjs, {type Dayjs} from "dayjs";
import {CalendarDate, type DateValue, getLocalTimeZone} from "@internationalized/date";

export const dayjsToCalendar: (d: Dayjs) => DateValue = (d: Dayjs) => new CalendarDate(d.year(), d.month() + 1, d.date())

const calendarToDayjs: (d: DateValue) => Dayjs = (d: DateValue) => dayjs(d.toDate(getLocalTimeZone()))

export const groupDates = (d: DateValue[]): Dayjs[][] => {
    return d.map(calendarToDayjs).reduce((acc, current, index, array) => {
        // Start a new group with the current date if this is the first date or if it's not consecutive
        if (index === 0 || current.diff(array[index - 1], 'day') > 1) {
            acc.push([current]);
        } else {
            // Otherwise, add the current date to the last group
            acc[acc.length - 1].push(current);
        }
        return acc;
    }, [[]] as Dayjs[][]).filter(group => group.length);

}
