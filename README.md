# Template for browser extension with React

This template based on [template-react-webpack-from-scratch](https://github.com/binarydiver/template-react-webpack-from-scratch)

Local edit with hot reloading option:\
`pnpm dev or npm run dev`

Local load chrome extension:\
`pnpm build or npm run build`\
Then click "load unpacked" on developer mode of `chrome://extensions/` and set dist folder.

Locally load firefox extension:\
`pnpm build or npm run build`\
Then go to `about:debugging#/runtime/this-firefox`, click "Load Temporary Add-on..." and set manifest.json file.
