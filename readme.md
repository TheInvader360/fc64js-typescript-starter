# fc64js-typescript-starter

A quick start template project for creating [fc64js](https://github.com/TheInvader360/fc64js) roms using typescript

It includes [typescript](https://www.npmjs.com/package/typescript), [vite](https://www.npmjs.com/package/vite), [eslint](https://www.npmjs.com/package/eslint), [prettier](https://www.npmjs.com/package/prettier), [browser-sync](https://www.npmjs.com/package/browser-sync), and [fc64js](https://www.npmjs.com/package/fc64js) dependencies, and comes preconfigured with convenient scripts for linting, previewing, and building

You will need [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed locally. It is recommended that you also have [git](https://github.com/git-guides/install-git), [vscode](https://code.visualstudio.com/download), and [chrome](https://www.google.com/chrome) installed.

## Example

Clone and rename the fc64js-typescript-starter repository (replace "fc64js-typescript-basic-example" as appropriate):

```bash
git clone https://github.com/TheInvader360/fc64js-typescript-starter.git
mv fc64js-typescript-starter fc64js-typescript-basic-example
cd fc64js-typescript-basic-example
```

Remove the ".git" and "dist" directories, and find all mentions of "fc64js-typescript-starter":

```bash
rm -rf .git
rm -rf dist
grep -r "fc64js-typescript-starter" .
```

Use your preferred text editor or IDE to change all instances of "fc64js-typescript-starter" to the new project name (e.g. "fc64js-typescript-basic-example"), and to edit "readme.md" as appropriate

Install the dependencies:

```bash
npm ci
```

Run the lint script:

```bash
npm run lint
```

Start the dev server:

```bash
npm run dev
```

Open the given local url in your web browser - you should be presented with the default demo running on the fc64js fantasy console:

<img src="https://raw.githubusercontent.com/TheInvader360/fc64js-typescript-starter/main/default-demo.gif" width="144"/>

Use your preferred text editor or IDE to replace the contents of the "src" directory as required. For the sake of this example that means deleting "images.ts" and replacing the contents of "main.ts" with:

```ts
import 'fc64js';

fc64Init(romInit, romLoop);

let x = 60;
let y = 60;
let color = 4;

function romInit() {
  drawPixel(3, 3, COL_WHT);
}

function romLoop() {
  if (isJustPressed(BTN_A) && color > 1) {
    color--;
  }
  if (isJustReleased(BTN_B) && color < 6) {
    color++;
  }
  drawPixel(x, y, COL_BLK);
  if (isPressed(BTN_U) && y > 0) {
    y--;
  }
  if (isPressed(BTN_D) && y < GFX_H - 1) {
    y++;
  }
  if (isPressed(BTN_L) && x > 0) {
    x--;
  }
  if (isPressed(BTN_R) && x < GFX_W - 1) {
    x++;
  }
  drawPixel(x, y, color);
}
```

Provided your dev server is still running, you should see your new code running in the web browser:

<img src="https://raw.githubusercontent.com/TheInvader360/fc64js-typescript-starter/main/basic-example.gif" width="144"/>

When you're done modifying rom code, you can run the lint script again, kill the dev server, then build and preview your distribution code:

```bash
npm run build-and-preview
```

Once satisfied all is well you can kill the preview process. The "dist" directory is now ready for distribution

Note: If you are publicly sharing your project on github you use github pages as a convenient means of distribution ([example](https://theinvader360.github.io/fc64js-typescript-starter/dist/))

