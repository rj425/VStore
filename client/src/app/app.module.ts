import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';  
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router'; 
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { ImageUploadModule } from 'angular2-image-upload';
import { SwiperModule } from 'angular2-useful-swiper';

// Importing defined Components
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { PostAdComponent } from './components/post-ad/post-ad.component';
import { SearchComponent } from './components/navbar/search/search.component';
import { AdDetailsComponent } from './components/ad-details/ad-details.component';

// Importing material Modules
import { MdButtonModule,MdProgressBarModule,MdTooltipModule,MdCardModule,MdGridListModule,MdTabsModule,MdChipsModule,MdMenuModule,MdDialogModule,MdToolbarModule,MdIconModule,MdSelectModule,MdInputModule,MdSnackBarModule,MdAutocompleteModule } from '@angular/material';

// Importing Services
import { VStoreService } from './shared/services/vStore.service';
import { AuthService } from './shared/services/auth.service';
import { CookieService } from 'angular2-cookie/core';
import { PageService } from './shared/services/page.service';
import { IsLoggedInGuard,IsLoggedOutGuard } from './shared/guards/auth.guard';
import { Ng2CarouselamosModule } from './shared/carousel/carouselamos';
import { ItemComponent } from './components/item/item.component';


const appRoutes:Routes=[
    {path:'', component:DashboardComponent,canActivate:[IsLoggedInGuard]},
    {path:'login', component:LoginComponent,canActivate:[IsLoggedInGuard]},
    {path:'dashboard', component:DashboardComponent},
    // {path:'dashboard', component:DashboardComponent,canActivate:[IsLoggedInGuard]},
    {path:'postAd',component:PostAdComponent},
    {path:'adDetails/:adID',component:AdDetailsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    PostAdComponent,
    SearchComponent,
    AdDetailsComponent,
    ItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    ImageUploadModule.forRoot(),
    MdButtonModule,MdProgressBarModule,MdCardModule,MdGridListModule,MdDialogModule,MdMenuModule,MdToolbarModule,MdSelectModule,MdIconModule,MdInputModule,MdSnackBarModule,MdAutocompleteModule,MdTabsModule,MdChipsModule,MdTooltipModule,  
    Ng2CarouselamosModule,
    SwiperModule
 ],
  providers: [VStoreService,CookieService,AuthService,IsLoggedInGuard,IsLoggedOutGuard,PageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
