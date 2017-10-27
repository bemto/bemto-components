# bemto-components <🍱> [WIP]

Smart components for using parts of BEM methodology with React. Used best together with styled-components.


## What does it do?

There are a lot of things `bemto-components` would do in the future, but for now here are two main features:

1. `bemto-components` allow you to use BEM-style modifiers for your React components using the _modifier prop syntax. For ecample, if you'd do this (where the Foo is bemto-component): `<Foo _bar />`, each className of the Foo component would be duplicated with an addition of the `_bar` modifier. That allows you to use the BEM modifiers in your CSS (both any external, or using styled-components).

2. _coming soon_ `bemto-components` would allow you to think less about handling your components' tag names by embracing some prop-based polymorphism. More on it when it would be ready!


## Disclaimer

Work in progress. Everything could change, don't treat as a stable thingy. I did not do any performance metrics and did not do any premature optimisations. Also: no tests for now. You're welcome to test, benchmark and overall think about this; create issues and PRs.


## Install

```sh
npm install --save bemto-components
```

## Example usage for modifiers

At definition:

```jsx
import bemto from 'bemto-components'

const Block = styled(bemto('div'))`
  background: red;

  &_mod {
    background: lime;
  }
`)
```

Usage:

``` jsx
<Block _mod />
```

Just like this.

More docs to come!


## Hint: you can do BEM elements without this lib

It is already possible to _kinda_ use Elements from BEM with react and/or styled components without adding anything extra:

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

This way you can easily couple the element with its block. I have some plans on how we could use more familiar to BEM `__elements`, so keep in touch if interested!
