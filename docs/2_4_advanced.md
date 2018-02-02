## Advanced Features and the Future

### Functions as prop values

In a lot of places bemto-components can accept functions instead of just values. Those functions would be evaluated with original block's props as an argument.

Currently, bemto-components support functions for setting:

- modifiers;
- props;
- optionality of elements;
- tag names.

***Note:** due to this mechanism, you should make sure that whenever you need an actual function as a prop argument in bemto context, you'll need to wrap it with an extra function that would return your function.

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

### Other stuff coming soon!

This is an ongoing project I'm developing right now, I have a lot of plans (the first of those — make a proper _plan of plans_, err, roadmap), and I'm planning on releasing new versions and documenting them as I'll go.

You could already see that these docs are very raw: typos, incorrect use of language, not that beautiful examples — yeah, I know. But you can help! Point me to what can be fixed in [Github issues](https://github.com/bemto/bemto-components/issues), create Pull Requests, try the project and tell me what do you think! Hit me at twitter [@kizmarh](https://twitter.com/kizmarh/) or just by [email](mailto:kizmarh@ya.ru).

Thanks if you've read all of it!
