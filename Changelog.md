## Bemto-components changelog

### v2.3.5 (2018-04-06)

- Fixed the state passed to `optional` option.

### v2.3.1–v2.3.4 (2018-04-05)

- Unfixed react (though did it long time ago?).
- Fixed another obscure bug (yeah, need more tests and refactor _everything_).
- Fixed incorrect variable definition.
- Fixed usage with a non-created component inside elem prop.
- Fixed undefined context issue.

### v2.3.0 (2018-04-03)

- Added two basic lifecycle methods setters: componentDidMount & componentWillUnmount, alongside a way to autoassign ref to an element (no docs & tests yet).

### v2.2.0 (2018-03-30)

- Added a way to use functions as `content` for elements.

### v2.1.0 (2018-03-30)

- Added `calculatedProps` to allow props passed inside an object to an element to be calculated when given as functions.
- Fixed some linking issues by deep clone.

### v2.0.3 (2018-03-29)

- Fixed merging of element props.
- Fixed passing of empty arrays as children, as it caused problems with empty tags like `img`.

### v2.0.2 (2018-03-28)

- Fixed component passed as a tag for an element (less partially lol?).

### v2.0.1 (2018-03-27)

- Fixed component passed as a tag for an element (partially?).

### v2.0.0 (2018-03-05)

- Added a way to handle state of an element and to adapt props&modifiers based on state.
- Added a way to pass props from block to elements and disallow props on blocks.
- Added a way to redefine the root tag.
- Breaking change: changed the way arguments are passed to modifier functions (just one argument, without element's own props).
- Moved from kizu/bemto-components to bemto/bemto-components.
- Removed `.elem()` and `.addElem()` generators: they were not working properly.

### v1.7.0 (2018-01-31)

- Added way to redefine tag name from element call.
- Added way to use function for tagnames on elements.
- Added docs for the external `bemto-overflower` component.
- Fixed modifiers and stuff when passing a component to content of an element.

### v1.6.2 (2018-01-29)

- Fixed the props passed to props generators on elements (pass block's props there).

### v1.6.1 (2017-11-27)

- Fixed `label` tag selection condition ([#32](https://github.com/bemto/bemto-components/pull/32), thanks to [@andrew--r](https://github.com/andrew--r)).

### v1.6.0 (2017-11-22)

- Added a way to pass function to props in definition.
- Added a way to pass function to `optional` prop at elem definition.
- Added a way to disable an element by calling it as `false` or `null`.
- Added a simpler way to set modifiers.
- Added a way to omit tag on element.
- Added the `reset` as a possible button type.
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
- Added basic tests using jest ([#7](https://github.com/bemto/bemto-components/pull/7), thanks to [@SevInf](https://github.com/SevInf)).

### v1.0.0 (2017-10-17)

First proper non-prototype version

- Prop modifiers to className generation.
- Some preparation for the custom polymorphic Tagnames.
