import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  addTourData,
  deleteTourData,
  fetchTourData,
  updateTourData,
  type Tour,
} from './getAPI';
import type { AppDispatch, RootState } from './store';

export default function TourScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, adding, updating, deleting, error } = useSelector(
    (state: RootState) => state.data
  );

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTourId, setEditingTourId] = useState<string | null>(null);
  const [deletingTourId, setDeletingTourId] = useState<string | null>(null);
  const [tourToDelete, setTourToDelete] = useState<Tour | null>(null);
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    void dispatch(fetchTourData());
  }, [dispatch]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setShowForm(false);
    setEditingTourId(null);
  };

  const handleSubmitTour = async () => {
    const trimmedName = name.trim();
    const parsedPrice = Number(price.trim());

    if (!trimmedName || !price.trim() || !Number.isFinite(parsedPrice)) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên tour và giá hợp lệ.');
      return;
    }

    if (parsedPrice < 0) {
      Alert.alert('Thông báo', 'Giá tour không được âm.');
      return;
    }

    try {
      if (editingTourId) {
        await dispatch(
          updateTourData({ id: editingTourId, name: trimmedName, price: parsedPrice })
        ).unwrap();
        Alert.alert('Thành công', 'Đã cập nhật tour.');
      } else {
        await dispatch(
          addTourData({ name: trimmedName, price: parsedPrice })
        ).unwrap();
        Alert.alert('Thành công', 'Đã thêm tour.');
      }

      resetForm();
    } catch (submitError) {
      const message =
        typeof submitError === 'object' && submitError !== null && 'message' in submitError
          ? String(submitError.message)
          : 'Không thể lưu tour. Vui lòng thử lại.';
      Alert.alert('Lỗi', message);
    }
  };

  const openAddForm = () => {
    setShowForm(true);
    setEditingTourId(null);
    setName('');
    setPrice('');
  };

  const openEditForm = (tour: Tour) => {
    setShowForm(true);
    setEditingTourId(tour.id);
    setName(tour.name || tour.title || '');
    setPrice(String(tour.price ?? ''));
  };

  const confirmDeleteTour = async () => {
    if (!tourToDelete) return;

    const tour = tourToDelete;
    setDeletingTourId(tour.id);
    setDeleteMessage('');
    try {
      await dispatch(deleteTourData(tour.id)).unwrap();
      setDeleteMessage('Đã xóa tour.');
      setTourToDelete(null);
    } catch (deleteError) {
      const message =
        typeof deleteError === 'object' && deleteError !== null && 'message' in deleteError
          ? String(deleteError.message)
          : 'Không thể xóa tour. Vui lòng thử lại.';
      setDeleteMessage(message);
    } finally {
      setDeletingTourId(null);
    }
  };

  if (loading && data.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0F62FE" />
        <Text style={styles.loadingText}>Đang tải danh sách tour...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>QUẢN LÝ TOUR DU LỊCH</Text>

      {!showForm && (
        <Button title="Thêm tour mới" onPress={openAddForm} />
      )}

      {showForm && (
        <View style={styles.form}>
          <Text style={styles.heading}>
            {editingTourId ? 'Cập nhật tour' : 'Thêm tour mới'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên tour"
            value={name}
            onChangeText={setName}
            maxLength={100}
            returnKeyType="next"
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập giá tour"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
          <Button
            title={
              adding || updating
                ? editingTourId
                  ? 'Đang cập nhật...'
                  : 'Đang lưu...'
                : editingTourId
                  ? 'Cập nhật tour'
                  : 'Lưu tour'
            }
            onPress={handleSubmitTour}
            disabled={adding || updating}
          />
          <View style={styles.cancelButton}>
            <Button
              title="Hủy"
              color="#666666"
              onPress={resetForm}
              disabled={adding || updating}
            />
          </View>
        </View>
      )}

      {!!error && <Text style={styles.error}>Lỗi: {error}</Text>}
      {!!deleteMessage && (
        <Text style={styles.deleteMessage}>{deleteMessage}</Text>
      )}

      <Modal
        visible={tourToDelete !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setTourToDelete(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.confirmDialog}>
            <Text style={styles.confirmTitle}>Xác nhận xóa</Text>
            <Text style={styles.confirmText}>
              Bạn có chắc muốn xóa “{tourToDelete?.name || tourToDelete?.title || 'tour'}”?
            </Text>
            <View style={styles.confirmActions}>
              <Pressable
                style={[styles.confirmButton, styles.cancelConfirmButton]}
                onPress={() => setTourToDelete(null)}
                disabled={deleting}
              >
                <Text style={styles.cancelConfirmText}>Hủy</Text>
              </Pressable>
              <Pressable
                style={[styles.confirmButton, styles.deleteConfirmButton]}
                onPress={() => void confirmDeleteTour()}
                disabled={deleting}
              >
                <Text style={styles.deleteConfirmText}>
                  {deleting ? 'Đang xóa...' : 'Xóa'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Text style={styles.heading}>Danh sách tour</Text>
      <FlatList
        style={styles.list}
        data={data}
        keyExtractor={(item, index) => item.id || `tour-${index}`}
        onRefresh={() => void dispatch(fetchTourData())}
        refreshing={loading}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {error ? 'Không tải được danh sách tour.' : 'Chưa có tour nào!'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.name || item.title || 'Chưa có tên tour'}
            </Text>
            <Text style={styles.price}>
              Giá:{' '}
              {item.price != null
                ? `${Number(item.price).toLocaleString('vi-VN')} VNĐ`
                : 'Chưa cập nhật'}
            </Text>
            <Text style={styles.id}>Mã tour: {item.id || 'Chưa có'}</Text>

            <View style={styles.actionRow}>
              <View style={styles.actionButton}>
                <Button
                  title={updating && editingTourId === item.id ? 'Đang sửa...' : 'Sửa'}
                  onPress={() => openEditForm(item)}
                  disabled={updating || deleting}
                />
              </View>
              <View style={styles.actionButton}>
                <Button
                  title={deleting && deletingTourId === item.id ? 'Đang xóa...' : 'Xóa'}
                  color="#D92D20"
                  onPress={() => {
                    setDeleteMessage('');
                    setTourToDelete(item);
                  }}
                  disabled={updating || deleting || deletingTourId !== null}
                />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 45,
    backgroundColor: '#F5F7FA',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#0F62FE',
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  cancelButton: {
    marginTop: 8,
  },
  list: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    color: '#0F62FE',
    marginBottom: 6,
  },
  id: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    color: '#666666',
    paddingVertical: 20,
  },
  error: {
    color: '#D92D20',
    marginBottom: 12,
    fontWeight: '600',
  },
  deleteMessage: {
    color: '#344054',
    marginBottom: 12,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  confirmDialog: {
    width: '100%',
    maxWidth: 420,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  confirmText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  confirmButton: {
    minWidth: 80,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  cancelConfirmButton: {
    backgroundColor: '#F2F4F7',
  },
  deleteConfirmButton: {
    backgroundColor: '#D92D20',
  },
  cancelConfirmText: {
    color: '#344054',
    fontWeight: '600',
  },
  deleteConfirmText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
