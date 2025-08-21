// --------------------------------------------------
// components/ThinkingBubble.js
// --------------------------------------------------
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import CustomLoader from './CustomLoader'; // Import the new loader

const BubbleContainer = styled.View`
  padding: 16px;
  border-radius: 20px;
  background-color: white;
  width: 280px; /* Wider to fit content */
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const ThinkingText = styled.Text`
  font-family: 'Inter-Bold';
  font-size: 16px;
  color: #1e293b;
  margin-left: 8px;
`;

const ChipContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const Chip = styled.View`
  background-color: #e0f2f1; /* Light teal background */
  border-radius: 16px;
  padding: 6px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
`;

const ChipText = styled.Text`
  font-family: 'Inter-Regular';
  font-size: 12px;
  color: #00796b; /* Darker teal text */
  margin-left: 4px;
`;

const ThinkingBubble = ({ accessTrace }) => {
  return (
    <BubbleContainer>
      <HeaderRow>
        <CustomLoader />
        <ThinkingText>Thinking... accessing:</ThinkingText>
      </HeaderRow>
      <ChipContainer>
        {accessTrace.map((item) => (
          <Chip key={item.id}>
            <MaterialIcons name="info-outline" size={14} color="#00796b" />
            <ChipText>{item.title}</ChipText>
          </Chip>
        ))}
      </ChipContainer>
    </BubbleContainer>
  );
};

export default ThinkingBubble;
