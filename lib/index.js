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
  result.classNames = (parsedTagString[2] && parsedTagString[2].replace(/\#[^\#\.]+/g, id => result.id ? '' : (result.id = id.replace('#', '')) && '') || '').replace(/\./g, ' ');
  return result;
};

const bemto = function(tagString) {
  const parsedBlockTagString = parseTagString(tagString || '');
  const bemtoFactory = class bemtoTag extends React.Component {
    render(){
      const elem = this.props.__BemtoElem;
      const parsedTagString = elem ? elem.parsedTagString : parsedBlockTagString;
      const props = {};
      for (var key in (elem && elem.props || this.props)) {
        if (!(typeof parsedTagString.tag === 'string' && key[0] === '_') && key !== 'children') {
          props[key] = (elem && elem.props || this.props)[key];
        }
      }

      if (parsedTagString.id && !props.id) {
        props.id = parsedTagString.id;
      }
      if (elem) {
        props.className = (props.className || '') + ' ' + createElemClassNames((this.props.className || '' + parsedBlockTagString.classNames), [elem.name]);
      }
      props.className = modifyClassNames((props.className || '') + parsedTagString.classNames, gatherModifiers(elem && elem.props || this.props));
      return React.createElement(parsedTagString.tag, props, this.props.children);
    }
  };

  bemtoFactory.elem = (elemName, tagString) => {
    return bemto.elem(bemtoFactory, elemName, tagString || '');
  }

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
