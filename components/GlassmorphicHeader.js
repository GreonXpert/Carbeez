// --------------------------------------------------
// components/GlassmorphicHeader.js
// --------------------------------------------------
import React from 'react';
import styled from 'styled-components/native';
import { View, Text, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import FloatingAvatar from './FloatingAvatar';
import PremiumChip from './PremiumChip';

const HeaderSafeArea = styled.View`
  background-color: rgba(255, 255, 255, 0.85);
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  padding-top: ${Platform.OS === 'android' ? '40px' : '0px'};
  border-bottom-width: 1px;
  border-color: rgba(0,0,0,0.05);
`;

const HeaderContainer = styled.View`
  padding: 16px 20px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TitleContainer = styled.View`
  margin-left: 16px;
`;

const TitleText = styled.Text`
  font-size: 22px;
  font-family: 'Inter-Bold';
  color: #0EA5A3;
`;

const SubtitleText = styled.Text`
  font-size: 14px;
  font-family: 'Inter-Regular';
  color: #475569;
`;

const ChipsContainer = styled.View`
  flex-direction: row;
  margin-top: 12px;
`;

const GlassmorphicHeader = ({ onCopyChat }) => {
  return (
    <HeaderSafeArea>
      <HeaderContainer>
        <Row>
          <Row>
            <FloatingAvatar kind="bot" />
            <TitleContainer>
              <TitleText>Carbeez AI</TitleText>
              <SubtitleText>Carbon Consultant • Online</SubtitleText>
            </TitleContainer>
          </Row>
          <TouchableOpacity onPress={onCopyChat}>
            <MaterialIcons name="content-copy" size={24} color="#94a3b8" />
          </TouchableOpacity>
        </Row>
         <ChipsContainer>
            <PremiumChip iconName="check-decagram" label="GHG Protocol" />
            <View style={{width: 10}}/>
            <PremiumChip iconName="check-decagram" label="ISO 14064-1" />
        </ChipsContainer>
      </HeaderContainer>
    </HeaderSafeArea>
  );
};

export default GlassmorphicHeader;
