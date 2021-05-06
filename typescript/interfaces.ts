export interface Todo {
  description: string;
  location: string;
}
export interface ILocation {
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  id: string;
  name: string;
}
