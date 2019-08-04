import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { usersService } from '../../../core/services/users.service';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BaseControlValueAccessor } from '../BaseControlValueAccessort';
import { startWith, map, switchMap } from 'rxjs/operators';
import { AutoCompleteBaseControl } from '../AutoCompleteBaseControl';

@Component({
  selector: 'app-owners-autocomplete',
  templateUrl: './owners-autocomplete.component.html',
  styleUrls: ['./owners-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OwnersAutocompleteComponent),
      multi: true
    }
  ]
})
export class OwnersAutocompleteComponent extends AutoCompleteBaseControl<any> implements ControlValueAccessor, OnInit {




  @Input() all: boolean = false;

  constructor(private usersService: usersService) {
    super();
    //this.filteredOptions = this.filteredOptions.pipe(switchMap(e => e));
  }

  users = [];

  displayFn(value) {
    if (!value) return "";
    return value.username;
  }

  async ngOnInit() {
    this.users = await this.usersService.getAllUsers().toPromise();

  }
  filterControlValueChanged(value) {
    if (typeof value !== "object") {
      this.optionSelected(null);
    }
  }

  filter(value: string): Promise<any[]> {
    if (typeof value != "string") return this.filter(this.value ? this.value.username : '');
    return this.usersService.getUsers(0, 20, value).map(e => e.data).toPromise();
    //return this.users.filter(user => user && user.username && user.username.toLowerCase().indexOf(value.toLowerCase()) > -1);
  }


}

