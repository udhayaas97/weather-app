import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { City, Country, LatLong, State } from './location.interface';
import { LocationService } from './services/location.service';
import { WeatherService } from './services/weather.service';
import {
  Weather,
  WeatherElement,
  WeatherQueryParam,
} from './weather.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  weather: Weather | undefined;
  isPermissionDenied: boolean | undefined;
  currentWeather: WeatherElement | undefined;
  currentDate: Date | undefined;
  isLoading = true;
  countries: Observable<Country[]>;
  subscriptions = new Subscription();
  states: Observable<State[]> | undefined;
  cities: Observable<City[]> | undefined;

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService
  ) {
    this.countries = locationService.getCountryList();
  }

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getCurrentLocation(): void {
    this.locationService
      .getPosition()
      .then((data: LatLong) => {
        const weatherParams: WeatherQueryParam = {
          lat: data.lat?.toString(),
          lon: data.lon?.toString(),
        };
        this.getWeather(weatherParams);
      })
      .catch((error: GeolocationPositionError) => {
        if (error.code === 1) {
          this.isPermissionDenied = true;
        } else {
          this.isPermissionDenied = false;
        }
      });
  }

  private getWeather(params: WeatherQueryParam): void {
    const weatherObserver = this.weatherService
      .getCurrentWeather(params)
      .subscribe((data: Weather) => {
        this.currentDate = new Date();
        this.weather = data;
        this.currentWeather = data?.weather[0];
        this.currentWeather.icon = `http://openweathermap.org/img/wn/${this.currentWeather?.icon}@2x.png`;
        this.isLoading = false;
      });
    this.subscriptions.add(weatherObserver);
  }

  public getVisibility(): string {
    if (this.weather && this.weather.visibility) {
      return this.weather.visibility > 1000
        ? `${this.weather.visibility / 1000} Km`
        : `${this.weather.visibility}m`;
    } else {
      return 'Not available';
    }
  }

  public onCountryChange(country: Country): void {
    this.states = this.locationService.getStateList(country.id);
  }

  public onStateChange(state: State): void {
    this.cities = this.locationService.getCityList(state.id);
  }

  public onCityChange(city: City): void {
    const weatherParams: WeatherQueryParam = {
      lat: city.latitude,
      lon: city.longitude,
    };
    this.getWeather(weatherParams);
  }
}
