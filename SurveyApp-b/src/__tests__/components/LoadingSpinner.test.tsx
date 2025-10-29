import React from 'react';
import { render } from '@testing-library/react-native';
import { LoadingSpinner } from '../../components/LoadingSpinner';

describe('LoadingSpinner component', () => {
  it('should render with default text', () => {
    const { getByText } = render(<LoadingSpinner />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should render with custom text', () => {
    const { getByText } = render(<LoadingSpinner text="Custom loading message" />);
    expect(getByText('Custom loading message')).toBeTruthy();
  });

  it('should not render text when text prop is empty', () => {
    const { queryByText } = render(<LoadingSpinner text="" />);
    expect(queryByText('Loading...')).toBeNull();
  });

  it('should render ActivityIndicator', () => {
    const { getByTestId } = render(<LoadingSpinner />);
    // ActivityIndicator doesn't have a built-in testID, but we can check for its presence
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });
});