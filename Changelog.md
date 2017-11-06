# `bemto-components` changelog

## v1.3.0 (in development)

- Made __BemtoElem API a bit easier to use.

## v1.2.0 (2017-11-04)

- Added basic polymorphic tagnames.
- Added a chaining way to declare elements.

## v1.1.2 (2017-10-30)

- Some minor docs changes.

## v1.1.1 (2017-10-30)

- Fixed the call without tagString at all.

## v1.1.0 (2017-10-30)

- Added a basic way to create elements of the blocks.
- Added a basic classNames/id parser to the tagString argument.
- Fixed a rogue modifier whenever there was a single pregenerated className.
- Fixed unneeded rendering of props started with underscore as attributes in React 16.
- Added basic tests using jest ([#7](https://github.com/kizu/bemto-components/pull/7), thanks to [@SevInf](https://github.com/SevInf)).

## v1.0.0 (2017-10-17)

First proper non-prototype version

- Prop modifiers to className generation.
- Some preparation for the custom polymorphic Tagnames.
