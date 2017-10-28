const React = require('react');

const modifyClassNames = function(classNames, modifiers) {
  return (classNames + ' ' + classNames.trim().split(/\s+/).map(className => modifiers.map(modifier => className + modifier).join(' ')).join(' ')).trim();
};

const gatherModifiers = function(props) {
  return Object.keys(props).filter(prop => props[prop] && prop[0] === '_').map(key => typeof props[key] === 'string' ? `${key}_${props[key]}` : key );
};

const parseTagString = function(tagString) {
  const result = {};
  const parsedTagString = typeof tagString === 'string' && tagString.match(/^([^\.\#]*)((?:[\.\#][^\.\#]+)*)$/);
  result.tag = parsedTagString[1] || typeof tagString === 'string' ? 'div' : tagString;
  result.classNames = (parsedTagString[2] && parsedTagString[2].replace(/\#[^\#\.]+/g, id => result.id ? '' : (result.id = id.replace('#', '')) && '') || '').replace(/\./g, ' ');
  return result;
}

const bemto = function(tagString) {
  return class bemtoTag extends React.Component {
    render(){
      const parsedTagString = parseTagString(tagString);

      const props = {};
      for (var key in this.props) {
        props[key] = this.props[key];
      }

      if (parsedTagString.id && !props.id) {
        props.id = parsedTagString.id;
      }

      props.className = modifyClassNames(props.className || '' + parsedTagString.classNames, gatherModifiers(props));
      return React.createElement(parsedTagString.tag, props, this.props.children);
    }
  };
};

module.exports = bemto;
