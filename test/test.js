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

test('with tag name and external className (options as an object)', () => {
  testSnapshot(
    bemto({ tagString: 'span' }),
    { className: 'block', _mod: 'value' }
  );
});

test('with tag name and external className (options as an object with a parsed tag)', () => {
  testSnapshot(
    bemto({ tag: 'span' }),
    { className: 'block', _mod: 'value' }
  );
});

test('with tagString as well as with options', () => {
  testSnapshot(
    bemto('span.tgsClsnm#tgsID', { tag: 'strong', className: 'optCls', id: 'optID' }),
    { className: 'block', _mod: 'value' }
  );
});

test('without anything, but with external className', () => {
  testSnapshot(
    bemto(),
    { className: 'block', _mod: 'value' }
  );
});

test('without anything, but with external className  (options as an empty object)', () => {
  testSnapshot(
    bemto({}),
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

test('with simple element using chaining', () => {
  const Block = bemto('.myBlock').addElem('MyElem');

  testSnapshot(
    Block,
    {
      _blockMod: 'value'
    },
    React.createElement(Block.MyElem, { _elemMod: 'value' })
  );
});

test('with two simple nested elements using chaining', () => {
  const Block = bemto('.myBlock').addElem('MyElem').addElem('MyElem2');

  testSnapshot(
    Block,
    {
      _blockMod: 'value'
    },
    React.createElement(Block.MyElem, { _elemMod: 'value' }, React.createElement(Block.MyElem2, { _elem2Mod: 'value' }))
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

test('should become an anchor based on an attrubute', () => {
  testSnapshot(
    bemto('.myLink'),
    { href: '#x' }
  );
});

test('should become an anchor based on an attrubute, even when defined as a button', () => {
  testSnapshot(
    bemto('button.myLink'),
    { href: '#x' }
  );
});

test('should become a label based on an attrubute', () => {
  testSnapshot(
    bemto('.myLabel'),
    { for: 'myID' }
  );
});

test('should become a label based on an attrubute, even when defined as a span', () => {
  testSnapshot(
    bemto('span.myLabel'),
    { for: 'myID' }
  );
});

test('should become a button based on an attrubute', () => {
  testSnapshot(
    bemto('.myButton'),
    { type: 'button' }
  );
});

test('should NOT become a button as a non-neutral type given', () => {
  testSnapshot(
    bemto('input.myButton'),
    { type: 'button' }
  );
});

test('should become a submit button based on an attrubute', () => {
  testSnapshot(
    bemto('.mySubmitButton'),
    { type: 'submit' }
  );
});

test('should become a radio button based on an attrubute', () => {
  testSnapshot(
    bemto('.myRadio'),
    { type: 'radio' }
  );
});

test('should become an image based on an attrubute', () => {
  testSnapshot(
    bemto('.myImage'),
    { src: 'kitten.jpg' }
  );
});

test('with element created through __BemtoElem prop', () => {
  const Block = bemto('.myBlock');

  testSnapshot(
    Block,
    {
      _blockMod: 'value'
    },
    React.createElement(Block, { __BemtoElem: {
      name: 'MyElem'
    }})
  );
});

test('with element created through __BemtoElem prop with more extensive options ', () => {
  const Block = bemto('.myBlock');

  testSnapshot(
    Block,
    {
      _blockMod: 'value'
    },
    React.createElement(Block, { __BemtoElem: {
      name: 'MyElem',
      tagString: 'span',
      props: {
        _elemMod: 'value'
      }
    }})
  );
});

test('simple block with defaulty content', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [{ children: true }]
    }),
    {},
    'children text'
  );
});

test('simple block with a Content wrapper', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [{
        elem: 'Content',
        content: [{ children: true }]
      }]
    }),
    {},
    'children text'
  );
});

test('simple block with a Helper item before children', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper'
        },
        {
          children: true
        }
      ]
    }),
    {},
    'children text'
  );
});

test('simple block with a Before, and a complex After, and a modifier, and an extraClass', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Before'
        },
        {
          children: true
        },
        {
          elem: 'After',
          content: [{
            elem: 'After__Inner'
          }]
        }
      ]
    }),
    { className: 'extraClass', _mod: true },
    React.createElement(bemto('.ChildBlock'), {}, 'some inner text')
  );
});

test('block with passing content to an element through props', () => {
  const MyBlock = bemto('.myBlock', {
    content: [
      {
        elem: 'Helper'
      },
      {
        children: true
      }
    ]
  });
  testSnapshot(
    MyBlock,
    {
      __Helper: 'Hello, helper!'
    },
    'children text'
  );
});

test('block with a single wrapper inside without an array', () => {
  const MyBlock = bemto('.myBlock', {
    content: {
      elem: 'Content',
      content: { children: true }
    }
  });
  testSnapshot(
    MyBlock,
    {},
    'children text'
  );
});

test('block with a single wrapper inside without an array with shorter children syntax', () => {
  const MyBlock = bemto('.myBlock', {
    content: {
      elem: 'Content',
      children: true
    }
  });
  testSnapshot(
    MyBlock,
    {},
    'children text'
  );
});

test('simple block with a Helper item that have a string content', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          content: 'I am a helper'
        },
        {
          children: true
        }
      ]
    }),
    {},
    'children text'
  );
});

test('simple block with a Helper item that have a string content which is later overrided', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          content: 'I am a helper'
        },
        {
          children: true
        }
      ]
    }),
    {
      __Helper: 'Overriding content!'
    },
    'children text'
  );
});

test('simple block with an optional Helper item that should not be rendered', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          optional: true
        },
        {
          children: true
        }
      ]
    }),
    {},
    'children text'
  );
});

test('simple block with an optional Helper item that should be rendered as it was passed on call', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          optional: true
        },
        {
          children: true
        }
      ]
    }),
    { __Helper: 'I am a Helper' },
    'children text'
  );
});

test('simple block with an optional nested Helper item that should not be rendered', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          optional: true,
          content: {
            elem: 'Helper__Content'
          }
        },
        {
          children: true
        }
      ]
    }),
    {},
    'children text'
  );
});

test('simple block with an optional nested Helper item that should be properly rendered', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          optional: true,
          content: {
            elem: 'Helper__Content'
          }
        },
        {
          children: true
        }
      ]
    }),
    { __Helper: 'I am a Helper' },
    'children text'
  );
});
