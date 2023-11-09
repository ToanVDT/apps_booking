import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MatIconModule} from '@angular/material/icon'
import { MatButtonModule} from '@angular/material/button'
import { MatMenuModule} from '@angular/material/menu'
import { MatDialogModule} from '@angular/material/dialog'
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { MatSelectModule } from '@angular/material/select';
import {MatListModule} from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SearchWidgetComponent } from './components/search-widget/search-widget.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatTabsModule} from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    SpinnerComponent,
    ConfirmDialogComponent,
    SearchWidgetComponent,
    UnauthorizedComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatListModule,
    MatSidenavModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatGridListModule,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatTabsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatTooltipModule,
    RouterModule
  ],
  exports:[
    MatIconModule,
    NavbarComponent,
    MatFormFieldModule,
    FooterComponent,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatListModule,
    MatSidenavModule,
    MatMenuModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatGridListModule,
    MatCardModule,
    MatProgressBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    SpinnerComponent,
    ConfirmDialogComponent,
    SearchWidgetComponent,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    MatTabsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    UnauthorizedComponent,
    MatStepperModule,
    MatSlideToggleModule,
    MatTooltipModule,
    RouterModule
  ]
})
export class ShareModule { }
