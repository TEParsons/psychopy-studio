<script>
    import { Button, SwitchButton } from "$lib/utils/buttons";
    import TimelineView from "./TimelineView.svelte";
    import LayoutView from "./LayoutView.svelte";
    import ParamsDialog from "$lib/paramCtrls/ParamsDialog.svelte";
    import { translate } from "$lib/translation";

    let {
        routine=undefined
    } = $props()

    let showDialog = $state(false);

    let view = $state.raw(0)
</script>

<div 
    class=routine-canvas
    
>
    <div class=button-container>
        <Button 
            label={translate("Routine settings")}
            icon="/icons/btn-settings.svg"
            tooltip={translate("Edit settings for this Routine")}
            onclick={() => showDialog = true}
            horizontal 
        />
        <div class=gap style:flex-grow=1></div>
        <SwitchButton 
            labels={[translate("Timeline"), translate("Layout")]}
            bind:value={view}
        />
    </div>

    <ParamsDialog
        element={routine.settings}
        bind:shown={showDialog}
    />
    {#if view}
        <LayoutView
            routine={routine}
        />
    {:else}
        <TimelineView
            routine={routine}
        />
    {/if}
</div>

<style>
    .routine-canvas {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding-bottom: 2rem;
        height: 100%;
        box-sizing: border-box;
    }
    .button-container {
        display: flex;
        flex-direction: row;
        align-items: start;
        justify-content: start;
        grid-column-start: entrypoints;
        grid-column-end: undershoot;
        justify-self: start;
        margin: .5rem;
        z-index: 2;
    }
</style>