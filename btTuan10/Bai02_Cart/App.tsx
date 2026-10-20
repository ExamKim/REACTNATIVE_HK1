import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import CartScreen from './src/screen/CartScreen';
import { StyleSheet } from 'react-native';

export default function App() {
  return (
    <Provider store={store}>
      <CartScreen />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
