## Modifiers

As with blocks and elements, if you don't yet know what BEM modifiers are, here is [their basic definition](https://en.bem.info/methodology/key-concepts/#modifier):

> A BEM entity that defines the appearance and behavior of a block or an element.
> The use of modifiers is optional.
> Modifiers are similar in essence to HTML attributes. The same block looks different due to the use of a modifier.

Modifiers are a thing I love BEM the most for. In plain CSS era they were the best way to define various variants of different components.

But do we need them now, when we can write our CSS right in JS, where we could use JS inside our CSS that would output more CSS inside our CSS? _Inside JS?_

When I look at most CSS-in-JS solutions, their code looks just like the previous paragraph: a bit absurd.

I'd say, that by finding ourselves with all the new power that JS provides, we sometimes use it as a wrong tool for the job. CSS is declarative. It has a lot of cool features. Descendant combinators are good. Proper use of context is good. CSS can solve a lot of problems much easier and in much more readable and maintainable way than JS. And BEM modifiers tremendously help with this.

I've already wrote a lot and I should probably start thinking about writing a proper article about all of this, so I'll get to the code (in which I could miss the point and not present you with the best use cases for modifiers, but hey, these docs are not set in stone and we could make them much more clear later!) Anyway, try to believe me and try using modifiers instead of relying on JS conditions.

Let's get to the code at last!

    const Block = bemto('.block');

    <div>
      <Block>Hello!</Block>
      <Block _dark _big>Hello!</Block>

      <style>{`

        .block_dark {
          color: #FFF;
          background: #000;
        }
        .block_big {
          font-size: 2em;
        }

      `}</style>
    </div>

You could aready see how the bemto-components' API works there. We can attach props that start with an underscore. Those props would create BEM-style modifiers on our components just like elements are created from our blocks' classNames.

This allows us to use the powers of CSS to modify everything using the natural to CSS declarative way, and we get the simplest possible API in JSX. And because of CSS we can mix the modifiers with ease.

And there are a lot of ways to use modifiers, for example, you can attach default ones, or even make them adapt based on other props right on definition, and, of course, style elements based on parents' modifiers:

    const Block = bemto('.block', {
      modifiers: {
        _dark: true,
        _big: props => !!props.__helper
      },
      content: [
        {
          elem: 'content',
          children: true
        },
        {
          elem: 'helper',
          optional: true
        }
      ]
    });

    <div>
      <Block>Just a dark by default block</Block>

      <Block _dark={false}>
        Not dark, 'cause we did redefine it
      </Block>

      <Block __helper='🙀'>Wow</Block>

      <style>{`
        .block_dark > .block__helper {
          background: rebeccapurple;
        }
      `}</style>
    </div>

You can see how in the above example:

1. The blocks are dark by default.
2. We can change the default value of a modifier on call.
3. We can make a modifier's value to depend on component's other props.
4. As what we get in result is just CSS, we can then just add proper overrides and get desired result.

- - -

There can be a lot of other ways to use modifers: you can use not only boolean ones, but pass string values for them; they're available for elements as well, for example; and, as with elements, we have a lot of plans to enhance them even more in the next releases, as well as document all the current uses for them. Play with them! But maybe first read below about styled-components, as playing with elements, modifiers AND styled-components at the same time can be really fun!
