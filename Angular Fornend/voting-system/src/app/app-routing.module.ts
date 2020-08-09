import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainHomeComponent } from './main-home/main-home.component';
import { AuthGuard } from './auth.guard';

//For wild character we can use page not found component
// we can also use lazy loading if we have multiples routes or modules to make it feasible.
const routes: Routes = [
  { path: '', component:  HomeComponent},
  { path: 'welcome', canActivate: [AuthGuard], component : MainHomeComponent},
  { path: 'admin', component:  HomeComponent},
  { path: '**' , component:  HomeComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponent = [HomeComponent, AppComponent, MainHomeComponent];

