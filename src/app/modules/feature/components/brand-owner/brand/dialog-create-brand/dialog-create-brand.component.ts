import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Brand } from "../../model/brand.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BrandService } from "../../service/brand-service";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { AuthenticationService } from "../../../auth/service/authentication.service";

@Component({
  selector: "app-dialog-create-brand",
  templateUrl: "./dialog-create-brand.component.html",
  styleUrls: ["./dialog-create-brand.component.scss"],
})
export class DialogCreateBrandComponent implements OnInit {
  @Output() createOrUpdate = new EventEmitter<any>();

  brand: Brand = {};
  brandForm: FormGroup;
  user: any;
  selectedFile: any;
  img: any;
  nameDuplicated: boolean = false;
  phoneDuplicated: boolean = false;

  constructor(
    private brandService: BrandService,
    private auth: AuthenticationService
  ) {
    this.brandForm = new FormGroup({
      name: new FormControl(this.brand.name, [Validators.required]),
      address: new FormControl(this.brand.address, [Validators.required]),
      phone: new FormControl(this.brand.phone, [
        Validators.required,
        Validators.pattern(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)]),
      description: new FormControl(this.brand.description),
      // image: new FormControl(this.brand.image,[Validators.required]),
    });
  }

  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.brandForm.get("name")?.valueChanges.pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((data) => {
        if (data) {
          this.checkDuplicateName(data, this.user.data?.id);
        }
      });
    this.brandForm.get("phone")?.valueChanges.pipe(debounceTime(700), distinctUntilChanged())
      .subscribe((data) => {
        if (data) {
          this.checkDuplicatePhone(data, this.user.data?.id);
        }
      });
    this.brandForm.get("name")?.valueChanges.subscribe((data) => {
      this.brand.name = data;
    });
    this.brandForm.get("address")?.valueChanges.subscribe((data) => {
      this.brand.address = data;
    });
    this.brandForm.get("description")?.valueChanges.subscribe((data) => {
      this.brand.description = data;
    });
    this.brandForm.get("phone")?.valueChanges.subscribe((data) => {
      this.brand.phone = data;
    });
  }
  upLoad(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.img = event.target.result;
      };
    }
  }
  onSubmit() {
    if (this.brandForm.valid) {
      this.createOrUpdate.emit({ brand: this.brand, file: this.selectedFile });
    }
  }
  checkDuplicatePhone(phone: any, userId: any) {
    this.brandService.checkDuplicatePhoneBrand(phone, userId)
      .subscribe((data) => {
        this.phoneDuplicated = data;
        if(data){
          this.brandForm.get('phone')?.setErrors({phoneDuplicated:true})
        }
      });
  }
  checkDuplicateName(name: any, userId: any) {
    this.brandService.checkDuplicateNameBrand(name, userId)
      .subscribe((data) => {
        this.nameDuplicated = data;
        if(data){
          this.brandForm.get('name')?.setErrors({nameDuplicated:true})
        }
      });
  }
}
