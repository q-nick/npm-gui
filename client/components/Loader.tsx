import styled from 'styled-components';

const LoaderStyled = styled.span`
  font-size: inherit;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
`;

export function Loader(): JSX.Element {
  return <LoaderStyled className="oi" data-glyph="reload" />;
}
