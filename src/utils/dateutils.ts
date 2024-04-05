import type {Dayjs} from "dayjs";
import {CalendarDate, type DateValue} from "@internationalized/date";

export const dayjsToCalendar: (d: Dayjs) => DateValue = (d: Dayjs) => new CalendarDate(d.year(), d.month() + 1, d.date())