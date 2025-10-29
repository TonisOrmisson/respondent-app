import React from 'react';
import { render } from '@testing-library/react-native';
import { TextInput } from '../../components/TextInput';

describe('TextInput component', () => {
  it('should render with placeholder', () => {
    const { getByPlaceholderText } = render(
      <TextInput placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with label', () => {
    const { getByText } = render(
      <TextInput label="Test Label" placeholder="Enter text" />
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('should show required asterisk when required', () => {
    const { getByText } = render(
      <TextInput label="Test Label" required={true} placeholder="Enter text" />
    );
    expect(getByText(/Test Label/)).toBeTruthy();
    expect(getByText(/\*/)).toBeTruthy();
  });

  it('should display error message when error prop is provided', () => {
    const { getByText } = render(
      <TextInput placeholder="Enter text" error="This field is required" />
    );
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('should apply error styles when error is present', () => {
    const { getByPlaceholderText } = render(
      <TextInput placeholder="Enter text" error="Error message" />
    );
    
    const input = getByPlaceholderText('Enter text');
    expect(input.props.style).toContainEqual(
      expect.objectContaining({ borderColor: '#d32f2f' })
    );
  });

  it('should pass through TextInput props', () => {
    const { getByPlaceholderText } = render(
      <TextInput 
        placeholder="Enter text" 
        value="test value" 
        editable={false}
      />
    );
    
    const input = getByPlaceholderText('Enter text');
    expect(input.props.value).toBe('test value');
    expect(input.props.editable).toBe(false);
  });
});