import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import TourItem from "./src/components/TourItem";
import { Tour, groupByCity } from "./src/utils/tour";

const API_URL = "https://6acdca04f338359cf1c25441.mockapi.io/tours";

function HomeScreen() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTours = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("GET thất bại");
      const data: Tour[] = await res.json();
      setTours(data);
    } catch {
      Alert.alert("Lỗi", "Không thể tải danh sách tour.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTours();
  }, [loadTours]);

  const filteredTours = useMemo(() => {
    const q = keyword.trim().toLocaleLowerCase("vi");
    if (!q) return tours;

    return tours.filter((tour) =>
      tour.name.toLocaleLowerCase("vi").includes(q)
    );
  }, [tours, keyword]);

  const sections = useMemo(
    () => groupByCity(filteredTours).filter((s) => s.data.length > 0),
    [filteredTours]
  );

  const favorites = useMemo(
    () => tours.filter((tour) => tour.isFavorite),
    [tours]
  );

  const handlePress = useCallback((tour: Tour) => {
    Alert.alert(
      tour.name,
      `Ngày khởi hành: ${tour.departure}\nSố ngày: ${tour.days} ngày\nGiá: ${tour.price.toLocaleString("vi-VN")} ₫`
    );
  }, []);

  const toggleFavorite = useCallback(
    async (id: string, next: boolean) => {
      const oldTour = tours.find((t) => t.id === id);
      if (!oldTour) return;

      // Cập nhật lạc quan trước khi gọi API.
      setTours((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, isFavorite: next } : t
        )
      );

      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isFavorite: next }),
        });

        if (!res.ok) throw new Error("PUT thất bại");
      } catch {
        // Hoàn tác trạng thái cũ khi lỗi.
        setTours((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, isFavorite: oldTour.isFavorite }
              : t
          )
        );
        Alert.alert(
          "Lỗi",
          "Không thể cập nhật yêu thích. Vui lòng thử lại."
        );
      }
    },
    [tours]
  );

  const renderFavorites = useCallback(
    () => (
      <View style={styles.favoriteSection}>
        <Text style={styles.favoriteTitle}>
          Tour yêu thích ({favorites.length})
        </Text>
        {favorites.length === 0 ? (
          <Text style={styles.emptyFavorite}>
            Chưa có tour yêu thích
          </Text>
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={favorites}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => (
              <View style={{ width: 12 }} />
            )}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            renderItem={({ item }) => (
              <TourItem
                tour={item}
                compact
                onPress={handlePress}
                onToggleFavorite={toggleFavorite}
              />
            )}
          />
        )}
      </View>
    ),
    [favorites, handlePress, toggleFavorite]
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator size="large" color="#087F5B" />
        <Text style={styles.loadingText}>Đang tải tour...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Tour Việt</Text>
        <Text style={styles.student}>
          23633041 – Chìu Kim Thi
        </Text>
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Tìm tour theo tên..."
          style={styles.search}
          clearButtonMode="while-editing"
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        extraData={tours}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {section.title} • {section.data.length} tour
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TourItem
            tour={item}
            onPress={handlePress}
            onToggleFavorite={toggleFavorite}
          />
        )}
        ListHeaderComponent={renderFavorites}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Không tìm thấy tour phù hợp
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadTours(true)}
            colors={["#087F5B"]}
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F7FA",
  },
  header: {
    backgroundColor: "#087F5B",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  student: {
    color: "#FFFFFF",
    marginTop: 5,
  },
  search: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 12,
    color: "#222222",
  },
  favoriteSection: {
    paddingVertical: 12,
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 12,
    marginBottom: 10,
    color: "#183153",
  },
  emptyFavorite: {
    marginHorizontal: 12,
    color: "#666666",
  },
  sectionHeader: {
    backgroundColor: "#E5F3ED",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  sectionTitle: {
    color: "#087F5B",
    fontWeight: "bold",
    fontSize: 16,
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#666666",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 10,
    color: "#555555",
  },
});