# bemto-components 🍱

Smart components for using [BEM methodology](https://en.bem.info/methodology/quick-start/) with [React](https://reactjs.org/). Best used together with [styled-components](https://www.styled-components.com/).

<a class="github-button" href="https://github.com/kizu/bemto-components" data-show-count="true" aria-label="Star kizu/bemto-components on GitHub">bemto-components ★</a>
[![NPM package version][version]][version-link] 
[![Build Status][build]][build-link]

[build]: https://travis-ci.org/kizu/bemto-components.svg?branch=master
[build-link]: https://travis-ci.org/kizu/bemto-components
[version]: https://img.shields.io/npm/v/bemto-components.svg
[version-link]: https://www.npmjs.com/package/bemto-components

Bemto-components provide:

    // Our wrapper: <ul> with some styles
    const List = styled(bemto('ul'))`
      padding: 0 0 8px 1.25em;
      font: 18px/1.4 Helvetica Neue, Arial, sans-serif;
    `;

    // Our complex <Feature> component:
    // a) with some internal structure for inner elements;
    // b) note the absense of tagnames for <a> and <li>.
    const Feature = styled(bemto({
      content: [
        {
          elem: 'Link',
          content: [
            { elem: 'Icon' },
            { children: true }
          ]
        },
        {
          elem: 'Note',
          tag: 'span',
          optional: true
        }
      ],
      // You can declare possible modifiers like this
      modifiers: { _withIcon: props => !!props.__Icon }
    }))`
      /* You can style the internal elements like this! */
      &__Icon {
        display: inline-block;
        width: 3em;
        padding-right: 0.5em;
        margin-left: -3.5em;
        text-align: right;

        /* Use this if you'd need at some point in the nesting to get the root parent */
        ${() => Feature}:not(:hover) & {
          visibility: hidden;
        }
      }

      &__Link {
        display: inline-block;
        vertical-align: top;
        padding: 0 0 0.25em;

        &[href] {
          color: #1978C8;
          text-decoration: none;
          &:hover {
            color: #F28A25;
          }
        }
      }

      /* And modifers, like this: */
      &_withIcon:hover {
        list-style: none;
      }

      &_awesome {
        font-style: italic;
        color: red;
      }

      &_awesome > &__Link {
        color: #000;
      }
    `;

    // Here is how you can pass params and content to the generated elements:
    <List>
      <Feature __Link={{ props: { href: '#html-structure' } }} __Icon='🍢'>
        Reusable, configurable, easy to create HTML elements of any complexity.
      </Feature>
      <Feature __Link={{ props: { href: '#bem' } }} __Icon='🍙 🍣'>
        Elements and Modifiers from BEM.
      </Feature>
      <Feature __Link={{ props: { href: '#styled-components' } }} __Icon='💅'
        __Note=', totally optional.'>
        Styled-components support from the box
      </Feature>

      {/* And the syntax for modifiers? Just like this. */}
      <Feature _awesome>
        Just pure awesomeness (in my biased opinion). Just look at this example’s code ↓ or just skip to more simple examples and descriptions in the documentation below.
      </Feature>
    </List>

Note: you can edit the code above, as well as all the other examples on this page. Play with it a little and/or continue reading below for more on what there is and how everything works.
