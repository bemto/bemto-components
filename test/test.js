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

test('with tag given as `isTag` prop', () => {
  testSnapshot(
    bemto(),
    { className: 'foo', __is: 'strong' },
    "Hello"
  );
});

test('with component given as `isTag` prop', () => {
  const wrappedComponent = bemto('span.wrappedComponent');
  testSnapshot(
    bemto(),
    { className: 'foo', __is: wrappedComponent, _foo: true, href: '#x' },
    "Hello"
  );
});

test('with a calculated component given as `isTag` prop', () => {
  const wrappedComponent = bemto('span.wrappedComponent');
  testSnapshot(
    bemto(),
    { className: 'foo', __is: props => props._foo ? wrappedComponent : 'em', _foo: true },
    "Hello"
  );
});

test('with a calculated component given as `isTag` prop (faulty)', () => {
  const wrappedComponent = bemto('span.wrappedComponent');
  testSnapshot(
    bemto(),
    { className: 'foo', __is: props => props._foo ? wrappedComponent : 'em', _foo: false },
    "Hello"
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

test('with some default props', () => {
  testSnapshot(
    bemto('div', {
      props: { title: 'title!' }
    })
  );
});

test('with some prop as function', () => {
  testSnapshot(
    bemto('div', {
      props: { tabIndex: props=>1 }
    }),
    { href: '#x', onClick: ()=>alert('lol') }
  );
});

test('with some prop as function, based on another prop (faulty)', () => {
  testSnapshot(
    bemto('button', {
      props: { tabIndex: props=>props.href && 1 }
    }),
    {}
  );
});

test('with some prop as function, based on another prop (truth-y)', () => {
  testSnapshot(
    bemto('button', {
      props: { tabIndex: props=>props.href && 1 }
    }),
    { href: '#x' }
  );
});

test('with onclick as predefined function', () => {
  testSnapshot(
    bemto('div', {
      props: { onClick: ()=>()=>alert('lol') }
    }),
    { href: '#x' }
  );
});

test('with modifiers passed as configuration keys', () => {
  testSnapshot(
    bemto('.block', {
      _modWithVal: 'value',
      _modBool: true,
      _modNum: 2,
      _noMod: false
    })
  );
});

test('with modifiers passed in the modifiers object', () => {
  testSnapshot(
    bemto('.block', {
      modifiers: {
        _modWithVal: 'value',
        _modBool: true,
        _modNum: 2,
        _noMod: false
      }
    })
  );
});

test('with modifiers passed in the modifiers object while having an element', () => {
  testSnapshot(
    bemto('.block', {
      content: [
        { children: true },
        {
          elem: 'Helper',
          modifiers: {
            _elemModWithVal: 'value',
            _elemModBool: true,
            _elemModNum: 2,
            _elemNoMod: false
          }
        }
      ],
      modifiers: {
        _modWithVal: 'value',
        _modBool: true,
        _modNum: 2,
        _noMod: false
      }
    })
  );
});

test('with modifiers passed in the modifiers object while having an element (on top level)', () => {
  testSnapshot(
    bemto('.block', {
      content: [
        { children: true },
        {
          elem: 'Helper',
          _elemModWithVal: 'value',
          _elemModBool: true,
          _elemModNum: 2,
          _elemNoMod: false
        }
      ],
      _modWithVal: 'value',
      _modBool: true,
      _modNum: 2,
      _noMod: false
    })
  );
});

test('with modifiers passed in the modifiers object based on other props', () => {
  testSnapshot(
    bemto('.block', {
      modifiers: {
        _hasTitle: (props) => !!props.title,
        _titleText: (props) => props.title,
        _moreThan9000: (props) => props.power > 9000
      }
    }),
    {
      title: 'hello',
      power: 9042
    }
  );
});

test('with modifiers for helper passed in the modifiers object based on other props', () => {
  testSnapshot(
    bemto('.block', {
      content: [
        { children: true },
        {
          elem: 'Helper',
          modifiers: {
            _hasTitle: props => !!props.title,
            _titleText: props => props.title,
            _moreThan9000: props => props.power > 9000
          }
        }
      ],
    }),
    {
      title: 'hello',
      power: 9042
    }
  );
});

test('with modifiers passed in the modifiers object based on other props (absense)', () => {
  testSnapshot(
    bemto('.block', {
      modifiers: {
        _hasTitle: (props) => !!props.title,
        _titleText: (props) => props.title,
        _moreThan9000: (props) => props.power > 9000
      }
    })
  );
});

test('with modifiers passed in the modifiers object based on other props which are then overriden', () => {
  testSnapshot(
    bemto('.block', {
      modifiers: {
        _hasTitle: (props) => !!props.title,
        _titleText: (props) => props.title,
        _moreThan9000: (props) => props.power > 9000
      }
    }),
    {
      title: 'hello',
      power: 9042,
      _moreThan9000: false,
      _titleText: 'goodbye',
      _hasTitle: false
    }
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

test('should become an anchor based on an attrubute', () => {
  testSnapshot(
    bemto('.myLink'),
    { href: '#x' }
  );
});

test('with a wrapped component', () => {
  const wrappedComponent = bemto('span.wrappedComponent');
  testSnapshot(
    bemto(wrappedComponent, {
      className: 'wrapComponent'
    }),
    {
      className: 'externalClassname',
      _mod: 'value'
    }
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
    { htmlFor: 'myID' }
  );
});

test('should become a label based on an attrubute, even when defined as a span', () => {
  testSnapshot(
    bemto('span.myLabel'),
    { htmlFor: 'myID' }
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

test('should become a reset button based on an attrubute', () => {
  testSnapshot(
    bemto('.myResetButton'),
    { type: 'reset' }
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

test('simple block with a Content wrapper which is a span', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [{
        elem: 'Content',
        tag: 'span',
        content: [{ children: true }]
      }]
    }),
    {},
    'children text'
  );
});

test('simple block with a Content wrapper which is a span and have an extra class', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [{
        elem: 'Content',
        tag: 'span',
        className: 'extraContentClassname',
        content: [{ children: true }]
      }]
    }),
    {},
    'children text'
  );
});

test('simple block with a Content wrapper which is a span and have an extra class via tagString', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [{
        elem: 'Content',
        tagString: 'span.extraContentClassname',
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

test('block with a Helper having a modifier on base level', () => {
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
    { __Helper: { _elemMod: true } },
    'children text'
  );
});

test('block with a Helper having a modifier on base level, should override prev', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          _elemMod: 'old',
          elem: 'Helper'
        },
        {
          children: true
        }
      ]
    }),
    { __Helper: { _elemMod: 'new' } },
    'children text'
  );
});

test('block with a textnode Helper before content (tag: false)', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          tag: false
        },
        {
          elem: 'Content',
          children: true
        }
      ]
    }),
    { __Helper: 'hewwo' },
    'children text'
  );
});

test('block with a textnode Helper before content (tag: "")', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          tag: ''
        },
        {
          elem: 'Content',
          children: true
        }
      ]
    }),
    { __Helper: 'hewwo' },
    'children text'
  );
});

test('block with a textnode Helper before content (omitTag: true)', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          omitTag: true
        },
        {
          elem: 'Content',
          children: true
        }
      ]
    }),
    { __Helper: 'hewwo' },
    'children text'
  );
});

test('block with a textnode Helper before content (omitTag: true at call)', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper'
        },
        {
          elem: 'Content',
          children: true
        }
      ]
    }),
    { __Helper: { omitTag: true, content: 'hewwo' } },
    'children text'
  );
});

test('block with a Helper before content with overridden tag name', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper'
        },
        {
          elem: 'Content',
          children: true
        }
      ]
    }),
    { __Helper: { tag: 'strong', content: 'hewwo' } },
    'children text'
  );
});

test('block with a Helper with function tag name', () => {
  testSnapshot(
    bemto('span.myBlock', {
      content: [
        {
          elem: 'Helper',
          tag: p => p.foo === 'bar' && 'strong' || 'div'
        },
        {
          elem: 'Content',
          children: true
        }
      ]
    }),
    { foo: 'bar' },
    'children text'
  );
});

test('block with a Helper with function tag name (fallback test)', () => {
  testSnapshot(
    bemto('span.myBlock', {
      content: [
        {
          elem: 'Helper',
          tag: p => p.foo === 'bar' && 'strong' || 'div'
        },
        {
          elem: 'Content',
          children: true
        }
      ]
    }),
    {},
    'children text'
  );
});

test('block with a Helper with function tag name, overridden at call', () => {
  testSnapshot(
    bemto('span.myBlock', {
      content: [
        {
          elem: 'Helper'
        },
        {
          elem: 'Content',
          children: true
        }
      ]
    }),
    { foo: 'bar', __Helper: { content: 'lol', tag: p => p.foo === 'bar' && 'em' || 'div' } },
    'children text'
  );
});

test('block with a component for the element tag wrapper', () => {
  testSnapshot(
    bemto('span.myBlock', {
      content: [
        {
          elem: 'Content',
          tag: bemto('a.lol'),
          children: true
        }
      ]
    }),
    {},
    'children text'
  );
});

test('block with optional before & after inside a wrapper which should render just before', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: {
        elem: 'Content',
        content: [
          {
            elem: 'NestedBefore',
            optional: true
          },
          {
            elem: 'NestedAfter',
            optional: true
          },
          {
            children: true
          }
        ]
      }
    }),
    { __NestedBefore: 'what' },
    'children text'
  );
});

test('block with elem that appears only when another elem is defined', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Dependant',
          optional: props => !props.__Helper
        },
        {
          elem: 'Helper',
          optional: true
        },
        {
          children: true
        }
      ]
    }),
    { __Helper: 'hi' },
    'children text'
  );
});

test('block with elem that appears only when another elem is defined (nothing rendered)', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Dependant',
          optional: props => !props.__Helper
        },
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

test('block with elem that appears only when another elem is defined (disabled by false)', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Dependant',
          optional: props => !props.__Helper
        },
        {
          elem: 'Helper',
          optional: true
        },
        {
          children: true
        }
      ]
    }),
    { __Helper: 'hi', __Dependant: false },
    'children text'
  );
});

test('block with elem that appears only when another elem is defined (disabled by null)', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Dependant',
          optional: props => !props.__Helper
        },
        {
          elem: 'Helper',
          optional: true
        },
        {
          children: true
        }
      ]
    }),
    { __Helper: 'hi', __Dependant: null },
    'children text'
  );
});

test('simple block with a Helper item before children with some added props', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          props: {
            title: 'Oh wow',
            hidden: true
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

test('simple block with a Helper item before children with some added props based on parent attrs', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          props: {
            title: (props) => props.title + '!!!',
          }
        },
        {
          children: true
        }
      ]
    }),
    { title: 'Oh wow' },
    'children text'
  );
});

test('with nested bemto block in inline context', () => {
  testSnapshot(
    bemto('span.inlineClass1'),
    {},
    React.createElement(bemto('.class2'))
  );
});

test('with nested bemto block in list context', () => {
  testSnapshot(
    bemto('ul.listClass1'),
    {},
    React.createElement(bemto('.class2'))
  );
});

test('with nested bemto block in select context', () => {
  testSnapshot(
    bemto('select.selectClass1'),
    {},
    React.createElement(bemto('.class2'))
  );
});

test('with multiple nested bemto blocks in inline context', () => {
  testSnapshot(
    bemto('span.inlineClass1'),
    {},
    React.createElement(bemto('.class2'), {}, React.createElement(bemto('.class3')))
  );
});

test('with a more complex nested context', () => {
  const Minimal = bemto();
  const List = bemto('ol');
  const Strong = bemto('strong');

  testSnapshot(
    List,
    {},
    React.createElement(Minimal, {}, [
      'Item',
      React.createElement(Strong, { key: 'a'}, [
        React.createElement(Minimal, { key: 'a'}, 'with '),
        React.createElement(Minimal, { key: 'b'}, 'spans')
      ]),
      React.createElement(Minimal, { key: 'b'}, 'And a new line')
    ])
  );
});

test('simple block with a Helper item before children with inline context', () => {
  testSnapshot(
    bemto('span.myInlineBlock', {
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

test('simple block with a classLess Helper item before children', () => {
  testSnapshot(
    bemto('.myInlineBlock', {
      content: [
        {
          tag: 'div'
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

test('simple block with a nameless item before children', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          className: 'myHelper'
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

test('simple block with a nameless item before children (using props)', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          props: {
            className: 'myHelper'
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

test('simple block with a nameless item before children just by content', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          content: 'hewwo'
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

test('simple block with an item before children just from tagString and complexy structure', () => {
  testSnapshot(
    bemto('.myInlineBlock', {
      content: [
        {
          tagString: 'span.foobar',
          modifiers: { _mod: true },
          content: 'plaintext'
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

test('simple block with a Helper containing an extra elem at inline context', () => {
  testSnapshot(
    bemto('span.myInlineBlock', {
      content: [
        {
          elem: 'Helper',
          content: React.createElement(bemto('.class2'))
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

test('simple block with a Helper containing an array of extra elems at inline context', () => {
  testSnapshot(
    bemto('span.myInlineBlock', {
      content: [
        {
          elem: 'Helper',
          content: [
            React.createElement(bemto('.class2'), { key: 'a' }),
            React.createElement(bemto('.class2'), { key: 'b' })
          ]
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

test('with a nested Helpers containing an extra elem at inner inline context', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'InlineHelper',
          tag: 'span',
          content: {
            elem: 'Helper2',
            content: React.createElement(bemto('.class2'))
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

test('with a nested Helpers containing an extra elem at inner inline context overridden by label', () => {
  testSnapshot(
    bemto('span.myInlineBlock', {
      content: [
        {
          elem: 'LabelHelper',
          tag: 'label',
          content: [
            {
              elem: 'Helper2'
            },
            {
              elem: 'Helper3',
              content: React.createElement(bemto('.class2'))
            }
          ]
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

test('simple block with a Helper item before children with list context', () => {
  testSnapshot(
    bemto('ul.myListBlock', {
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

test('simple block with a Helper item before children with select context', () => {
  testSnapshot(
    bemto('select.mySelectBlock', {
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

test('simple block with a Helper item before children with nested list context', () => {
  testSnapshot(
    bemto('ul.myListBlock', {
      content: [
        {
          elem: 'Helper',
          content: { elem: 'Helper__Item' }
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

test('simple block with a Helper item before children with list nested in normal item', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'myListHelper',
          tag: 'ul',
          content: { elem: 'myListHelper__Item' }
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

test('block with a complex elements structure', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Elem1',
          tag: 'span',
          content: [
            { elem: 'Elem1__Elem1' },
            {
              elem: 'Elem1__Elem2',
              content: [
                { elem: 'Elem1__Elem2__Elem1' },
                { elem: 'Elem1__Elem2__Elem2' }
              ]
            }
          ]
        },
        {
          elem: 'Elem2',
          tag: 'ul',
          content: [
            { elem: 'Elem2__Elem1' },
            {
              elem: 'Elem2__Elem2',
              content: [
                { elem: 'Elem2__Elem2__Elem1' },
                { elem: 'Elem2__Elem2__Elem2' }
              ]
            }
          ]
        },
        {
          elem: 'Elem3',
          tag: 'span',
          content: [
            { elem: 'Elem3__Elem1', tag: 'label' },
            {
              elem: 'Elem3__Elem2',
              props: { href: '#x' },
              content: [
                { elem: 'Elem3__Elem2__Elem1' },
                { elem: 'Elem3__Elem2__Elem2' }
              ]
            }
          ]
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

test('simple block with a Helper item before children using a button tag on parent', () => {
  testSnapshot(
    bemto('button.myBlock', {
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

test('block with passing content to an element through props (passing proper element)', () => {
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
      __Helper: React.createElement(bemto('span.helperContent'))
    },
    'children text'
  );
});

test('block with passing content to an element through props (passing proper element, with a modifier)', () => {
  const MyBlock = bemto('.myBlock', {
    content: [
      {
        elem: 'Helper',
        _test: true
      },
      {
        children: true
      }
    ]
  });
  testSnapshot(
    MyBlock,
    {
      __Helper: React.createElement(bemto('span.helperContent'))
    },
    'children text'
  );
});

test('block with passing content to an element through props (passing proper element, with an overridden modifier)', () => {
  const MyBlock = bemto('.myBlock', {
    content: [
      {
        elem: 'Helper',
        _test: true
      },
      {
        children: true
      }
    ]
  });
  testSnapshot(
    MyBlock,
    {
      __Helper: {
        content: React.createElement(bemto('span.helperContent')),
        modifiers: {
          _test2: true,
          _test: false
        }
      }
    },
    'children text'
  );
});

// FIXME: problem with array and keys =_= so this test gives a warning
/*
test('block with passing content to an element through props (passing a list of proper elements)', () => {
  const MyBlock = bemto('.myBlock', {
    content: [
      {
        elem: 'Helper',
        list: true
      },
      {
        children: true
      }
    ]
  });
  testSnapshot(
    MyBlock,
    {
      __Helper: [
        React.createElement(bemto('span.helperContent1')),
        React.createElement(bemto('span.helperContent2'))
      ]
    },
    'children text'
  );
});
*/

test('block with passing content to an element through props using an object', () => {
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
      __Helper: {
        content: 'Hello, helper!'
      }
    },
    'children text'
  );
});

test('block with passing content to an element through props using an object with props', () => {
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
      __Helper: {
        content: 'Hello, helper!',
        props: {
          _elemMod: true,
          href: '#x'
        }
      }
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

test('simple block with an optional Helper item that should be rendered as it was passed on call but as a boolean', () => {
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
    { __Helper: true },
    'children text'
  );
});

test('simple block with an optional Helper item that should be rendered as it was passed on call but as an contentless object with a modifier', () => {
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
    { __Helper: { props: { _elmo: 'whee'} } },
    'children text'
  );
});

test('simple block with a nested Helper item that should be rendered with diff modifiers on diff elements', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          content: {
            elem: 'Helper2',
            content: {
              elem: 'Helper3'
            }
          }
        },
        {
          children: true
        }
      ]
    }),
    {
      __Helper: { props: { _a1: true} },
      __Helper2: { props: { _a2: true} },
      __Helper3: { props: { _a3: true} }
    },
    'children text'
  );
});

test('simple block with a nested Helper item that should have proper content rendered', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          content: {
            elem: 'Helper2',
            content: {
              elem: 'Helper3'
            }
          }
        },
        {
          children: true
        }
      ]
    }),
    {
      __Helper: "not rendered",
      __Helper3: "rendered"
    },
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

test('block with an array as the content of an element', () => {
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
    { __Helper: ['lol', 'whatever'] },
    'children text'
  );
});

test('block with an array as the content of an element, but as a list', () => {
  testSnapshot(
    bemto('.myList', {
      content: [
        {
          elem: 'Item',
          list: true
        },
        {
          children: true
        }
      ]
    }),
    { __Item: ['lol', 'whatever'] },
    'children text'
  );
});

test('block with a more complex list system inside', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'List',
          tag: 'ul',
          optional: true,
          content: {
            elem: 'Item',
            tag: 'li',
            list: true
          }
        },
        {
          children: true
        }
      ]
    }),
    { __List: ['lol', 'whatever'] },
    'children text'
  );
});

test('block with a more complex list system inside, now with props O_O', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'List',
          tag: 'ul',
          optional: true,
          content: {
            elem: 'Item',
            tag: 'li',
            list: true
          }
        },
        {
          children: true
        }
      ]
    }),
    {
      __List: [
        { content: 'lol', props: { _mod: true } },
        { content: 'whatever' }
      ]
    },
    'children text'
  );
});

test('block that passes most of its props to one of its children', () => {
  testSnapshot(
    bemto('.myBlock', {
      acceptProps: ['title'],
      content: [
        {
          elem: 'Helper',
          acceptProps: ['id']
        },
        {
          elem: 'Controller',
          acceptProps: {
            except: ['id']
          },
          children: true
        }
      ]
    }),
    {
      href: '#x',
      disabled: true,
      id: 'LolID',
      title: 'my title',
      _mod: true
    },
    'hello'
  );
});

test('block that passes all its props to one of its children', () => {
  testSnapshot(
    bemto('.myBlock', {
      acceptProps: [],
      content: [
        {
          elem: 'Helper'
        },
        {
          elem: 'Controller',
          acceptProps: true,
          children: true
        }
      ]
    }),
    {
      href: '#x',
      disabled: true,
      id: 'LolID',
      title: 'my title',
      _mod: true
    },
    'hello'
  );
});


test('block with custom state constructor', () => {
  testSnapshot(
    bemto('.myBlock', {
      initialState: props => ({
        myStateItem: props.bar === 'baz' && true
      }),
      props: {
        href: (props, state) => state.myStateItem ? '#yep' : false
      },
      _foo: (props, state) => state.myStateItem ? true : false
    }),
    {
      bar: 'baz'
    },
    'hello'
  );
});

test('block with custom state constructor (faulty)', () => {
  testSnapshot(
    bemto('.myBlock', {
      initialState: props => ({
        myStateItem: props.bar === 'baz' && true
      }),
      props: {
        href: (props, state) => state.myStateItem ? '#yep' : false
      },
      _foo: (props, state) => state.myStateItem ? true : false
    }),
    {
    },
    'hello'
  );
});

test('blacklist for props', () => {
  testSnapshot(
    bemto({
      acceptProps: { except: 'foo' }
    }),
    { foo: 'bar', title: 'ok ok ok' }
  );
});

test('merging props for element', () => {
  testSnapshot(
    bemto({
      content: {
        elem: 'Content',
        props: {
          foo: 'should stay',
          bar: 'should not stay'
        },
        children: true
      }
    }),
    { __Content: { props: { bar: 'overridden', baz: 'new prop' } } },
    'some content'
  );
});

test('merging props for a component element', () => {
  testSnapshot(
    bemto({
      content: {
        elem: 'Content',
        tag: bemto({ props: { compProp: 'should stay yay?', compProp2: 'should not stay' } }),
        props: {
          foo: 'should stay',
          bar: 'should not stay',
          compProp2: 'new compProp2 value, would not stay'
        },
        children: true
      }
    }),
    { __Content: { props: { bar: 'overridden', baz: 'new prop', compProp2: 'final compProp2 value' } } },
    'some content'
  );
});

test('handling content of an element as a component', () => {
  testSnapshot(
    bemto({
      content: [
        {
          elem: 'Helper',
          tag: bemto('em.foo'),
          props: {
            title: p => p.__Helper
          },
          content: []
        },
        {
          elem: 'Content',
          children: true
        }
      ]
    }),
    { __Helper: 'Should go to title' },
    'some content'
  );
});

test('content as function', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          content: () => 'lol'
        },
        {
          children: true
        }
      ]
    }),
    {},
    'hello there'
  );
});

test('content as function based on prop', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          content: props => props._mod ? 'yep' : 'nope'
        },
        {
          children: true
        }
      ]
    }),
    {
      _mod: true
    },
    'hello there'
  );
});

test('content as function based on prop, faulty', () => {
  testSnapshot(
    bemto('.myBlock', {
      content: [
        {
          elem: 'Helper',
          content: props => props._mod ? 'yep' : 'nope'
        },
        {
          children: true
        }
      ]
    }),
    {
    },
    'hello there'
  );
});

test('content as function based on prop, from block prop', () => {
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
    {
      _mod: true,
      __Helper: {
        content: props => props._mod ? 'yep' : 'nope'
      }
    },
    'hello there'
  );
});

test('passing a bemto block to an element in props', () => {
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
    {
      __Helper: bemto('.new')
    },
    'hello there'
  );
});


test('optionality of an element based on state', () => {
  testSnapshot(
    bemto('.myBlock', {
      initialState: { foo: true },
      content: [
        {
          optional: (props, state) => !state.foo,
          elem: 'Helper',
          content: 'helper'
        },
        {
          children: true
        }
      ]
    }),
    {
    },
    'hello there'
  );
});
