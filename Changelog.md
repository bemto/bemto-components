## Changelog

### v1.6.0 (in development)

- Added a way to pass function to props in definition.
- Added a way to pass function to `optional` prop at elem definition.
- Added a way to disable an element by calling it as `false` or `null`.
- Added docs for the external `bemto-button` component.
- Fixed non-cloned parents array which led to incorrect render of elements in some cases.

### v1.5.0 (2017-11-18)

- Added a way of setting elements' modifiers based on their block's props.
- Added a way of creating nameless elements on definition.
- Added proper docs.

### v1.4.0 (2017-11-16)

- Added context handling for polymorphic tags.
- Added modifiers declaration on block with possible passing of functions.
- Added a way to pass props on element declaration.
- Fixed a tag getter from the tagString of an element declaration.

### v1.3.0 (2017-11-08)

- Added a way to define the element when defining a bemto block.
- Added a way to pass content to those elements from the block call.
- Added a way to pass options object as well/instead of a tagString.
- Made __BemtoElem API a bit easier to use.

### v1.2.0 (2017-11-04)

- Added basic polymorphic tagnames.
- Added a chaining way to declare elements.

### v1.1.2 (2017-10-30)

- Some minor docs changes.

### v1.1.1 (2017-10-30)

- Fixed the call without tagString at all.

### v1.1.0 (2017-10-30)

- Added a basic way to create elements of the blocks.
- Added a basic classNames/id parser to the tagString argument.
- Fixed a rogue modifier whenever there was a single pregenerated className.
- Fixed unneeded rendering of props started with underscore as attributes in React 16.
- Added basic tests using jest ([#7](https://github.com/kizu/bemto-components/pull/7), thanks to [@SevInf](https://github.com/SevInf)).

### v1.0.0 (2017-10-17)

First proper non-prototype version

- Prop modifiers to className generation.
- Some preparation for the custom polymorphic Tagnames.
