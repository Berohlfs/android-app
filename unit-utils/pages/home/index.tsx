import { useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useThemeColor } from '@/hooks/use-theme-color';
import { categories as staticCategories } from './constants/categories';
import { useCurrencyCategory } from './hooks/use-currency-category';
import CategoryBar from './components/CategoryBar';
import ConverterPanel from './components/ConverterPanel';

export default function HomePage() {
  const background = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');

  const {
    category: currencyCategory,
    loading: currencyLoading,
    error: currencyError,
  } = useCurrencyCategory();

  const allCategories = useMemo(() => {
    const cats = [...staticCategories];
    // Insert currency as 4th item (after Temp)
    cats.splice(3, 0, currencyCategory);
    return cats;
  }, [currencyCategory]);

  const [selectedKey, setSelectedKey] = useState(staticCategories[0].key);
  const activeCategory = allCategories.find((c) => c.key === selectedKey)!;

  const isCurrency = selectedKey === 'currency';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: background }]}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.icon}
            />
            <Text style={[styles.title, { color: text }]}>Unit Utils</Text>
          </View>

          <CategoryBar
            categories={allCategories}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
          />

          <ConverterPanel
            key={selectedKey}
            category={activeCategory}
            loading={isCurrency ? currencyLoading : undefined}
            error={isCurrency ? currencyError : undefined}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
});
