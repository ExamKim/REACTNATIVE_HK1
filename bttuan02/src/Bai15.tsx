import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

type TodoItem = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export default function Bai15() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchTodos = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=20');
      const data = (await response.json()) as TodoItem[];
      setTodos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchTodos();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text>Bài 15: Tải lại trang (Pull to Refresh State)</Text>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.id}. {item.title}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

