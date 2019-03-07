import { Country } from 'src/app/shared/models/country';

export interface City {
  Key: string;
  EnglishName: string;
  Type: string;
  Country: Country;
}

