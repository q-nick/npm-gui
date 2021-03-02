import { useCallback, useState } from 'react';
import styled from 'styled-components';
import type { Props } from '../Button/Button';
import { Button } from '../Button/Button';
import { useInterval } from '../../hooks/useInterval';

const Wrapper = styled.div`
  display: inline-block;
  position: relative;
`;

const StartButtonThe = styled(Button)`
  margin-right: 0;
`;

const ConfirmButtonThe = styled(Button)`
  position: absolute;
  right: 0;
  top: 0;
`;

export function ConfirmButton({ onClick, ...props }: Readonly<Props>): JSX.Element {
  const [countdown, setCountdown] = useState(0);

  const onStartClick = useCallback(() => {
    setCountdown(5);
  }, []);

  useInterval(() => {
    if (countdown !== 0) {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }
  }, 1000);

  return (
    <Wrapper>
      <StartButtonThe
        {...props} // eslint-disable-line
        onClick={onStartClick}
      />

      {!!countdown && (
        <ConfirmButtonThe
          {...props} // eslint-disable-line
          onClick={onClick}
        >
          {`confirm (${countdown})`}
        </ConfirmButtonThe>
      )}
    </Wrapper>
  );
}
