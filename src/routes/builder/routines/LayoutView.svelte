<script>
    import { Icon } from "$lib/utils/icons";

    let {
        routine
    } = $props()

    function parseList(val) {
        if (typeof val !== "string") {
            return val
        }
        val = val.match(/^[\(\[]?(-?[\d\.]*?),(-?[\d\.]*?)[\)\]]?$/).slice(1)
        val = val.map(item => parseFloat(item))

        return val
    }
</script>

<div 
    class=layout-canvas
>
    {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as col}
        {#each [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as row}
            <div 
                class=grid
                class:center-x={col==4}
                class:center-y={row==4}
                style:left="{col * 10}%"
                style:right="{(9 - col) * 10}%"
                style:top="{row * 10}%"
                style:bottom="{(9 - row) * 10}%"
            ></div>
        {/each}
    {/each}
    {#each routine.components as component}
        {#if "pos" in component.params && "size" in component.params}
            <div 
                class=component
                style:left="{50 + (parseList(component.params['pos'].val)[0] - parseList(component.params['size'].val)[0] / 2) * 100}%"
                style:right="{50 - (parseList(component.params['pos'].val)[0] + parseList(component.params['size'].val)[0] / 2) * 100}%"
                style:top="{50 + (parseList(component.params['pos'].val)[1] - parseList(component.params['size'].val)[1] / 2) * 100}%"
                style:bottom="{50 - (parseList(component.params['pos'].val)[1] + parseList(component.params['size'].val)[1] / 2) * 100}%"
            >
                <div class=component-label>
                    <Icon 
                        src={component.iconSVG}
                        size=4rem
                    />
                    {component.name}
                </div>
            </div>
        {/if}
    {/each}
</div>

<style>
    .layout-canvas {
        position: relative;
        border: 1px solid var(--overlay);
        border-top: 2px solid var(--overlay);
        border-left: 2px solid var(--overlay);
        height: 100%;
        width: calc(100% - 2rem);
        box-sizing: border-box;
        margin: 0 1rem;
    }

    .component {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--base);
        border: .75rem solid var(--blue);
        font-size: 1.2rem;
    }

    .component-label {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: .5rem 1rem;
        gap: 1rem;
        height: 4rem;
        border-radius: .5rem;
    }

    .grid {
        position: absolute;
        border-right: 1px solid var(--overlay);
        border-bottom: 1px solid var(--overlay);
    }
    .grid.center-x {
        border-right: 2px solid var(--overlay);
    }
    .grid.center-y {
        border-bottom: 2px solid var(--overlay);
    }
</style>