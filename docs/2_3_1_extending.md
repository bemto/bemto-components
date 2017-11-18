### Extending styled-components

While most styled-components' features are good to have with bemto-components, one of them shines much brighter than others. Its the ability to extend styles.

But I need to mention one thing first: if you'd look at the styled-components examples of inheritance, you'd see that its much much easier to implement the same things using them with bemto-elements! Just look at this example below and compare with [what is there at styled-components](https://www.styled-components.com/docs/basics#extending-styles).

    const Button = styled(bemto('button'))`
      all: inherit;
      color: palevioletred;
      font-size: 1em;
      margin: 1em;
      padding: 0.25em 1em;
      border: 2px solid palevioletred;
      border-radius: 3px;

      &_tomato {
        color: tomato;
        border-color: tomato;
      }
    `;

    <div>
      <Button>Normal Button</Button>
      <Button _tomato>Tomato Button</Button>
      <Button href="#x">Normal Link</Button>
      <Button _tomato href="#x">Tomato Link</Button>
    </div>

You can see that with modifiers and attribute polymorphism you don't need to use the `.extend` or `.withComponent` from styled-components at all! And its already much easier to combine stuff.

But then, there are cases where you'd want to use `extend` from styled-components, and it would work perfectly with bemto-components:

    const Block = require('./block-example.js');

    const ExtendedBlock = Block.extend`
      border-color: yellow;

      &_dark > &__content {
        padding: 0 0.25em;
        background: maroon;
      }

      &__helper {
        margin-left: 0.5em;
      }
    `;
    <div>
      <Block _dark _big __helper='🐈'>Hey</Block>

      <ExtendedBlock _dark _big __helper='🐈'>Hey</ExtendedBlock>
    </div>

You can see that almost everything works just like that: you can not only extend this way the styles of the component, but all the styles for elements and modifiers as well.

The only thing that did not work: we lost the `rebeccapurple` background from the original element. Why? Because it had the interpolation for using the block itself, and now it has the className for the original block and not the extended one. That's why if you're providing abstract components that are meant to be extended you need to keep your styles abstract enough.

However, in styled-components there is another way to extend styles: by wrapping your already styled component in another `styled()`!

    const Block = require('./block-example.js');

    const WrappedBlock = styled(Block)`
      border-color: yellow;

      &_dark > &__content {
        padding: 0 0.25em;
        background: maroon;
      }

      &__helper {
        margin-left: 0.5em;
      }
    `;
    <div>
      <Block _dark _big __helper='🐈'>Hey</Block>

      <WrappedBlock _dark _big __helper='🐈'>Hey</WrappedBlock>
    </div>

You can see that the background of a helper element now has a proper color. That's because of the crucial difference between calling `extend` and wrapping a component. In the first case we get all the new classNames but with the same old styles plus the new ones all in one package. And in the second case we keep all the classNames of original components but then we add new ones for our new styles. So, actually, the styled-components wrapper works much more like BEM modifiers (but you still couldn't, for exampe, mix multiple of those on one element easily).

The main consequence of this difference is that when you wrap components, you still could target them all by referencing the original. That can be useful if you're using context in your styles and want to select all the different components that have common origin. But if you need a new isolated component that wouldn't inherit anything from such contexts — you should use `.extend`.