// if running from electron, these will be set by preload.js, otherwise will be undefined
export var electron = $state(window.electron) 
export var git = $state(window.git)
export var python = $state(window.python)
// global stores for pavlovia and hardware stuff
export var devices = $state({})
export var projects = $state({})
export var users = $state({})
// global stores for UI stuff
export var panels = $state([])