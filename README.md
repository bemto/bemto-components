# bemto-components <🍱> [WIP] [![Build Status][build]][build-link] [![NPM version][version]][version-link]

[build]: https://travis-ci.org/kizu/bemto-components.png?branch=master
[build-link]: https://travis-ci.org/kizu/bemto-components
[version]: https://badge.fury.io/js/bemto-components.png
[version-link]: https://www.npmjs.com/package/bemto-components

Smart components for using parts of [BEM methodology](https://en.bem.info/methodology/quick-start/) with [React](https://reactjs.org/). Used best together with [styled-components](https://www.styled-components.com/).


## What does it do?

[You can play with everything at this CodePen playground!](https://codepen.io/kizu/pen/BwxNqQ?editors=0010)

There are a lot of things `bemto-components` would do in the future, but for now here are a few main features:

1. `bemto-components` allow you to use BEM-style modifiers for your React components using the _modifier prop syntax. For ecample, if you'd do this (where the Foo is bemto-component): `<Foo _bar />`, each className of the Foo component would be duplicated with an addition of the `_bar` modifier. That allows you to use the BEM modifiers in your CSS (both any external, or using styled-components).

2. `bemto-components` gives you a way to easily create a component from a simple string that can contain an optional tag name (for now it defaults to `div` if omitted, but more on it coming, see the [3.]) and a bunch of classNames: `bemto('span.myClass1.myClass2')` would create a span component with the `myClass1 myClass2`, which would have all the other bemto features (like the applying of modifiers).

2. `bemto-components` gives you a way to easily create BEM “Elements” for your components.

3. _coming soon_ `bemto-components` would allow you to think less about handling your components' tag names by embracing some prop-based polymorphism. More on it when it would be ready!


## Disclaimer

Work in progress. Everything could change, don't treat as a stable thingy. I did not do any performance metrics and did not do any premature optimisations. Also: no tests for now. You're welcome to test, benchmark and overall think about this; create issues and PRs.


## Install

```sh
npm install --save bemto-components
```

## Example usage for modifiers

At definition:

``` jsx
import bemto from 'bemto-components';

const Block = bemto('div.myBlock');
```

Usage:

``` jsx
<Block _mod>
  Hello
</Block>
```

This would output

``` html
<div class='myBlock myBlock_mod'>Hello</div>
```

### Modifiers with string values

Both boolean and string values are supported for modifiers:

``` jsx
<Block _mod1 _mod2='mod2value' />
```

### With styled-components

Just pass a bemto-component inside styled-components:

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

## Example usage for elements

For bemto-components you can call `.elem()` method to create an element:

``` jsx
import bemto from 'bemto-components';

const Block = bemto('.myBlock');
Block.Element = Block.elem('myElement');
```

And then use it like this:

``` jsx
<Block>
  <Block.Element>Hello</Block.Element>
</Block>
```

Which would output

``` html
<div class='myBlock'><div class='myBlock__myElement'>Hello</div></div>
```

### TagString for Elements

Like with creation of Blocks, you can use a tagString, passing it as a second param when creating an element:

``` jsx
import bemto from 'bemto-components';

const Block = bemto('.myBlock');
Block.Element = Block.elem('myElement', 'span.extraElemClass');
```

Again,

``` jsx
<Block>
  <Block.Element>Hello</Block.Element>
</Block>
```

Would output

``` html
<div class='myBlock'><span class='myBlock__myElement extraElemClass'>Hello</span></div>
```

### With styled-components

As after wrapping with styled-component you would lose the `elem` method, there is an extra way to create elements:

```jsx
import bemto from 'bemto-components'

const Block = styled(bemto())`
  background: red;

  &_mod {
    background: lime;
  }

  &__myElement {
    background: blue;
  }
`);

Block.Element = bemto.elem(Block, 'myElement', 'span.extraElemClass');
```

And there you'd even get the styled-components' names as block names.

## Hint: if you have styled-components, you can emulate elements even without this lib:

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
