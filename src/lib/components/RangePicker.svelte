<script lang="ts">
    import {type DateValue, getLocalTimeZone} from "@internationalized/date";
    import {Calendar} from "$lib/components/ui/calendar";
    import dayjs, {type Dayjs} from "dayjs";
    import _ from "lodash";
    import {dayjsToCalendar} from "../../utils/dateutils";

    export let values: DateValue[] = []
    export let datesToDisable: Dayjs[];
    export let selectedMonth: DateValue;

    $: {
        const dayJsDisabledVals = datesToDisable.map(d => dayjsToCalendar(d))
        values = _.differenceWith(values, dayJsDisabledVals, (c1, c2) =>
            c1.compare(c2) === 0
        )
    }

    const fillSortedDates = (sortedDates: [DateValue, DateValue]) => {
        const firstDate = dayjs(sortedDates[0].toDate(getLocalTimeZone()))
        const lastDate = dayjs(sortedDates[1].toDate(getLocalTimeZone()))

        const diff = lastDate.diff(firstDate, 'days')

        const daysToAdd = [...Array(diff + 1).keys()]

        return daysToAdd.map(d => firstDate.add(d, 'day'))
    }

    const isDateDisabled = (date: DateValue) => {
        return datesToDisable.find(d => d.isSame(date.toDate(getLocalTimeZone()), 'day')) !== undefined
    }

    const onValueChange = (dates: DateValue[]) => {
        const sortedDates = dates.sort((d1, d2) => d1.compare(d2))

        if (sortedDates.length === 2) {
            const filledDates = fillSortedDates([sortedDates[0], sortedDates[1]])

            values = filledDates.map(d => dayjsToCalendar(d)).filter(d => !isDateDisabled(d))
        } else {
            values = _.difference(dates, values)
        }
    }

    const onPlaceholderChange = (dv: DateValue) => {
        if (dv.month !== selectedMonth.month) {
            values = []
        }
        selectedMonth = dv
    }

</script>

<div>
    {#key datesToDisable}
        <Calendar
                onPlaceholderChange={onPlaceholderChange}
                placeholder={selectedMonth}
                class="flex flex-col items-center"
                multiple
                onValueChange={d => d && onValueChange(d)}
                isDateDisabled={isDateDisabled}
                value={values}
                weekStartsOn={1}
        />
    {/key}
</div>