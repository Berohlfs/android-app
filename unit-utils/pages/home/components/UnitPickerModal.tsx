import { useEffect } from 'react';
import {
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Unit } from '../types';

type Props = {
  visible: boolean;
  units: Unit[];
  selectedKey: string;
  onSelect: (unit: Unit) => void;
  onClose: () => void;
};

const SHEET_HEIGHT_RATIO = 0.6;
const DISMISS_THRESHOLD = 80;

export default function UnitPickerModal({
  visible,
  units,
  selectedKey,
  onSelect,
  onClose,
}: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const sheetHeight = windowHeight * SHEET_HEIGHT_RATIO;

  const { bottom: safeBottom } = useSafeAreaInsets();
  const { background, text, textSecondary, tint, border, surface } =
    useThemeColor();

  const scrollY = useSharedValue(0);
  const contentHeight = useSharedValue(0);
  const layoutHeight = useSharedValue(0);

  const translateY = useSharedValue(sheetHeight);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [visible, sheetHeight, translateY]);

  const close = () => {
    translateY.value = withTiming(
      sheetHeight,
      { duration: 250, easing: Easing.in(Easing.cubic) },
      () => {
        runOnJS(onClose)();
      }
    );
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY > DISMISS_THRESHOLD) {
        runOnJS(close)();
      } else {
        translateY.value = withTiming(0, {
          duration: 200,
          easing: Easing.out(Easing.cubic),
        });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const isScrollable = () => {
    'worklet';
    return contentHeight.value > layoutHeight.value;
  };

  const indicatorStyle = useAnimatedStyle(() => {
    if (!isScrollable()) return { opacity: 0 };

    const trackHeight = layoutHeight.value;
    const thumbHeight = Math.max(
      30,
      (layoutHeight.value / contentHeight.value) * trackHeight
    );
    const maxScroll = contentHeight.value - layoutHeight.value;
    const scrollRatio = maxScroll > 0 ? scrollY.value / maxScroll : 0;
    const thumbOffset = scrollRatio * (trackHeight - thumbHeight);

    return {
      opacity: 1,
      height: thumbHeight,
      transform: [{ translateY: thumbOffset }],
    };
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={styles.container}>
        <Pressable style={styles.overlay} onPress={close} />

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: background, height: sheetHeight, paddingBottom: safeBottom + 12 },
            sheetStyle,
          ]}
        >
          <GestureDetector gesture={panGesture}>
            <View>
              <View style={[styles.handle, { backgroundColor: border }]} />
              <Text style={[styles.title, { color: text }]}>Select Unit</Text>
            </View>
          </GestureDetector>
          <View style={styles.listContainer}>
            <FlatList
              data={units}
              keyExtractor={(item) => item.key}
              bounces={false}
              showsVerticalScrollIndicator={false}
              onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
                scrollY.value = e.nativeEvent.contentOffset.y;
              }}
              scrollEventThrottle={16}
              onContentSizeChange={(_w, h) => {
                contentHeight.value = h;
              }}
              onLayout={(e) => {
                layoutHeight.value = e.nativeEvent.layout.height;
              }}
              renderItem={({ item }) => {
                const isSelected = item.key === selectedKey;
                return (
                  <Pressable
                    onPress={() => {
                      onSelect(item);
                      close();
                    }}
                    style={[
                      styles.option,
                      {
                        backgroundColor: isSelected ? surface : 'transparent',
                      },
                    ]}
                  >
                    <View style={styles.optionLeft}>
                      <Text style={[styles.optionLabel, { color: text }]}>
                        {item.label}
                      </Text>
                      <Text
                        style={[styles.optionAbbr, { color: textSecondary }]}
                      >
                        {item.abbreviation}
                      </Text>
                    </View>
                    {isSelected && (
                      <MaterialIcons name="check" size={20} color={tint} />
                    )}
                  </Pressable>
                );
              }}
            />
            <Animated.View
              style={[
                styles.scrollIndicator,
                { backgroundColor: tint },
                indicatorStyle,
              ]}
            />
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionAbbr: {
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
    position: 'relative',
  },
  scrollIndicator: {
    position: 'absolute',
    right: 4,
    top: 0,
    width: 4,
    borderRadius: 2,
  },
});
