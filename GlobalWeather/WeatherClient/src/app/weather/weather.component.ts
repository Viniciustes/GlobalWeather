import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { LocationService } from '../shared/services/location.service';
//import { CurrentConditionsService } from '../shared/services/current-conditions.service';
import { Country } from '../shared/models/country';
import { City } from '../shared/models/city';
//import { City } from '../shared/models/city';
//import { CurrentConditions } from '../shared/models/current-conditions';
//import { Weather } from '../shared/models/weather';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  private weatherForm: FormGroup;
  private countries: Array<Country> = [];
  private city: City;
  //private weather: Weather;
  private errorMessage: string;

  @ViewChild('instance')
  instanceCountry: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) { }

  async ngOnInit() {
    this.weatherForm = this.buildForm();
    await this.getCountries();
  }

  buildForm(): FormGroup {
    return this.fb.group({
      searchGroup: this.fb.group({
        country: [
          null
        ],
        city: [
          null,
          [Validators.required]
        ],
      })
    });
  }

  async getCountries() {
    const promise = new Promise((resolve, reject) => {
      this.locationService.getCountries()
        .toPromise()
        .then(
          res => { // Success
            this.countries = res;
            resolve();
          },
          err => {
            this.errorMessage = err;
            reject(err);
          }
        );
    });
    await promise;
  }

  async getCity() {
    const country = this.countryControl.value as Country;
    const searchText = this.cityControl.value as string;
    const countryCode = country ? country.ID : null;
    const promise = new Promise((resolve, reject) => {
      this.locationService.getCities(searchText, countryCode)
        .toPromise()
        .then(
          res => { // Success
            var data = res as City[];
            const cities = data;
            if (cities.length === 0) {
              this.errorMessage = 'Cannot find the specified location.';
              reject(this.errorMessage);
            } else {
              this.city = cities[0];
              resolve();
            }
          },
          err => {
            this.errorMessage = err;
            reject(err);
          }
        );
    });
    await promise;
    if (this.city) {
      const country = this.countries.filter(x => x.ID === this.city.Country.ID)[0];
      this.weatherForm.patchValue({
        searchGroup: {
          country: country,
          city: this.city.EnglishName
        }
      });
    }
  }

  get cityControl(): FormControl {
    return <FormControl>this.weatherForm.get('searchGroup.city');
  }

get countryControl(): FormControl {
    return <FormControl>this.weatherForm.get('searchGroup.country');
 }

  countryFormatter = (country: Country) => country.EnglishName;

  searchCountry = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instanceCountry.isPopupOpen()));
    const inputFocus$ = this.focus$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === ''
        ? this.countries
        : this.countries.filter(v => v.EnglishName.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }
}