const styled = require('styled-components').default;
const injectGlobal = require('styled-components').injectGlobal;

if (!global.hasGlobalStyles) {
  global.hasGlobalStyles = true

  const globalStyles = injectGlobal`

    [class^=rsg--pathline-] {
      display: none;
    }

    table p[class] {
      margin-bottom: 0;
    }

    #components ~ div header > *[id] {
      margin-bottom: 0;
    }

    #components ~ div header > * > a {
      display: block;
    }

    /* Some helper classes */
    .Grid {
      display: grid;
      grid-gap: 10px;
    }

    /* Logoheader a bit smaller and better */
    main + div > div > h1[class] {
      white-space: nowrap;
      font-size: 16px;
    }

    /* Search is not needed */
    main + div > div + div > div[class] {
      padding-top: 10px;
    }

    main + div > div + div > div > div:first-child {
      display: none;
    }

    /* We don't need buggy isolate there */
    a + div[class*=toolbar] > div > a,
    a + div[class*=toolbar] > div > a > svg {
      visibility: hidden;
      opacity: 0;
    }

    main > section > section article > div[class] > div:nth-child(2) {
      position: relative;
      top: 30px;
      margin: -50px 0 0;
    }

    h1#introduction + article > div + div .react-codemirror2 {
      margin-top: 30px;
    }

    main > section > section article > div[class] > div:nth-child(2) a {
      display: none;
    }

    /* Sticky first code example */
    @media (min-height: 600px) {
      h1#introduction + article > div + div > div[data-preview=Introduction] {
        position: sticky;
        top: -1px;
        z-index: 9;

        border: 0;
        padding: 0;

        background: #FFF;
      }
    }

    /* Better side menu */
    #app main + div > div ul > li {
      margin-top: 0;
      margin-bottom: 0;

      &:last-child {
        margin-bottom: 8px;
      }

      & > a {
        display: block;
        padding-top: 4px;
        padding-bottom: 4px;
      }
    }

    /* Compact examples with better layout */
    main > section > section:not(:first-child) article > div[class] {
      display: flex;
      flex-direction: row-reverse;
      overflow: hidden;
      resize: horizontal;

      @media (max-width: 800px) {
        flex-direction: column-reverse;
      }

      & > div {
        flex-grow: 1;
        flex-basis: 50%;
      }

      /* Result */
      & > div:first-child {
        display: flex;
        justify-content: center;
        align-items: center;

        font: 18px/1.4 Helvetica Neue, Arial, sans-serif;
        overflow: auto;
        overflow-y: hidden;

        /* Make errors more readable */
        & pre {
          white-space: pre-wrap;
        }

        & > div {
          max-width: 100%;
        }
      }
      /* Code pane */
      & > div:nth-child(2) {
        display: none;
      }

      & > div:last-child {
        max-height: 50vh;
        overflow: auto;
      }
    }
  `;
}

module.exports = styled;
