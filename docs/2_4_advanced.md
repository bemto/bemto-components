## Advanced Features and the Future

### Passing props from block to elements

Sometimes you would want for some props to render not on the topmost parent Block, but on some of the elements. While you could implement this partially by using functions for props, there is a handy shortcut for this: `acceptProps` option.

Whenever it is present on a Block, it would determine which props would be accepted by Block.

Whenever it is used on Element, it would accept every prop _except_ for those that are accepted by Block.

Possible values for `acceptProps`:

- `true` — to accept every prop (default for Block);
- `[]` — do not accept any props (default for Elements);
- `['foo', 'bar']` — accept only `foo` and `bar` props if present.
- `{}` — object that could have a key `except` that could contain props that should **not** be accepted. When used on Element, would be merged with the props that are accepted by BLock.

**Note:** right now the `className` is always accepted _only_ by Block, as well as any bemto props (those starting from `_`). Also, right now exception would always override inclusion, so if Block accepts some prop, it won't be possible to accept it on Elements. This probably woulc change in the future.

### Functions as prop values

In a lot of places bemto-components can accept functions instead of just values.

Currently, bemto-components support functions for setting:

- modifiers;
- props;
- optionality of elements;
- tag names.

Those functions can be used with up to three arguments: `props`, `state` and `component`. This would allow you to adapt any of the above based on the element's props, component's state, or to even go deeper by using the component itself.

***Note:** due to this mechanism, you should make sure that whenever you need an actual function as a prop argument in bemto context, you'll need to wrap it with an extra function that would return your function.

### Handling state

We just mentioned that we can accept `state` when using functions for modifiers or props. But for using it properly, we would need to have some initial state, and that is possible with an `initialState` object or function. Here is an example of how we can make an input with two states and modifiers based on it:

    const MyInput = styled(bemto({
      initialState: props => ({
        isFocused: false,
        value: props.value || props.defaultValue
      }),

      _empty: (props, state) => !state.value,
      _focus: (props, state) => state.isFocused,

      acceptProps: [],
      content: {
        elem: 'Controller',
        acceptProps: true,
        props: {
          type: 'text',
          onChange: (props, state, component) => (e) => {
            component.setState({ value: e.target.value });
          },
          onFocus: (props, state, component) => () => {
            component.setState({ isFocused: true });
          },
          onBlur: (props, state, component) => () => {
            component.setState({ isFocused: false });
          }
        }
      }
    }))`
      &__Controller {
        font-size: 2em;
        box-sizing: border-box;
        max-width: 100%;
        background: transparent;
      }

      &_focus {
        background: yellow;
      }

      &:not(&_empty) {
        background: lime;
      }
    `;

    <p className='Grid'>
        <MyInput />
        <MyInput defaultValue='With value' />
    </p>

You can see how different advanced features are used in this example: how we create an inner element, pass all the properties to this inner element, but have our modifiers on the top level and attach events on the input inside that handle the state of our whole component.

### Other stuff coming soon!

This is an ongoing project I'm developing right now, I have a lot of plans (the first of those — make a proper _plan of plans_, err, roadmap), and I'm planning on releasing new versions and documenting them as I'll go.

You could already see that these docs are very raw: typos, incorrect use of language, not that beautiful examples — yeah, I know. But you can help! Point me to what can be fixed in [Github issues](https://github.com/bemto/bemto-components/issues), create Pull Requests, try the project and tell me what do you think! Hit me at twitter [@kizmarh](https://twitter.com/kizmarh/) or just by [email](mailto:kizmarh@ya.ru).

Thanks if you've read all of it!
