<script>
    import { setContext } from "svelte";
    import { onResize } from "./functions.svelte.js";

    let {
        /** @interface */
        children
    } = $props()

    // state in which to store sections
    let sections = $state([])
    setContext("sections", sections)
</script>

<svelte:window 
  on:resize={evt => onResize(sections)} 
/>

<div id=ribbon>
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