const React = require('react');
const PropTypes = require('prop-types');
const cloneDeep = require('lodash.clonedeep');

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

const renderModifier = function(key, value, blockProps, component) {
  const type = typeof value;
  if (type === 'function' && React.Component.isPrototypeOf(value)) {
    return '';
  }
  if (type === 'string' || type === 'number') {
    return key + '_' + value;
  }
  if (type === 'function') {
    const modValue = value(blockProps, component.state, component);
    if (modValue) {
      return renderModifier(key, modValue, blockProps, component);
    } else {
      return '';
    }
  }
  if (value) {
    return key;
  }
}

const gatherModifiers = function(props, modifiersObj, blockProps, component) {
  if (!props) return [];

  const propKeys = Object.keys(props);
  const modifiers = propKeys.filter(prop => props[prop] && prop[0] === '_' && prop[1] !== '_').map(key => renderModifier(key, props[key], blockProps, component));
  if (modifiersObj) {
    for (var key in modifiersObj) {
      if (propKeys.indexOf(key) === -1) {
        const modValue = renderModifier(key, modifiersObj[key], blockProps, component);
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

const isTagFunction = tagOrFunction => typeof tagOrFunction === 'function' && !React.Component.isPrototypeOf(tagOrFunction) && !(tagOrFunction.prototype && tagOrFunction.prototype.isReactComponent) && !tagOrFunction.styledComponentId;

// Base for polymorphic tag names
const selectTag = function(props, defaultTag, context, blockProps, component) {
  const tag = isTagFunction(defaultTag) ? defaultTag(blockProps, component.state, component) : defaultTag;
  if (blockProps && blockProps.__is) {
    if (isTagFunction(blockProps.__is)) {
      return blockProps.__is(blockProps, component.state, component);
    }
    return blockProps.__is;
  };
  if (typeof tag === 'string') {
    if (props.href) return 'a';
    if (tag === 'div' || tag === 'span') {
      if (props.htmlFor) return 'label';
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
    if (tag === 'div') {
      if (context && context === 'inline') return 'span';
    }
  }
  return tag;
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
  const options = cloneDeep(additionalOptions || typeof tagString === 'object' && tagString || {});
  const parsedTagString = parseTagString(options.tagString || typeof tagString === 'string' && tagString || '');
  options.type = (typeof tagString === 'function' && React.Component.isPrototypeOf(tagString)) ? 'wrapper' : 'block';
  options.tag = options.tag || (typeof tagString === 'function' && tagString) || parsedTagString.tag;
  options.props = options.props || {};
  options.props.className = [options.props.className, options.className, parsedTagString.className].filter(className => className).join(' ');
  options.props.id = options.props.id || options.id || parsedTagString.id;
  options.modifiers = options.modifiers || {};

  // Handle props as functions
  for (var key in options.props) {
    if (typeof options.props[key] === 'function') {
      options.props[key] = {
        bemtoCalculated: options.props[key]
      }
    }
  }

  // Move the modifiers from the top level to the modifiers object
  for (var key in options) {
    if (key[0] === '_' && key[1] !== '_') {
      options.modifiers[key] = options[key];
    }
  }

  return {
    tag: options.tag,
    type: options.type,
    props: options.props,
    initialState: options.initialState,
    lifecycle: options.lifecycle,
    acceptProps: options.acceptProps,
    content: options.content,
    modifiers: options.modifiers
  };
};

const normalizeClassNames = function(classNames) {
  const classNamesArray = classNames.split(/\s+/);
  return classNamesArray.filter((item, index) => classNamesArray.indexOf(item) === index).join(' ');
};

const expandAccept = function(props, acceptProps) {
  if (!acceptProps) return props;
  let accept = acceptProps;
  if (accept.constructor !== Array) {
    if (typeof accept === 'string') {
      accept = [accept];
    } else {
      accept = props
        .filter(prop => {
          if (accept.except) {
            if (typeof accept.except === 'string') {
              if (prop === accept.except) return false;
            } else {
              if (accept.except.indexOf(prop) !== -1) return false;
            }
          } else if (accept.accept) {
            if (typeof accept.accept === 'string') {
              if (prop === accept.accept) return true;
            } else {
              if (accept.accept.indexOf(prop) !== -1) return true;
            }
            return false;
          }
          return true;
        });
    }
  }
  return accept;
};

const compileProps = function(fromProps, toProps, tag, tagProps, acceptProps, component) {
  const isElem = tagProps.__BemtoElem;
  const blockAccept = expandAccept(Object.keys(tagProps), acceptProps);
  const elemAccept = isElem && isElem.acceptProps && expandAccept(
    expandAccept(Object.keys(tagProps), isElem.acceptProps),
    { except: blockAccept }
  );
  const isNotComponent = !(typeof tag === 'function' && React.Component.isPrototypeOf(tag));
  if (fromProps) {
    for (var key in fromProps) {
      if (!(isNotComponent && key[0] === '_') && key !== 'children' && key !== 'className') {
        if (!(!isElem && blockAccept && blockAccept.indexOf(key) === -1)) {
          toProps[key] = fromProps[key];
        }
      }
    }
    toProps.className = (toProps.className || '') +  ' ' + (fromProps.className || '');
  }
  elemAccept && elemAccept.map(key => {
    if (tagProps[key] && !(isNotComponent && key[0] === '_') && key !== 'children' && key !== 'className') {
      toProps[key] = tagProps[key];
    }
  })
  if (toProps) {
    for (var key in toProps) {
      if (toProps[key] && toProps[key].bemtoCalculated) {
        const calculatedValue = toProps[key].bemtoCalculated(tagProps, component.state, component);
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
  finalOptions.omitTag = elem ? elem.omitTag : false;

  // Use just the props that don't start with underscore for the final version
  compileProps(fullProps, finalOptions.props, finalOptions.tag, baseOptions.tagProps, outerOptions.acceptProps, baseOptions.component)

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
    gatherModifiers(finalOptions.type !== 'wrapper' && fullProps, finalOptions.modifiers, baseOptions.tagProps, baseOptions.component));

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
    omitTag: finalOptions.omitTag,
    createRef: finalOptions.createRef,
    finalTag: selectTag(finalOptions.props, finalOptions.tag, finalOptions.tagContext, baseOptions.tagProps, baseOptions.component),
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
const unfoldChildren = function(props, component, generator) {
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

    if ((elemProp && (elemProp.tag === false || elemProp.tag === '')) || !(elemProp && elemProp.tag) && (item.tag === false || item.tag === '')) {
      item.omitTag = true;
    }
    if (item.type === 'elemContent') {
      if (elemProp) {
        if (typeof elemProp === 'string' || elemProp && elemProp.constructor === Array) {
          return elemProp;
        } else {
          if (isTagFunction(elemProp.content)) {
            return elemProp.content(props, component.state, component);
          } else {
            if (React.Component.isPrototypeOf(elemProp)) {
              return React.createElement(elemProp, {});
            } else {
              return elemProp.content;
            }
          }
        }
      }
      return;
    }
    // TODO: refactor this lol, almost any object could go there!
    if (elemName || item.omitTag || item.tag || item.tagString || item.className || item.props || item.content) {
      const optional = typeof item.optional === 'function' ? item.optional(props) : item.optional;
      if (props['__' + elemName] === false || props['__' + elemName] === null || optional && !elemProp) {
        return;
      }
      // TODO: we don't really need “parsedTagString”, need different naming
      const parsedTagString = parseTagString(item.tagString);
      parsedTagString.tag = elemProp && elemProp.tag || item.tag || parsedTagString.tag || 'div';

      if (isTagFunction(parsedTagString.tag)) {
        parsedTagString.tag = parsedTagString.tag(props);
        if (parsedTagString.tag === false || parsedTagString.tag === '') {
          item.omitTag = true;
        }
      }

      if (item.className) { parsedTagString.className += ' ' + item.className; }

      const myPropsProps = cloneDeep(item.props) || {};
      // Handle props as functions
      for (var key in myPropsProps) {
        if (typeof myPropsProps[key] === 'function') {
          myPropsProps[key] = {
            bemtoCalculated: myPropsProps[key]
          }
        }
      }

      if (elemProp && elemProp.props) {
        for (var key in elemProp.props) {
          if (elemProp.calculatedProps && typeof elemProp.props[key] === 'function') {
            myPropsProps[key] = {
              bemtoCalculated: elemProp.props[key]
            };
          } else {
            myPropsProps[key] = elemProp.props[key];
          }
        }
      }

      if (item.createRef) {
        myPropsProps.ref = component.setElemRef(elemName);
      }

      if (index !== undefined) {
        myPropsProps.key = index;
      }

      // Collecting options from everywhere
      const optsItem = collectOptions(item.tagString || '', item);
      const optsElem = typeof elemProp === 'object' && collectOptions('', cloneDeep(elemProp)) || {};

      const elemOptions = Object.assign(
        {},
        optsItem,
        optsElem
      );

      elemOptions.modifiers = Object.assign(
        {},
        optsItem.modifiers,
        optsElem.modifiers
      );

      const myProps = Object.assign({
        __BemtoElem: {
          tagContext: item.tagContext,
          omitTag: item.omitTag || (elemProp && elemProp.omitTag),
          createRef: item.createRef,
          name: elemName,
          props: myPropsProps,
          acceptProps: item.acceptProps,
          calculatedProps: item.calculatedProps || (elemProp && elemProp.calculatedProps),
          parsedTagString: parsedTagString,
          modifiers: elemOptions.modifiers
        }
      }, props);

      const _content = (!(typeof item.content === 'string' && elemProp) && item.content) || (item.children && { children: true }) || { type: 'elemContent', name: elemName };
      const content = isTagFunction(_content) ? _content(props, component.state, component) : _content;
      const parents = item.parents && item.parents.slice(0) || [];
      parents.push(elemName);
      const contentModifier = {
        parents: parents
      };
      contentModifier.tagContext = getContextFromTag(selectTag(myPropsProps, parsedTagString.tag, item.tagContext, {}, component))
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
  const bemtoFactory = class Bemto extends React.Component {
    constructor(props, context) {
      super(props);
      let initialState = {};
      if (blockOptions.initialState) {
        if (typeof blockOptions.initialState === 'function') {
          initialState = blockOptions.initialState(props);
        } else {
          initialState = blockOptions.initialState;
        }
      }
      initialState.bemtoTagContext = getContextFromTag(blockOptions.tag, context && context.bemtoTagContext);
      this.state = initialState;

      this.elemRefs = {};
      this.setElemRef = elem => element => this.elemRefs[elem] = element;
    }
    componentDidMount() {
      if (blockOptions.lifecycle && blockOptions.lifecycle.componentDidMount) {
        blockOptions.lifecycle.componentDidMount(this);
      }
    }
    componentWillUnmount() {
      if (blockOptions.lifecycle && blockOptions.lifecycle.componentWillUnmount) {
        blockOptions.lifecycle.componentWillUnmount(this);
      }
    }
    getChildContext() {
      return { bemtoTagContext: this.state.bemtoTagContext }
    }
    render() {
      const generateTag = (props, children) => {
        const isReactElem = children && children.type && children.type === 'reactContent';
        const options = gatherOptions(blockOptions, {
          tagProps: props,
          children: isReactElem ? React.createElement(BemtoContextProvider, { context: children.modifier.tagContext || 'block' }, children.content) : children,
          tagContext: this.context.bemtoTagContext,
          component: this
        })
        if (options.children && options.children.constructor === Array && !options.children.length) {
          options.children = null;
        }

        if (options.omitTag) {
          return options.children;
        } else {
          return React.createElement(options.finalTag, options.finalProps, options.children);
        }
      };
      const content = !this.props.__BemtoElem && blockOptions.content;
      const children = content
        ? applyToAll(content, unfoldChildren(this.props, this, generateTag), {
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

  return bemtoFactory;
};

bemto.DefaultPropTypes = DefaultPropTypes;

module.exports = bemto;
