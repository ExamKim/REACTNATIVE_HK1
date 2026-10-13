
import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Tour, formatDate, formatPrice, getSeatLabel } from "../utils/tour";

export type TourItemProps = {
  tour: Tour;
  compact?: boolean;
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
};

function TourItem({
  tour,
  compact = false,
  onPress,
  onToggleFavorite,
}: TourItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.card, compact && styles.compactCard]}
      onPress={() => onPress(tour)}
    >
      <View style={compact ? styles.compactImageWrap : styles.imageWrap}>
        <Image
          source={{ uri: tour.image }}
          style={compact ? styles.compactImage : styles.image}
        />
        <TouchableOpacity
          testID="fav-btn"
          style={[styles.heart, compact && styles.heartOverlay]}
          onPress={() =>
            onToggleFavorite(tour.id, !tour.isFavorite)
          }
        >
          <Text style={styles.heartText}>
            {tour.isFavorite ? "♥" : "♡"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.info}>
        <Text numberOfLines={compact ? 1 : 2} style={styles.name}>
          {tour.name}
        </Text>

        <Text style={styles.price}>{formatPrice(tour.price)}</Text>

        {!compact && (
          <>
            <Text style={styles.detail}>📍 {tour.city}</Text>
            <Text style={styles.detail}>
              📅 {formatDate(tour.departure)} • {tour.days} ngày
            </Text>
            <Text
              style={[
                styles.seats,
                tour.seats <= 3 && styles.lowSeats,
              ]}
            >
              {getSeatLabel(tour.seats)}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    alignItems: "center",
  },
  compactCard: {
    flexDirection: "column",
    width: 160,
    padding: 0,
    marginHorizontal: 0,
    marginVertical: 0,
    alignItems: "stretch",
    overflow: "hidden",
  },
  imageWrap: {
    width: 90,
    height: 90,
    position: "relative",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  compactImageWrap: {
    width: "100%",
    aspectRatio: 4 / 3,
    position: "relative",
  },
  compactImage: {
    width: "100%",
    height: "100%",
  },
  heart: {
    padding: 5,
    alignSelf: "center",
  },
  heartOverlay: {
    position: "absolute",
    right: 5,
    top: 5,
    backgroundColor: "#FFFFFFDD",
    borderRadius: 20,
  },
  heartText: {
    color: "#E53935",
    fontSize: 25,
  },
  info: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#183153",
  },
  price: {
    color: "#087F5B",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 5,
  },
  detail: {
    fontSize: 12,
    color: "#555555",
    marginTop: 4,
  },
  seats: {
    color: "#27864B",
    marginTop: 4,
    fontSize: 12,
  },
  lowSeats: {
    color: "#D62828",
    fontWeight: "700",
  },
});

export default React.memo(TourItem);