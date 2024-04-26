<script lang="ts">
    import dayjs, {type Dayjs} from "dayjs";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {Label} from "$lib/components/ui/label";
    import {Button} from "$lib/components/ui/button";
    import {type DateValue, getLocalTimeZone, today} from "@internationalized/date";
    import {getAttendance, getHolidays, saveAttendance} from "./api";
    import {getPageData} from "./utils/PageDataFetcher";
    import RangePicker from "$lib/components/RangePicker.svelte";
    import {groupDates} from "./utils/dateutils";
    import type {WFHLeaveReq} from "./types";

    const pattern = "YYYY-MM-DD";

    let attendances: Dayjs[] = []
    let holidays: Dayjs[] = []
    let weekdays: Dayjs[] = []
    let currentPageInfo: { userId: number, sessionid: string, csrftoken: string };
    let wfhDates: DateValue[];

    let skipHolidays = true
    let skipWeekend = true

    let startOfMonth: string;
    let endOfMonth: string;

    $: selectedMonth = today(getLocalTimeZone())
    $: datesToDisable = [] as Dayjs[]

    $: {
        datesToDisable = [
            ...attendances,
            ...(skipHolidays ? holidays : []),
            ...(skipWeekend ? weekdays.filter(d => d.day() === 0 || d.day() === 6) : [])
        ]
    }

    $: {
        startOfMonth = dayjs(selectedMonth.toDate(getLocalTimeZone())).startOf('month').format(pattern)
        endOfMonth = dayjs(selectedMonth.toDate(getLocalTimeZone())).endOf('month').format(pattern)
        fetchPageInfo().then(() => updateDatesToDisable())
    }

    const fetchHolidays = async () => {
        const holidayResponses = await getHolidays(currentPageInfo.csrftoken, currentPageInfo.sessionid, startOfMonth, endOfMonth)
        const allHolidays = holidayResponses.map(a => dayjs(a.date, pattern))
        const mappedHolidays = allHolidays.reduce((acc, item) => {
            if ([0, 6].includes(item.day())) {
                acc['weekday'] = [...acc['weekday'], item]
            } else {
                acc['holiday'] = [...acc['holiday'], item]
            }
            return acc;
        }, {weekday: [], holiday: []} as Record<'weekday' | 'holiday', Dayjs[]>)

        holidays = mappedHolidays['holiday']
        weekdays = mappedHolidays['weekday']
    }

    const fetchAttendances = async () => {
        const attendanceResponses = await getAttendance(currentPageInfo.csrftoken, currentPageInfo.sessionid, startOfMonth, endOfMonth)
        attendances = attendanceResponses.map(a => dayjs(a.date, pattern))
    }

    const fetchPageInfo = async () => {
        try {
            if (!currentPageInfo) {
                currentPageInfo = await getPageData()
            }

            await Promise.all([fetchHolidays(), fetchAttendances()]);
        } catch (e) {
            console.error(e)
        }
    }

    function updateDatesToDisable() {
        datesToDisable = [
            ...attendances,
            ...(skipHolidays ? holidays : []),
            ...(skipWeekend ? weekdays.filter(d => d.day() === 0 || d.day() === 6) : [])
        ]
    }

    function scheduleWFH(): void {
        const groupedDates = groupDates(wfhDates)

        const formattedAndGroupedDates = groupedDates.map(d => d.map(v => v.format("YYYY-MM-DD")))

        const allRequests = formattedAndGroupedDates.map(d => ({
            user: currentPageInfo.userId,
            id: null,
            comment: "",
            is_approved: null,
            type: 2,
            timezone: "Europe/Helsinki",
            start_date: d[0],
            end_date: d[d.length - 1]
        } as WFHLeaveReq)).map(payload => saveAttendance(currentPageInfo.csrftoken, currentPageInfo.sessionid, payload))

        Promise.allSettled(allRequests).then(() => chrome.tabs.reload())

    }

</script>

<div class="min-w-96">
    <div class="flex flex-col mx-5 items-stretch">
        <RangePicker
                datesToDisable={datesToDisable}
                bind:selectedMonth={selectedMonth}
                bind:values={wfhDates}
        />
        <div>
            <Label for="skip-weekend">Ignore weekends</Label>
            <Checkbox id="skip-weekend" bind:checked={skipWeekend}/>
        </div>

        <div class="my-4">
            <Label for="skip-holidays">Ignore holidays</Label>
            <Checkbox id="skip-holidays" bind:checked={skipHolidays}/>
        </div>

        <div class="my-5">
            <Button class="w-full" on:click={() => scheduleWFH()}>Save</Button>
        </div>
    </div>
</div>