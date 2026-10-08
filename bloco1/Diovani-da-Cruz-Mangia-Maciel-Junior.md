# Onboarding SACI 2026.2 - DevSecOps

## Dados do Candidato
* **Nome:** Diovani da Cruz Mangia Maciel Junior
* **Curso:** Bacharelado em Sistemas de Informação
* **Trilha:** DevSecOps

---

## Desafio Técnico Inicial

### Pergunta:
Trilha: 
Pergunta Rápida: Escreva uma breve explicação (COM SUAS PALAVRAS) sobre o que são SAST, DAST, SCA e como cada um deles ajuda no desenvolvimento seguro.

### Resposta:

Dentro de DevSecOps, temos várias técnicas para descobrir vulnerabilidades no código nas primeiras fases de desenvolvimento e antes de lançar a aplicação na internet (deploy).

#### **SAST (Static Application Security Testing):**
- **O que é:** Analisa o código fonte da aplicação, em busca de falhas sem executar o programa
- **Como funciona:** Funciona como uma espécie de corretor “gramatical” interno, inspecionando linhas de código em busca de lógicas falhas, criptografia fraca e injeção de SQL.
- **Quando usar:** No início do desenvolvimento, integrado no momento do commit ou pull request.
- **Exemplos de ferramentas:** SonarQube, Bandit.

#### **SCA (Análise de Composição):**
- **O que é:** Inspecionador que verifica as dependências e bibliotecas de terceiros usadas no projeto.
- **Como funciona:** Identifica se há vulnerabilidades conhecidas em pacotes externos utilizados pelo software, assim como riscos de licenças de código aberto para evitar que uma biblioteca force o código proprietário a se tornar público.
- **Quando usar:** Junto com o SAST, no início do projeto, durante o build ou no gerenciamento de pacotes.
- **Exemplos de ferramentas:** Snyk, Mend.

#### **DAST (Análise Dinâmica):**
- **O que é:** Testa a segurança da aplicação de forma externa quando ela está rodando (teste da caixa preta).
- **Como funciona:** Simula ataques de atacantes via rede ou requisição HTTP para ver como o sistema se comporta em ambiente ativo.
- **Quando usar:** Nas fases finais de testes, homologação ou após deploy em fase de staging.
- **Exemplos de ferramentas:** OWASP ZAP, Burp Suite.

#### **Em síntese:**
Uma técnica não substitui a outra. Em uma analogia com o setor de construção civil seria como:
- **SAST:** Seria o inspetor da planta da casa/prédio que avalia se não há nenhum erro de cálculo, inconformidades com normas e leis ou problemas estruturais.
- **SCA:** Seria o responsável por checar a procedência dos materiais comprados e dos fornecedores.
- **DAST:** O que testa as portas e janelas com o prédio pronto e funcionando, para verificar se não existe uma entrada indevida para as áreas dos moradores.
Em suma, DAST, SAST e SCA são formas de blindar aplicações antes de liberá-las para a produção, assegurando um software mais robusto em segurança na entrega.