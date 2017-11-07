const React = require('react');

const modifyClassNames = function(classNames, modifiers) {
  return (classNames + ' ' + classNames.trim().split(/\s+/).map(className => modifiers.map(modifier => className + modifier).join(' ')).join(' ')).trim();
};

const createElemClassNames = function(classNames, elemNames) {
  return (classNames.trim().split(/\s+/).map(className => elemNames.map(elemName => className + '__' + elemName).join(' ')).join(' ')).trim();
};

const gatherModifiers = function(props) {
  return Object.keys(props).filter(prop => props[prop] && prop[0] === '_' && prop[1] !== '_').map(key => typeof props[key] === 'string' ? `${key}_${props[key]}` : key );
};

const parseTagString = function(tagString) {
  const result = {};
  const parsedTagString = typeof tagString === 'string' && tagString.match(/^([^\.\#]*)((?:[\.\#][^\.\#]+)*)$/);
  result.tag = parsedTagString[1] || (typeof tagString === 'string' ? 'div' : tagString);
  result.className = (parsedTagString[2] && parsedTagString[2].replace(/\#[^\#\.]+/g, id => result.id ? '' : (result.id = id.replace('#', '')) && '') || '').replace(/\./g, ' ');
  return result;
};

const selectTag = function(props, defaultTag) {
  if (typeof defaultTag === 'string') {
    if (props.href) return 'a';
    if (defaultTag === 'div' || defaultTag === 'span') {
      if (props.for) return 'label';
      if (props.src) return 'img';
      if (props.type) {
        if (props.type === 'button' || props.type === 'submit') return 'button';
        return 'input';
      }
    }
  }
  return defaultTag;
};

const bemto = function(tagStringOrOptions, optionalOptions) {
  const blockOptions = optionalOptions || typeof tagStringOrOptions !== 'string' && tagStringOrOptions || {};
  blockOptions.type = 'block';
  const tagString = blockOptions.tagString || typeof tagStringOrOptions === 'string' && tagStringOrOptions;
  const parsedBlockTagString = parseTagString(tagString || '');
  blockOptions.tag = blockOptions.tag || parsedBlockTagString.tag;
  blockOptions.props = blockOptions.props || parsedBlockTagString.props || {};
  blockOptions.props.className = (blockOptions.props.className || blockOptions.className || '')+ ' ' + parsedBlockTagString.className
  blockOptions.props.id = blockOptions.props.id || blockOptions.id || parsedBlockTagString.id;

  const bemtoFactory = class bemtoTag extends React.Component {
    render() {
      const generateTag = (tagProps, children) => {
        const options = Object.assign({}, blockOptions);
        options.props = Object.assign({}, blockOptions.props);
        const elem = tagProps.__BemtoElem;
        if (elem) {
          options.type = 'elem';
          const elemParsedTagString = elem.parsedTagString || parseTagString(elem.tagString || '');
          if (elemParsedTagString.tag) {
            options.tag = elemParsedTagString.tag;
          }
          if (elemParsedTagString.id) {
            options.props.id = elemParsedTagString.id;
          }
          options.props.className = elemParsedTagString.className || '';
        }

        const props = {};
        for (var key in (elem && (elem.props || {}) || tagProps)) {
          if (!(typeof options.tag === 'string' && key[0] === '_') && key !== 'children') {
            props[key] = (elem && (elem.props || {}) || tagProps)[key];
          }
        }

        if (options.props.id && !props.id) {
          props.id = options.props.id;
        }

        if (elem) {
          props.className = (props.className || '') + ' ' + createElemClassNames(((tagProps.className || '') + ' ' + parsedBlockTagString.className), [elem.name]);
        }

        props.className = modifyClassNames((props.className || '') + ' ' + options.props.className, gatherModifiers(elem && (elem.props || {}) || tagProps));

        // FIXME: replace with joining className_s_ (which don't exist yet)
        props.className = props.className.replace(/\s{2,}/g, ' ');

        return React.createElement(selectTag(props, options.tag), props, children);
      };

      let children = this.props.children;
      if (blockOptions.content) {
        const unfoldChildren = (item, index) => {
          if (item.type === 'children') {
            return this.props.children;
          } else if (item.type === 'elem') {
            const myProps = Object.assign({
              // TODO: add __ElemProps ?
              __BemtoElem: {
                name: item.name,
                props: { key: index }
              }
            }, this.props);
            return generateTag(myProps, (item.content || [{ type: 'elemContent',  name: item.name }]).map(unfoldChildren));
          } else if (item.type === 'elemContent') {
            return this.props['__' + item.name];
          };
        }
        children = blockOptions.content.map(unfoldChildren);
      }
      return generateTag(this.props, children);
    }
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
