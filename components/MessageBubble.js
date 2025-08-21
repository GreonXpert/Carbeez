// --------------------------------------------------
// components/MessageBubble.js
// --------------------------------------------------
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import Markdown from 'react-native-markdown-display';
import { MaterialIcons } from '@expo/vector-icons';

const BubbleContainer = styled.View`
  position: relative;
`;

const Bubble = styled.View`
  padding: 16px 20px;
  border-radius: 20px;
  background-color: ${(props) => (props.sender === 'user' ? '#0EA5A3' : '#FFFFFF')};
  margin-bottom: 8px;
  max-width: 100%;
  elevation: 1;
  shadow-color: #000;
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 2px;
`;

const TimestampContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-top: 8px;
`;

const TimestampText = styled.Text`
  font-size: 12px;
  color: ${(props) => (props.sender === 'user' ? 'rgba(255, 255, 255, 0.8)' : '#94a3b8')};
`;

const EditedText = styled.Text`
  font-size: 12px;
  font-style: italic;
  margin-right: 4px;
  color: ${(props) => (props.sender === 'user' ? 'rgba(255, 255, 255, 0.8)' : '#94a3b8')};
`;


const ActionButtonContainer = styled.View`
  position: absolute;
  top: -12px;
  right: 10px;
  flex-direction: row;
  background-color: white;
  border-radius: 16px;
  padding: 4px;
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.15;
  shadow-radius: 5px;
`;

const ActionButton = styled.TouchableOpacity`
  padding: 6px;
  margin: 0 4px;
`;

const MessageBubble = ({ message, onCopy, onEdit }) => {
  const { sender, text, timestamp, edited } = message;
  const [showActions, setShowActions] = useState(false);

  return (
    <TouchableOpacity onLongPress={() => setShowActions(true)} onPressOut={() => setShowActions(false)} activeOpacity={0.8}>
      <BubbleContainer>
        <Bubble sender={sender}>
          <Markdown style={{
            body: { color: sender === 'user' ? '#FFFFFF' : '#1e293b', fontSize: 16, fontFamily: 'Inter-Regular' },
            heading1: { color: sender === 'user' ? 'white' : '#0EA5A3', fontFamily: 'Inter-Bold' },
            strong: { fontFamily: 'Inter-Bold' },
          }}>
            {text}
          </Markdown>
          <TimestampContainer>
            {edited && <EditedText sender={sender}>(edited)</EditedText>}
            <TimestampText sender={sender}>
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </TimestampText>
          </TimestampContainer>
        </Bubble>
        {showActions && (
          <ActionButtonContainer>
            <ActionButton onPress={onCopy}>
              <MaterialIcons name="content-copy" size={20} color="#475569" />
            </ActionButton>
            {sender === 'user' && (
              <ActionButton onPress={onEdit}>
                <MaterialIcons name="edit" size={20} color="#475569" />
              </ActionButton>
            )}
          </ActionButtonContainer>
        )}
      </BubbleContainer>
    </TouchableOpacity>
  );
};

export default MessageBubble;
