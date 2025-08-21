// components/FloatingAvatar.js
import React from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';

const AvatarContainer = styled.View`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${(props) => (props.kind === 'bot' ? '#0EA5A3' : '#10b981')};
  justify-content: center;
  align-items: center;
  /* Shadow props for iOS */
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 4px;
  /* Elevation for Android */
  elevation: 8;
`;

const FloatingAvatar = ({ kind = 'bot' }) => {
  const iconName = kind === 'bot' ? 'smart-toy' : 'person';
  return (
    <AvatarContainer kind={kind}>
      <MaterialIcons name={iconName} size={28} color="white" />
    </AvatarContainer>
  );
};

export default FloatingAvatar;