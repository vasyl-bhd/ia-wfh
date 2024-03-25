<script lang="ts">
    import RangePicker from "$lib/components/RangePicker.svelte";
    import dayjs from "dayjs";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {Label} from "$lib/components/ui/label";
    import {Textarea} from "$lib/components/ui/textarea/index.js";
    import {Button} from "$lib/components/ui/button";

</script>

<div class="min-w-96">
    <div class="flex flex-col mx-5 items-stretch">
        <RangePicker datesToDisable={[dayjs()]} />

        <div>
            <Label for="skip-weekend">Ignore weekends</Label>
            <Checkbox id="skip-weekend"/>
        </div>

        <div class="my-4">
            <Label for="skip-holidays">Ignore holidays</Label>
            <Checkbox id="skip-holidays"/>
        </div>

        <div class="mt-5">
            <Textarea placeholder="Comment"/>
        </div>

        <div class="my-5">
            <Button class="w-full">Save</Button>
        </div>
    </div>
</div>