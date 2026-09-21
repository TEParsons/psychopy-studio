<script>
    import { getContext } from "svelte";
    import VersionCtrl from "../VersionCtrl.svelte";

    let {
        plugin,
        venv=$bindable()
    } = $props()

    let siblings = getContext("siblings");

    // install progress information
    let showProgress = $state.raw(false)


    $effect(() => {
        if (siblings.selected === undefined) {
            siblings.selected = page
        }
    })

    let installed = $derived(
        Object.keys(siblings.installed).includes(plugin.pipname)
    )
</script>

<!-- this is drawn or not drawn according to selection -->
{#snippet page()}
    <div class=plugin-page>
        <header>
            <img 
                class=avatar 
                src={plugin.icon} 
                alt={plugin.pipname} 
            />
            <div 
                class=details
            >
                <a href="{plugin.homepage}" class=name>
                    <h2>{plugin.name}</h2>
                </a>
                <code class=pipname>
                    {plugin.pipname}
                </code>
                <div class=header-ctrls>
                    <VersionCtrl 
                        pipname={plugin.pipname}
                        bind:installed={siblings.installed[plugin.pipname]}
                        venv={venv}
                    />
                </div>
            </div>
        </header>
        {#each (plugin.description || "").split("\n") as line}
            <p>{line}</p>
        {/each}
    </div>
{/snippet}



<button 
    class=plugin-item
    class:selected={siblings.selected === page}
    class:installed={installed}
    onclick={evt => siblings.selected = page}
>
    <img 
        class=avatar 
        src={plugin.icon} 
        alt={plugin.pipname} 
    />
    <div class=details>
        <h3 class=name>
            {plugin.name}
        </h3>
        <code class=pipname>
            {plugin.pipname}
        </code>
    </div>
    
</button>

<style>

    .plugin-page {
        display: flex;
        flex-direction: column;
        padding: 0 1rem;
        gap: 1rem;
        width: 45rem;
    }
    .plugin-item, .plugin-page header {
        display: grid;
        position: relative;
        align-items: start;
        align-content: start;
        justify-items: start;
        justify-content: start;
        gap: 1rem;
        width: 100%;
    }

    .plugin-item {
        grid-template-columns: [avatar] 4rem [start] 1fr [end];
        border: 1px solid var(--overlay);
        border-radius: .5rem;
        padding: 1rem;
        box-sizing: border-box;
        background-color: var(--mantle);
    }
    .plugin-item.selected {
        border: 1px solid var(--blue);
    }
    .plugin-item.installed {
        background-color: var(--base)
    }

    .plugin-page header {
        grid-template-columns: [avatar] 6rem [start] 1fr [end];
    }
    
    .name {
        text-decoration: none;
        color: var(--text);
        font-size: 1.25rem;
        grid-column: start / button;
        text-align: left;
    }

    .avatar {
        border-radius: .5rem;
        width: 100%;
    }
    .details {
        text-align: left;
    }
    .header-ctrls {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        gap: .5rem;
        margin: 1rem 0;
    }
</style>