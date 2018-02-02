## Advanced Features and the Future

### Functions as prop values

In a lot of places bemto-components can accept functions instead of just values. Those functions would be evaluated with original block's props as an argument.

Currently, bemto-components support functions for setting:

- modifiers;
- props;
- optionality of elements;
- tag names.

***Note:** due to this mechanism, you should make sure that whenever you need an actual function as a prop argument in bemto context, you'll need to wrap it with an extra function that would return your function.

### Other stuff coming soon!

This is an ongoing project I'm developing right now, I have a lot of plans (the first of those — make a proper _plan of plans_, err, roadmap), and I'm planning on releasing new versions and documenting them as I'll go.

You could already see that these docs are very raw: typos, incorrect use of language, not that beautiful examples — yeah, I know. But you can help! Point me to what can be fixed in [Github issues](https://github.com/bemto/bemto-components/issues), create Pull Requests, try the project and tell me what do you think! Hit me at twitter [@kizmarh](https://twitter.com/kizmarh/) or just by [email](mailto:kizmarh@ya.ru).

Thanks if you've read all of it!
