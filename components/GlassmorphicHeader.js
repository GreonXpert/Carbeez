// components/GlassmorphicHeader.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const GlassmorphicHeader = ({
  title,
  subtitle,
  avatar,
  onProfilePress = () => {},
  onLogoutPress = () => {},
  onClearChat = () => {}, // ✅ Clear chat callback
  onSaveChat = () => {},  // ✅ Save chat callback
  onPersonalInfoPress = () => {}, // ✅ NEW: Personal Info navigation callback
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (menuVisible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [menuVisible]);

  const handleProfile = () => {
    setMenuVisible(false);
    onProfilePress && onProfilePress();
  };

  const handleLogout = () => {
    setMenuVisible(false);
    onLogoutPress && onLogoutPress();
  };

  // ✅ Clear chat handler
  const handleClearChat = () => {
    setMenuVisible(false);
    onClearChat && onClearChat();
  };

  // ✅ Save chat handler
  const handleSaveChat = () => {
    setMenuVisible(false);
    onSaveChat && onSaveChat();
  };

  // ✅ NEW: Personal Info handler
  const handlePersonalInfo = () => {
    onPersonalInfoPress && onPersonalInfoPress();
  };

  return (
    <>
      <View style={styles.headerOuter}>
        {/* GLASS GRADIENT FRAME */}
        <LinearGradient
          colors={['rgba(0, 209, 178, 0.12)', 'rgba(0, 209, 178, 0.08)']}
          style={styles.gradientOutline}
        >
          <BlurView intensity={35} style={styles.blurPlate}>
            <View style={styles.innerContent}>
              {/* ✅ NEW: Left – Clickable Person Icon */}
              <TouchableOpacity 
                style={styles.avatarWrapper}
                onPress={handleProfile}
                activeOpacity={0.7}
              >
                {avatar ? (
                  <View style={styles.avatarContainer}>
                    {avatar}
                  </View>
                ) : (
                  <LinearGradient
                    colors={['#00D1B2', '#00a27a']}
                    style={styles.avatarRing}
                  >
                    <View style={styles.avatarCircle}>
                      <MaterialIcons name="person" size={22} color="#00D1B2" />
                    </View>
                  </LinearGradient>
                )}
              </TouchableOpacity>

              {/* Middle – Title and Subtitle */}
              <View style={styles.titleBlock}>
                <Text style={styles.title}>{title}</Text>
                {!!subtitle && (
                  <Text style={styles.subtitle}>{subtitle}</Text>
                )}
              </View>

              {/* Right – Action Menu */}
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setMenuVisible(true)}
                activeOpacity={0.75}
              >
                <LinearGradient
                  colors={['rgba(0, 209, 178, 0.15)', 'rgba(0, 209, 178, 0.08)']}
                  style={styles.actionBtnCircle}
                >
                  <MaterialIcons name="more-vert" size={22} color="#00D1B2" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>
        </LinearGradient>
      </View>

      {/* Animated Glassy Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.menuContainer,
                { transform: [{ scale: scaleAnim }] }
              ]}
            >
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.menuGlass}>
                  

                  <View style={styles.menuDivider} />

                  {/* ✅ Clear Chat */}
                  <TouchableOpacity style={styles.menuItem} onPress={handleClearChat}>
                    <View style={styles.menuIconCircle}>
                      <MaterialIcons name="delete-sweep" size={18} color="#ef4444" />
                    </View>
                    <Text style={[styles.menuText, { color: '#ef4444' }]}>Clear Chat</Text>
                  </TouchableOpacity>

                  <View style={styles.menuDivider} />

                  {/* ✅ Save Chat */}
                  <TouchableOpacity style={styles.menuItem} onPress={handleSaveChat}>
                    <View style={styles.menuIconCircle}>
                      <MaterialIcons name="save-alt" size={18} color="#22c55e" />
                    </View>
                    <Text style={[styles.menuText, { color: '#22c55e' }]}>Save Chat</Text>
                  </TouchableOpacity>

                  <View style={styles.menuDivider} />

                
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  headerOuter: {
    paddingTop: 48,
    paddingHorizontal: 18,
    zIndex: 10,
  },
  gradientOutline: {
    borderRadius: 24,
    padding: 2.2,
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 7,
  },
  blurPlate: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 68,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 22,
  },
  avatarWrapper: {
    marginRight: 8,
    // ✅ NEW: Added touch feedback styles
    borderRadius: 23,
    overflow: 'hidden',
  },
  avatarContainer: {
    // ✅ NEW: Container for custom avatar
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    // ✅ NEW: Added shadow for better visual feedback
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#b9fbee',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,209,178,0.24)',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: '#182230',
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: '#00D1B2',
    textAlign: 'center',
    letterSpacing: 0.16,
  },
  actionBtn: {
    marginLeft: 8,
    borderRadius: 24,
  },
  actionBtnCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00D1B2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 3,
  },
  // MODAL MENU
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20,25,45,0.10)',
  },
  menuContainer: {
    position: 'absolute',
    top: 98,
    right: 25,
    width: 170,
    elevation: 12,
    zIndex: 20,
  },
  menuGlass: {
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderWidth: 1,
    borderColor: 'rgba(0,209,178,0.15)',
    shadowColor: '#6366f1',
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 9,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  menuIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e1f9f4',
  },
  menuText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#212427',
    letterSpacing: 0.1,
  },
  menuDivider: {
    height: 1.1,
    backgroundColor: '#ECF1F6',
    marginHorizontal: 18,
  },
});

export default GlassmorphicHeader;
