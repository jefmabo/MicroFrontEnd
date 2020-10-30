## Micro front-end utilizando Angular

Neste projeto busco desenvolver uma aplicação Angular aplicando os conceitos de micro front-end.

São três aplicações sendo a Principal a aplicação root (raiz) e duas aplicações filhas (Content1 e Content2).

### Passo-a-passo

Para seguir este passo-a-passo é necessário que tenha em sua máquina o Angular CLI já instalado, não abordarei esta etapa, partiremos direto para o desenvolvimento. A versão do Angular utilizada aqui é 10.0.4.

Primeiro vamos criar nossa aplicação root, para isso basta executar o comando `ng new Principal --routing`. 

No arquivo src/app.component.html vamos limpar o conteúdo e deixar conforme abaixo:

```
<h1>Micro front-end</h1>
<a routerLink="/content1">Content 1</a>
<a routerLink="/content2" style="margin-left:  20px;">Content 2</a>
<router-outlet></router-outlet>
```

Na pasta assets vamos criar uma pasta chamada single-spa e dentro dela criaremos 3 arquivos que serão responsáveis por mapear nossos front-ends na aplicação principal.

Primeiro criaremos o arquivo src/assets/single-spa/import-map.json, este arquivo é responsável por mapear onde estão os 'mains' (o arquivo principal) de cada front-end.

O conteúdo deve ser algo como abaixo:

```
{
    "imports": {
        "content1": "http://localhost:4201/main.js",
        "content2": "http://localhost:4202/main.js",
        "single-spa": "https://cdnjs.cloudflare.com/ajax/libs/single-spa/4.3.5/system/single-spa.min.js"
    }
}
```

Content1 e Content2 são os nossos front-ends enquanto single-spa é uma biblioteca que nos permitirá renderizar estes em nossa aplicação principal.

O próximo arquivo que criaremos será o src/assets/single-spa/import-window-var.js que é responsável por registrar cada host em que estão hospedados os front-ends.

Seu conteúdo será algo como abaixo:

```
window.content1 = 'http://localhost:4201/'


window.content2 = 'http://localhost:4202/'
```

Por último iremos criar o arquivo src/assets/single-spa/import-map.js.

Lembra do single-spa importado no arquivo import-map.json? Então, agora ele entra em ação, com essa biblioteca faremos o registro de cada um dos nossos front-end.

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
Criado estes 3 arquivos agora os importaremos na index.html da nossa aplicação principal. No cabeçalho (<head></head>) é necessário a importação do arquivo import-map.json bem como algumas bibliotecas para que tudo funcione corretamente. Abaixo temos o trecho com todas estas importações.

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

Na primeira e segunda linha é onde importamos o import-map.json, as demais são dependências necessárias para execução da aplicação.

No corpo do HTML é necessário injetar os arquivos em que registramos nossos front-ends.

```
<body>
  <app-root></app-root>
  <script src="assets/single-spa/import-window-var.js"></script>
  <script src="assets/single-spa/import-map.js"></script>  
</body>
```

Agora iremos criar um componente vazio para que possamos mapear as rotas de nossos front-ends. Basta executar o comando `ng generate component empty-route --inline-style=true --inline-template=true --skip-tests` e realizar alguns ajustes.

Após criado o componente removeremos a propriedade styles de @Component, o método ngOnInit e a interface OnInit e deixaremos o template vazio, ao final teremos um componente como abaixo:

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

Feito isso, agora configuraremos nossas rotas no arquivo app-routing.module.ts

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

Concluída a criação da aplicação principal agora criaremos nossos micro front-ends.

Para criar o Content1 vamos executar o comando `ng new Content1 --routing --prefix cnt1`.

Da mesma forma que criamos a aplicação principal com o comando --routing criaremos nosso Content1, a diferença é a adição do comando --prefix, este comando é necessário pois cada front-end deve ter um prefixo distinto para não gerar conflito entre as aplicações, quando utilizado este comando o valor da propriedade selector do decorator @Component virá com o prefixo cnt1. Por exemplo, imaginamos que foi criado um componente chamado home, o seletor deste componente será cnt1-home.

Seguindo a mesma dinâmica, criaremos o componente Content2 com o comando `ng new Content2 --routing --prefix cnt2`.

Criado os dois componentes devemos adicionar a dependência single-spa-angular, para isso usaremos o comando `ng add single-spa-angular`.

Esta dependência deve ser adicionada em todos front-ends (Content1 e Content2), poderíamos utilizar o npm para fazer a instalação, mas o ng além de instalar também configura o pacote em nossa aplicação.

Ao executar este comando você poderá ter que responder duas perguntas a respeito de como seu projeto está configurado, uma pergunta se estamos utilizando o Angular routing (nesse exemplo estamos utilizando) e a segunda é se estamos utilizando BrowserAnimationsModule (para nosso exemplo não estamos utilizando).

No arquivo package.json do front-end Content1 alteraremos o comando script start, deverá ficar como abaixo:

```
"scripts" : {
  ...
  "start" : "ng serve --port 4201",
  ...
}
```

No arquivo package.json do front-end Content2 alteraremos o comando script start, deverá ficar como abaixo:

```
"scripts" : {
  ...
  "start" : "ng serve --port 4202",
  ...
}
```

Estas alterações servirão para quando executarmos o comando npm start as aplicações iniciem nas portas que foram configuradas na aplicação principal.

Já aproveita e ajusta as propriedades deste arquivo que estejam com a porta 4200 para as novas portas.

Próximo passo é criar um componente para que utilizaremos para mapear nossas rotas, no Content1 criarmos um chamado home-content1 e no Content2 um outro chamado home-content2 e configuraremos as rotas para quando chegar uma requisição no caminho /content1 ou /content2 sejam chamados seus respectivos home-content.

Dentro da pasta do projeto Content1 executamos o comando `ng g c home-content1` e da mesma forma no projeto Content2 com o comando `ng g c home-content2`.

O routing-module da aplicação Content1 deve ficar como abaixo:

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

O routing-module da aplicação Content2 deve ficar como abaixo:

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

No arquivo app.component.html do Content1 e do Content2 vamos remover o conteúdo que é gerado padrão e substituir pela tag `router-outlet></router-outlet>`.

Antes de executar as aplicações é bom também executar o comando npm install nas aplicações Content1 e Content2 para instalar alguma dependência do single-spa-angular.

Neste ponto acredito que esteja tudo funcionando corretamente, agora basta executar cada uma das aplicações utilizando o comando npm start e acessar a aplicação principal em http://localhost:4200.