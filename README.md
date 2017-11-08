# bemto-components 🍱

[![Build Status][build]][build-link] [![NPM package version][version]][version-link]

[build]: https://travis-ci.org/kizu/bemto-components.svg?branch=master
[build-link]: https://travis-ci.org/kizu/bemto-components
[version]: https://img.shields.io/npm/v/bemto-components.svg
[version-link]: https://www.npmjs.com/package/bemto-components

Smart components for using parts of [BEM methodology](https://en.bem.info/methodology/quick-start/) with [React](https://reactjs.org/). Best used together with [styled-components](https://www.styled-components.com/).


## What does it do?

[You can play with everything at this CodePen playground!](https://codepen.io/kizu/pen/BwxNqQ?editors=0010)

There are a lot of things `bemto-components` would do in the future, but for now here are a few main features:

1. `bemto-components` allow you to use BEM-style modifiers for your React components using the _modifier prop syntax. For example, if you'd do `<Foo _bar />` (where `Foo` is bemto-component), each className of the Foo component would be duplicated with an addition of the `_bar` modifier. That allows you to use the BEM modifiers in your CSS (both external, or using styled-components).

2. `bemto-components` gives you a way to easily create a component from a simple string that can contain an optional tag name (for now it defaults to `div` if omitted, but more on it coming, see the [3.]) and a bunch of classNames: `bemto('span.myClass1.myClass2')` would create a span component with the `myClass1 myClass2`, which would have all the other bemto features (like the applying of modifiers).

3. `bemto-components` gives you a way to easily create BEM “Elements” for your components. And you have a lot of ways to do it. Like, you can generate the HTML structure of the block with all the elements right at the definition and then pass content to those elements when you call your block.

4. `bemto-components` allows you to think less about handling your components' tag names by embracing some prop-based polymorphism. For example, you can ommit explicit tagnames for some HTML elements: anchors when you'd use `href` attribute, images for components with `src`, labels for components `for`. Buttons for `type` prop with `button` or `submit` values, and inputs for other `type` values. This makes it really easy to make polymorphic menu items (that are spans or divs when no `href` given, and proper links when the `href` is given), or buttons that could be `button`s by default, but would convert themselves to anchors when `href` given.


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

## Example usage for elements (on definition)

Whenever you define your bemto block, you can pass an object that would describe its content. This would allow you both to generate the desired HTML structure of the element right away, and link the created elements inside with the corresponding props on the block.

For example, what if we'd want a block that would have an extra wrapper inside for its content, but as well would have two helper elements at the start of the block, one of which could be optional? Easy!

```jsx
const Bento = bemto('.Bento', {
  content: [
    { elem: 'Helper1' },
    { elem: 'Helper2', optional: true },
    { elem: 'Content', children: true }
  ]
});
```

Then we can call it like that:

```jsx
<Bento>Hello</Bento>
```

And we'd get this HTML for it:

```html
<div class="Bento">
  <div class="Bento__Helper1"></div>
  <div class="Bento__Content">
    Hello
  </div>
</div>
```

As you can see, the `Helper1` element is always rendered, while the `Helper2` is not there. That leads to a question: what is the prerequisite for this element to appear? That leads to the next part:

### Passing content and props to the elements

Yep, whenever you define a block with its elements, you get also a way to _control_ those elements. What if we'd call our block like this?

```jsx
<Bento __Helper1='foo' __Helper2='bar'>
  Hello
</Bento>
```

Can you guess what we'd get?

```html
<div class="Bento">
  <div class="Bento__Helper1">foo</div>
  <div class="Bento__Helper2">bar</div>
  <div class="Bento__Content">
    Hello
  </div>
</div>
```

You can pass strings, arrays or other html/react elements inside. But what if you'd want to change some of those elements a bit? Easy:

```jsx
<Bento
  __Helper1={{
    content: 'foo',
    props: { _mod: true }
  }}
  __Helper2={{
    content: 'bar',
    props: { href: '#x' }
  }}
>
  Hello
</Bento>
```

Whenever you pass a special object, you're getting a way to define props on this element (and you can use `content` for its children). And, of course, all other bemto features work on those elements: the modifiers modify this exact element, and the tags would be polymorphic as well.

### Styled-components

What I like about these elements the most is that there is build-in support for styled-components. Look:

```jsx
const Bento = styled(bemto({
  content: [
    { elem: 'Helper1' },
    { elem: 'Helper2', optional: true },
    { elem: 'Content', children: true }
  ]
}))`
  border: 1px solid;

  &__Helper1 {
    background: blue;

    &_mod {
      background: lime;
    }
  }

  &__Helper2 {
    background: red;
  }

  &__Content {
    padding: 10px;
  }
`;
```

That's it! We can just wrap our bemto block with `styled()` and all of the automatically generated classNames would work for elements and modifiers.

But wait. The best part: all of this works with `.extend`!

```jsx
const CuteBentoBox = Bento.extend`
  background: yellow;

  &__Helper1,
  &__Helper2 {
    padding: 5px;
  }
`;
```

And then when you'd use `<CuteBentoBox>` you'd get all of the stuff you've defined for `<Bento>`, as well as all the new styles. This allows you to create not just abstract styled atomic components, but more complex structures that would still be extendable and wouldn't have specificity problems or conflicts, as all the classNames would be prefixed by the styled-components-generated className, and each element would have just a single className in selector (compare with cases when you'd use something like `${Bento} > &` for your child components when doing stuff in a traditional styled-components way).

- - -

There are a lot of other planned features around this kind of elements, but those are the base of it and should be enough to create really complex components in a really easy way.

## Example usage for elements (postfactum API)

(disclaimer: all of these methods were created before the abovementioned creation-on-definition, so I'm not sure how useful all of this would be now, but still!)

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

### Chaining for creating Elements

You can also use an `addElem()` for creating elements for any given block:

``` jsx
import bemto from 'bemto-components';

const Block = bemto('.myBlock').addElem('myElement');
```

would be basically the same as previous example.

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

### Inline creation of elements from existing Block

There is a slightly strange-looking API that you can use to create elements without saving them. For doing this you can call your block, but with an addition of a `__BemtoElem` prop, which value should be an object:

```jsx
<Block>
  <Block __BemtoElem={{ name: 'Element', tagString: 'span' }}>Hello</Block>
</Block>
```

This can be used whenever you want to create a stylable composition of blocks and elements:

```jsx
const BemtoBlock = bemto();

class BlockStructure extends React.Component {
  render() {
    return (
      <BemtoBlock {...this.props}>
        <BemtoBlock {...this.props} __BemtoElem={{
          name: 'Content',
          tagString: 'span'
        }}>
          {this.props.children}
        </BemtoBlock>
      </BemtoBlock>
    )
  }
}

const Block = styled(BlockStructure)`
  background: red;

  &__Content {
    display: inline-block;
    padding: 10px;
  }
`;
```

Doing so would allow you to later extend you styled-component and still keep all the element bindings:

const MyBlock = Block.extend`
  border: 2px solid;

  &__Content {
    background: lime;
  }
`;

This new `MyBlock` would be rendered with all the styles combined and it would have a Content element that would also have all the styles combined.

Note: it could be possible to create a sligtly better API, but that would mean there'd be more logic involved, and this `__BemtoElem` way should be the cheapest and would have the lower amount of wrappers than alternatives.

- - -

To be continued!

If you'd like to follow on the bemto-components progress, [follow me on twitter](https://twitter.com/kizmarh/).

- - -

Copyright (c) 2017 Roman Komarov <kizu@kizu.ru>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.