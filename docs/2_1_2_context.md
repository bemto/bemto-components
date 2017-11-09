### Context-aware Tag Names

But hey, do you remember in the minimal example there was a phrase “In our first examples that would be a `<div>`”? Here is the catch: when you use such `bemto()` component, even if by _default_ it would be a `<div>`, there can be a number of situations when it won't be one.

Ok, look at this:

    const Minimal = bemto();
    const Inline = bemto('span');

    <div>
      <Minimal>Line 1</Minimal>
      <Minimal>Line 2</Minimal>
      <Inline>
        <Minimal>Part 1</Minimal>,
        <Minimal>part 2</Minimal>
      </Inline>
    </div>

Suddenly, the `<Minimal>` inside of the `<Inline>` are rendered as `<span>`s! Now look at some other examples:

    const Minimal = bemto();
    const List = bemto('ul');

    <List>
      <Minimal>Item 1</Minimal>
      <Minimal>Item 2</Minimal>
    </List>

<!-- -->

    const Minimal = bemto();
    const List = bemto('ol');
    const Strong = bemto('strong');

    <List>
      <Minimal>
        Item
        <Strong>
          <Minimal>with </Minimal>
          <Minimal>spans</Minimal>
        </Strong>
        <Minimal>
          And a new line
        </Minimal>
      </Minimal>
    </List>

Here you can see how your component could adapt to becoming a child of a list, or to become inline in any other inline context like a `<strong>` HTML element. This allows us to create components that would be much easier used in semantic HTML context, without the need of extra wrappers etc.

Note that only tags that are `<div>` or `<span>` would have this behavior, as those are HTML tags that don't have semantics, so we can totally convert them. There is a chance we'll look into changing other tags and in other contexts, but that would be a more complex task.
