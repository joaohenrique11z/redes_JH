# Projeto OSI - Redes
# 🌐 Projeto Redes - Simulação do Modelo OSI

Este projeto é uma aplicação web interativa desenvolvida para simular de forma simplificada e visual as interações das camadas superiores do **Modelo OSI** (Camadas de Aplicação e Apresentação). 

O sistema permite criar diferentes tipos de requisições e demonstra na prática como os dados são formatados, validados e criptografados antes de descerem pela pilha de protocolos.

---

## 🚀 Funcionalidades

O projeto explora 4 cenários principais de redes, aplicando regras específicas para cada um:

* **💬 Chat (WebSocket):** Geração de payload para envio de mensagens em tempo real.
* **🌐 Sites (HTTP/HTTPS):** Simulação de requisição web com validação de URL (exige `www` e `.com`).
* **📧 E-mail (SMTP/POP):** Simulação de envio de e-mail com validação de formato (exige `@` e `.com`).
* **📁 Arquivos (FTP/HTTP):** Simulação de upload de arquivos com extração dinâmica de nome e extensão.

### 🛡️ Criptografia e Segurança (Camada 6)
Para representar a **Camada de Apresentação**, foi implementada uma função de criptografia baseada na **Cifra de César**. Antes da requisição ser concluída, dados sensíveis do payload (como o corpo da mensagem, IP do host e nome do arquivo) são mascarados e transformados.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estrutura semântica da aplicação.
* **CSS3:** Estilização com design moderno (Flexbox, variáveis de cor, fontes customizadas do Google Fonts).
* **JavaScript (Vanilla):** Lógica de negócios dividida em módulos (ES6 Modules) para melhor organização.

---

## 📂 Estrutura do Projeto

A lógica principal foi dividida da seguinte forma:

* `application.js`: Atua como a "fábrica" de objetos. Responsável pela **Camada de Aplicação** (montagem dos dados e validações) e pela **Camada de Apresentação** (algoritmo da Cifra de César).
* `OSI.js`: Orquestrador do fluxo. Monitora os eventos do usuário na interface, coleta os dados, aciona a montagem, aplica a criptografia e exibe o resultado.

---

## 💻 Como executar o projeto

Como o projeto utiliza apenas tecnologias front-end nativas (sem dependências externas), rodá-lo é muito simples:

1. Clone este repositório em sua máquina:
   ```bash
   git clone [https://github.com/SEU-USUARIO/projeto-modelo-osi.git](https://github.com/SEU-USUARIO/projeto-modelo-osi.git)
