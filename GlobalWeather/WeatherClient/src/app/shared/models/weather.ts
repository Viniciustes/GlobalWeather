import { City } from 'src/app/shared/models/city';
import { CurrentConditions } from 'src/app/shared/models/current-conditions';

export class Weather {
    public location: string;
    public weatherIconUrl: string;
    public weatherText: string;
    public temperatureValue: number;
    public temperatureUnit: string;
    public isDaytime: boolean;

    public constructor(currentConditions: CurrentConditions, city: City) {
        this.location = city.EnglishName;
        this.weatherText = currentConditions.WeatherText;
        this.isDaytime = currentConditions.IsDayTime;
        if (currentConditions.WeatherIcon)
            this.weatherIconUrl = `./assets/images/${currentConditions.WeatherIcon}.png`;
        this.temperatureValue = currentConditions.Temperature.Metric.Value;
        this.temperatureUnit = currentConditions.Temperature.Metric.Unit;
    }
}