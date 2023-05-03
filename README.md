# Avatar generator that looks like messenger group chat default avatar

It exposes a function `makeCombined` that recieves and image array as argument and returns a promise that will be resolved when the image is processed with a image location.

## TS/ES

```typescript
import makeCombined from '@dreygur/messenger-group-avatar';

makeCombined(...images)
  .then((combinedImage) => /* do whatever you want to do with the combined image */ );
```

## CommonJS/Node.js

```js
const { default: makeCombined } = require('@dreygur/messenger-group-avatar');

makeCombined(...images)
  .then((combinedImage) => /* do whatever you want to do with the combined image */ );
```
