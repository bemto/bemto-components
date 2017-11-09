### TagString Argument

Now, that was the minimal version. But bemto-component can also accept an argument:

    const Foo = bemto('span.foo');
    // try changing the ↑ there to h2

    <div>
      <Foo>Hello,</Foo> <Foo>world!</Foo>

      <style>{`
        .foo {
          border: 1px solid;
        }
      `}</style>
    </div>

This argument is a thing called “tagString”, it looks a bit similar to how CSS selectors look, but (for now) it only allows you to use the tag name, any number of classNames and ID (though, you probably won’t want to have ID declared at this kind of components). So all of those are totally valid:

- `bemto('span')` would render as `<span>`
- `bemto('.foo')` would render as `<div class='foo'>`
- `bemto('a.foo.bar')` would render as `<a class='foo bar'>`
- etc.

This allows you to both easily declare which tag you should render the component with, and attach any extra classNames in case you're using an external library of some sorts.
