import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { BaseControlValueAccessor } from '../BaseControlValueAccessort';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';
import { AutoCompleteBaseControl } from '../AutoCompleteBaseControl';

@Component({
  selector: 'app-locations-autocomplete',
  templateUrl: './locations-autocomplete.component.html',
  styleUrls: ['./locations-autocomplete.component.scss'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocationsAutocompleteComponent),
      multi: true
    }
  ]
})
export class LocationsAutocompleteComponent extends AutoCompleteBaseControl<any> implements ControlValueAccessor, OnInit {



  _city = null;
  @Input() set city(city) {
    this._city = city;
    if(city && this.value && this.value.cityId == city.id ) return ; 

    this.filterControl.setValue('');
    this.optionSelected(null);

  }
  get locations(): any[] {
    if (this._city) return this._city.locations ? this._city.locations : [] ;
    return [];
  }
  constructor() {
    super();
  }


  displayFn(value) {
    if(!value) return "" ; 

    return value.nameEn;
  }

  setValue(value) {
    this.value = value;
  }


  optionSelected(location) {
    this.setValue(location);
    this.onChange(location);
    this.onTouched(location);
  }

  async ngOnInit() {

  }
  filterValueChanged(value) {
    if (typeof value !== "object") {
      this.optionSelected(null);
    }
  }
  filter(value: string) {
    if (!value) return this.locations.slice();
    if(typeof value != "string") return this.filter(this.value ?  this.value.nameEn : null ) ;

    return this.locations.filter(location => location.nameEn.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

  
}
