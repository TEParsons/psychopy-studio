<script>
    let {
        /** State to use to show/hide the tooltip */
        shown=$bindable(false),
        /** @prop @type {number} Delay (s) before showing this tooltip */
        delay = 0.1,
        /** @prop @type {number} Width (px) at which to start wrapping text */
        maxWidth = 400,
        /** @prop @type {string} Where to show the tooltip, relative to its parent */
        position = "right",
        /** @prop @type {number} Time (s) to wait after mouseout before hiding, so the mouse can move onto the tooltip */
        grace = 0.05,
        /** @interface */
        children
    } = $props()

    // unique anchor name linking the tooltip to its parent
    let uid = $props.id()
    let anchor = `--tooltip-${uid}`

    // where to place the tooltip relative to its anchor, and which side to leave a gap on
    let placements = {
        "top": { area: "top span-right", margin: "0 0 .5rem 0" },
        "top-right": { area: "top span-left", margin: "0 0 .5rem 0" },
        "bottom": { area: "bottom span-right", margin: ".5rem 0 0 0" },
        "bottom-right": { area: "bottom span-left", margin: ".5rem 0 0 0" },
        "left": { area: "left span-bottom", margin: "0 .5rem 0 0" },
        "right": { area: "right span-bottom", margin: "0 0 0 .5rem" },
    }

    let handle = $state.raw();
    // is the mouse over the tooltip itself?
    let held = $state.raw(false);
    // should the popover be open?
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

    // open/close to match visibility
    $effect(() => {
        handle?.togglePopover?.(visible)
    })

    // anchor to the element it's a tooltip for
    $effect(() => {
        // skip if there's no parent element
        if (!handle?.parentElement) {
            return
        }
        // anchor
        handle?.parentElement.style.setProperty("anchor-name", anchor)
        // unanchor it when done
        return () => handle?.parentElement.style.removeProperty("anchor-name")
    })

    let width = $state.raw();
</script>

<div
    class=tooltip
    popover=hint
    bind:this={handle}
    style:position-anchor={anchor}
    style:position-area={placements[position].area}
    style:margin={placements[position].margin}
    style:max-width="{maxWidth}px"
    style:transition-delay="{delay}s"
    onmouseenter={evt => held = true}
    onmouseleave={evt => held = false}
    ontoggle={evt => {
        // if the popover closed itself (e.g. Escape or light dismiss), dismiss immediately
        if (evt.newState === "closed") {
            shown = false
            held = false
            visible = false
        }
    }}
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

<style>
    .tooltip {
        inset: auto;
        border: none;
        padding: .25rem .5rem;
        border-radius: .5rem;
        background-color: var(--outline);
        color: var(--text-on-outline);
        overflow: hidden;
        max-width: 35rem;
        position-try-fallbacks: flip-block, flip-inline;
        /* slide in from the left */
        clip-path: inset(0 100% 0 0);
        transition:
            clip-path .2s ease,
            display .2s allow-discrete,
            overlay .2s allow-discrete;
    }
    .tooltip:popover-open {
        clip-path: inset(0);
    }
    @starting-style {
        .tooltip:popover-open {
            clip-path: inset(0 100% 0 0);
        }
    }
</style>
