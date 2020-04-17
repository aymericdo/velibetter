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
  score?: number;
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export enum FeedbackType {
  confirmed,
  broken
}

export interface Feedback {
  stationId: number;
  type: FeedbackType;
  numberMechanical?: number;
  numberEbike?: number;
  numberDock?: number;
}
