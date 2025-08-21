// components/ThinkingBubble.js
import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import CustomLoader from './CustomLoader';

const defaultSteps = [
  { icon: 'search', text: 'Analyzing request' },
  { icon: 'rule', text: 'Applying GHG Protocol' },
  { icon: 'checklist', text: 'Checking ISO 14064-1' },
  { icon: 'functions', text: 'Calculating emissions' },
];

// FIX: Added `steps = defaultSteps` to provide a default array
const ThinkingBubble = ({ steps = defaultSteps }) => {
  return (
    <BubbleContainer>
      <HeaderRow>
        <CustomLoader />
        <ThinkingText>Thinking...</ThinkingText>
      </HeaderRow>
      <ChipContainer>
        {/* This line will no longer crash and will show the default steps */}
        {steps.map((step, index) => (
          <Chip key={index}>
            <MaterialIcons name={step.icon} size={16} color="#004d40" />
            <ChipText>{step.text}</ChipText>
          </Chip>
        ))}
      </ChipContainer>
    </BubbleContainer>
  );
};

// ... (keep all your styled-components definitions below this line)

const BubbleContainer = styled.View`
  padding: 16px;
  border-radius: 20px;
  background-color: white;
  width: 280px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  align-self: flex-start;
  margin: 8px 0;
`;

const HeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const ThinkingText = styled.Text`
  font-family: 'Inter_700Bold';
  font-size: 16px;
  color: #1e293b;
  margin-left: 8px;
`;

const ChipContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const Chip = styled.View`
  background-color: #e0f2f1;
  border-radius: 16px;
  padding: 6px 12px;
  margin-right: 8px;
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
`;

const ChipText = styled.Text`
  font-family: 'Inter_400Regular';
  font-size: 12px;
  color: #004d40;
  margin-left: 6px;
`;

export default ThinkingBubble;