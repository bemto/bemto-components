const React = require('react');
const PropTypes = require('prop-types');

// The code below is a mess, I'm sorry. But it is a working mess at least!
// If you'd want to improve anything: PRs are welcome!
// And we have tests, don't be afraid to refactor anything.

const DefaultPropTypes = {
  children: PropTypes.node,
  elem: PropTypes.oneOfType([PropTypes.node, PropTypes.object])
};

const modifyClassNames = function(classNames, modifiers) {
  return (classNames + ' ' + classNames.trim().split(/\s+/).map(className => modifiers.map(modifier => className + modifier).join(' ')).join(' ')).trim();
};

const createElemClassNames = function(classNames, elemNames) {
  return (classNames.trim().split(/\s+/).map(className => elemNames.map(elemName => className + '__' + elemName).join(' ')).join(' ')).trim();
};

const renderModifier = function(key, value, props, blockProps) {
  const type = typeof value;
  if (type === 'string' || type === 'number') {
    return `${key}_${value}`;
  }
  if (type === 'function') {
    modValue = value(props, blockProps);
    if (modValue) {
      return renderModifier(key, modValue, props, blockProps);
    } else {
      return;
    }
  }
  if (value) {
    return key;
  }
}

const gatherModifiers = function(props, modifiersObj, blockProps) {
  if (!props) return [];

  const propKeys = Object.keys(props);
  const modifiers = propKeys.filter(prop => props[prop] && prop[0] === '_' && prop[1] !== '_').map(key => renderModifier(key, props[key], props, blockProps));
  if (modifiersObj) {
    for (var key in modifiersObj) {
      if (propKeys.indexOf(key) === -1) {
        const modValue = renderModifier(key, modifiersObj[key], props, blockProps);
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
        if (props.type === 'button' || props.type === 'submit' || props.type === 'reset') return 'button';
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
  const options = additionalOptions || typeof tagString === 'object' && tagString || {};
  const parsedTagString = parseTagString(options.tagString || typeof tagString === 'string' && tagString || '');
  options.type = typeof tagString === 'function' ? 'wrapper' : 'block';
  options.tag = options.tag || (typeof tagString === 'function' && tagString) || parsedTagString.tag;
  options.props = options.props || parsedTagString.props || {};
  options.props.className = [options.props.className, options.className, parsedTagString.className].filter(className => className).join(' ');
  options.props.id = options.props.id || options.id || parsedTagString.id;

  // Handle props as functions
  for (var key in options.props) {
    if (typeof options.props[key] === 'function') {
      options.props[key] = {
        bemtoCalculated: options.props[key]
      }
    }
  }

  return {
    tag: options.tag,
    type: options.type,
    props: options.props,
    content: options.content,
    modifiers: options.modifiers
  };
};

const normalizeClassNames = function(classNames) {
  const classNamesArray = classNames.split(/\s+/);
  return classNamesArray.filter((item, index) => classNamesArray.indexOf(item) === index).join(' ');
};

const compileProps = function(fromProps, toProps, tag) {
  if (fromProps) {
    for (var key in fromProps) {
      if (!(typeof tag === 'string' && key[0] === '_') && key !== 'children' && key !== 'className') {
        toProps[key] = fromProps[key];
      }
    }
    toProps.className = (toProps.className || '') +  ' ' + (fromProps.className || '');
  }
  if (toProps) {
    for (var key in toProps) {
      if (toProps[key] && toProps[key].bemtoCalculated) {
        const calculatedValue = toProps[key].bemtoCalculated(toProps);
        if (calculatedValue !== undefined && calculatedValue !== false && calculatedValue !== null) {
          toProps[key] = calculatedValue;
        } else {
          delete toProps[key];
        }
      }
    }
  }
};

// Most of the props-handling stuff happens there
const gatherOptions = function(outerOptions, baseOptions) {
  // Preparing all the objects
  const options = Object.assign({}, outerOptions);
  const originalProps = Object.assign({}, options.props);
  const elem = baseOptions.tagProps.__BemtoElem;
  // Starting to initiate base props
  const fullProps = elem ? elem.props : baseOptions.tagProps;
  const finalOptions =
    elem
    ? collectOptions(elem.tagString, elem.parsedTagString)
    : Object.assign({}, options);
  finalOptions.props = Object.assign({}, finalOptions && finalOptions.props);
  finalOptions.modifiers = elem ? elem.modifiers : finalOptions.modifiers;
  finalOptions.tagContext = elem ? elem.tagContext || finalOptions.tagContext || 'block' : baseOptions.tagContext;

  // Use just the props that don't start with underscore for the final version
  compileProps(fullProps, finalOptions.props, finalOptions.tag)

  if (elem && elem.name) {
    // Adding Element parts to classNames
    finalOptions.props.className += ' ' + createElemClassNames(((baseOptions.tagProps.className || '') + ' ' + originalProps.className), [elem.name]);
  }
  if (!elem) {
    // Otherwise, add the block's className
    finalOptions.props.className += ' ' + originalProps.className;
  }

  // Applying modifiers
  finalOptions.props.className = modifyClassNames(
    finalOptions.props.className,
    gatherModifiers(finalOptions.type !== 'wrapper' && fullProps, finalOptions.modifiers, baseOptions.tagProps));

  // Normalizing classNames (removing duplicates etc.)
  finalOptions.props.className = normalizeClassNames(finalOptions.props.className);

  // Handling id (hmm, should be done somehow better?)
  if (originalProps.id && !finalOptions.props.id) {
    finalOptions.props.id = originalProps.id;
  }
  if (!finalOptions.props.id) {
    delete finalOptions.props.id;
  }
  if (!finalOptions.props.className) {
    delete finalOptions.props.className;
  }

  return {
    finalTag: selectTag(finalOptions.props, finalOptions.tag, finalOptions.tagContext),
    finalProps: finalOptions.props,
    children: baseOptions.children
  };
}

const SELF_CLOSING_TAGS = ['hr', 'br', 'wbr', 'source', 'img', 'input'];
const INLINE_TAGS = ['a', 'abbr', 'acronym', 'b', 'code', 'em', 'font', 'i', 'ins', 'kbd', 'map', 'pre', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'textarea', 'time'];
const INLINE_CONTEXT_TAGS = ['label', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const LIST_CONTEXT_TAGS = ['ul', 'ol'];
const OPTIONS_CONTEXT_TAGS = ['select', 'datalist'];
// TODO: add plaintext context?

const getContextFromTag = function(tag, context) {
  if (tag === 'div') {
    return context === 'inline' ? 'inline' : 'block';
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
  return 'block';
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
    // TODO: refactor this lol, almost any object could go there!
    if (elemName || item.tag || item.tagString || item.className || item.props || item.content) {
      const optional = typeof item.optional === 'function' ? item.optional(props) : item.optional;
      if (props['__' + elemName] === false || props['__' + elemName] === null || optional && !elemProp) {
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
          parsedTagString: parsedTagString,
          modifiers: item.modifiers
        }
      }, props);

      const content = (!(typeof item.content === 'string' && elemProp) && item.content) || (item.children && { children: true }) || { type: 'elemContent', name: elemName };

      const parents = item.parents && item.parents.slice(0) || [];
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
      const content = !this.props.__BemtoElem && blockOptions.content;
      const children = content
        ? applyToAll(content, unfoldChildren(this.props, generateTag), {
          tagContext: getContextFromTag(blockOptions.tag)
        })
        : this.props.children;
      return generateTag(this.props, children);
    }
  };

  bemtoFactory.propTypes = {
    children: DefaultPropTypes.children
  };

  bemtoFactory.childContextTypes = {
    bemtoTagContext: PropTypes.string
  };
  bemtoFactory.contextTypes = {
    bemtoTagContext: PropTypes.string
  };
  bemtoFactory.elem = (elemName, tagString, options) => {
    return bemto.elem(bemtoFactory, elemName, tagString || '', options);
  };

  bemtoFactory.addElem = (elemName, tagString, options) => {
    bemtoFactory[elemName] = bemtoFactory.elem(elemName, tagString, options);
    return bemtoFactory;
  };

  return bemtoFactory;
};

bemto.elem = function(block, elemName, tagString, options) {
  const parsedTagString = parseTagString(tagString);
  return class bemtoTag extends React.Component {
    render(){
      const props = {};
      props.__BemtoElem = {
        name: elemName,
        props: this.props,
        parsedTagString: parsedTagString,
        options: options
      };
      return React.createElement(block, props, this.props.children);
    }
  }
};

bemto.DefaultPropTypes = DefaultPropTypes;

module.exports = bemto;
