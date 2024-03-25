<script lang="ts">
    import RangePicker from "$lib/components/RangePicker.svelte";
    import dayjs from "dayjs";
    import {Checkbox} from "$lib/components/ui/checkbox";
    import {Label} from "$lib/components/ui/label";
    import {Textarea} from "$lib/components/ui/textarea/index.js";
    import {Button} from "$lib/components/ui/button";

</script>

<RangePicker datesToDisable={[dayjs()]} />

<Label for="skip-weekend">Ignore weekends</Label>
<Checkbox id="skip-weekend"/>

<Label for="skip-holidays">Ignore holidays</Label>
<Checkbox id="skip-holidays"/>

<Textarea placeholder="Comment"/>

<Button>Save</Button>