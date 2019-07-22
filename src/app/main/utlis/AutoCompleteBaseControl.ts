import { ControlValueAccessor, FormControl } from '@angular/forms';
import { BaseControlValueAccessor } from './BaseControlValueAccessort';
import { Observable } from 'rxjs/Observable';
import { startWith, map } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

export class AutoCompleteBaseControl<T> extends BaseControlValueAccessor<T> {

  filterControl = new FormControl('');
  filteredOptions: Observable<any>;
  refreshSubject = new Subject(); 

  constructor() {
    super();
    
    this.filteredOptions = this.filterControl.valueChanges.merge(this.refreshSubject)
      .pipe(
        startWith(''),
        map(value => this.filter(value)),
      );

    this.filterControl.valueChanges.subscribe(this.filterValueChanged.bind(this));
  }
  filter(value) { return [] }
  filterValueChanged(value) { }


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
