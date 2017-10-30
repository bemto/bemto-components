const React = require('react');
const bemto = require('..');
const renderer = require('react-test-renderer');

const testSnapshot = function(tag, props, children) {
  const component = renderer.create(
    React.createElement(
      tag,
      props,
      children
    )
  );

  expect(component.toJSON()).toMatchSnapshot();
}

test('with tag name and external className', () => {
  testSnapshot(
    bemto('div'),
    { className: 'block', _mod: 'value' }
  );
});

test('without anything, but with external className', () => {
  testSnapshot(
    bemto(),
    { className: 'block', _mod: 'value' }
  );
});

test('with boolean modifier', () => {
  testSnapshot(
    bemto('div'),
    { className: 'block', _mod: true }
  );
});

test('with falsey boolean modifier', () => {
  testSnapshot(
    bemto('div'),
    { className: 'block', _mod: false }
  );
});

test('with class name only', () => {
  testSnapshot(
    bemto('.block'),
    { _mod: 'value' }
  );
});

test('with tag and explicit class name', () => {
  testSnapshot(
    bemto('span.block'),
    { _mod: 'value' }
  );
});

test('with tag and explicit id and class name', () => {
  testSnapshot(
    bemto('span#id.block'),
    { _mod: 'value' }
  );
});

test('with multiple ids in definition', () => {
  testSnapshot(
    bemto('span#id1.block#id2#id3'),
    { _mod: 'value' }
  );
});

test('with id and class name, and local id', () => {
  testSnapshot(
    bemto('#id.block'),
    {
      _mod: 'value',
      id: 'newId'
    }
  );
});

test('with multiple classes', () => {
  testSnapshot(
    bemto('.block1.block2'),
    { _mod: 'value' }
  );
});

test('with multiple external classes', () => {
  testSnapshot(
    bemto('div'),
    {
      className: 'block1 block2',
      _mod: 'value'
    }
  );
});

test('with multiple classes at different places and multiple modifiers', () => {
  testSnapshot(
    bemto('div.defClass1.defClass2'),
    {
      className: 'callClass1 callClass2',
      _mod1: 'value',
      _mod2: true,
      _mod3: 'value'
    }
  );
});

test('with multiple a class, some attributes and a child block', () => {
  testSnapshot(
    bemto('h1.class1'),
    {
      _mod: 'value',
      title: 'hello',
      id: 'Unique'
    },
    React.createElement(bemto('span.class2'))
  );
});

test('with simple element', () => {
  const Block = bemto('.myBlock');
  Block.MyElem = Block.elem('myElem');

  testSnapshot(
    Block,
    {
      _blockMod: 'value'
    },
    React.createElement(Block.MyElem, { _elemMod: 'value' })
  );
});

test('with block that has multiple classes and with an element that has a tagString', () => {
  const Block = bemto('.myBlock1.myBlock2');
  Block.MyElem = Block.elem('myElem', 'span.extraElemClass');

  testSnapshot(
    Block,
    {
      _blockMod: 'value'
    },
    React.createElement(Block.MyElem, { _elemMod: 'value', className: 'extraElemCallClass' })
  );
});
