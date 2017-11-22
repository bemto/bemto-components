// Only until https://github.com/styled-components/styled-components/issues/945#issuecomment-340166853 would be merged

const path = require('path');

const defaultResolver = require("react-docgen").resolver.findAllExportedComponentDefinitions;
const annotationResolver = require("react-docgen-annotation-resolver").default;

module.exports = {
  title: 'Bemto-components 🍱',
  showCode: true,
  sections: [
    { name: 'Introduction', content: './docs/0_introduction.md' },
    { name: 'Installation', content: './docs/1_installation.md' },
    {
      name: 'Features',
      _content: './docs/2_0_features.md',
      sections: [
        {
          name: 'HTML Structure',
          content: './docs/2_1_0_html.md',
          sections: [
            { name: 'TagString',         content: './docs/2_1_1_tagstring.md' },
            { name: 'Context awareness', content: './docs/2_1_2_context.md' },
            { name: 'Prop polymorphism', content: './docs/2_1_3_attributes.md' },
            { name: 'Structure',         content: './docs/2_1_4_structure.md' }
          ]
        },
        {
          name: 'BEM',
          content: './docs/2_2_0_bem.md',
          sections: [
            { name: 'Elements',  content: './docs/2_2_1_elements.md' },
            { name: 'Modifiers', content: './docs/2_2_2_modifiers.md' }
          ]
        },
        {
          name: 'Styled-Components',
          content: './docs/2_3_0_styled.md',
          sections: [
            {
              name: 'Extending',
              content: './docs/2_3_1_extending.md'
            }
          ]
        }
      ]
    },
    {
      name: 'Advanced features',
      content: './docs/2_4_advanced.md',
    },
    {
      name: 'Components',
      content: './docs/3_components.md',
      components: './node_modules/bemto-*/lib/**/index.js'
    },
    {
      name: 'Meta',
      sections: [
        {
          name: 'Changelog',
          content: './Changelog.md'
        }
      ]
    }
  ],

  styles: {
    SectionHeading: {
      root: {
        marginBottom: '-24px'
      },
      heading: {
        display: 'none'
      }
    }
  },

  context: {
    styled: path.resolve(__dirname, 'docs/styled-default.js'),
    bemto: path.resolve(__dirname, 'lib/index.js')
  },

  compilerConfig: {
    objectAssign: 'Object.assign',
    transforms: { dangerousTaggedTemplateString: true }
  },

  template: './docs/styleguidist-template.html',

  resolver: (ast, recast) => {
    const annotatedComponents = annotationResolver(ast, recast);
    const defaultComponents = defaultResolver(ast, recast);

    return annotatedComponents.concat(defaultComponents);
  }
};
