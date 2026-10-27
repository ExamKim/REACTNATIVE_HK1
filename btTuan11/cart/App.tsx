import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { store, AppDispatch, RootState } from './store';
import {
  addToCart,
  applyDiscount,
  clearCart,
  decreaseQuantity,
  hydrateCart,
  increaseQuantity,
  removeFromCart,
  setShippingCost,
} from './src/features/cart/cartSlice';
import { selectCartSummary } from './src/features/cart/cartSelectors';
import { fetchProducts, Product } from './src/features/products/productsSlice';

const CART_STORAGE_KEY = '@cart/items';

const money = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

function ShoppingCart() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector((state: RootState) => state.products.items);
  const productStatus = useSelector((state: RootState) => state.products.status);
  const productError = useSelector((state: RootState) => state.products.error);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const hydrated = useSelector((state: RootState) => state.cart.hydrated);
  const summary = useSelector(selectCartSummary);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        const items = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(items)) throw new Error('Dữ liệu giỏ hàng không hợp lệ.');
        if (active) dispatch(hydrateCart(items));
      } catch (error) {
        console.error('Không thể khôi phục giỏ hàng:', error);
        if (active) dispatch(hydrateCart([]));
      }
    };
    void loadCart();
    return () => {
      active = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems)).catch((error) => {
      console.error('Không thể lưu giỏ hàng:', error);
    });
  }, [cartItems, hydrated]);

  useEffect(() => {
    if (productStatus === 'idle') void dispatch(fetchProducts());
  }, [dispatch, productStatus]);

  useEffect(() => {
    if (!notification) return;
    const timeout = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timeout);
  }, [notification]);

  const addProduct = (product: Product) => {
    dispatch(addToCart({ ...product }));
    setNotification(`Đã thêm vào giỏ hàng: ${product.title}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="dark" />
      {notification && (
        <View style={styles.notification} accessibilityRole="alert">
          <Text style={styles.notificationText}>{notification}</Text>
          <Pressable onPress={() => setNotification(null)}>
            <Text style={styles.notificationClose}>Đóng</Text>
          </Pressable>
        </View>
      )}
      <Text style={styles.heading}>Cửa hàng trực tuyến</Text>

      <Text style={styles.sectionTitle}>Sản phẩm</Text>
      {productStatus === 'loading' && <ActivityIndicator color="#2563eb" />}
      {productStatus === 'failed' && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{productError}</Text>
          <Pressable style={styles.retryButton} onPress={() => void dispatch(fetchProducts())}>
            <Text style={styles.buttonText}>Thử lại</Text>
          </Pressable>
        </View>
      )}
      {products.map((product) => (
        <View key={product.id} style={styles.productCard}>
          <View style={styles.flex}>
            <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
            <Text style={styles.price}>{money(product.price)}</Text>
          </View>
          <Pressable style={styles.primaryButton} onPress={() => addProduct(product)}>
            <Text style={styles.buttonText}>Thêm vào giỏ</Text>
          </Pressable>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Giỏ hàng ({summary.itemCount})</Text>
      {!hydrated ? (
        <ActivityIndicator color="#2563eb" />
      ) : cartItems.length === 0 ? (
        <Text style={styles.muted}>Giỏ hàng đang trống.</Text>
      ) : (
        <>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
              <Text>{money(item.price)} × {item.quantity}</Text>
              <View style={styles.quantityRow}>
                <Pressable style={styles.quantityButton} onPress={() => dispatch(decreaseQuantity(item.id))}>
                  <Text>-</Text>
                </Pressable>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Pressable style={styles.quantityButton} onPress={() => dispatch(increaseQuantity(item.id))}>
                  <Text>+</Text>
                </Pressable>
                <Pressable onPress={() => dispatch(removeFromCart(item.id))}>
                  <Text style={styles.removeText}>Xóa</Text>
                </Pressable>
              </View>
            </View>
          ))}
          <Pressable style={styles.clearButton} onPress={() => dispatch(clearCart())}>
            <Text style={styles.removeText}>Xóa toàn bộ giỏ hàng</Text>
          </Pressable>
        </>
      )}

      <Text style={styles.sectionTitle}>Mã giảm giá</Text>
      <View style={styles.discountRow}>
        {(['SUMMER10', 'SPECIAL20'] as const).map((code) => (
          <Pressable
            key={code}
            style={[styles.discountButton, code === 'SPECIAL20' && styles.discountButtonGap]}
            onPress={() => dispatch(applyDiscount(code))}
          >
            <Text style={styles.discountText}>{code}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Phí vận chuyển</Text>
      <View style={styles.shippingRow}>
        {[0, 250000, 625000].map((cost) => (
          <Pressable
            key={cost}
            style={[styles.shippingButton, summary.shipping === cost && styles.selectedButton]}
            onPress={() => dispatch(setShippingCost(cost))}
          >
            <Text>{cost === 0 ? 'Miễn phí' : money(cost)}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.summary}>
        <Text style={styles.sectionTitle}>Tóm tắt đơn hàng</Text>
        <SummaryRow label="Tạm tính" value={money(summary.subtotal)} />
        <SummaryRow label="Giảm giá" value={money(-summary.discount)} />
        <SummaryRow label="Thuế (10%)" value={money(summary.tax)} />
        <SummaryRow label="Vận chuyển" value={money(summary.shipping)} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Thành tiền</Text>
          <Text style={styles.totalLabel}>{money(summary.total)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.muted}>{label}</Text>
      <Text>{value}</Text>
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <ShoppingCart />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 64, backgroundColor: '#f8fafc' },
  heading: { fontSize: 28, fontWeight: '700', color: '#0f172a' },
  subtitle: { marginTop: 4, color: '#64748b' },
  sectionTitle: { marginTop: 24, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#0f172a' },
  productCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginBottom: 10, backgroundColor: '#fff', borderRadius: 12 },
  cartCard: { padding: 14, marginBottom: 10, backgroundColor: '#fff', borderRadius: 12 },
  flex: { flex: 1 },
  productTitle: { fontWeight: '600', color: '#1e293b' },
  price: { marginTop: 5, fontWeight: '700', color: '#2563eb' },
  primaryButton: { paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#2563eb', borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '700' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12 },
  quantityButton: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#e2e8f0', borderRadius: 6 },
  quantity: { fontWeight: '700' },
  removeText: { color: '#dc2626', fontWeight: '600' },
  clearButton: { alignSelf: 'flex-end', paddingVertical: 8 },
  muted: { color: '#64748b' },
  discountRow: { flexDirection: 'row' },
  discountButton: { padding: 10, backgroundColor: '#dbeafe', borderRadius: 8 },
  discountButtonGap: { marginLeft: 10 },
  discountText: { color: '#1d4ed8', fontWeight: '600' },
  shippingRow: { flexDirection: 'row', gap: 8 },
  shippingButton: { flex: 1, alignItems: 'center', padding: 10, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8 },
  selectedButton: { borderColor: '#2563eb', backgroundColor: '#dbeafe' },
  summary: { padding: 16, marginTop: 18, backgroundColor: '#fff', borderRadius: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  totalLabel: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  errorBox: { padding: 14, backgroundColor: '#fee2e2', borderRadius: 10 },
  errorText: { color: '#991b1b', marginBottom: 10 },
  retryButton: { alignSelf: 'flex-start', padding: 10, backgroundColor: '#dc2626', borderRadius: 8 },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#166534',
    borderRadius: 10,
  },
  notificationText: { flex: 1, color: '#fff', fontWeight: '700' },
  notificationClose: { color: '#dcfce7', fontWeight: '700' },
});
