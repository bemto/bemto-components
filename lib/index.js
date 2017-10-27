const React = require('react');

const modifyClassNames = function(classNames, modifiers) {
  return classNames + ' ' + classNames.split(' ').map(className => modifiers.map(modifier => className + modifier).join(' ')).join(' ').trim();
};

const gatherModifiers = function(props) {
  return Object.keys(props).filter(prop => props[prop] && prop[0] === '_').map(key => typeof props[key] === 'string' ? `${key}_${props[key]}` : key );
};

const bemto = function(tagName) {
  return class bemtoTag extends React.Component {
    render(){
      const TagName = tagName || 'div';
      const props = {};
      for (var key in this.props) {
        props[key] = this.props[key];
      }

      props.className = modifyClassNames(props.className, gatherModifiers(props))
      return React.createElement(TagName, props, this.props.children);
    }
  };
};

module.exports = bemto;
