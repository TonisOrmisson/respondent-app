import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../components/Button';

describe('Button component', () => {
  it('should render with title', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={jest.fn()} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPressMock} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={onPressMock} disabled={true} />
    );
    
    const button = getByText('Test Button').parent?.parent;
    expect(button?.props.accessibilityState.disabled).toBe(true);
  });

  it('should show loading indicator when loading', () => {
    const { queryByText, getByTestId } = render(
      <Button title="Test Button" onPress={jest.fn()} loading={true} />
    );
    
    expect(queryByText('Test Button')).toBeNull();
    // ActivityIndicator should be present
    expect(getByTestId('activity-indicator')).toBeTruthy();
  });

  it('should be disabled when loading', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button title="Test Button" onPress={onPressMock} loading={true} />
    );
    
    const button = getByTestId('activity-indicator').parent?.parent;
    expect(button?.props.accessibilityState.disabled).toBe(true);
  });

  it('should apply correct styles for primary variant', () => {
    const { getByText } = render(
      <Button title="Primary Button" onPress={jest.fn()} variant="primary" />
    );
    
    const button = getByText('Primary Button').parent?.parent;
    const styles = Array.isArray(button?.props.style) ? button?.props.style : [button?.props.style];
    const flatStyles = Object.assign({}, ...styles);
    expect(flatStyles.backgroundColor).toBe('#007AFF');
  });

  it('should apply correct styles for secondary variant', () => {
    const { getByText } = render(
      <Button title="Secondary Button" onPress={jest.fn()} variant="secondary" />
    );
    
    const button = getByText('Secondary Button').parent?.parent;
    const styles = Array.isArray(button?.props.style) ? button?.props.style : [button?.props.style];
    const flatStyles = Object.assign({}, ...styles);
    expect(flatStyles.backgroundColor).toBe('transparent');
    expect(flatStyles.borderWidth).toBe(1);
    expect(flatStyles.borderColor).toBe('#007AFF');
  });
});