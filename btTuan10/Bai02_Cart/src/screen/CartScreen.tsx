import React from 'react';
import {  FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {  addToCart, clearCart, removeFromCart, updateQuantity} from '../store/cartSlide';

const PRODUCTS = [
  { id: 1, name: 'Laptop Dell XPS', price: 1200, quantity:1 },
  { id: 2, name: 'Mouse Logitech', price: 45, quantity:1 },
  { id: 3, name: 'Keyboard Mechanical', price: 120 , quantity:1},
  { id: 4, name: 'Monitor LG 27"', price: 350 , quantity:1},
  { id: 5, name: 'USB Cable', price: 15, quantity:1 },
];

export default function CartScreen() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleAddProduct = () => {
    const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    dispatch(addToCart(randomProduct));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>Chưa có sản phẩm nào</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} - ${item.price} x {item.quantity}</Text>
            
            <View style={styles.row}>
              <TouchableOpacity onPress={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>
                <Text style={styles.btn}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>
                <Text style={styles.btn}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
                <Text style={styles.btn}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity onPress={handleAddProduct} style={styles.actionBtn}>
        <Text>+ Thêm sản phẩm</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => dispatch(clearCart())} style={styles.actionBtn}>
        <Text>Xóa tất cả</Text>
      </TouchableOpacity>

      <Text style={styles.total}>Tổng tiền: ${totalPrice}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    marginTop: 5,
    gap: 10,
  },
  btn: {
    padding: 5,
    backgroundColor: '#eee',
  },
  actionBtn: {
    padding: 10,
    backgroundColor: '#ddd',
    alignItems: 'center',
    marginTop: 10,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
  },
});