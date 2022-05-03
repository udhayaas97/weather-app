import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Weather, WeatherQueryParam } from './weather.interface';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  readonly apiUrl = `${environment.apiUrl}/weather`;

  constructor(private httpClient: HttpClient) {}

  getCurrentWeather(weatherParams: WeatherQueryParam): Observable<Weather> {
    const params = new HttpParams().appendAll({
      appid: environment.openWeatherMapApiKey,
      ...weatherParams,
    });

    return this.httpClient.get<Weather>(this.apiUrl, { params: params });
  }
}
