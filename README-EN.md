## Micro front-end using Angular

In this project I develop an Angular application applying the micro front-end concepts.

They are three applications where the Principal is the root and two children applications (Content1 and Content2).

### Step by step

To follow this step by step It's necessary your machine has the Angular CLI intaled yet, I don't will approach this stage, we will start direct to the development. The Angular version used here is 10.0.4.


First of all, we will create our root application, to do this we just need to execute the command `ng new Principal --routing`. 

In the file src/app.component.html we will clear the content and let as below:

```
<h1>Micro front-end</h1>
<a routerLink="/content1">Content 1</a>
<a routerLink="/content2" style="margin-left:  20px;">Content 2</a>
<router-outlet></router-outlet>
```

In the asset folder we will create a new folder caller single-spa and inside it we will create 3 files responsibles to map our fron-end in the root application.

First we will create the file src/assets/single-spa/import-map.json, this file is resposible to map where are the 'mains' (the principal file) of each front-end.

The content is something like below:

```
{
    "imports": {
        "content1": "http://localhost:4201/main.js",
        "content2": "http://localhost:4202/main.js",
        "single-spa": "https://cdnjs.cloudflare.com/ajax/libs/single-spa/4.3.5/system/single-spa.min.js"
    }
}
```

Content1 and Content2 are our front-ends while single-spa is a library tha allow us to render this front-ends in our root application

The next file wich we will create will be the src/assets/single-spa/import-window-var.js that is responsible to register each host that are hosteds the front-ends.

The content will be something like below:

```
window.content1 = 'http://localhost:4201/'


window.content2 = 'http://localhost:4202/'
```

Lastly we will create the file src/assets/single-spa/import-map.js.

Do you remember the single-spa imported in the file import-map.json? So, now it enter in action, with this library we will do the register of each one of our front-end.

```
System.import('single-spa').then(function (singleSpa) {
    singleSpa.registerApplication(
        'content1', function () {
            return System.import('content1')
        },
        function (location) {
            return location.pathname.startsWith('/content1')
        }
    );


    singleSpa.registerApplication(
        'content2',
        function () {
            return System.import('content2')
        },
        function (location) {
            return location.pathname.startsWith('/content2')
        });


    singleSpa.start();
});
```

Created this 3 files, now we will import in the intex.html of the our root application. In the header (<head></head>) is necessary import the file import-map.json as well some libraries to everything works well. On below we have part of code with all this imports.

```
 <meta name="importmap-type" content="systemjs-importmap">
  <script type="systemjs-importmap" src="assets/single-spa/import-map.json"></script>
  
  <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/single-spa/5.3.4/system/single-spa.min.js" as="script" crossorigin="anonymous" />
  <script src='https://unpkg.com/core-js-bundle@3.1.4/minified.js'></script>
  <script src="https://unpkg.com/import-map-overrides@1.6.0/dist/import-map-overrides.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/4.0.0/system.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/4.0.0/extras/amd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/4.0.0/extras/named-exports.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/systemjs/4.0.0/extras/named-register.min.js"></script>
```

In the first and second line is where we import the import-map.json, the others are necessary dependencies to the application execution.

In the html body is necessary inject the files to register our front-ends.

```
<body>
  <app-root></app-root>
  <script src="assets/single-spa/import-window-var.js"></script>
  <script src="assets/single-spa/import-map.js"></script>  
</body>
```

Now, we will create a empty component to we can map the routes of our front-ends. Enough execute the command `ng generate component empty-route --inline-style=true --inline-template=true --skip-tests` and realize some ajusts.

After create the component, we will remove the @Component property style, the method ngOnInit and the interface OnInit and will have the template empty, in the final we will have a compoment as below:

```
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-empty-route',
  template: ''
})
export class EmptyRouteComponent {


  constructor() { }


}
```

Made this, now we will configure our routes in the file app-routing.module.ts.

```
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';


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
```

Finished the creation of principal application now we will create our micro front-ends.

To create the Content1 we will execute the command  `ng new Content1 --routing --prefix cnt1`.

The same type wich we created the root application with the command --routing we will create our Content1, the diference is the command --prefix, this command is necessary because each front-end has to have a distinct prefix to doesn't generate conflit between the applications, when this command is executed the value of selector property of decorator @Componente will come with the prefix cnt1. For example, imagine that was created a component called home, the selector of this componente will be cnt1-home.

Following the same dinamic, we will create the Content2 using the command `ng new Content2 --routing --prefix cnt2`.

With the both applications created, we will add the single-spa-angular dependency, for this we will use the command `ng add single-spa-angular`.

This dependency have to be add on all front-ends (Content1 and Content2), we could use the npm to do the install, but the ng beyond to install it configure the package on our application too.

When running this command, maybe you will can have to answer two questions about how your project is configurated, one question is whether we are using the Angular routing (in this example we are using) and the last one is whether we are using BrowserAnimationsModule (in our example we aren't using).

In the Content1 front-end package.json file, we will modify the property 'script start', it's have to be as below:

```
"scripts" : {
  ...
  "start" : "ng serve --port 4201",
  ...
}
```

In the Content2 front-end package.json file, we will modify the property 'script start', it's have to be as below:

```
"scripts" : {
  ...
  "start" : "ng serve --port 4202",
  ...
}
```

This modifications will serve to when we execute the command npm start the applications will start in the ports wich was configurated in the root application.
 
Here you can adjust all properties in this file wich are with the port 4200 to the new ports.

Next step is create a component to wich we will map our routes, on the Content1 we will create one called home-content1 and on the Content2 other called home-content-2 and we will configure the ports to when a request arrives on path /content1 or /content2 will be called your respectives home-contents.

Inside of Content1 project folder, we will execute the command `ng g c home-content1` and in the same way on the project Content2 with the command `ng g c home-content2`.

The routing module of the Content1 application should look like you can see below:

```
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeContent1Component } from './home-content1/home-content1.component';


const routes: Routes = [
  {
    path: 'content1',
    component: HomeContent1Component
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

The routing module of the Content2 application should look like you can see below:

```
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
```

In the  app.component.html file inside the applications Content1 and Content2, we will remove the content that is generated by default and replace with `<router-outlet></router-outlet>`.

Before to execute the applications is good to execute the command `npm install` on applications Content1 and Content2 to install some dependencies of single-spa-angular.

In this point I guess wich everything is working well, now enough to execute each one of applications using the command `npm start` and access the main application on http://localhost:4200.