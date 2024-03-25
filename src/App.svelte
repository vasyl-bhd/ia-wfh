<script lang="ts">
    import RangePicker from "$lib/components/RangePicker.svelte";
    import dayjs, {type Dayjs} from "dayjs";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {Label} from "$lib/components/ui/label";
    import {Button} from "$lib/components/ui/button";
    import {getLocalTimeZone, today} from "@internationalized/date";
    import {getAttendance, getHolidays} from "./api";
    import {getPageData} from "./PageDataFetcher";

    const pattern = "YYYY-MM-DD";


    let skipHolidays = true
    let skipWeekend = true
    let attendances: Dayjs[] = []
    let holidays: Dayjs[] = []
    let weekdays: Dayjs[] = []
    let currentPageInfo: { userId: number, sessionid: string, csrftoken: string };

    let selectedMonth = today(getLocalTimeZone())
    $: datesToDisable = []
    $: selectedMonth && getAsyncInfo()
    $: startOfMonth = dayjs(selectedMonth.toDate(getLocalTimeZone())).startOf('month').format(pattern)
    $: endOfMonth = dayjs(selectedMonth.toDate(getLocalTimeZone())).endOf('month').format(pattern)

    const fetchHolidays = async () => {
        const holidayResponses = await getHolidays(currentPageInfo.csrftoken, currentPageInfo.sessionid, startOfMonth, endOfMonth)
        const allHolidays = holidayResponses.map(a => dayjs(a.date, pattern))
        const mappedHolodays = allHolidays.reduce((acc, item) => {
            if ([0, 6].includes(item.day())) {
                acc['weekday'] = [...acc['weekday'], item]
            } else {
                acc['holiday'] = [...acc['holiday'], item]
            }
            return acc;
        }, {weekday: [], holiday: []} as Record<'weekday' | 'holiday', Dayjs[]>)

        holidays = mappedHolodays['holiday']
        weekdays = mappedHolodays['weekday']
    }

    const fetchAttendances = async () => {
        const attendanceResponses = await getAttendance(currentPageInfo.csrftoken, currentPageInfo.sessionid, startOfMonth, endOfMonth)
        attendances = attendanceResponses.map(a => dayjs(a.date, pattern))
    }

    const getAsyncInfo = async () => {
        try {
            const pageInfo = await getPageData()
            currentPageInfo = pageInfo

            await fetchHolidays()
            await fetchAttendances()
        } catch (e) {
            console.error(e)
        }

        datesToDisable = [
            ...attendances,
            ...(skipHolidays ? holidays : []),
            ...(skipWeekend ? weekdays : [])
        ]
    }

</script>

<div class="min-w-96">
    <div class="flex flex-col mx-5 items-stretch">
        <RangePicker
                bind:selectedMonth
                bind:datesToDisable
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
            <Button class="w-full" on:click={getAsyncInfo}>Save</Button>
        </div>
    </div>
</div>