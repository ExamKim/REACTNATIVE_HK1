import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  website?: string;
  company?: {
    name: string;
  };
};

export default function Bai10() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        const data: User = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  // Khi chưa có dữ liệu thì hiện màn hình trống
  if (!user) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Text>Bài 10: Chi tiết người dùng (User Profile Detail)</Text>
      <Text>ID: {user?.id}</Text>
      <Text>Họ tên: {user?.name}</Text>
      <Text>Username: {user?.username}</Text>
      <Text>Email: {user?.email}</Text>
      <Text>Số điện thoại: {user?.phone}</Text>
      <Text>Website: {user?.website}</Text>
      <Text>Công ty: {user?.company?.name}</Text>
    </View>
  );
}

