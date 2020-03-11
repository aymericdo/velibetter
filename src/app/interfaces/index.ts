export interface Marker {
  id: number;
  lat: number;
  lng: number;
}

export interface Station {
  stationId: number;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  distance?: number;
  numBikesAvailable: number;
  numDocksAvailable: number;
  isInstalled: boolean;
  isReturning: boolean;
  isRenting: boolean;
  lastReported: number;
  mechanical: number;
  ebike: number;
  rentalMethods: string[];
}

export interface Coordinate {
  lat: number;
  lng: number;
}
