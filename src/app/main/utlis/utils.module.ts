import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesAutoCompleteComponent } from './categories-auto-complete/categories-auto-complete.component';
import { SharedModule } from '../../core/modules/shared.module';
import { OwnersAutocompleteComponent } from './owners-autocomplete/owners-autocomplete.component';
import { SubCategoriesAutocompleteComponent } from './sub-categories-autocomplete/sub-categories-autocomplete.component';
import { CitiesAutocompleteComponent } from './cities-autocomplete/cities-autocomplete.component';
import { LocationsAutocompleteComponent } from './locations-autocomplete/locations-autocomplete.component';
import { BusinessCategoriesAutocompleteComponent } from './business-categories-autocomplete/business-categories-autocomplete.component';
import { BusinessSubCategoriesAutocompleteComponent } from './business-sub-categories-autocomplete/business-sub-categories-autocomplete.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CategoriesAutoCompleteComponent, OwnersAutocompleteComponent, CitiesAutocompleteComponent, SubCategoriesAutocompleteComponent, LocationsAutocompleteComponent , BusinessCategoriesAutocompleteComponent , BusinessSubCategoriesAutocompleteComponent
  ],
  
  declarations: [CategoriesAutoCompleteComponent, OwnersAutocompleteComponent, SubCategoriesAutocompleteComponent, CitiesAutocompleteComponent, LocationsAutocompleteComponent, BusinessCategoriesAutocompleteComponent, BusinessSubCategoriesAutocompleteComponent]
})
export class UtilsModule { }
