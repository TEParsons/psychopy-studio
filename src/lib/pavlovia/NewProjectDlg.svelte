<script>
    import { Dialog } from "$lib/utils/dialog";
    import { git } from "$lib/globals.svelte";
    import { getContext } from "svelte";
    import { translate } from "$lib/translation";

    let {
        shown=$bindable(),
        awaiting=$bindable()
    } = $props()

    let current = getContext("current");

    let details = $state({
        name: undefined,
        group: undefined,
    })

    async function getAllProjects() {
        let allProjects = {}
        // get groups (and current user)
        let groups = await git.listGroups($state.snapshot(current.user)).then(
            resp => resp.map(item => item.path)
        )
        groups.push(
            $state.snapshot(current.user)
        )
        // for each group...
        for (let group of groups) {
            // get projects
            let projects = await git.listProjects(group, $state.snapshot(current.user))
            // store their names
            allProjects[group] = projects.map(
                proj => proj.name
            )
        }

        return allProjects
    }
</script>
{#await getAllProjects() then projects}
    <Dialog 
        title={translate("New project")}
        buttons={{
            OK: async evt => {
                // create a new project
                await git.newProject(
                    $state.snapshot(details), 
                    current.experiment.file.parent, 
                    $state.snapshot(current.user)
                )
                // set current project to this new one
                current.project = await git.getProjectInfo(
                    { folder: current.experiment.file.parent }, 
                    $state.snapshot(current.user)
                )
                // mark finished
                awaiting.resolve(true)
            },
            CANCEL: evt => awaiting.resolve(false)
        }}
        buttonsDisabled={{
            OK: projects[details.group]?.includes?.(details.name)
        }}
        onopen={evt => {
            details.name = current.experiment.file.stem
            details.group = $state.snapshot(current.user)
            // refresh promise
            let newPromise = Promise.withResolvers();
            awaiting.resolve(newPromise.promise);
            awaiting = newPromise;
        }}
        bind:shown={shown}
        shrink
    >
        <div class=content>
            <div class=ctrl>
                pavlovia.org / 
                <select bind:value={details.group} style:flex-grow=1>
                    <option value={current.user}>{current.user}</option>
                        {#each Object.keys(projects) as group}
                            <option value={group}>{group}</option>
                        {/each}
                </select>
                /
                <input bind:value={details.name} />
            </div>
            <div class=warning>
                {#if projects[details.group]?.includes?.(details.name)}
                    {translate("{} already exists").replace("{}", `${details.group}/${details.name}`)}
                {/if}
            </div>
        </div>
    </Dialog>
{/await}

<style>
    .content {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
        padding: 1rem;
        min-width: 35rem;
    }
    .ctrl {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: .5rem;
    }

    .warning {
        text-align: right;
        color: var(--red);
    }
</style>