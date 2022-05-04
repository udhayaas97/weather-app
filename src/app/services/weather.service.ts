import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Weather, WeatherQueryParam } from '../weather.interface';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  readonly apiUrl = `${environment.apiUrl}/weather`;

  constructor(private httpClient: HttpClient) {}

  getCurrentWeather(weatherParams: WeatherQueryParam): Observable<Weather> {
    let params = new HttpParams().appendAll({
      appid: environment.openWeatherMapApiKey,
      units: 'metric',
    });
    if (weatherParams.q) {
      params = params.append('q', weatherParams.q);
    } else if (weatherParams.lat && weatherParams.lon) {
      params = params.appendAll({
        lat: weatherParams.lat,
        lon: weatherParams.lon,
      });
    }
    return this.httpClient.get<Weather>(this.apiUrl, { params: params });
  }
}
