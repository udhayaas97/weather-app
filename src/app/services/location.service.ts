import { state } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { City, Country, LatLong, State } from '../location.interface';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  constructor(private httpClient: HttpClient) {}

  getPosition(): Promise<LatLong> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({
            lon: resp.coords.longitude,
            lat: resp.coords.latitude,
          });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  getCountryList(): Observable<Country[]> {
    return this.httpClient.get<Country[]>('assets/locations/countries.json');
  }

  getStateList(countryId?: number): Observable<State[]> {
    return new Observable((subscriber) => {
      this.httpClient
        .get<State[]>('assets/locations/states.json')
        .subscribe((data) => {
          if (countryId) {
            subscriber.next(
              data.filter((state) => state.country_id === countryId)
            );
          } else {
            subscriber.next(data);
          }
        });
    });
  }

  getCityList(stateId: number): Observable<City[]> {
    return new Observable((subscriber) => {
      this.httpClient
        .get<City[]>('assets/locations/cities.json')
        .subscribe((cities) => {
          if (stateId) {
            subscriber.next(cities.filter((city) => city.state_id === stateId));
          } else {
            subscriber.next(cities);
          }
        });
    });
  }
}
