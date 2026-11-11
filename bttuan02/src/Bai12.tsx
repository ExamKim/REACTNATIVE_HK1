import React, { useState } from 'react';
import { Alert, Button, Text, View } from 'react-native';

export type CustomError = {
  status?: number;
  message: string;
};

export default function Bai12() {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const callBrokenApi = async () => {
    try {
      // Cố tình gọi sai URL để gây lỗi
      const response = await fetch('https://invalid-domain-that-does-not-exist-12345.typicode.com/posts');
      if (!response.ok) {
        const customErr: CustomError = {
          status: response.status,
          message: `Lỗi từ server (HTTP ${response.status})`,
        };
        throw customErr;
      }
      await response.json();
    } catch (error: unknown) {
      const typedError = error as CustomError;
      const friendlyMessage = typedError?.message || 'Đã xảy ra lỗi khi kết nối tới server!';
      setErrorMessage(friendlyMessage);
      Alert.alert('Thông báo lỗi', friendlyMessage);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Text>Bài 12: Xử lý lỗi API (API Error Handling)</Text>
      <Button title="Gọi API lỗi" onPress={callBrokenApi} />
      {errorMessage ? <Text>Chi tiết lỗi: {errorMessage}</Text> : null}
    </View>
  );
}

