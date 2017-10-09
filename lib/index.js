const addBemtoClasses = (props, el) => Object.keys(props).filter(prop => prop[0] == '_').map(modifier => (el.styledComponentId + modifier)).join(' ');

const bemto = function(c) {
  c.attrs = c.attrs || {};
  c.attrs.className = (p) => addBemtoClasses(p, c);
  c.componentStyle.rules = c.componentStyle.rules.map(s => typeof s === 'string' ? s.replace(/&_/g, `&.${c.styledComponentId}_`) : s);
  return c;
}

module.exports = bemto;
