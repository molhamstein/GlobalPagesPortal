import { Component, OnInit, Input, Output, forwardRef } from '@angular/core';
import { CategoriesService } from '../../../core/services/categories.service';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AutoCompleteBaseControl } from '../AutoCompleteBaseControl';

@Component({
  selector: 'app-categories-auto-complete',
  templateUrl: './categories-auto-complete.component.html',
  styleUrls: ['./categories-auto-complete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CategoriesAutoCompleteComponent),
      multi: true
    }
  ]
})
export class CategoriesAutoCompleteComponent extends AutoCompleteBaseControl<any> implements ControlValueAccessor, OnInit {


  categories = [];
  constructor(private categoriesService: CategoriesService) {
    super();
  }

  displayFn(value) {
    if(!value) return "" ; 

    return value.titleEn;
  }

  async ngOnInit() {
    this.categories = await this.categoriesService.getCategories().toPromise();
  }
  filterValueChanged(value) {
    if (typeof value !== "object") {
      this.optionSelected(null);
    }
  }

  filter(value: string) {
    if (!value) return this.categories.slice();
    if(typeof value != "string")  return this.filter(this.value ? this.value.titleEn : null ); 
     
    return this.categories.filter(cat => cat.titleEn.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }



}
