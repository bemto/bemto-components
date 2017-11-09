### Generating the Structure

Now, with all the above features, its really easy and fast to create small reusable components. But there can be a lot of cases where you'd need a more complex HTML structure for your components, like having an extra wrapper for content, some helper elements and stuff like that. Its often kinda dounting at first to use a shortcut for the single element and then later write a much more code just to get some complex element composition.

Bemto-components provides you with a way to solve it right when you define your component. Just pass an object (either as a second argument, or just as a first one) with more options:

    const Foo = bemto('span.foo', {
      content: {
        className: 'bar',
        children: true
      }
    });

    <div>
      <Foo>Not just one element!</Foo>

      <style>{`
        .foo { border: 1px dashed; padding: 10px; }
        .bar { border: 3px dotted; }
      `}</style>
    </div>

That's just a component with an extra wrapper inside, but you could do much more if you'd want:

    const Foo = bemto('.foo', {
      content: {
        tag: 'ul',
        content: [
          { content: 'Item 1' },
          { content: { children: true } },
          {
            content: 'Item 1',
            className: 'bar'
          }
        ]
      }
    });

    <Foo>Not just one element!</Foo>

The API for this kind of setting up all the extra elements is easy:

- As well as `tagString`, you can pass an object as `bemto()` argument.
- Whenever you pass an object to a `content` key in this object, this object would become our component's internal structure.
- By default you could say that any object's `content` is `{ children: true }` — that means that this would just apply anything that you pass to the component right inside of it.
- So, in the need of a wrapper, you can add `content: { children: true }`, or just `children: true` with this extra element's definition to mark a place where your contents would go.
- Any nested `content` would work, and you can pass there any of this: object, string (for a textnode) or an array containing any of those.
- Any of those objects could have all the same properties you could pass to the definition object: `tag`, `tagString`, `className`, `props` — all of those would work anywhere.
- All of the features of a single bemto component would work with those generated elements as well: they would depend on context and be polymorphic based on the properties passed to them.

All of this allows you to create some really complex HTML structures, but there is a thing that makes this much more powerful tool and not just a shortcut. Its all the stuff that bemto-components borrows from BEM.
