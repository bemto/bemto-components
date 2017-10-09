# bemto-components [WIP]

BEM + styled-components = 💖

## Disclaimer

Work in progress. Everything would change, don't treat as a stable thingy.

## Install

```sh
npm install --save bemto-components
```

## Example usage

At definition:

```jsx
import bemto from 'bemto-components'

const Block = bemto(styled.div`
  background: red;

  &_mod {
    background: lime;
  }
`)
```

At usage:

``` jsx
<Block _mod />
```

Just like this.