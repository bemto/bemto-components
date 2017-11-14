const React = require('react');
const PropTypes = require('prop-types');

// The code below is a mess, I'm sorry. But it is a working mess at least!
// If you'd want to improve anything: PRs are welcome!
// And we have tests, don't be afraid to refactor anything.

const modifyClassNames = function(classNames, modifiers) {
  return (classNames + ' ' + classNames.trim().split(/\s+/).map(className => modifiers.map(modifier => className + modifier).join(' ')).join(' ')).trim();
};

const createElemClassNames = function(classNames, elemNames) {
  return (classNames.trim().split(/\s+/).map(className => elemNames.map(elemName => className + '__' + elemName).join(' ')).join(' ')).trim();
};

const renderModifier = function(key, value, props) {
  const type = typeof value;
  if (type === 'string' || type === 'number') {
    return `${key}_${value}`;
  }
  if (type === 'function') {
    modValue = value(props);
    if (modValue) {
      return renderModifier(key, modValue, props);
    } else {
      return;
    }
  }
  if (value) {
    return key;
  }
}

const gatherModifiers = function(props, modifiersObj) {
  const propKeys = Object.keys(props);
  const modifiers = propKeys.filter(prop => props[prop] && prop[0] === '_' && prop[1] !== '_').map(key => renderModifier(key, props[key], props));
  if (modifiersObj) {
    for (var key in modifiersObj) {
      if (propKeys.indexOf(key) === -1) {
        const modValue = renderModifier(key, modifiersObj[key], props);
        if (modValue) {
          modifiers.push(modValue);
        }
      }
    }
  }
  return modifiers;
};

// Basic parsing of a tagString
const parseTagString = function(tagString) {
  const result = {};
  const parsedTagString = typeof tagString === 'string' && tagString.match(/^([^\.\#]*)((?:[\.\#][^\.\#]+)*)$/);
  result.tag = parsedTagString[1] || (typeof tagString === 'string' ? 'div' : tagString);
  result.className = (parsedTagString[2] && parsedTagString[2].replace(/\#[^\#\.]+/g, id => result.id ? '' : (result.id = id.replace('#', '')) && '') || '').replace(/\./g, ' ');
  return result;
};

// Base for polymorphic tag names
const selectTag = function(props, defaultTag, context) {
  if (typeof defaultTag === 'string') {
    if (props.href) return 'a';
    if (defaultTag === 'div' || defaultTag === 'span') {
      if (props.for) return 'label';
      if (props.src) return 'img';
      if (props.type) {
        if (props.type === 'button' || props.type === 'submit') return 'button';
        return 'input';
      }
      if (context) {
        if (context === 'list') return 'li';
        if (context === 'optionlist') return 'option';
      }
    }
    if (defaultTag === 'div') {
      if (context && context === 'inline') return 'span';
    }
  }
  return defaultTag;
};

const applyToAll = function(content, func, modifier) {
  if (React.isValidElement(content)) {
    if (modifier) {
      return {
        content: content,
        type: 'reactContent',
        modifier: modifier
      };
    }
    return content;
  }

  const isArray = (content && content.constructor === Array);
  if (modifier) {
    const modifyContent = function(content) {
      for (var key in modifier) {
        content[key] = modifier[key];
      }
      return content;
    }
    const modifiedContent = applyToAll(content, modifyContent);
    return isArray ? modifiedContent.map(func) : func(modifiedContent);
  }

  return isArray ? content.map(func) : func(content);
};

// Getting the options from the flexible arguments
// Can accept any of [tagString], [additionalOptions] or [tagString, additionalOptions]
const collectOptions = function(tagString, additionalOptions) {
  const options = additionalOptions || typeof tagString !== 'string' && tagString || {};
  options.type = 'block';
  options.tagString = options.tagString || typeof tagString === 'string' && tagString;
  options.parsedTagString = parseTagString(options.tagString || '');
  options.tag = options.tag || options.parsedTagString.tag;
  options.props = options.props || options.parsedTagString.props || {};
  options.props.className = (options.props.className || options.className || '')+ ' ' + options.parsedTagString.className
  options.props.id = options.props.id || options.id || options.parsedTagString.id;
  return options;
};

// Most of the props-handling stuff happens there
// TODO: refactor this to a few specialized funcions.
const gatherOptions = function(outerOptions, baseOptions) {
  // Clone & merge options from arguments
  const options = Object.assign(baseOptions, outerOptions);
  options.props = Object.assign({}, outerOptions.props);

  // Modify options if we're at elem scope
  options.elem = options.tagProps.__BemtoElem;
  if (options.elem) {
    options.type = 'elem';
    const elemParsedTagString = options.elem.parsedTagString || parseTagString(options.elem.tagString || '');
    if (elemParsedTagString.tag) {
      options.tag = elemParsedTagString.tag;
    }
    if (elemParsedTagString.id) {
      options.props.id = elemParsedTagString.id;
    }
    options.props.className = elemParsedTagString.className || '';
  }

  options.finalProps = {};
  for (var key in (options.elem && (options.elem.props || {}) || options.tagProps)) {
    if (!(typeof options.tag === 'string' && key[0] === '_') && key !== 'children') {
      options.finalProps[key] = (options.elem && (options.elem.props || {}) || options.tagProps)[key];
    }
  }

  if (options.props.id && !options.finalProps.id) {
    options.finalProps.id = options.props.id;
  }

  if (options.elem) {
    options.finalProps.className = (options.finalProps.className || '') + ' ' + createElemClassNames(((options.tagProps.className || '') + ' ' + options.parsedTagString.className), [options.elem.name]);
    options.tagContext = options.elem.tagContext || options.tagContext || 'block';
  }

  options.finalProps.className = modifyClassNames((options.finalProps.className || '') + ' ' + options.props.className, gatherModifiers(options.elem && (options.elem.props || {}) || options.tagProps, options.modifiers));

  // FIXME: replace with joining className_s_ (which don't exist yet)
  options.finalProps.className = options.finalProps.className.replace(/\s{2,}/g, ' ');

  options.finalTag = selectTag(options.finalProps, options.tag, options.tagContext);

  return options;
}

const SELF_CLOSING_TAGS = ['hr', 'br', 'wbr', 'source', 'img', 'input'];
const INLINE_TAGS = ['a', 'abbr', 'acronym', 'b', 'code', 'em', 'font', 'i', 'ins', 'kbd', 'map', 'pre', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'textarea', 'time'];
const INLINE_CONTEXT_TAGS = ['label', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const LIST_CONTEXT_TAGS = ['ul', 'ol'];
const OPTIONS_CONTEXT_TAGS = ['select', 'datalist'];
// TODO: add plaintext context?

const getContextFromTag = function(tag, context) {
  if (tag === 'div') {
    return context || 'block';
  }
  if (typeof tag !== 'string') {
    return;
  }
  if (INLINE_TAGS.indexOf(tag) !== -1 || INLINE_CONTEXT_TAGS.indexOf(tag) !== -1) {
    return 'inline';
  }
  if (LIST_CONTEXT_TAGS.indexOf(tag) !== -1) {
    return 'list';
  }
  if (OPTIONS_CONTEXT_TAGS.indexOf(tag) !== -1) {
    return 'optionlist';
  }
  if (SELF_CLOSING_TAGS.indexOf(tag) !== -1) {
    return 'empty';
  }
  return context || 'block';
};

// Recursive unfolder of children for the object to elements generator
const unfoldChildren = function(props, generator) {
  const unfoldFunction = function(item, index, modifier) {
    if (React.isValidElement(item)) {
      return item;
    }
    // Not sure if we need it there or if won't be ever used?
    if (item.type && item.type === 'reactContent') {
      return item.content;
    }
    const elemName = item.name || item.elem;
    let elemProp = props['__' + elemName] || item.parents && props['__' + item.parents.filter(name => props['__' + name]).reverse()[0]];
    if (typeof item === 'string') {
      return item;
    }
    // Totally not sure why we need to do this
    // The code is in need of a deep refactoring T_T
    if (elemProp && React.isValidElement(elemProp)) {
      elemProp = { content: elemProp }
    }
    if (item.type === 'elemContent') {
      if (elemProp) {
        if (typeof elemProp === 'string' || elemProp && elemProp.constructor === Array) {
          return elemProp;
        } else {
          return elemProp.content;
        }
      }
      return;
    }
    if (elemName) {
      if (item.optional && !elemProp) {
        return;
      }
      const parsedTagString = parseTagString(item.tagString);
      parsedTagString.tag = item.tag || parsedTagString.tag || 'div';
      if (item.className) { parsedTagString.className += ' ' + item.className; }

      const myPropsProps = elemProp && elemProp.props || item.props || {};
      if (elemProp && elemProp.props) {
        for (var key in elemProp.props) {
          myPropsProps[key] = elemProp.props[key];
        }
      }
      myPropsProps.key = index;
      const myProps = Object.assign({
        __BemtoElem: {
          tagContext: item.tagContext,
          name: elemName,
          props: myPropsProps,
          parsedTagString: parsedTagString
        }
      }, props);

      const content = (!(typeof item.content === 'string' && elemProp) && item.content) || (item.children && { children: true }) || { type: 'elemContent', name: elemName };

      const parents = item.parents || [];
      parents.push(elemName);
      const contentModifier = {
        parents: parents
      };
      contentModifier.tagContext = getContextFromTag(selectTag(myPropsProps, parsedTagString.tag, item.tagContext))
      if (item.list && elemProp && elemProp.constructor === Array) {
        const key_prefix = myPropsProps.key + '_';
        return elemProp.map((item, index) => {
          if (typeof item !== 'string') {
            // We need a proper deep clone there lol
            const itemProps = Object.assign({}, myProps);
            const itemBemtoElem = {};
            for (var key in itemProps.__BemtoElem) {
              itemBemtoElem[key] = itemProps.__BemtoElem[key];
            }
            itemProps.__BemtoElem = itemBemtoElem;
            const itemElemProps = item.props || {};
            for (var key in itemBemtoElem.props) {
              itemElemProps[key] = itemBemtoElem.props[key];
            }
            itemElemProps.key = key_prefix + index;
            itemProps.__BemtoElem.props = itemElemProps
            return generator(itemProps, item.content || item)
          } else {
            myPropsProps.key = key_prefix + index;
            return generator(myProps, unfoldFunction(item))
          }
        });
      }
      return generator(myProps, applyToAll(content, unfoldFunction, contentModifier));
    } else if (item.children || item.type === 'children') {
      return props.children;
    };
  }
  return unfoldFunction;
};

// Provider of bemto tag context for using when there are stuff inbetween that won't set it
class BemtoContextProvider extends React.Component {
  getChildContext() {
   return { bemtoTagContext: this.props.context }
  }
  render() {
    return this.props.children;
  }
}
BemtoContextProvider.propTypes = {
  context: PropTypes.string.isRequired,
};
BemtoContextProvider.childContextTypes = {
  bemtoTagContext: PropTypes.string.isRequired
};

// Our main factory
const bemto = function(tagString, additionalOptions) {
  const blockOptions = collectOptions(tagString, additionalOptions);
  const bemtoFactory = class bemtoTag extends React.Component {
    constructor(props, context) {
      super(props);
      this.state = {
        bemtoTagContext: getContextFromTag(blockOptions.tag, context && context.bemtoTagContext)
      };
    }
    getChildContext() {
      return { bemtoTagContext: this.state.bemtoTagContext }
    }
    render() {
      const generateTag = (props, children) => {
        const isReactElem = children && children.type && children.type === 'reactContent';
        const options = gatherOptions(blockOptions, {
          tagProps: props,
          children: isReactElem ? React.createElement(BemtoContextProvider, { context: children.modifier.tagContext }, children.content) : children,
          tagContext: this.context.bemtoTagContext
        })
        return React.createElement(options.finalTag, options.finalProps, options.children);
      };

      const children = blockOptions.content
        ? applyToAll(blockOptions.content, unfoldChildren(this.props, generateTag), {
          tagContext: getContextFromTag(blockOptions.tag)
        })
        : this.props.children;
      return generateTag(this.props, children);
    }
  };

  bemtoFactory.childContextTypes = {
    bemtoTagContext: PropTypes.string
  };
  bemtoFactory.contextTypes = {
    bemtoTagContext: PropTypes.string
  };
  bemtoFactory.elem = (elemName, tagString) => {
    return bemto.elem(bemtoFactory, elemName, tagString || '');
  };

  bemtoFactory.addElem = (elemName, tagString) => {
    bemtoFactory[elemName] = bemtoFactory.elem(elemName, tagString);
    return bemtoFactory;
  };

  return bemtoFactory;
};

bemto.elem = function(block, elemName, tagString) {
  const parsedTagString = parseTagString(tagString);
  return class bemtoTag extends React.Component {
    render(){
      const props = {};
      props.__BemtoElem = {
        name: elemName,
        props: this.props,
        parsedTagString: parsedTagString
      };
      return React.createElement(block, props, this.props.children);
    }
  }
};

module.exports = bemto;
