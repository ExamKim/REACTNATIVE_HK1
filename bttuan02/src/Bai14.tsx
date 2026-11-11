import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';

// Generic Interface cho API phân trang
export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
}

export type ProductItem = {
  id: number;
  title: string;
  price: number;
};

type DummyJsonProductsResponse = {
  products: ProductItem[];
  total: number;
  skip: number;
  limit: number;
};

const PAGE_LIMIT = 10;

export async function fetchPaginatedProducts(page: number): Promise<ApiResponse<ProductItem>> {
  const skip = (page - 1) * PAGE_LIMIT;
  const response = await fetch(`https://dummyjson.com/products?limit=${PAGE_LIMIT}&skip=${skip}`);
  const json = (await response.json()) as DummyJsonProductsResponse;

  return {
    data: json.products,
    total: json.total,
    page,
  };
}

export default function Bai14() {
  const [responseState, setResponseState] = useState<ApiResponse<ProductItem>>({
    data: [],
    total: 0,
    page: 1,
  });

  const loadPage = async (pageNumber: number) => {
    try {
      const result = await fetchPaginatedProducts(pageNumber);
      setResponseState(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadPage(1);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text>Bài 14: Phân trang dữ liệu (Pagination Response)</Text>
      <Text>
        Trang hiện tại: {responseState.page} | Tổng số sản phẩm: {responseState.total}
      </Text>
      <View>
        <Button
          title="Trang trước"
          disabled={responseState.page <= 1}
          onPress={() => loadPage(responseState.page - 1)}
        />
        <Button
          title="Trang tiếp"
          disabled={responseState.page * PAGE_LIMIT >= responseState.total}
          onPress={() => loadPage(responseState.page + 1)}
        />
      </View>
      <FlatList
        data={responseState.data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>
              #{item.id} - {item.title} (${item.price})
            </Text>
          </View>
        )}
      />
    </View>
  );
}

