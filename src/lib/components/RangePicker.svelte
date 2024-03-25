<script lang="ts">
    import {CalendarDate, type DateValue, getLocalTimeZone} from "@internationalized/date";
    import {Calendar} from "$lib/components/ui/calendar";
    import dayjs from "dayjs";
    import _ from "lodash";

    $: values = []


    const fillSortedDates = (sortedDates: [DateValue, DateValue]) => {
        const firstDate = dayjs(sortedDates[0].toDate(getLocalTimeZone()))
        const lastDate = dayjs(sortedDates[1].toDate(getLocalTimeZone()))

        const diff = lastDate.diff(firstDate, 'days')

        const daysToAdd = [...Array(diff + 1).keys()]

        return daysToAdd.map(d => firstDate.add(d, 'day'))
    }

    const isDateDisabled = (date: DateValue) => {
        return date.day % 3 === 0
    }

    const onValueChange = (dates: DateValue[]) => {
        const sortedDates = dates.sort((d1, d2) => d1.compare(d2))

        console.log(values, dates)
        if (sortedDates.length === 2) {
            const filledDates = fillSortedDates([sortedDates[0], sortedDates[1]])
            values = filledDates.map(d => new CalendarDate(d.year(), d.month() + 1, d.date())).filter(d => !isDateDisabled(d))
            console.log(values)
        } else {
            values = _.difference(dates, values)
        }
    }
</script>

<div class="container">
    <Calendar
            multiple
            onValueChange={d => d && onValueChange(d)}
            isDateDisabled={isDateDisabled}
            value={values}
            weekStartsOn={1}
            preventDeselect


    />
</div>