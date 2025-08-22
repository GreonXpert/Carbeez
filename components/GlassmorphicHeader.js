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

  return (
    <>
      <View style={styles.headerOuter}>
        {/* GLASS GRADIENT FRAME */}
        <LinearGradient
          colors={['rgba(0,209,178,0.6)', 'rgba(99,102,241,0.4)']}
          start={{ x: 0.1, y: 0.2 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientOutline}
        >
          <BlurView intensity={95} tint="light" style={styles.blurPlate}>
            <View style={styles.innerContent}>
              {/* Left – Avatar */}
              <TouchableOpacity activeOpacity={0.7} style={styles.avatarWrapper} onPress={onProfilePress}>
                <LinearGradient
                  colors={['#00D1B2', '#6366F1']}
                  style={styles.avatarRing}
                >
                  <View style={styles.avatarCircle}>
                    {avatar ? (
                      <>{avatar}</>
                    ) : (
                      <MaterialIcons name="person" size={28} color="#fff" />
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              {/* Middle – Title and Subtitle */}
              <View style={styles.titleBlock}>
                <Text style={styles.title}>{title}</Text>
                {!!subtitle && 
                  <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
                }
              </View>
              {/* Right – Action */}
              <TouchableOpacity style={styles.actionBtn} onPress={() => setMenuVisible(true)} activeOpacity={0.75}>
                <LinearGradient colors={['#00D1B2', '#00a27a']} style={styles.actionBtnCircle}>
                  <MaterialIcons name="more-vert" size={24} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>
        </LinearGradient>
      </View>
      
      {/* Animated Glassy Menu Modal */}
      <Modal
        transparent
        visible={menuVisible}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.menuContainer,
                { 
                  transform: [
                    { scale: scaleAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.0] }) },
                    { translateY: scaleAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }
                  ],
                  opacity: scaleAnim,
                },
              ]}
            >
              <View style={styles.menuGlass}>
                <TouchableOpacity style={styles.menuItem} onPress={handleProfile} activeOpacity={0.7}>
                  <LinearGradient colors={['#00D1B2', '#6366F1']} style={styles.menuIconCircle}>
                    <MaterialIcons name="account-circle" size={24} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>
                <View style={styles.menuDivider} />
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout} activeOpacity={0.7}>
                  <View style={[styles.menuIconCircle, { backgroundColor: '#fff2f2' }]}>
                    <MaterialIcons name="logout" size={22} color="#ef4444" />
                  </View>
                  <Text style={[styles.menuText, { color: '#EF4444' }]}>Logout</Text>
                </TouchableOpacity>
              </View>
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
  },
  avatarRing: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
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
