import { useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Linking,
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
  const { background, text, textSecondary, tint } = useThemeColor();

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

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: textSecondary }]}>
              By{' '}
              <Text
                style={[styles.footerLink, { color: tint }]}
                onPress={() =>
                  Linking.openURL('https://www.bernardorohlfs.com/')
                }
              >
                Bernardo Rohlfs
              </Text>
            </Text>
          </View>
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
    flexGrow: 1,
    paddingBottom: 20,
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
    fontFamily: 'LexendDeca_700Bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto' as const,
    paddingTop: 40,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 13,
  },
  footerLink: {
    textDecorationLine: 'underline' as const,
    fontSize: 13,
  },
});
