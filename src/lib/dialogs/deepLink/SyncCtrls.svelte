<script>
    import path from "path-browserify";
    import { parsePath, browseFileOpen } from "$lib/utils/files";
    import { openIn } from "$lib/utils/views.svelte";
    import { electron, git } from "$lib/globals.svelte";
    import { MessageDialog } from "$lib/utils/dialog";
    import { Button } from "$lib/utils/buttons";
    import { translate } from "$lib/translation";
    import { getContext } from "svelte";

    let {
        project,
        projects
    } = $props()

    let current = getContext("current");

    let show = $state({
        forkPrompt: false
    })

    let busy = $state({
        cloning: Promise.resolve(false)
    })
    
    
</script>


{#if project in projects}
    <Button 
        label={translate("Open file")}
        icon="/icons/btn-open.svg"
        onclick={evt => fileOpen(projects[project])}
        horizontal
    />
    {#await electron.files.scandir(projects[project], true) then files}
        {#each files.map(file => parsePath(file)) as file}
            {#if file.ext === ".psyexp"}
                <Button 
                    label={translate("Run {}").replace("{}", file.stem)}
                    icon="/icons/btn-runpy.svg"
                    onclick={evt => {
                        openIn(path.join(projects[project], file.file), "runner");
                        shown = false;
                    }}
                    horizontal
                />
            {/if}
        {/each}
    {/await}
{:else}
    <h3>Not synced</h3>
    {translate(
        "This project is not synced to your local machine. Would you like to fetch it from Pavlovia?"
    )}
    <div class=button-array>
        <Button
            label="Fetch"
            tooltip={translate("Get this project from Pavlovia")}
            icon="/icons/btn-download.svg"
            onclick={async evt => {
                if (current.user === info.namespace.name) {
                    // if this is their own project, clone it
                    return await clone()
                } else {
                    // if not, ask if they want to fork it
                    show.forkPrompt = true
                }
            }}
            bind:awaiting={busy.cloning}
            horizontal
        />
        <MessageDialog
            title={translate("Fork project?")}
            buttons={{
                YES: evt => fork(),
                NO: evt => clone(project)
            }}
            bind:shown={show.forkPrompt}
        >
            {translate(
                "This project belongs to {}, would you like to create a fork (copy) of it on your Pavlovia account?"
            ).replaceAll("{}", info.namespace.name)}
        </MessageDialog>
        <Button
            label="Find"
            tooltip={translate("Point to a local clone of this project")}
            icon="/icons/btn-open.svg"
            onclick={async evt => {
                if (current.user === info.namespace.name) {
                    // if this is their own project, clone it
                    return await clone()
                } else {
                    // if not, ask if they want to fork it
                    show.forkPrompt = true
                }
            }}
            bind:awaiting={busy.cloning}
            horizontal
        />
    </div>
{/if}