import { ControlValueAccessor, FormControl } from '@angular/forms';
import { BaseControlValueAccessor } from './BaseControlValueAccessort';
import { Observable } from 'rxjs/Observable';
import { startWith, map, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';

export class AutoCompleteBaseControl<T> extends BaseControlValueAccessor<T> {

  filterControl = new FormControl('');
  filteredOptions: Observable<any>;
  refreshSubject = new Subject();

  constructor() {
    super();

    this.filteredOptions = this.filterControl.valueChanges.pipe(debounceTime(300) , distinctUntilChanged() ).merge(this.refreshSubject)
      .pipe(
        startWith(''),
        map(value => this.filter(value)) , 
        switchMap( value => {
            if(value instanceof Observable || value instanceof Promise  )  return value; 
            return of(value); 
        })
      );

    this.filterControl.valueChanges.subscribe(this.filterControlValueChanged.bind(this));
  }
  filter(value) : any[] | Promise<any[]>  { return [] }
  filterControlValueChanged(value) { }


  setValue(value) {
    this.value = value;
  }
  writeValue(value) {
    this.setValue(value);
    this.filterControl.setValue(value);
  }

  optionSelected(category) {
    this.setValue(category);
    this.onChange(category);
    this.onTouched(category);
  }

}
