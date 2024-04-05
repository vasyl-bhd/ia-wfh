import {writable} from "svelte/store";
import {type CalendarDate, type DateValue, getLocalTimeZone, today} from "@internationalized/date";
import type {Dayjs} from "dayjs";

type CalendarSettings = {
    selectedMonth: CalendarDate,
    skipHolidays: boolean,
    skipWeekend: boolean
}
export const selectedMonth = writable<DateValue>(today(getLocalTimeZone()))