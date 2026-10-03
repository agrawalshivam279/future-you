import React from 'react';
import { render, screen } from '@testing-library/react';
import { StepWrapper } from '../step-wrapper';

describe('StepWrapper Component', () => {
  it('renders step badge, title, subtitle, and description', () => {
    render(
      <StepWrapper
        stepNumber={1}
        title="Goals & Aspirations"
        subtitle="Where you want to go"
        description="Share your short and long term dreams."
        direction={1}
      >
        <div>Form Content Slot</div>
      </StepWrapper>
    );

    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument();
    expect(screen.getByText('Goals & Aspirations')).toBeInTheDocument();
    expect(screen.getByText('Where you want to go')).toBeInTheDocument();
    expect(screen.getByText('Share your short and long term dreams.')).toBeInTheDocument();
    expect(screen.getByText('Form Content Slot')).toBeInTheDocument();
  });
});
