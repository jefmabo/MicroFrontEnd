import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'content1',
    children: [{ path: '**', component: EmptyRouteComponent }]
  },
  {
    path: 'content2',
    children: [{ path: '**', component: EmptyRouteComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
