<script>
    import { electron } from "$lib/globals.svelte";
    import { setContext } from "svelte";

    let {
        /** @param @type {function} Callback to execute when a file is dropped on this frame */
        onFileDrop = (evt, file) => {},
        /** @interface */
        ribbon=undefined,
        /** @interface */
        children
    } = $props();

    let hover = $state({
        show: false,
        indicator: undefined
    })
    // list focus methods for each focusable panel in the frame, in order
    let focusPanels = $state([])
    setContext("focusPanels", focusPanels)
</script>

<div 
    id=frame
    ondragenter={evt => hover.show = evt.dataTransfer.types?.includes?.("Files")}
    ondragover={evt => evt.preventDefault()}
    ondragleave={evt => hover.show = evt.fromElement === hover.indicator}
    ondrop={async evt => {
        hover.show = false;
        if (electron) {
            evt.preventDefault();
            // trigger callback with full filepath (from electron)
            for (let f of evt.dataTransfer.files) {
                onFileDrop(evt, await electron.paths.getPathForFile(f))
            }
        }
    }}
    role="region"
>
    {#if hover.show}
        <div class=hover-indicator bind:this={hover.indicator}></div>
    {/if}
    {#if ribbon}
        {@render ribbon()}
    {/if}
    <div id=content>
        {@render children()}
    </div>
</div>

<svelte:window 
    onkeydown={evt => {
        if (evt.ctrlKey && evt.key === "Tab") {
            // sort focus panels by DOM position
            let sorted = focusPanels.toSorted(
                (a, b) => a.handle.compareDocumentPosition(b.handle) === 4 ? -1 : 1
            )
            // get index of focused panel
            let i = sorted.findIndex(
                obj => obj.hasFocus(obj.handle)
            )
            // focus the next panel
            let target = sorted[
                i < sorted.length - 1 ? i + 1 : 0
            ]
            target.receiveFocus(target.handle)
        }
    }}
/>

<style>
#frame {
    display: grid;
    grid-template: min-content 1fr / 1fr;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
}
#content {
    position: relative;
    background-color: var(--crust);
    overflow-y: hidden;
}
.hover-indicator {
    position: absolute;
    left: 0; right: 0;
    top: 0; bottom: 0;
    background: linear-gradient(var(--blue) 0%, transparent 500%);
    opacity: 10%;
    z-index: 100;
}
</style>