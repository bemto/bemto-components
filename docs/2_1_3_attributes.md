### Attributes-aware Tag Names

The tag names' polymorphism does not stop at just context:

    const Minimal = bemto();

    <Minimal href='#x'>
      Oh, its a link!
    </Minimal>

That's right, we can have components that could become links just like that: when you pass a `href` to them. What can describe a link other than that attribute?

And, of course, other attributes can be definitive too, here are all currently supported permutations:

    const Minimal = bemto();

    <div className='Grid'>

      <Minimal>Just some div</Minimal>

      <Minimal href='#x'>Now: a link</Minimal>

      <Minimal type='text'
        id='iAmATextInput'
        defaultValue='I am a text input!' />

      <Minimal htmlFor='iAmATextInput'>
        Click me, I am a label!
      </Minimal>

      <Minimal type='button'>A button?</Minimal>

      <Minimal src='https://placebear.com/200/100' />

    </div>

A few rules for how this works:

1. Anything could become a `<a>` link. Links are good, all tags want to become one.
2. All other polymorphism happens only on `<div>` and `<span>` (at least for now).
3. The `type` attribute defines both `<button>` and `<input>`. How this works? Only the `type='button'` and `type='submit'` would become proper buttons. Anything else would become various inputs.
