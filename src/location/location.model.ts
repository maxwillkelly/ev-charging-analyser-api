export class Location {
  id: string;
  carId?: string;
  userId?: string;
  longitude: number;
  latitude: number;
  recordedAt: string;
  altitude?: number;
  heading?: number;
  altitudeAccuracy: number;
  speed: number;
  accuracy: number;
}
