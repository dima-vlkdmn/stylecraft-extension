import styled from 'styled-components';

import { Button } from 'primereact/button';

const PrimaryButton = styled(Button)`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  width: fit-content;
  min-height: 1.5rem;
  color: var(--primary-color);
  background-color: var(--surface-50);
  border-radius: 0.25rem;
  margin-bottom: 1rem;

  .p-button-label {
    padding: 0;
  }

  .pi {
    margin-right: 0.5rem;
    font-size: 1rem;
  }
`;

export { PrimaryButton };