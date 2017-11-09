const styled = require('styled-components').default;
const bemto = require('./../');

const Block = styled(bemto({
  content: [
    {
      elem: 'content',
      children: true
    },
    {
      elem: 'helper',
      optional: true,
      modifiers: {
        _dark:
          (props, blockProps) => !!blockProps._dark
      }
    }
  ]
}))`
  display: inline-flex;
  border: 0.5em dotted;
  padding: 0.5em 1.5em;

  &_dark {
    color: #FFF;
    background: #000;
  }

  &_big {
    font-size: 2em;
  }

  &__content {
    box-shadow: 0 0 0.5em;
  }

  &__helper {
    min-width: 1.5em;
    text-align: center;
    background: pink;

    ${()=>Block} & {
      background: rebeccapurple;
    }

    &_dark {
      text-shadow: 0.5em 0.5em 0  #FFF;
    }
  }
`;

module.exports = Block;
