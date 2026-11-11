import React, { useEffect, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';

// Hàm Generic nhận vào mảng các object có trường name và một từ khóa để lọc
export function filterByName<T extends { name: string }>(items: T[], keyword: string): T[] {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) {
    return items;
  }
  return items.filter((item) => item.name.toLowerCase().includes(normalizedKeyword));
}

type UserItem = {
  id: number;
  name: string;
  email: string;
};

export default function Bai13() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = (await response.json()) as UserItem[];
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = filterByName<UserItem>(users, keyword);

  return (
    <View style={{ flex: 1 }}>
      <Text>Bài 13: Bộ lọc danh sách (Filtered List Generic)</Text>
      <TextInput
        placeholder="Lọc theo name..."
        value={keyword}
        onChangeText={setKeyword}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.name} ({item.email})
            </Text>
          </View>
        )}
      />
    </View>
  );
}

