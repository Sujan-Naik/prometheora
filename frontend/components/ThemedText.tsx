// components/ThemedText.tsx
import { Text as RNText, TextProps } from 'react-native';

export function Text(props: TextProps) {
  return (
    <RNText
      {...props}
      className={`font-sans ${props.className || ''}`}
      style={props.style}
    />
  );
}