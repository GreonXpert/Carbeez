// components/HelpCenter.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const faqs = [
    { question: 'What is Carbeez?', answer: 'Carbeez is an AI-powered carbon consultant designed to help you track, manage, and report your Greenhouse Gas (GHG) emissions according to international standards.' },
    { question: 'Which standards do you follow?', answer: 'We follow the GHG Protocol Corporate Standard and ISO 14064-1:2018 for GHG inventories.' },
    { question: 'How do I change my password?', answer: 'You can change your password from the "Privacy & Security" section in your profile.' },
];

const FaqItem = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <View style={styles.faqItem}>
            <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.questionContainer}>
                <Text style={styles.question}>{item.question}</Text>
                <MaterialIcons name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} size={24} color="#4CAF50" />
            </TouchableOpacity>
            {isOpen && <Text style={styles.answer}>{item.answer}</Text>}
        </View>
    )
}

const HelpCenter = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {faqs.map((faq, index) => <FaqItem key={index} item={faq} />)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
  content: { padding: 20 },
  faqItem: {
      backgroundColor: '#FFF',
      borderRadius: 8,
      padding: 15,
      marginBottom: 10,
  },
  questionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
  },
  question: {
      fontSize: 16,
      fontFamily: 'Inter_600SemiBold',
      color: '#111827',
      flex: 1
  },
  answer: {
      marginTop: 10,
      fontSize: 14,
      fontFamily: 'Inter_400Regular',
      color: '#6B7280',
      lineHeight: 20
  }
});

export default HelpCenter;