<script>
    import { IconButton } from "$lib/utils/buttons";
    import { Icon } from "$lib/utils/icons";
    import { getContext, onMount } from "svelte";
    import { onResize } from "./functions.svelte.js";

    let {
        /** @prop @type {string} Label for this section */
        label="",
        /** @prop @type {string|undefined} Icon for this section, if any */
        icon=undefined,
        /** @interface */
        children=undefined
    } = $props()

    let sections = getContext("sections")
    let index = $state.snapshot(sections.length)
    sections.push({
        collapsed: false,
        fullSize: 0,
        handle: undefined
    })
    let showMore = $state.raw(false)

    onMount(() => {
        // store original size
        sections[index].fullSize = sections[index].handle.clientWidth
        // listen for size changes to this section
        new ResizeObserver(
            evt => onResize(sections)
        ).observe(
            sections[index].handle
        )
    })
     
</script>

<div
    class=ribbon-section
    bind:this={sections[index].handle}
>
    {#if sections[index].collapsed}
        <IconButton
            icon="/icons/sym-pending.svg"
            label={label}
            onclick={evt => showMore = !showMore}
            borderless
        />
        {#if showMore}
            <div class=floating>
                <div class=ribbon-section>
                    {@render children?.()}
                    <div class=ribbon-section-label>
                        <Icon 
                            src={icon}
                        />
                        {label}
                    </div>
                </div>
            </div>
        {/if}
        <div class=ribbon-section-label>
            <Icon 
                src={icon}
            />
        </div>
    {:else}
        {@render children?.()}
        <div class=ribbon-section-label>
            <Icon 
                src={icon}
            />
            {label}
        </div>
    {/if}
</div>

<style>
    .ribbon-section {
        display: grid;
        position: relative;
        grid-auto-flow: column;
        grid-template-rows: [top] 1fr [divide] 1rem [bottom];
        justify-items: center;
        justify-content: center;
        align-items: stretch;
        gap: .5rem 0;
        padding: 0 1rem;
        transition: width 2s;
        z-index: 100;
    }
    .ribbon-section>:global(*):not(.ribbon-section-label) {
        grid-row-start: top;
    }
    .ribbon-section-label {
        display: flex;
        flex-direction: row;
        gap: .5rem;
        align-items: center;
        position: absolute;
        bottom: 0;
        height: 1rem;
    }
    .ribbon-section:not(:first-of-type) {
        border-left: 1px solid var(--overlay)
    }

    .ribbon-section .floating {
        position: absolute;
        top: calc(100% + .5rem);
        right: 0;
        background: var(--mantle);
        border: 1px solid var(--overlay);
        padding: .5rem;
        border-radius: .5rem;
    }
</style>