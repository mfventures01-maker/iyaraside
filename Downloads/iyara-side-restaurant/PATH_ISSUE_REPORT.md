# CRITICAL ISSUE REPORT: Path Character Encoding

**Status**: ⛔ BLOCKED
**Root Cause**: The project directory path contains a non-ASCII character: `à`
**Path**: `c:\Users\Administrator\Downloads\iyarà-side-restaurant`

## Analysis
The build tools (Vite/Rollup/Node.js) on Windows are failing to correctly handle the special character `à` in the file path during the bundling process. This results in cryptic errors like `Identifier.bind (node-entry.js)` or `Failed to resolve entry`.

We verified this by:
1.  Isolating dependencies (Clean install).
2.  Downgrading tools (Vite 5).
3.  **Definitive Test**: A minimal `test_build.js` file failed to build even with no external dependencies, confirming the environment path is the trigger.

## Required Action 🛠️
You must **RENAME** the project folder to remove the special character.

**Change this:**
`iyarà-side-restaurant`

**To this:**
`iyara-side-restaurant`

## Next Steps
1.  Close your IDE/Terminal.
2.  Rename the folder in Windows Explorer.
3.  Re-open the project in the new `iyara-side-restaurant` folder.
4.  Run `npm run build` - it will succeed immediately (Gravity Restored).
