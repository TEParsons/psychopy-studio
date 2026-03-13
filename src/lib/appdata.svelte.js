import FallbackComponentProfiles from "$lib/experiment/fallbacks/components.json";
import FallbackLoopProfiles from "$lib/experiment/fallbacks/loops.json";
import FallbackDeviceProfiles from "$lib/experiment/fallbacks/devices.json";
import PreferencesProfile from "$lib/preferences.json"
import path from "path-browserify"


class AppData {
    profiles = $state({
        components: FallbackComponentProfiles,
        loops: FallbackLoopProfiles,
        devices: FallbackDeviceProfiles,
        preferences: PreferencesProfile
    })

    constructor() {
        this.ready = this.load()
    }

    async load() {
        // do nothing if no electron
        if ( !electron ) {
            return
        }
        // get file path
        let file = path.join(
            await electron.paths.user(),
            "appdata.json"
        )
        // do nothing if file doesn't exist yet
        if (!(await electron.files.exists(file))) {
            return
        }
        // load from file
        let data = JSON.parse(
            await electron.files.load(file)
        )
        // apply
        Object.assign(this.profiles, data.profiles)
    }

    async save() {
        // do nothing if no electron
        if ( !electron ) {
            return
        }
        // get file path
        let file = path.join(
            await electron.paths.user(),
            "appdata.json"
        )
        // write
        await electron.files.save(
            file,
            JSON.stringify({
                profiles: this.profiles
            }, undefined, 4)
        )
    }
}

export var appdata = new AppData()