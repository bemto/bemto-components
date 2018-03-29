## Elements

Let's look at the [element's definition](https://en.bem.info/methodology/key-concepts/#element):

> A constituent part of a block that can't be used outside of it.

You could already notice [the place](#structure) in bemto-components which has those parts which won't make much sense outside of the bemto component. And to enable the powers of Elements all you'll need to do is to use a special prop in the content object definition:

    const Block = bemto('.block', {
      content: [
        {
          elem: 'content',
          children: true
        },
        { elem: 'helper' }
      ]
    });

    <div>
      <Block>Shiny!</Block>

      <style>{`

        .block {
          display: inline-flex;
          border: 0.5em dotted;
          padding: 0.5em 1.5em;
        }

        .block__content {
          box-shadow: 0 0 0.5em;
        }

        .block__helper {
          min-width: 1.5em;
          text-align: center;
          background: pink;
        }
        
      `}</style>
    </div>

There is a really simple thing happening: all the classNames that our “Block” are used to create “Elements” on our generated tags by using the `elem` property of a definition object (in future not _all_ the classNames would be used in this way, but when this would happen that would be a breaking major release anyway). On its own this allows you to use any external CSS that is written with BEM in mind, but as you'll see [later](#styled-components), this feature shines the best when used with styled-components. But for now — I'd need to talk a bit more about another key feature that elements allow.

### Passing Content to Elements

While it could be useful to have elements like in the example above to enable easier styling in CSS, in some cases you'll want to either make those optional or to make them configurable in some way, like having some extra content etc.

That is where the elements' API comes in handy:

    const Block = bemto('.block', {
      content: [
        {
          elem: 'content',
          children: true
        },
        { elem: 'helper' }
      ]
    });

    <Block
      __helper='🙀'
      __content={{ props: { href: '#x' } }}
    >
      Shiny!
    </Block>

We can see two things there:

1. We can pass any content to our elements.
2. We can add some extra properties to them.

Another thing related to passing content is that you can make your elements optional:

    const Block = bemto('.block', {
      content: [
        {
          elem: 'content',
          children: true
        },
        { elem: 'helper', optional: true }
      ]
    });

    <div>    
      <Block>
        No kitty
      </Block>
      <Block __helper='🐈'>
        Kitty!
      </Block>
    </div>

And, of course, your elements could have complex structure too, and you can pass content to them by mentioning the top level. And if the top level would be optional, nothing would be rendered.

    const Block = bemto('.block', {
      content: [
        {
          elem: 'content',
          children: true
        },
        { 
          elem: 'helper',
          optional: true,
          content: {
            elem: 'content'
          }
        }
      ]
    });

    <div>    
      <Block>
        No kitty
      </Block>
      <Block __helper='🐈'>
        Kitty!
      </Block>
    </div>

And, of course, you can pass not just some strings, but other components as well:

    const Block = bemto('.block', {
      content: [
        {
          elem: 'content',
          children: true
        },
        { 
          elem: 'helper'
        }
      ]
    });

    <div>    
      <Block
        __helper=<strong>wow</strong>
      >
        Kitty!
      </Block>
    </div>

Sometimes you could want to use the content passed to an element as its attribute and not as its actual content. In that case you can use a trick of using an empty array for its value:

    const Block = bemto('.block', {
      content: [
        {
          elem: 'content',
          children: true
        },
        {
          elem: 'helper',
          props: {
            src: p => p.__helper
          },
          content: []
        }
      ]
    });

    <div>
      <Block
        __helper='https://placebear.com/50/30'
      >
        Bear!
      </Block>
    </div>

- - -

Those are almost all features available for elements, but we have a lot of plans to expand on this idea. And, I need to mention this: as well as with the modifiers you'll know about below, all of this makes much more sense when used with styled-components. You'll see.
