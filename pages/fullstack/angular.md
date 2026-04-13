# 🅰️ Angular — Framework Frontend de Elite

O **Angular** é o framework frontend da Google para construir aplicações web robustas, escaláveis e de alto desempenho. Enquanto React é uma biblioteca, Angular é um framework completo — ele vem com tudo: roteamento, formulários, HTTP, injeção de dependência e muito mais, sem precisar instalar nada extra.

---

## 1. 🎯 O que é o Angular

Angular é ideal para:

- SPAs (Single Page Applications) corporativas
- Dashboards e sistemas administrativos
- Aplicações de grande escala com equipes grandes
- Integração com APIs REST e GraphQL
- PWAs (Progressive Web Apps)
- Aplicações em tempo real com WebSockets

A filosofia do Angular é **opinada**: ele dita a arquitetura, as convenções e a estrutura do projeto. Isso parece restritivo no começo, mas é exatamente o que faz equipes grandes entregarem código consistente.

---

## 2. 🛡️ Por que Angular e não React ou Vue?

| Critério | Angular | React | Vue |
|---------|---------|-------|-----|
| Tipo | Framework completo | Biblioteca UI | Framework progressivo |
| Linguagem | TypeScript (nativo) | JS/TSX | JS/TS |
| Curva de aprendizado | Alta | Média | Baixa |
| Arquitetura | Rígida e consistente | Livre | Semi-livre |
| Indicado para | Grandes sistemas | Qualquer escala | Projetos médios |
| Suporte | Google | Meta | Comunidade |

> Angular brilha em **sistemas corporativos complexos** onde padronização e manutenibilidade são mais importantes que velocidade inicial.

---

## 3. 🎒 Pré-requisitos

- Node.js 18 ou superior
- npm 9+
- Conhecimento básico de TypeScript
- VS Code com extensão **Angular Language Service**

---

## 4. ⚡ Instalação e Primeiro Projeto

```bash
# Instalar o Angular CLI globalmente
npm install -g @angular/cli

# Verificar versão
ng version

# Criar novo projeto
ng new meu-projeto

# Responder às perguntas:
# ? Would you like to add Angular routing? Yes
# ? Which stylesheet format? SCSS

# Entrar no projeto e rodar
cd meu-projeto
ng serve
```

Acesse `http://localhost:4200`. O servidor recarrega automaticamente a cada alteração.

---

## 5. 🗂️ Estrutura do Projeto

```
meu-projeto/
├── src/
│   ├── app/
│   │   ├── app.component.ts       # Componente raiz
│   │   ├── app.component.html     # Template raiz
│   │   ├── app.component.scss     # Estilos do componente raiz
│   │   ├── app.module.ts          # Módulo principal (NgModule)
│   │   └── app-routing.module.ts  # Configuração de rotas
│   ├── assets/                    # Imagens, fontes, arquivos estáticos
│   ├── environments/              # Variáveis por ambiente (dev/prod)
│   ├── index.html                 # HTML raiz
│   └── main.ts                    # Ponto de entrada da aplicação
├── angular.json                   # Configuração do Angular CLI
├── tsconfig.json                  # Configuração do TypeScript
└── package.json
```

---

## 6. 🧱 Componentes

Componentes são os blocos fundamentais do Angular. Cada componente é formado por três partes:

```typescript
// src/app/usuario/usuario.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuario',       // tag HTML: <app-usuario>
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  nome: string = 'Fábio';
  usuarios: string[] = ['Ana', 'Carlos', 'Maria'];

  ngOnInit(): void {
    // Executado ao inicializar o componente
    console.log('Componente carregado');
  }
}
```

```html
<!-- usuario.component.html -->
<h1>Olá, {{ nome }}</h1>

<ul>
  <li *ngFor="let u of usuarios">{{ u }}</li>
</ul>

<p *ngIf="usuarios.length > 0">Total: {{ usuarios.length }} usuários</p>
```

### Gerar componente via CLI

```bash
ng generate component usuario
# ou abreviado:
ng g c usuario
```

---

## 7. 📡 Services e Injeção de Dependência

Services centralizam a lógica de negócio e comunicação com APIs. São singletons injetados nos componentes automaticamente.

```typescript
// src/app/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // disponível em toda a aplicação
})
export class UsuarioService {
  private apiUrl = 'https://api.exemplo.com/usuarios';

  constructor(private http: HttpClient) {}

  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  criar(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

```typescript
// Injetar e usar no componente
export class UsuarioComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.listar().subscribe({
      next: (dados) => this.usuarios = dados,
      error: (err) => console.error(err)
    });
  }
}
```

```bash
# Gerar service via CLI
ng g s services/usuario
```

---

## 8. 🔀 Roteamento

```typescript
// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioDetalheComponent } from './usuario-detalhe/usuario-detalhe.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'usuarios/:id', component: UsuarioDetalheComponent },
  { path: '**', redirectTo: '' }  // rota coringa (404)
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

```html
<!-- Navegação no template -->
<nav>
  <a routerLink="/">Home</a>
  <a routerLink="/usuarios" routerLinkActive="ativo">Usuários</a>
</nav>

<!-- Onde as páginas são renderizadas -->
<router-outlet></router-outlet>
```

```typescript
// Acessar parâmetro de rota no componente
import { ActivatedRoute } from '@angular/router';

export class UsuarioDetalheComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID:', id);
  }
}
```

---

## 9. 📋 Formulários

Angular tem dois tipos de formulários:

### Template-driven (simples)

```html
<form #form="ngForm" (ngSubmit)="salvar(form)">
  <input name="nome" ngModel required placeholder="Nome" />
  <button type="submit" [disabled]="form.invalid">Salvar</button>
</form>
```

### Reactive Forms (recomendado para formulários complexos)

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class LoginComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

```html
<form [formGroup]="form" (ngSubmit)="login()">
  <input formControlName="email" placeholder="E-mail" />
  <span *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
    E-mail inválido
  </span>

  <input type="password" formControlName="senha" placeholder="Senha" />

  <button type="submit" [disabled]="form.invalid">Entrar</button>
</form>
```

---

## 10. 🔧 Diretivas Essenciais

| Diretiva | Tipo | Uso |
|---------|------|-----|
| `*ngIf` | Estrutural | Renderiza condicionalmente |
| `*ngFor` | Estrutural | Itera sobre listas |
| `*ngSwitch` | Estrutural | Switch/case no template |
| `[ngClass]` | Atributo | Aplica classes dinamicamente |
| `[ngStyle]` | Atributo | Aplica estilos dinamicamente |
| `[(ngModel)]` | Two-way binding | Sincroniza campo com variável |

```html
<!-- ngClass -->
<div [ngClass]="{ 'ativo': isAtivo, 'erro': hasErro }">Conteúdo</div>

<!-- ngStyle -->
<p [ngStyle]="{ 'color': corTexto, 'font-size': tamanho + 'px' }">Texto</p>

<!-- Two-way binding -->
<input [(ngModel)]="nome" />
<p>{{ nome }}</p>
```

---

## 11. 🏗️ Build para Produção

```bash
# Build otimizado para produção
ng build --configuration production

# Os arquivos ficam em dist/meu-projeto/
# Servir com nginx, Apache ou qualquer servidor estático
```

### Variáveis de ambiente

```typescript
// src/environments/environment.ts (desenvolvimento)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};

// src/environments/environment.prod.ts (produção)
export const environment = {
  production: true,
  apiUrl: 'https://api.meusite.com'
};
```

---

## 12. 📦 Comandos CLI Essenciais

| Comando | Ação |
|---------|------|
| `ng serve` | Inicia servidor de desenvolvimento |
| `ng build` | Compila o projeto |
| `ng g c nome` | Gera componente |
| `ng g s nome` | Gera service |
| `ng g m nome` | Gera módulo |
| `ng g pipe nome` | Gera pipe |
| `ng g guard nome` | Gera guard de rota |
| `ng test` | Executa testes unitários (Karma) |
| `ng lint` | Analisa o código com ESLint |
| `ng update` | Atualiza o Angular e dependências |

---

## 13. 💡 Boas Práticas

> **Módulos por feature:** Organize o projeto em módulos por funcionalidade (`UsuariosModule`, `ProdutosModule`), não por tipo de arquivo.

- Use **Lazy Loading** para módulos que não são necessários no carregamento inicial
- Sempre **desinscreva de Observables** no `ngOnDestroy` para evitar memory leaks
- Prefira **Reactive Forms** a Template-driven em formulários complexos
- Use `trackBy` no `*ngFor` para listas grandes (performance)
- Mantenha os **componentes "burros"** — lógica de negócio fica nos services
- Use o **Angular DevTools** (extensão Chrome) para depurar a árvore de componentes

---

## 14. 🔗 Recursos Adicionais

- [Documentação Oficial — angular.dev](https://angular.dev)
- [Angular CLI Reference](https://angular.dev/tools/cli)
- [RxJS — Operadores para Observables](https://rxjs.dev/guide/operators)
- [Angular Material — Componentes UI oficiais](https://material.angular.io)
