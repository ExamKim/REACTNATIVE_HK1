import React from 'react';
import { Provider } from 'react-redux';
import TourScreen from './src/components/TourScreen';
import { store } from './src/components/store';

export default function App() {
  return (
    <Provider store={store}>
      <TourScreen />
    </Provider>
  );
}
