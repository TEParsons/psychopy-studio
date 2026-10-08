<script>
    import { slide } from 'svelte/transition';
    
    let {
        /** State to use to show/hide the tooltip */
        shown=$bindable(false),
        /** @prop @type {number} Delay (s) before showing this tooltip */
        delay = 0.5,
        /** @prop @type {number} Width (px) at which to start wrapping text */
        maxWidth = 400,
        /** @prop @type {string} Where to show the tooltip, relative to its parent */
        position = "right",
        /** @prop @type {number} Time (s) to wait after mouseout before hiding, so the mouse can move onto the tooltip */
        grace = 0.05,
        /** @interface */
        children
    } = $props()

    // is the mouse over the tooltip itself?
    let held = $state.raw(false);
    // is the tooltip actually rendered?
    let visible = $state.raw(false);

    $effect(() => {
        // show right away
        if (shown || held) {
            visible = true
            return
        }
        // wait before hiding, to give the mouse time to cross the gap onto the tooltip
        let timeout = setTimeout(() => visible = false, grace * 1000)
        // cancel the hide if shown/held changes before it fires
        return () => clearTimeout(timeout)
    })

    let width = $state.raw();
</script>

{#if visible}
    <div 
        class=tooltip
        transition:slide={{axis: "x", delay: delay}}
        style:inset={{
            "top": "auto auto calc(100% + .5rem) 0",
            "top-right": "auto 0 calc(100% + .5rem) auto",
            "bottom": "calc(100% + .5rem) auto auto 0",
            "bottom-right": "calc(100% + .5rem) 0 auto auto",
            "left": "auto calc(100% + .5rem) auto auto",
            "right": "auto auto auto calc(100% + .5rem)",
        }[position]}
        style:max-width="{maxWidth}px"
        onmouseenter={evt => held = true}
        onmouseleave={evt => held = false}
        role=none
    >
        <div 
            class=tooltip-content
            bind:clientWidth={width}
            style:text-wrap={width >= maxWidth ? "wrap" : "nowrap"}
            style:width={width >= maxWidth ? `${maxWidth}px` : "auto"}
        >
            {@render children?.()}
        </div>
    </div>
{/if}

<svelte:window 
    onkeyup={evt => {
        // dismiss tooltip on Escape
        if (visible && evt.key === "Escape") {
            // prevent default behaviour
            evt.preventDefault()
            // dismiss immediately, skipping the grace period
            shown = false
            held = false
            visible = false
        }
    }}
/>

<style>
    .tooltip {
        position: absolute;
        padding: .25rem .5rem;
        border-radius: .5rem;
        background-color: var(--outline);
        color: var(--text-on-outline);
        overflow: hidden;
        max-width: 35rem;
    }
</style>