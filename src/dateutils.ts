import type {Dayjs} from "dayjs";
import {CalendarDate} from "@internationalized/date";

export const dayjsToCalendar = (d: Dayjs) => new CalendarDate(d.year(), d.month() + 1, d.date())