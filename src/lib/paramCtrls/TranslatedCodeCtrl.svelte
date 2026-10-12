<script>
    import ParamCtrl from "./ParamCtrl.svelte";
    import { PaneGroup, Pane, PaneResizer } from "paneforge";

    let {
        codeTypeParam=$bindable(),
        pyParam=$bindable(),
        jsParam=$bindable(),
        highlight=$bindable()
    } = $props()

    // highlight category if we have content
    $effect(() => highlight = [pyParam.val, jsParam.val].some(
        val => !["", "// Translating..."].includes(val)
    ))
</script>


{#if codeTypeParam.val === "Py"}
    <ParamCtrl 
        name={pyParam.name} 
        bind:param={pyParam}
    />
{:else if codeTypeParam.val === "JS"}
    <ParamCtrl 
        name={jsParam.name} 
        bind:param={jsParam}
    />
{:else}
    <PaneGroup direction="horizontal">
        <Pane defaultSize={1/2}>
            <div class=container
            >
                <ParamCtrl 
                    name={pyParam.name} 
                    bind:param={pyParam}
                />
            </div>
        </Pane>
        <PaneResizer style="width: .3rem;" />
        <Pane defaultSize={1/2}>
            <div class=container>
                <ParamCtrl 
                    name={jsParam.name} 
                    bind:param={jsParam}
                />
            </div>
        </Pane>
    </PaneGroup>
{/if}


<style>
    .container {
        display: flex;
        height: 100%;
    }
</style>