// components/PremiumChip.js
import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ChipContainer = styled.View`
  background-color: rgba(14, 165, 163, 0.1);
  /* This is the corrected line */
  border: 1px solid rgba(14, 165, 163, 0.2);
  border-radius: 16px;
  padding: 4px 10px;
  flex-direction: row;
  align-items: center;
`;

const ChipText = styled.Text`
  color: #0f172a;
  font-weight: 600;
  margin-left: 6px;
`;

const PremiumChip = ({ label, iconName }) => {
  return (
    <ChipContainer>
      <MaterialCommunityIcons name={iconName} size={16} color="#0A7B79" />
      <ChipText>{label}</ChipText>
    </ChipContainer>
  );
};

export default PremiumChip;