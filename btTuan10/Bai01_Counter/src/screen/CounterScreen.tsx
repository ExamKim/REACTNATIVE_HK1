import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { decrement, increment } from '../store/counterSlide';

export default function CounterScreen() {
  const dispatch = useDispatch();
  const count = useSelector((state: RootState) => state.counter.value);

  function handleInc() {
    dispatch(increment(1));
  }

  function handleDec() {
    dispatch(decrement());
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 10 }}>Count: {count}</Text>

      <TouchableOpacity
        onPress={handleInc}
        style={{ padding: 10, backgroundColor: '#e0e0e0', marginBottom: 10 }}
      >
        <Text>Inc</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleDec}
        style={{ padding: 10, backgroundColor: '#e0e0e0' }}
      >
        <Text>Dec</Text>
      </TouchableOpacity>
    </View>
  );
}