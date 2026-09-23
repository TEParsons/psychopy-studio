<script>
    import { onMount, setContext, getContext } from "svelte";

    let {
        /** @interface */
        children
    } = $props()

    // state which keeps track of the index of each section
    let handle = $state.raw()

    onMount(
        () => {
            // set context so children have access to DOM element
            setContext("ribbon", handle) 
            // add to focusable panels
            getContext("focusPanels").push({
                handle: handle,
                // function to query whether the ribbon has focus
                hasFocus: () => handle?.contains?.(document.activeElement),
                // function to execute when the ribbon receives focus
                receiveFocus: () => {
                    for (
                        let child of Array.from(
                            handle.getElementsByTagName("*")
                        )
                        .filter(
                            child => child.tabIndex >= 0 && !child.disabled
                        ).toSorted(
                            (a, b) => a.tabIndex - b.tabIndex
                        )
                    ) {
                        child.focus()
                        break
                    }
                }
            })
        }
    )
</script>

<div id=ribbon bind:this={handle}>
    {@render children()}
</div>

<style>
    /* --- Frame ribbon ---*/

    #ribbon {
        display: flex;
        flex-direction: row;
        padding: .5em;
        background-color: var(--crust);
        position: relative;
    }    
</style>