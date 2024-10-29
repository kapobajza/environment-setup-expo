import { Text, SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import { config } from '@/src/config';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>You're running {config.APP_NAME}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 24,
  },
});
