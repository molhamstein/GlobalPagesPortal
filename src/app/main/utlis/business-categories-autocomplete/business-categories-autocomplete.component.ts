import { Component, OnInit, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AutoCompleteBaseControl } from '../AutoCompleteBaseControl';
import { CategoriesService } from '../../../core/services/categories.service';
import { BusinessCategoriesService } from '../../../core/services/business-cat.service';

@Component({
  selector: 'app-business-categories-autocomplete',
  templateUrl: './business-categories-autocomplete.component.html',
  styleUrls: ['./business-categories-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BusinessCategoriesAutocompleteComponent),
      multi: true
    }
  ]
})
export class BusinessCategoriesAutocompleteComponent extends AutoCompleteBaseControl<any> implements ControlValueAccessor, OnInit {


  categories = [];
  constructor(private categoriesService: BusinessCategoriesService) {
    super();
  }

  displayFn(value) {
    if (!value) return "";
    return value.titleEn;
  }

  async ngOnInit() {
    this.categories = await this.categoriesService.getBusinessCategories('titleEn').toPromise();
  }
  filterValueChanged(value) {
    if (typeof value !== "object") {
      this.optionSelected(null);
    }
  }

  filter(value: string) {
    if (!value) return this.categories.slice();
    if (typeof value != "string") return this.filter(this.value ? this.value.titleEn : null);

    return this.categories.filter(cat => cat.titleEn.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }

}
