import { Component, OnInit, forwardRef } from '@angular/core';
import { RegionsService } from '../../../core/services/regions.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { BaseControlValueAccessor } from '../BaseControlValueAccessort';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';
import { AutoCompleteBaseControl } from '../AutoCompleteBaseControl';

@Component({
  selector: 'app-cities-autocomplete',
  templateUrl: './cities-autocomplete.component.html',
  styleUrls: ['./cities-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CitiesAutocompleteComponent),
      multi: true
    }
  ]
})
export class CitiesAutocompleteComponent extends AutoCompleteBaseControl<any> implements ControlValueAccessor, OnInit {



  cities = [];

  constructor(private regigonService: RegionsService) { super() }



  displayFn(value) {
    if(!value) return ""; 
    return value.nameEn;
  }

  async ngOnInit() {
    this.cities = await this.regigonService.getAllCities('nameEn').toPromise();
   
  }
  filterValueChanged(value) {
    if (typeof value !== "object") {
      this.optionSelected(null);
    }
  }
   filter(value: string) {
    if (!value) return this.cities.slice();
    if(typeof value != "string") return this.filter(this.value ? this.value.nameEn : null ) ;

    return this.cities.filter(city => city.nameEn.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }


}
