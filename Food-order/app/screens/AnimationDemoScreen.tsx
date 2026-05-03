
import React, { useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Animated, PanResponder,
  Dimensions, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_W } = Dimensions.get('window');
const BALL_SIZE = 64;

export default function AnimationDemoScreen() {
  const navigation = useNavigation<any>();

  // ── 1. Fade ────────────────────────────────────────────────────────────────
  const fadeAnim    = useRef(new Animated.Value(1)).current;
  const [visible,   setVisible] = useState(true);

  const toggleFade = () => {
    const toValue = visible ? 0 : 1;
    Animated.timing(fadeAnim, { toValue, duration: 600, useNativeDriver: true }).start();
    setVisible(!visible);
  };

  // ── 2. Slide ───────────────────────────────────────────────────────────────
  const slideAnim   = useRef(new Animated.Value(0)).current;
  const [slideLeft, setSlideLeft] = useState(true);

  const toggleSlide = () => {
    const toValue = slideLeft ? SCREEN_W - 80 : 0;
    Animated.spring(slideAnim, { toValue, tension: 50, friction: 7, useNativeDriver: true }).start();
    setSlideLeft(!slideLeft);
  };

  // ── 3. Scale / Bounce ──────────────────────────────────────────────────────
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const triggerBounce = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.5, tension: 120, friction: 3, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 0.8, tension: 120, friction: 4, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1.2, tension: 100, friction: 5, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1,   tension: 80,  friction: 6, useNativeDriver: true }),
    ]).start();
  };

  // ── 4. Draggable ball (PanResponder) ───────────────────────────────────────
  const ballPos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const ballScale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        ballPos.setOffset({ x: (ballPos.x as any)._value, y: (ballPos.y as any)._value });
        ballPos.setValue({ x: 0, y: 0 });
        // ballScale must use the same JS driver as ballPos — they share one transform array
        Animated.spring(ballScale, { toValue: 1.2, useNativeDriver: false }).start();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: ballPos.x, dy: ballPos.y }],
        { useNativeDriver: false },
      ),
      onPanResponderRelease: () => {
        ballPos.flattenOffset();
        Animated.spring(ballScale, { toValue: 1, friction: 4, useNativeDriver: false }).start();
      },
    }),
  ).current;

  const resetBall = () => {
    Animated.spring(ballPos, {
      toValue: { x: 0, y: 0 },
      tension: 60, friction: 6,
      useNativeDriver: false,
    }).start();
  };

  // ── 5. Progress bar ────────────────────────────────────────────────────────
  const progressAnim  = useRef(new Animated.Value(0)).current;
  const [progRunning, setProgRunning] = useState(false);
  const [progDone,    setProgDone]    = useState(false);

  const startProgress = () => {
    if (progRunning) return;
    setProgRunning(true);
    setProgDone(false);
    progressAnim.setValue(0);
    Animated.timing(progressAnim, {
      toValue: 1, duration: 3000, useNativeDriver: false,
    }).start(({ finished }) => {
      setProgRunning(false);
      if (finished) setProgDone(true);
    });
  };

  const resetProgress = () => {
    progressAnim.setValue(0);
    setProgRunning(false);
    setProgDone(false);
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const progressColor = progressAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#FF6B35', '#FDCB6E', '#00B894'],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#2D3436" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Animation Demo</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── 1. Fade ─────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>✨</Text>
            <Text style={styles.cardTitle}>1 · Fade In / Out</Text>
          </View>
          <Text style={styles.cardDesc}>Animated.timing with opacity</Text>

          <Animated.View style={[styles.demoBox, { opacity: fadeAnim, backgroundColor: '#FFEBE4' }]}>
            <Text style={styles.demoBoxEmoji}>🍕</Text>
            <Text style={styles.demoBoxLabel}>{visible ? 'Visible' : 'Fading…'}</Text>
          </Animated.View>

          <TouchableOpacity style={styles.demoBtn} onPress={toggleFade}>
            <Text style={styles.demoBtnText}>{visible ? 'Fade Out' : 'Fade In'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── 2. Slide ────────────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>↔️</Text>
            <Text style={styles.cardTitle}>2 · Slide Animation</Text>
          </View>
          <Text style={styles.cardDesc}>Animated.spring with translateX</Text>

          <View style={styles.slideTrack}>
            <Animated.View
              style={[styles.slideBox, { transform: [{ translateX: slideAnim }] }]}
            >
              <Text style={styles.demoBoxEmoji}>🍔</Text>
            </Animated.View>
          </View>

          <TouchableOpacity style={styles.demoBtn} onPress={toggleSlide}>
            <Text style={styles.demoBtnText}>{slideLeft ? 'Slide Right →' : '← Slide Left'}</Text>
          </TouchableOpacity>
        </View>

        {/* ── 3. Scale / Bounce ───────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>⚡</Text>
            <Text style={styles.cardTitle}>3 · Scale / Bounce</Text>
          </View>
          <Text style={styles.cardDesc}>Animated.sequence with spring scale</Text>

          <View style={styles.centreBox}>
            <Animated.View style={[styles.bounceCircle, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.demoBoxEmoji}>🌮</Text>
            </Animated.View>
          </View>

          <TouchableOpacity style={styles.demoBtn} onPress={triggerBounce}>
            <Text style={styles.demoBtnText}>Bounce!</Text>
          </TouchableOpacity>
        </View>

        {/* ── 4. Draggable Ball ───────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>✋</Text>
            <Text style={styles.cardTitle}>4 · Drag Gesture</Text>
          </View>
          <Text style={styles.cardDesc}>PanResponder — drag the ball freely</Text>

          <View style={styles.dragArea}>
            <Text style={styles.dragHint}>Drag area</Text>
            <Animated.View
              style={[
                styles.draggableBall,
                {
                  transform: [
                    ...ballPos.getTranslateTransform(),
                    { scale: ballScale },
                  ],
                },
              ]}
              {...panResponder.panHandlers}
            >
              <Text style={{ fontSize: 28 }}>🍣</Text>
            </Animated.View>
          </View>

          <TouchableOpacity style={[styles.demoBtn, { marginTop: 8 }]} onPress={resetBall}>
            <Text style={styles.demoBtnText}>Reset Position</Text>
          </TouchableOpacity>
        </View>

        {/* ── 5. Progress Bar ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📊</Text>
            <Text style={styles.cardTitle}>5 · Progress Bar</Text>
          </View>
          <Text style={styles.cardDesc}>Animated.timing with width + color interpolation</Text>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth, backgroundColor: progressColor }]}
            />
          </View>

          <Text style={styles.progressLabel}>
            {progDone ? '✅ Complete!' : progRunning ? 'Loading…' : 'Ready'}
          </Text>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.demoBtn, { flex: 1 }]}
              onPress={startProgress}
              disabled={progRunning}
            >
              <Text style={styles.demoBtnText}>{progRunning ? 'Running…' : 'Start'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.demoBtn, styles.demoBtnOutline, { flex: 1 }]}
              onPress={resetProgress}
            >
              <Text style={[styles.demoBtnText, { color: '#FF6B35' }]}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#2D3436' },
  scroll: { paddingHorizontal: 20, paddingTop: 8 },

  card: {
    backgroundColor: '#FFF', borderRadius: 20,
    padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardIcon:  { fontSize: 20 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#2D3436' },
  cardDesc:  { fontSize: 12, color: '#636E72', marginBottom: 16, fontStyle: 'italic' },

  // Fade demo
  demoBox: {
    height: 90, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 10, marginBottom: 14,
  },
  demoBoxEmoji: { fontSize: 36 },
  demoBoxLabel: { fontSize: 14, fontWeight: '600', color: '#2D3436' },

  // Slide demo
  slideTrack: {
    height: 72, backgroundColor: '#F8F9FA',
    borderRadius: 14, overflow: 'hidden',
    justifyContent: 'center', marginBottom: 14,
    paddingHorizontal: 4,
  },
  slideBox: {
    width: 64, height: 64, borderRadius: 14,
    backgroundColor: '#FFF9E4', alignItems: 'center', justifyContent: 'center',
  },

  // Bounce demo
  centreBox: { alignItems: 'center', marginBottom: 14 },
  bounceCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#FFF0E4', alignItems: 'center', justifyContent: 'center',
  },

  // Drag demo
  dragArea: {
    height: 160, backgroundColor: '#F0F4FF',
    borderRadius: 14, overflow: 'hidden',
    marginBottom: 4, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#DFE6E9', borderStyle: 'dashed',
  },
  dragHint: { position: 'absolute', top: 10, fontSize: 12, color: '#B2BEC3' },
  draggableBall: {
    width: BALL_SIZE, height: BALL_SIZE, borderRadius: BALL_SIZE / 2,
    backgroundColor: '#E4FFF4', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 5,
  },

  // Progress bar
  progressTrack: {
    height: 16, backgroundColor: '#F0F0F0',
    borderRadius: 8, overflow: 'hidden', marginBottom: 8,
  },
  progressFill: { height: '100%', borderRadius: 8 },
  progressLabel: {
    fontSize: 13, color: '#636E72', textAlign: 'center', marginBottom: 14,
  },

  // Shared button styles
  demoBtn: {
    backgroundColor: '#FF6B35', borderRadius: 12,
    paddingVertical: 12, alignItems: 'center',
  },
  demoBtnOutline: { backgroundColor: '#FFF0EB' },
  demoBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  btnRow: { flexDirection: 'row', gap: 10 },
});
