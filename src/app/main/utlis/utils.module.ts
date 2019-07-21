import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesAutoCompleteComponent } from './categories-auto-complete/categories-auto-complete.component';
import { SharedModule } from '../../core/modules/shared.module';
import { OwnersAutocompleteComponent } from './owners-autocomplete/owners-autocomplete.component';
import { SubCategoriesAutocompleteComponent } from './sub-categories-autocomplete/sub-categories-autocomplete.component';
import { CitiesAutocompleteComponent } from './cities-autocomplete/cities-autocomplete.component';
import { LocationsAutocompleteComponent } from './locations-autocomplete/locations-autocomplete.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CategoriesAutoCompleteComponent, OwnersAutocompleteComponent, CitiesAutocompleteComponent, SubCategoriesAutocompleteComponent, LocationsAutocompleteComponent
  ],
  
  declarations: [CategoriesAutoCompleteComponent, OwnersAutocompleteComponent, SubCategoriesAutocompleteComponent, CitiesAutocompleteComponent, LocationsAutocompleteComponent]
})
export class UtilsModule { }
