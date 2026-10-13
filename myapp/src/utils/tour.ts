export type Tour = {
  id: string;
  name: string;
  city: string;
  days: number;
  price: number;
  seats: number;
  departure: string;
  image: string;
  isFavorite: boolean;
};

export type TourSection = {
  title: string;
  data: Tour[];
};

export function groupByCity(tours: Tour[]): TourSection[] {
  const groups: Record<string, Tour[]> = {};

  tours.forEach((tour) => {
    if (!groups[tour.city]) groups[tour.city] = [];
    groups[tour.city].push(tour);
  });

  return Object.keys(groups)
    .sort((a, b) => a.localeCompare(b, "vi"))
    .map((city) => ({
      title: city,
      data: groups[city].sort(
        (a, b) =>
          a.departure.localeCompare(b.departure)
      ),
    }));
}

export function formatDate(date: string): string {
  const parts = date.split("-");
  if (parts.length !== 3) return date;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

export function getSeatLabel(seats: number): string {
  if (seats <= 0) return "Hết chỗ";
  if (seats <= 3) return `Chỉ còn ${seats} chỗ`;
  return `Còn ${seats} chỗ`;
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("vi-VN")} ₫`;
}
