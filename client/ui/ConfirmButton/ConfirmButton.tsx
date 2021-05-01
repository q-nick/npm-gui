import styled from 'styled-components';
import type { Props } from '../Button/Button';
import { Button } from '../Button/Button';
import { useCountdown } from '../../hooks/useCountDown';

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
  const { countLeft, onStartCountdown, onStopCountdown } = useCountdown();

  return (
    <Wrapper>
      <StartButtonThe
        {...props} // eslint-disable-line
        onClick={onStartCountdown}
      />

      {countLeft !== undefined && countLeft > 0 && ( // eslint-disable-line
        <ConfirmButtonThe
          {...props} // eslint-disable-line
          onClick={(e): void => { if (onClick) { onClick(e); } onStopCountdown(); }}
        >
          {`confirm (${countLeft})`}
        </ConfirmButtonThe>
      )}
    </Wrapper>
  );
}
