import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { fuseAnimations } from "../../../../../core/animations";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { AdsService } from "../../../../../core/services/ads.service";
import { CategoriesService } from "../../../../../core/services/categories.service";
import { RegionsService } from "../../../../../core/services/regions.service";
import { usersService } from "../../../../../core/services/users.service";

@Component({
  selector: "add-ad",
  templateUrl: "./add-ad.component.html",
  styleUrls: ["./add-ad.component.scss"],
  animations: fuseAnimations
})
export class AddAdComponent implements OnInit {
  form: FormGroup;
  formErrors: any;
  newAd: any = {};
  categories: any = [];
  category: any = {};
  subCategory: any = {};
  owners: any = [];
  owner: any = {};
  regions: any = [];
  region: any = {};
  subRegion: any = {};
  imgs: any = [];
  selectedFile: File;
  url: any;
  dataFormImgs: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private adServ: AdsService,
    private route: Router,
    private snack: MatSnackBar,
    private catServ: CategoriesService,
    private regServ: RegionsService,
    private userServ: usersService
  ) {
    this.newAd.isFeatured = false;
    this.category.subCategories = [];
    this.region.locations = [];
  }

  ngOnInit() {
    this.userServ.getAllUsers().subscribe(res => {
      this.owners = res;
      // debugger;
    });

    this.catServ.getAllCategories().subscribe(res => {
      this.categories = res;
      // debugger;
    });

    this.regServ.getAllCities().subscribe(res => {
      this.regions = res;
    });

    this.formErrors = {
      title: {},
      description: {},
      status: {},
      isFeatured: {},
      category: [],
      subCategory: [],
      city: [],
      location: [],
      owner: []
    };

    this.form = this.formBuilder.group({
      title: ["", Validators.required],
      description: ["", Validators.required],
      status: ["", Validators.required],
      isFeatured: [""],
      category: [this.categories[0], Validators.required],
      subCategory: [{}, Validators.required],
      city: [{}, Validators.required],
      location: ["", Validators.required],
      owner: [{}, Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.onFormValuesChanged();
    });
  }

  onFileChanged(event) {
    this.selectedFile = <File>event.target.files[0];

    var reader = new FileReader();

    reader.onload = (event: ProgressEvent) => {
      this.url = (<FileReader>event.target).result;
      this.imgs.push(this.url);
    };
    reader.readAsDataURL(event.target.files[0]);

    this.dataFormImgs.push(this.selectedFile);

    // debugger;
  }

  onupload() {
    const frmData: FormData = new FormData();
    for (let i = 0; i < this.dataFormImgs.length; i++) {
      frmData.append("file", this.dataFormImgs[i], this.dataFormImgs[i].name);
      // debugger;
    }
    /*  frmData.append("fileUpload", this.selectedFile); */
    this.adServ.uploadImages(frmData).subscribe(events => {
      this.newAd.media = events.body;
      console.log(this.newAd.media);
      // this.saveAd();
      // debugger;
    });
  }

  dd(event) {
    console.log(event);
  }

  saveAd() {
    var dateTemp = new Date();
    this.newAd.creationDate = dateTemp.toISOString();
    this.newAd.viewsCount = 0;
    this.newAd.ownerId = this.owner.id;
    this.newAd.categoryId = this.category.id;
    this.newAd.subCategoryId = this.subCategory.id;
    this.newAd.cityId = this.region.id;
    this.newAd.locationId = this.subRegion.id;

    if (!this.newAd.media) {
      this.newAd.media = [];
    }

    this.adServ.addNewAd(this.newAd).subscribe(
      res => {
        this.route.navigate(["/pages/ads-management"]);
        this.snack.open("You Succesfully entered a new Advertisement", "Done", {
          duration: 2000
        });
      },
      err => {
        this.snack.open(
          "Please Re-enter the right Advertisement information..",
          "OK"
        );
      }
    );
  }

  onFormValuesChanged() {
    for (const field in this.formErrors) {
      if (!this.formErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.formErrors[field] = {};

      // Get the control
      const control = this.form.get(field);

      if (control && control.dirty && !control.valid) {
        this.formErrors[field] = control.errors;
      }
    }
  }
}
