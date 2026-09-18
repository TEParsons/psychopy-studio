import { _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';


var app;


test.beforeAll(async () => {
    // start the app once, before all tests
    app = await electron.launch({ 
        args: ["electron/src/index.cjs", "--no-splash"] 
    });
    // get splash window
    let window = await app.firstWindow();
    // wait for splash to load
    await window.waitForLoadState("domcontentloaded");
})


test.afterAll(async () => {
    // close the app when we're done
    await app.evaluate(({ app }) => app.quit());
})


test(
    "Builder, Coder and Runner can open",
    async () => {
        // get first window
        let window = await app.firstWindow();
        // wait for page to load
        await window.waitForLoadState('domcontentloaded');
        // open Builder, Coder and Runner
        for (let target of ["builder", "coder", "runner"]) {
            // open window via preloaded methods
            let id = await window.evaluate(
                `electron.windows.new("${target}")`
            )
        }
    }
);