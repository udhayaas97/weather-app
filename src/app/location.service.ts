import { Injectable } from '@angular/core';
import { WeatherQueryParam } from './weather.interface';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor() {}

  getPosition(): Promise<WeatherQueryParam> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({
            lon: resp.coords.longitude?.toString(),
            lat: resp.coords.latitude?.toString(),
          });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}
