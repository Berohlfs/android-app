import { useState, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';
import { UnitCategory, Unit } from '../types';
import { convert, formatResult } from '../helpers/convert';
import UnitRow from './UnitRow';
import SwapButton from './SwapButton';
import UnitPickerModal from './UnitPickerModal';

type Props = {
  category: UnitCategory;
  loading?: boolean;
  error?: boolean;
};

type PickerTarget = 'from' | 'to' | null;

export default function ConverterPanel({
  category,
  loading,
  error,
}: Props) {
  const border = useThemeColor({}, 'border');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const tint = useThemeColor({}, 'tint');

  const [fromUnitKey, setFromUnitKey] = useState(
    category.units[0]?.key ?? ''
  );
  const [toUnitKey, setToUnitKey] = useState(
    category.units[1]?.key ?? ''
  );
  const [inputValue, setInputValue] = useState('');
  const [activeField, setActiveField] = useState<'from' | 'to'>('from');
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);

  const fromUnit = category.units.find((u) => u.key === fromUnitKey);
  const toUnit = category.units.find((u) => u.key === toUnitKey);

  const computedValue = useMemo(() => {
    if (!fromUnit || !toUnit) return '';
    const num = parseFloat(inputValue);
    if (isNaN(num)) return '';

    if (activeField === 'from') {
      return formatResult(convert(num, fromUnit, toUnit));
    } else {
      return formatResult(convert(num, toUnit, fromUnit));
    }
  }, [inputValue, fromUnit, toUnit, activeField]);

  const handleFromChange = (text: string) => {
    setActiveField('from');
    setInputValue(text);
  };

  const handleToChange = (text: string) => {
    setActiveField('to');
    setInputValue(text);
  };

  const handleSwap = () => {
    setFromUnitKey(toUnitKey);
    setToUnitKey(fromUnitKey);
  };

  const handlePickUnit = (unit: Unit) => {
    if (pickerTarget === 'from') {
      setFromUnitKey(unit.key);
    } else if (pickerTarget === 'to') {
      setToUnitKey(unit.key);
    }
    setPickerTarget(null);
  };

  if (loading) {
    return (
      <View style={[styles.panel, styles.centered, { borderColor: border }]}>
        <ActivityIndicator size="small" color={tint} />
        <Text style={[styles.statusText, { color: textSecondary }]}>
          Loading rates…
        </Text>
      </View>
    );
  }

  if (error || !fromUnit || !toUnit) {
    return (
      <View style={[styles.panel, styles.centered, { borderColor: border }]}>
        <Text style={[styles.statusText, { color: textSecondary }]}>
          Could not load currency rates.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.panel, { borderColor: border }]}>
      <UnitRow
        label="From"
        unit={fromUnit}
        value={activeField === 'from' ? inputValue : computedValue}
        onChangeValue={handleFromChange}
        onPressUnit={() => setPickerTarget('from')}
      />

      <SwapButton onPress={handleSwap} />

      <UnitRow
        label="To"
        unit={toUnit}
        value={activeField === 'to' ? inputValue : computedValue}
        onChangeValue={handleToChange}
        onPressUnit={() => setPickerTarget('to')}
      />

      <UnitPickerModal
        visible={pickerTarget !== null}
        units={category.units}
        selectedKey={pickerTarget === 'from' ? fromUnitKey : toUnitKey}
        onSelect={handlePickUnit}
        onClose={() => setPickerTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    gap: 12,
  },
  statusText: {
    fontSize: 14,
  },
});
