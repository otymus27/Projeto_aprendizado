# ☕ Desenvolvendo Backend de Elite Mestre com Java e Spring Boot

O **Spring Boot** é um projeto do ecossistema Spring criado para aniquilar as configurações desnecessárias e simplificar a criação de APIs Java gigantescas e sistemas Full Stack massivos.

---

## 1. 🎯 O que é o Spring Boot

Especialmente feito para dominar os seguintes cenários:
- APIs REST
- Sistemas web fechados
- Microsserviços 
- Aplicações corporativas (Bancos, Sistemas Fiscais)
- Integrações brutas com Banco de Dados
- Autenticação JWT e OAuth
- Cloud messaging (Kafka, RabbitMQ)

Com o Boot, você monta a arquitetura na IDE, dá play, e ele sobe sozinho com milhares de padrões de ouro já configurados.

---

## 2. 🛡️ O problema que o Boot resolve

Antes dele, programar em Java e Spring puro exigia dezenas de arquivos `XML`, baixar manualmente os JARs do Tomcat. O Spring Boot trucidou essa barreira com:

- **Auto-configuration:** Ele "Adivinha" o que você quer usar baseado no que baixou.
- **Starters:** Em vez de `hibernate`, `jpa-driver` e `jdbc`, você apenas pede: `"SpringBoot_Data_JPA"`. E ele traz todo o bolo de pacotes conectados perfeitamente para você.
- **Servidor Embutido:** O Tomcat WebServer roda literalmente DENTRO do sistema sem você precisar o configurar por fora.

---

## 3. 🎒 O que você precisa ter Instalado

- Java 17 ou superior (Temurin ou Oracle)
- Maven ou Gradle
- IDE como IntelliJ IDEA (A melhor hoje), VS Code ou Eclipse
- Postman / Insomnia para testar os Links (Rotas API) HTTP 

---

## 4. 👶 O berço do projeto: Spring Initializr

Acesse o site **Spring Initializr** (`start.spring.io`) para moldar o esqueleto base de seu projeto. Sempre opte pelas dependências base:
- Spring Web (Cria APIs)
- Spring Data JPA (Domina o Banco Relacional)
- Spring Security (Trava sua API contra hackers)
- Lombok (Elimina código repetitivo - Gettys, Settys)
- DB Driver: MySQL ou PostgreSQL.

---

## 5. 🗂️ Estrutura de Camadas Clássica

Uma aplicação profissional é fragmentada na famosa arquitetura Hexagonal ou MVC Layered. A sua pasta SRC vai ser idêntica a isso:

\`\`\`text
src/
└── main/
    ├── java/
    │   └── com/nomedaempresa/nomedoprojeto/
    │       ├── controllers/       <-- A Recepcionista (Guida a rota HTTP)
    │       ├── services/          <-- O Advogado (Guarda as Regras Lógicas de Negócios)
    │       ├── repositories/      <-- O Arquivista (Fala com o Banco de Arquivos DB)
    │       ├── entities/          <-- As Tabelas em corpo Físico de Objeto
    │       ├── dtos/              <-- Os Transportadores limpos pra internet ver
    │       ├── config/            <-- Segurança, JWT e Cors
    │       ├── exceptions/        <-- Tratamento de erros Customizados
    │       └── ProjetoApplication.java <-- Ponto de Entrada mestre
    └── resources/
        ├── application.properties <-- Suas senhas e caminhos para Banco DB
        ├── static/
        └── templates/
\`\`\`

---

## 6. 🚀 O Motor de Ignição

\`\`\`java
package com.exemplo.projeto;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProjetoApplication {
    public static void main(String[] args) {
        // Isso sobe o Tomcat na porta 8080!
        SpringApplication.run(ProjetoApplication.class, args);
    }
}
\`\`\`

---

## 7. 🔌 Maven Básico (O gerenciador de dependências)

Exemplo de `pom.xml` bem simples. Tudo que estiver na dependência "Starter" é mágico.

\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
</dependencies>
\`\`\`

---

## 8. 🟢 Como Testar pra ver Bater
Para compilar seu projeto inteiro no Linux / Prompt:

\`\`\`bash
# Maven
./mvnw spring-boot:run

# Gradle
./gradlew bootRun
\`\`\`

---

## 9. ⚙️ Properties e Yaml (O Cofre)

\`\`\`properties
# application.properties (Seu arquivo vital em resource)
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/sistema
spring.datasource.username=root
spring.datasource.password=sua-senha-mestra-aqui

# Faz o Hibernate RECRIAR as tabelas baseadas nas suas classes toda vez ao dar PLAY!
spring.jpa.hibernate.ddl-auto=update
\`\`\`

---

## 10. 👤 Criando uma Entidade (A Tabela em forma de Classe)

\`\`\`java
package com.exemplo.projeto.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true, nullable = false)
    private String email;

    // Getters and Setters puros viriam aqui se não tivessemos Lombok...
}
\`\`\`

---

## 11. 📚 O Repositório (As Queries prontas de SQL)

Sim, você nunca fará `SELECT * FROM USUARIO`! Extendendo um `JpaRepository`, o Spring já injeta mais de 30 métodos prontos para manipulação do Banco.

\`\`\`java
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Isso é surreal. Literalmente o Spring entende o nome "ByEmail" da função que você criou e o transforma na query SQL instantaneamente atrás da cortina!
    Optional<Cliente> findByEmail(String email);
}
\`\`\`

---

## 12. 🧠 O Service (Aonde O Cérebro Do Dev Fica)

Seu service pega os dados e toma decisões polêmicas. "O cliente tem saldo?", "É maior de idade?", "Ativou email?". TUDO AQUI!

\`\`\`java
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();  // O Spring pega tudo no banco sozinho
    }

    public Cliente salvarNovo(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
}
\`\`\`

---

## 13. 🗣️ O Controller (A boca da Internet)

Seu Frontend em URL (Next.JS, App de Celular) vai bater nessa porta:

\`\`\`java
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public List<Cliente> pegar() {
        return clienteService.listarTodos();
    }

    @PostMapping
    public Cliente criarDaInternet(@RequestBody Cliente cliente) {
        return clienteService.salvarNovo(cliente);
    }
}
\`\`\`

---

## 14. 📇 O DTO e Segredos 
*Data Transfer Object*. Você NUNCA passa o a classe de Cliente inteira para o Frontend que pediu! Por quê? O Cliente tem uma coluna "Senha Hash" que não deve jamais vazar num payload JSON do browser! O DTO é uma cópia capada.

\`\`\`java
public record ClienteResponseDTO(Long id, String nome, String email) {
      // Record são objetos minúsculos Imutáveis novos do Java 14+ fantásticos pra DTO
}
\`\`\`
*(O frontend consome essa versão limpíssima).*

---

## 15. ✅ O Cors

Seu Java bloqueia na porrada qualquer tela local de react tentando dar fetch por segurança (*Cors Blocked*). Você precisa abrir a porta abertamente!

\`\`\`java
package com.exemplo.projeto.config;

// CorsConfig.java
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
      registry.addMapping("/**") // Abre para todas as rotas de ponta a ponta
           .allowedOrigins("http://localhost:3000") // Permite o seu react do nextjs  
           .allowedMethods("*");
    }
}
\`\`\`

---

## 16. 🔐 Spring Security, JWT e Autenticação

Para travar rotas para que asssaltantes não manipulem sua URI pelo celular sem permissões:

\`\`\`java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
      .authorizeHttpRequests(auth -> auth
          .requestMatchers("/public/**").permitAll()   // Apenas essa rota eh livre para o google 
          .anyRequest().authenticated()                // 100% de todo resto bloqueado pedindo que passem token.
      )
      .httpBasic(Customizer.withDefaults());

    return http.build();
}
\`\`\`

*(A segurança real atual necessita integrar Classes Filter JWT que pegam o Authentication Header).*

---

## 17. 🧰 Anotações Mais Usadas na Carreira

**Web**
- `@RestController` *(O motor que transforma classes em URIs API)*
- `@GetMapping`, `@PostMapping` *(Oculta RequestMapping pro verbo HTTP)*
- `@PathVariable` / `@RequestParam` *(Recolta argumentos do URL. Pega do ?id=x e poe no parametro java)*
- `@RequestBody` *(Transforma o JSON do Body vindo da internet e o traduz num Array Mapeado perfeito de POJOS para a sua Classe Java imediatamente!! É mágico!)*

**Persistência**
- `@Entity`
- `@OneToMany`, `@ManyToOne` *(Relações de banco)*

**Injeções (As Engrenagens do Dependency Inject)**
- `@Component`, `@Service`, `@Repository`, `@Bean`

---

## 18. 🐳 Empacotando em um Container Docker para Deploy em Nuvem Linux

\`\`\`dockerfile
# Usa Java 17 leve 
FROM eclipse-temurin:17-jre 
WORKDIR /app
COPY target/projeto-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\`

Para bater o Java final em código puro:
\`\`\`bash
mvn clean package  # Vai gerar na pasta TARGET o super arquivo JAR que executa tudo sem source local.
java -jar target/projeto.jar --spring.profiles.active=prod
\`\`\`

---

## 19. 📝 Boas Práticas do Dev Pleno a Sênior
1. Controllers tem que ser ridiculamente finos e enxutos. Toda dor e lógica matemática vai pro *Service*.
2. Responda o Frontend do seu sistema usando **ResponseEntity**. (`return ResponseEntity.ok(cliente)` invés de só retornar cliente). Sabe pq? Isso dá a você acesso direto aos verbos cruéis do http 404, 201 Created, 204 NoContent, sem o Spring Boot mascarar de 200 OK tudo o que ele responde.
3. Não faça injeções com tag `@Autowired` em cima das suas colunas privadas de classe. É péssimo para testes JUnit. Utilize Construtores ou lombok `@RequiredArgsConstructor`.
4. Pare de usar os Getters e Setters sujos poluindo as classes de modelo, instale a mágica do **Lombok** (`@Getter @Setter` na capa da Model). 

> Trabalhar com Java é assinar um contrato milionário com a padronização orientada à objeto mais resiliente e estável da Engenharia de Software. Todo projeto Spring Boot é extremamente similar e robusto internamente independente da empresa. Em breve sua curva de dominação do Backend será inquebrável.
