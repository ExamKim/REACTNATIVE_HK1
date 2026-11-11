import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';

export type Product = {
  id: number;
  title: string;
  price: number;
};

export type ProductSearchResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export async function fetchProducts(keyword: string, limit: number): Promise<Product[]> {
  const response = await fetch(
    `https://dummyjson.com/products/search?q=${encodeURIComponent(keyword)}&limit=${limit}`
  );
  const data = (await response.json()) as ProductSearchResponse;
  return data.products;
}

export default function Bai11() {
  const [keyword, setKeyword] = useState<string>('phone');
  const [limit, setLimit] = useState<string>('10');
  const [products, setProducts] = useState<Product[]>([]);

  const handleSearch = async () => {
    try {
      const parsedLimit = Number(limit) || 10;
      const result = await fetchProducts(keyword, parsedLimit);
      setProducts(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text>Bài 11: Tìm kiếm sản phẩm (Product Search API)</Text>
      <TextInput
        placeholder="Nhập từ khóa tìm kiếm..."
        value={keyword}
        onChangeText={setKeyword}
      />
      <TextInput
        placeholder="Giới hạn số lượng (limit)..."
        value={limit}
        onChangeText={setLimit}
        keyboardType="numeric"
      />
      <Button title="Tìm kiếm" onPress={handleSearch} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.title} - ${item.price}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

