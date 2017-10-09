# bemto-components [WIP]

BEM + styled-components = 💖

## Disclaimer

Work in progress. Everything would change, don't treat as a stable thingy.

## Install

```sh
npm install --save bemto-components
```

## Example usage for modifiers

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

## Hint: you can do elements without this lib

It is possible to use Elements from BEM kinda easy with react and styled components without adding anything extra:

```jsx
const Block = styled.div`
  background: red;
`

Block.Element = styled.span`
  background: blue;
  
  ${Block}:hover & {
    background: lime;
  }
`
```

And in usage:

```jsx
<Block>
  <Block.Element>Hewwo!</Block.Element>
</Block>
```

This way you can easily couple the element with its block.