import React, { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

export type Post = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

export default function Bai9() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        setPosts(data as Post[]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text>Bài 9: Danh sách tin tức (News Feed)</Text>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>- {item.title}</Text>
          </View>
        )}
      />
    </View>
  );
}

