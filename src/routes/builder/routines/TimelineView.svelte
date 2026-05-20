<script>
    import { Menu, MenuItem} from '$lib/utils/menu';
    import { pasteComponent } from "../callbacks.svelte";
    import Component from './Component.svelte';
    import TimelineHeader from './Timeline.svelte';
    import EntryPoint from './EntryPoint.svelte';
    import { translate } from "$lib/translation";

    let {
        routine
    } = $props()

    let contextMenu = $state({
        show: false,
        pos: {
            x: undefined,
            y: undefined
        }
    })
</script>

<div 
    class=timeline-canvas
    style:grid-template-rows="[timeline-top] min-content {routine.components.length ? `repeat(${routine.components.length}, min-content)` : ""} [timeline-bottom] min-content [timeline-end] 1fr"
>
    {#if routine.components}
        <TimelineHeader routine={routine} />
    {/if}

    {#each routine.components as component}
        <Component component={component} />
    {/each}
    <EntryPoint routine={routine} index=-1 />
    <div 
        class=context-target
        style:grid-row-start={"timeline-end"}
        style:grid-column-start={"entrypoints"}
        style:grid-column-end={"end"}
        oncontextmenu={evt => {
            evt.preventDefault();
            // show menu
            contextMenu.show = true;
            // set its position to the mouse pos
            contextMenu.pos.x = evt.pageX;
            contextMenu.pos.y = evt.pageY;
        }}
        role="none"
    ></div>
    <Menu 
        bind:shown={contextMenu.show} 
        bind:position={contextMenu.pos}
    >
        <MenuItem
            icon="/icons/btn-paste.svg"
            label={translate("Paste Component")}
            onclick={evt => pasteComponent(routine, 0)}
        />
    </Menu>
</div>

<style>
    .timeline-canvas {
        display: grid;
        grid-template-columns: [entrypoints] 1rem [name] min-content [undershoot] 3rem [timeline] 1fr [overshoot] 3rem [end];
        grid-gap: 0;
        padding-bottom: 2rem;
        height: 100%;
        box-sizing: border-box;
    }
</style>