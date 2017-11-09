## HTML Structure Generation 🍢

The **minimal** form of bemto-component is `bemto()`, which would output just a single HTML element. In our first examples that would be a `<div>`:

    const Foo = bemto();

    <Foo>Hello, world!</Foo>

Note that that component would work like your usual HTML elements: you can pass props (**attributes**, but in JSX syntax — so you'll need `className` instead of a `class` and `styles` should accept an object) and they would be properly passed to the generated HTML element:

    const Foo = bemto();

    <Foo
      className='foo'
      style={{ padding: 16, border: '1px solid' }}
      title='Some HTML title text'
    >
      We have some attributes there
    </Foo>
