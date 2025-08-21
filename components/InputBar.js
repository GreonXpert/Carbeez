// components/InputBar.js
import React from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';


const InputContainer = styled.View`
  padding: ${Platform.OS === "android" ? "16px" : "24px"};
  background-color: rgba(255, 255, 255, 0.95);
  border-top-width: 1px;
  border-top-color: rgba(14, 165, 163, 0.1);
  flex-direction: row;
  align-items: center;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(14, 165, 163, 0.1);
  border-radius: 20px;
  padding: 12px 16px;
  font-size: 16px;
  color: #0f172a;
`;

const SendButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: #10b981;
  justify-content: center;
  align-items: center;
  margin-left: 12px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1.0)};
`;

const InputBar = ({ value, onChangeText, onSend, disabled }) => {
  return (
    <InputContainer>
      <StyledTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Ask about GHG inventory..."
        placeholderTextColor="#94a3b8"
        multiline
        editable={!disabled}
      />
      <SendButton onPress={onSend} disabled={disabled}>
        <MaterialIcons name="send" size={24} color="white" />
      </SendButton>
    </InputContainer>
  );
};

export default InputBar;