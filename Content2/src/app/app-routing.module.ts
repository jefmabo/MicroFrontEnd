import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeContent2Component } from './home-content2/home-content2.component';

const routes: Routes = [
  {
    path: 'content2',
    component: HomeContent2Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
