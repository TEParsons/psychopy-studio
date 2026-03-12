import { python } from "$lib/globals.svelte";
import { appdata } from "$lib/appdata.svelte";


export var profiles = $state($state.snapshot(appdata.profiles))
appdata.ready.then(() => Object.assign(profiles, appdata.profiles))

export var pending = $state({
    components: Promise.withResolvers().promise,
    loops: Promise.withResolvers().promise,
    devices: Promise.withResolvers().promise,
    preferences: Promise.withResolvers().promise
})

// populate on Liaison starting (if it ever does)
if ( python ) {
    python.liaison.ready("app").then(() => {
        // get components
        pending.components = python.liaison.send("app", {
            command: "run",
            args: [
                "psychopy.experiment:getElementProfiles"
            ]
        }).then(
            data => Object.assign(profiles.components, data)
        )
        // get loops
        pending.loops = python.liaison.send("app", {
            command: "run",
            args: [
                "psychopy.experiment:getLoopProfiles"
            ]
        }).then(
            data => Object.assign(profiles.loops, data)
        )
        // get devices
        pending.devices = python.liaison.send("app", {
            command: "run",
            args: [
                "psychopy.experiment:getDeviceProfiles"
            ]
        }).then(
            resp => Object.assign(profiles.devices, resp)
        )
        // save profiles if possible
        Promise.all([
            pending.components,
            pending.loops,
            pending.devices
        ]).then(() => {
            Object.assign(appdata.profiles, profiles)
            appdata.save()
        })
    })
}

