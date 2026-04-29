export function onResize(sections) {
    // work out content width
    let contentWidth = sections.reduce(
        (accum, val) => accum + val.handle.clientWidth,
        0
    )
    // sort sections by x positions
    let sortedSections = sections.toSorted(
        (a, b) => a.handle?.offsetLeft < b.handle?.offsetLeft ? -1 : 1
    )
    // if content width is greater than window width...
    if (contentWidth > window.innerWidth) {
        // collapse last expanded section
        for (let i of Object.keys(sortedSections).toReversed()) {
            if (!sortedSections[i].collapsed) {
                sortedSections[i].collapsed = true
                break
            }
        }
    } else {
        // if there's enough space to expand the first collapsed section...
        for (let i of Object.keys(sortedSections)) {
            if (sortedSections[i].collapsed) {
                if (contentWidth < window.innerWidth - sortedSections[i].fullSize - 50) {
                    // expand it
                    sortedSections[i].collapsed = false
                }
                break
            }
        }
    }
}