# 🅰️ Angular — Do Básico ao Avançado

O **Angular** é o framework frontend da Google para construir aplicações web modernas, robustas e escaláveis. Diferente do React (que é uma biblioteca), Angular vem com **tudo incluso**: roteamento, formulários, HTTP, injeção de dependência, build e testes — sem precisar montar nada manualmente.

---

## 1. 🎯 Quando usar Angular

Angular é a escolha certa quando você precisa de:

- **Padronização forte** — arquitetura consistente para times grandes
- **SPAs corporativas** — dashboards, sistemas administrativos, ERPs
- **Formulários complexos** — validações em camadas, campos dinâmicos
- **Frontends integrados com APIs REST** — ciclo CRUD completo
- **Escalabilidade de time** — todos seguem as mesmas convenções

> **Angular vs React vs Vue:** Angular é opinado e completo. React é flexível e requer mais escolhas. Vue é progressivo e gentil para iniciantes. Para sistemas corporativos de médio/grande porte, Angular vence em padronização.

---

## 2. 🎒 Pré-requisitos e Instalação

- Node.js 18 ou superior
- VS Code com a extensão **Angular Language Service**
- Familiaridade básica com TypeScript

```bash
# Instalar o Angular CLI globalmente
npm install -g @angular/cli

# Verificar versão
ng version

# Criar um novo projeto
ng new meu-projeto
# ? Would you like to add Angular routing? Yes
# ? Which stylesheet format? SCSS

# Rodar em desenvolvimento
cd meu-projeto
ng serve --open
```

Acesse `http://localhost:4200`. O servidor recarrega automaticamente a cada alteração.

---

## 3. 🗂️ Estrutura do Projeto

```text
meu-projeto/
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Componente raiz
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.routes.ts          # Configuração de rotas
│   ├── assets/                    # Imagens, fontes, arquivos estáticos
│   ├── environments/              # Variáveis por ambiente (dev/prod)
│   ├── index.html                 # HTML raiz
│   ├── main.ts                    # Bootstrap da aplicação
│   └── styles.scss                # Estilos globais
├── angular.json                   # Configuração do Angular CLI
├── tsconfig.json
└── package.json
```

**Bootstrap moderno** em `main.ts`:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { authInterceptor } from './app/core/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
});
```

---

## 4. 🧱 Componentes

Componentes são os blocos fundamentais do Angular. No Angular moderno, são **standalone** por padrão — sem necessidade de `NgModule`.

```ts
// src/app/clientes/clientes.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteService } from '../core/services/cliente.service';
import { Cliente } from '../core/models/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  clientes: Cliente[] = [];

  ngOnInit(): void {
    this.clienteService.listar().subscribe({
      next: (dados) => this.clientes = dados,
      error: (err) => console.error(err)
    });
  }
}
```

```bash
# Gerar componente via CLI (já cria os 3 arquivos)
ng generate component clientes
# ou abreviado:
ng g c clientes
```

### Lifecycle Hooks

| Hook | Quando é chamado |
|------|-----------------|
| `ngOnInit` | Após inicializar o componente (use para buscar dados) |
| `ngOnChanges` | Sempre que um `@Input()` muda |
| `ngOnDestroy` | Antes de destruir o componente (use para limpar subscriptions) |
| `ngAfterViewInit` | Após renderizar o template e filhos |

---

## 5. 📐 Templates e Data Binding

O template é a parte visual do componente. Pode ser inline (`template:`) ou em arquivo separado (`templateUrl:`).

```html
<!-- Interpolação -->
<h1>{{ titulo }}</h1>

<!-- Property binding -->
<img [src]="imagemUrl" [alt]="descricao">

<!-- Event binding -->
<button (click)="salvar()">Salvar</button>
<input (keyup.enter)="buscar()">

<!-- Two-way binding -->
<input [(ngModel)]="nome">
<p>Digitando: {{ nome }}</p>

<!-- Class e style binding -->
<div [class.ativo]="isAtivo">...</div>
<p [style.color]="corTexto">Texto colorido</p>
```

---

## 6. 🔀 Diretivas e Controle de Fluxo

### Sintaxe moderna (Angular 17+) — recomendada

```html
<!-- Condicional -->
@if (usuario) {
  <p>Olá, {{ usuario.nome }}</p>
} @else {
  <p>Faça login para continuar</p>
}

<!-- Loop com track obrigatório -->
@for (item of itens; track item.id) {
  <li>{{ item.nome }}</li>
} @empty {
  <p>Nenhum item encontrado</p>
}

<!-- Conteúdo adiado (melhor performance) -->
@defer (on viewport) {
  <app-grafico />
} @placeholder {
  <p>Carregando gráfico...</p>
} @loading (minimum 300ms) {
  <app-spinner />
}
```

### Sintaxe clássica com diretivas estruturais

```html
<p *ngIf="ativo; else inativo">Está ativo</p>
<ng-template #inativo><p>Inativo</p></ng-template>

<li *ngFor="let item of itens; trackBy: trackById">{{ item.nome }}</li>

<div [ngClass]="{ 'erro': temErro, 'sucesso': sucesso }">Mensagem</div>
<p [ngStyle]="{ 'color': cor, 'font-size': tamanho + 'px' }">Texto</p>
```

```ts
// trackBy — essencial para listas que mudam com frequência
trackById(index: number, item: any): number {
  return item.id;
}
```

---

## 7. 🔧 Pipes

Pipes transformam dados diretamente no template, sem lógica no componente.

```html
<p>{{ nome | uppercase }}</p>
<p>{{ preco | currency:'BRL':'symbol':'1.2-2' }}</p>
<p>{{ hoje | date:'dd/MM/yyyy HH:mm' }}</p>
<p>{{ objeto | json }}</p>
<p>{{ texto | slice:0:100 }}</p>
```

**Pipe customizado:**

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpf', standalone: true })
export class CpfPipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
```

```html
<p>{{ '12345678901' | cpf }}</p>  <!-- 123.456.789-01 -->
```

---

## 8. 📡 Comunicação entre Componentes

### `@Input()` — pai para filho

```ts
// filho.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-cliente',
  standalone: true,
  template: `<div class="card"><h3>{{ cliente.nome }}</h3></div>`
})
export class CardClienteComponent {
  @Input() cliente!: { nome: string; email: string };
}
```

```html
<!-- pai.component.html -->
<app-card-cliente [cliente]="clienteSelecionado" />
```

### `@Output()` — filho para pai

```ts
// botao-acao.component.ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-botao-acao',
  standalone: true,
  template: `<button (click)="confirmar()">Confirmar</button>`
})
export class BotaoAcaoComponent {
  @Output() confirmado = new EventEmitter<void>();

  confirmar() {
    this.confirmado.emit();
  }
}
```

```html
<!-- pai.component.html -->
<app-botao-acao (confirmado)="salvar()" />
```

---

## 9. 🔄 Services e Injeção de Dependência

Services centralizam a lógica de negócio e são singletons injetados automaticamente onde precisar.

```ts
// src/app/core/services/cliente.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/clientes`;

  listar(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.api);
  }

  buscarPorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.api}/${id}`);
  }

  criar(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
    return this.http.post<Cliente>(this.api, cliente);
  }

  atualizar(id: number, cliente: Partial<Cliente>): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.api}/${id}`, cliente);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`).pipe(
      catchError(err => throwError(() => err))
    );
  }
}
```

```bash
# Gerar service via CLI
ng g s core/services/cliente
```

---

## 10. 🔀 Roteamento

```ts
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  // Carregamento direto
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },

  // Com guard de autenticação
  {
    path: 'clientes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/clientes/clientes.component')
        .then(m => m.ClientesComponent)
  },

  // Rota com parâmetro
  {
    path: 'clientes/:id',
    loadComponent: () =>
      import('./features/clientes/cliente-detalhe/cliente-detalhe.component')
        .then(m => m.ClienteDetalheComponent)
  },

  // 404
  { path: '**', redirectTo: 'dashboard' }
];
```

**Lendo parâmetros de rota:**

```ts
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

export class ClienteDetalheComponent implements OnInit {
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // ou via Observable para reuso do componente na mesma rota:
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
    });
  }
}
```

**Navegação no template:**

```html
<nav>
  <a routerLink="/dashboard" routerLinkActive="ativo">Dashboard</a>
  <a routerLink="/clientes" routerLinkActive="ativo">Clientes</a>
  <a [routerLink]="['/clientes', cliente.id]">Ver detalhe</a>
</nav>

<router-outlet />
```

### Guard de autenticação

```ts
// src/app/core/guards/auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
```

---

## 11. 📋 Formulários

### Template-driven — para formulários simples

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <form #form="ngForm" (ngSubmit)="salvar(form.value)">
      <input name="nome" ngModel required placeholder="Nome" />
      <button type="submit" [disabled]="form.invalid">Salvar</button>
    </form>
  `
})
export class FormSimplesComponent {
  salvar(dados: any) { console.log(dados); }
}
```

### Reactive Forms — para formulários complexos (recomendado)

```ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './cliente-form.component.html'
})
export class ClienteFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    nome:  ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    cpf:   ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
    // FormArray para lista dinâmica
    telefones: this.fb.array([this.fb.control('')])
  });

  get telefones() {
    return this.form.get('telefones') as any;
  }

  adicionarTelefone() {
    this.telefones.push(this.fb.control(''));
  }

  salvar() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

```html
<!-- cliente-form.component.html -->
<form [formGroup]="form" (ngSubmit)="salvar()">

  <input formControlName="nome" placeholder="Nome" />
  @if (form.get('nome')?.invalid && form.get('nome')?.touched) {
    <span class="erro">Nome obrigatório (mínimo 3 caracteres)</span>
  }

  <input formControlName="email" placeholder="E-mail" />
  @if (form.get('email')?.errors?.['email']) {
    <span class="erro">E-mail inválido</span>
  }

  <div formArrayName="telefones">
    @for (tel of telefones.controls; track $index) {
      <input [formControlName]="$index" placeholder="Telefone" />
    }
    <button type="button" (click)="adicionarTelefone()">+ Telefone</button>
  </div>

  <button type="submit" [disabled]="form.invalid">Salvar</button>
</form>
```

---

## 12. 🌐 HttpClient

**Registro** em `main.ts` (já feito na seção de estrutura):

```ts
provideHttpClient(withInterceptors([authInterceptor]))
```

**Model com interface TypeScript:**

```ts
// src/app/core/models/cliente.model.ts
export interface Cliente {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  criadoEm: string;
}
```

**RxJS com operadores:**

```ts
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

listar() {
  return this.http.get<Cliente[]>(this.api).pipe(
    tap(() => console.log('Buscando...')),
    map(clientes => clientes.filter(c => c.ativo)),
    catchError(err => {
      console.error('Erro na API:', err);
      return throwError(() => err);
    })
  );
}
```

### Interceptor JWT

```ts
// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  const reqComToken = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqComToken);
};
```

---

## 13. ⚡ Signals — Reatividade Moderna

Signals são o modelo moderno de reatividade do Angular (v16+), mais eficiente que o `ChangeDetection` padrão.

```ts
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-contador',
  standalone: true,
  template: `
    <p>Contador: {{ contador() }}</p>
    <p>Dobro: {{ dobro() }}</p>
    <button (click)="incrementar()">+</button>
    <button (click)="resetar()">Reset</button>
  `
})
export class ContadorComponent {
  // Signal — valor reativo
  contador = signal(0);

  // Computed — derivado de outros signals
  dobro = computed(() => this.contador() * 2);

  constructor() {
    // Effect — reage a mudanças de signals
    effect(() => {
      console.log(`Contador mudou para: ${this.contador()}`);
    });
  }

  incrementar() { this.contador.update(v => v + 1); }
  resetar()     { this.contador.set(0); }
}
```

**Signal com objeto:**

```ts
usuario = signal<{ nome: string; nivel: number } | null>(null);

// Atualizar campo específico
this.usuario.update(u => u ? { ...u, nivel: u.nivel + 1 } : u);
```

---

## 14. 🏗️ Organização Profissional

Para projetos reais, adote a estrutura **Core / Shared / Features**:

```text
src/app/
├── core/                    # Singletons e infraestrutura
│   ├── guards/              # authGuard, roleGuard
│   ├── interceptors/        # authInterceptor, errorInterceptor
│   ├── services/            # ClienteService, AuthService
│   └── models/              # Interfaces TypeScript
│
├── shared/                  # Componentes e utilitários reutilizáveis
│   ├── components/          # ButtonComponent, ModalComponent
│   ├── pipes/               # CpfPipe, CurrencyBrPipe
│   └── directives/          # AutofocusDirective
│
├── features/                # Um módulo por feature/domínio
│   ├── auth/                # login, cadastro, recuperar-senha
│   ├── dashboard/
│   ├── clientes/            # list, form, detalhe
│   └── relatorios/
│
├── app.component.ts
└── app.routes.ts
```

> **Regra de ouro:** componentes em `features/` são burros — recebem dados por `@Input()` e emitem eventos por `@Output()`. Toda lógica de negócio fica nos services de `core/`.

---

## 15. 🏗️ Build para Produção

```bash
# Build otimizado — gera em dist/meu-projeto/
ng build --configuration production

# Análise de bundle (requer source-map-explorer)
npx source-map-explorer dist/meu-projeto/browser/*.js
```

**Variáveis de ambiente:**

```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.meusite.com.br'
};
```

Uso no service:
```ts
import { environment } from '../../../environments/environment';
private api = `${environment.apiUrl}/clientes`;
```

---

## 16. 📦 Comandos CLI Essenciais

| Comando | Ação |
|---------|------|
| `ng serve` | Inicia servidor de desenvolvimento |
| `ng serve --open` | Abre o browser automaticamente |
| `ng build` | Build de desenvolvimento |
| `ng build --configuration production` | Build otimizado |
| `ng g c caminho/nome` | Gera componente |
| `ng g s caminho/nome` | Gera service |
| `ng g pipe caminho/nome` | Gera pipe |
| `ng g guard caminho/nome` | Gera guard |
| `ng g interface caminho/nome` | Gera interface TypeScript |
| `ng test` | Executa testes unitários (Karma + Jasmine) |
| `ng lint` | Analisa o código com ESLint |
| `ng update` | Atualiza Angular e dependências |
| `ng add @angular/material` | Adiciona Angular Material |

---

## 17. 💡 Boas Práticas

- **Prefira `inject()`** a constructor injection — mais limpo e testável
- **Use `@defer`** para adiar componentes pesados (gráficos, tabelas grandes)
- **Use Signals** em vez de `BehaviorSubject` para estado local
- **Sempre implemente `trackBy`** (ou `track` na sintaxe nova) em listas
- **Desinscreva Observables** no `ngOnDestroy` ou use o operador `takeUntilDestroyed()`
- **Lazy load todas as rotas** — nunca importe componentes diretamente no `routes`
- **Tipar tudo com interfaces** — nunca use `any` em código de produção

```ts
// takeUntilDestroyed — forma moderna de cancelar subscriptions
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class MeuComponent {
  constructor() {
    this.service.listar()
      .pipe(takeUntilDestroyed())
      .subscribe(dados => this.dados = dados);
  }
}
```

---

## 18. 🔗 Recursos Adicionais

- [Documentação Oficial — angular.dev](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [RxJS — Operadores e Observables](https://rxjs.dev/guide/operators)
- [Angular Material — Componentes UI oficiais](https://material.angular.io)
- [Angular DevTools — Extensão Chrome para debug](https://angular.dev/tools/devtools)
