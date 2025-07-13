import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';

export default function HowToScreen() {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setCollapsed(!collapsed)} style={styles.header}>
        <Text style={styles.headerText}>📍 Comment venir ?</Text>
      </TouchableOpacity>

      <Collapsible collapsed={collapsed}>
        <Text style={styles.content}>
          Le festival a lieu à Albi :
          {'\n'}🚆 En train depuis Toulouse
          {'\n'}🚗 En voiture par l’A68
          {'\n'}🚌 En bus régionaux
        </Text>
      </Collapsible>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    backgroundColor: '#ddd',
    padding: 15,
    borderRadius: 8,
  },
  headerText: { fontSize: 18, fontWeight: 'bold' },
  content: { marginTop: 10, fontSize: 16, lineHeight: 22 },
});
