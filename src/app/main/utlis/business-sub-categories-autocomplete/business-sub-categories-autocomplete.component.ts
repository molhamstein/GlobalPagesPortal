import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { AutoCompleteBaseControl } from '../AutoCompleteBaseControl';
import { CategoriesService } from '../../../core/services/categories.service';
import { BusinessCategoriesService } from '../../../core/services/business-cat.service';

@Component({
  selector: 'app-business-sub-categories-autocomplete',
  templateUrl: './business-sub-categories-autocomplete.component.html',
  styleUrls: ['./business-sub-categories-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BusinessSubCategoriesAutocompleteComponent),
      multi: true
    }
  ]
})
export class BusinessSubCategoriesAutocompleteComponent extends AutoCompleteBaseControl<any> implements ControlValueAccessor, OnInit {


  _category = null;
  @Input() all: boolean = false;

  @Input() set category(category) {
    this._category = category;
    if (category && this.value && this.value.parentCategoryId == category.id) return;
    this.filterControl.setValue('');
    this.optionSelected(null);
  }
  _categories: any[] = [];
  get categories(): any[] {
    if (this.all) return this._categories;
    if (this._category) return this._category.subCategories ? this._category.subCategories : [];
    return [];
  }
  constructor(private categoryService: BusinessCategoriesService) {
    super();
  }

  async ngOnInit() {
    if (this.all)
      this._categories = await this.categoryService.getBusinessSubCategories("titleEn").toPromise(); 
  }

  displayFn(value) {
    if (!value) return "";

    return value.titleEn;
  }


  filterControlValueChanged(value) {
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
