# Comparison of the code for different use-cases

Most only the parts which are different were taked from the original examples for brevity, some parts of the original could also sometimes have extra line wraps to fit into the table.

Note that while the HTML and CSS for those examples would be mostly similar, there could be other differences based the nature of each method.

## Styled-components

<table><thead><tr><th>styled-components</th><th>bemto-components</th></tr></thead><tbody>
<tr><th colspan="2">

### [Adapting based on props](https://www.styled-components.com/docs/basics#adapting-based-on-props)

</th></tr><tr><td colspan="2">
Note: bemto has more code vertically, but more readable and maintainable than one based on props.
</td></tr><tr><td>

``` jsx static
const Button = styled.button`
  background: ${props => props.primary
    ? 'palevioletred' : 'white'};
  color: ${props => props.primary
    ? 'white' : 'palevioletred'};
`;
render(
  <div>
    <Button>Normal</Button>
    <Button primary>Primary</Button>
  </div>
);
```

</td><td>

``` jsx static
const Button = styled(bemto('button'))`
  background: white;
  color: palevioletred;

  &_primary {
    background: palevioletred;
    color: white;
  }
`;
render(
  <div>
    <Button>Normal</Button>
    <Button _primary>Primary</Button>
  </div>
);
```

</td></tr>

<tr><th colspan="2">

### [Extending styles](https://www.styled-components.com/docs/basics#extending-styles)

</th><tr><td colspan="2">
Note: not exactly the same if you'd want to style all the buttons from outside (possible for bemto, not possible for extend): `${Button}` wouldn't match `TomatoButton`. Thus, the bemto variant is closer to the wrapping with an extra `styled`, like `TomatoButton = styled(Button)`.
</td></tr></tr><tr><td>

``` jsx static
const Button = styled.button`
  color: palevioletred;
  border: 2px solid palevioletred;
`;
const TomatoButton = Button.extend`
  color: tomato;
  border-color: tomato;
`;
render(
  <div>
    <Button>Normal Button</Button>
    <TomatoButton>Tomato Button</TomatoButton>
  </div>
);
```

</td><td>

``` jsx static
const Button = styled(bemto('button'))`
  color: palevioletred;
  border: 2px solid palevioletred;

  &_tomato {
    color: tomato;
    border-color: tomato;
  }
`;
render(
  <div>
    <Button>Normal Button</Button>
    <Button _tomato>Tomato Button</Button>
  </div>
);
```

</td></tr><tr><td colspan="2">
Note: see how we don't need anything extra to change the tag to a link in a bemto-variant, it would even have the same styles for the `_tomato` modifier!
</td></tr><tr><td>

``` jsx static
const Button = styled.button`
  color: palevioletred;
  border: 2px solid palevioletred;
`;
const Link = Button.withComponent('a')
const TomatoLink = Link.extend`
  color: tomato;
  border-color: tomato;
`;
render(
  <div>
    <Button>Normal Button</Button>
    <Link>Normal Link</Link>
    <TomatoLink>Tomato Link</TomatoLink>
  </div>
);
```

</td><td>

``` jsx static
const Button = styled(bemto('button'))`
  color: palevioletred;
  border: 2px solid palevioletred;

  &_tomato {
    color: tomato;
    border-color: tomato;
  }
`;
render(
  <div>
    <Button>Normal Button</Button>
    <Button href="#x">Normal Link</Button>
    <Button href="#x" _tomato>Tomato Link</Button>
  </div>
);
```

</td></tr>
</tbody>
</table>


