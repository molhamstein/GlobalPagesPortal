import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { BaseControlValueAccessor } from '../BaseControlValueAccessort';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AutoCompleteBaseControl } from '../AutoCompleteBaseControl';

@Component({
  selector: 'app-sub-categories-autocomplete',
  templateUrl: './sub-categories-autocomplete.component.html',
  styleUrls: ['./sub-categories-autocomplete.component.scss'],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SubCategoriesAutocompleteComponent),
      multi: true
    }
  ]
})
export class SubCategoriesAutocompleteComponent extends AutoCompleteBaseControl<any> implements ControlValueAccessor, OnInit {
  ngOnInit(): void {

  }


  _category = null;
  @Input() set category(category) {
    this._category = category;
    if(category && this.value && this.value.parentCategoryId == category.id ) return ; 
    this.filterControl.setValue('');
    this.optionSelected(null);
  }
  get categories(): any[] {
    if (this._category) return this._category.subCategories ? this._category.subCategories : [];
    return [];
  }
  constructor() {
    super();
  }


  displayFn(value) {
    if(!value) return "" ; 

    return value.titleEn;
  }


  filterValueChanged(value) {
    if (typeof value !== "object") {
      this.optionSelected(null);
    }
  }
  filter(value: string) {
    if (!value) return this.categories.slice();
    if (typeof value != "string") return this.filter( this.value ? this.value.titleEn : null );

    return this.categories.filter(cat => cat.titleEn.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }



}
