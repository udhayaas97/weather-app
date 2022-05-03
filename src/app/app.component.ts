import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LocationService } from './location.service';
import {
  Weather,
  WeatherElement,
  WeatherQueryParam,
} from './weather.interface';
import { WeatherService } from './weather.service';

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
  subscriptions = new Subscription();

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getCurrentLocation(): void {
    this.locationService
      .getPosition()
      .then((data) => {
        this.getWeatherFromLatLon(data);
      })
      .catch((error: GeolocationPositionError) => {
        if (error.code === 1) {
          this.isPermissionDenied = true;
        } else {
          this.isPermissionDenied = false;
        }
      });
  }

  private getWeatherFromLatLon(latLong: WeatherQueryParam): void {
    const weatherObserver = this.weatherService
      .getCurrentWeather(latLong)
      .subscribe((data: Weather) => {
        this.currentDate = new Date();
        this.weather = data;
        this.currentWeather = data?.weather[0];
        this.currentWeather.icon = `http://openweathermap.org/img/wn/${this.currentWeather?.icon}@2x.png`;
      });
    (data: HttpErrorResponse) => {
      // alert(data.error);
    };
    this.subscriptions.add(weatherObserver);
  }
}
