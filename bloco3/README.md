# Bloco 3 — SCA, Scan de Containers, Detecção de Segredos e Deploy Automático

Evolução da pipeline do Bloco 2: além do SAST (Semgrep), o código passa por
três novos gates de segurança e, só depois de todos aprovados, é publicado
automaticamente no Render.

## Aplicação publicada

**https://devsecops-trilha-diovani-da-cruz.onrender.com**

| Rota | O que mostra |
| :--- | :--- |
| [`/health`](https://devsecops-trilha-diovani-da-cruz.onrender.com/health) | Status da aplicação e o `commit` publicado |
| [`/api/tasks`](https://devsecops-trilha-diovani-da-cruz.onrender.com/api/tasks) | Lista de tarefas |
| [`/`](https://devsecops-trilha-diovani-da-cruz.onrender.com/) | Lista de endpoints |

### Plano gratuito: hibernação

O serviço usa o plano **Free** do Render, que **hiberna após 15 minutos sem
receber requisições**. A primeira requisição depois disso "acorda" o serviço
e pode levar alguns segundos (até cerca de um minuto) para responder; as
seguintes respondem normalmente. Isso é o comportamento esperado do plano
gratuito, não uma falha da aplicação.

## Pipeline

Arquivo: [`securanca-sast.yml`](securanca-sast.yml) (cópia idêntica de
`.github/workflows/securanca-sast.yml`, que é o arquivo executado pelo GitHub Actions).

```
build ──► SAST (Semgrep) ──────────┐
     ├──► SCA (Trivy fs) ──────────┤
     ├──► Container (Trivy image) ─┼──► Deploy (Render)
     └──► Segredos (Gitleaks) ─────┘
```

| Gate | Ferramenta | Falha quando |
| :--- | :--- | :--- |
| SAST | Semgrep (`--config auto`) | qualquer achado no código |
| SCA | Trivy `fs` | vulnerabilidade HIGH ou CRITICAL nas dependências (`package-lock.json`) |
| Container | Trivy `image` | vulnerabilidade HIGH ou CRITICAL com correção disponível na imagem Docker |
| Segredos | Gitleaks `git` | qualquer segredo no código **ou em todo o histórico** do repositório |
| Deploy | Render Deploy Hook | só roda em push/merge na `main` e só depois dos 4 gates passarem |

- Os quatro gates rodam em paralelo depois do build; o deploy depende de todos (`needs`).
- Pull requests executam os gates, mas não fazem deploy.
- O Auto-Deploy nativo do Render está **desligado**: a única forma de publicar é pelo job
  de deploy da pipeline. O job dispara o deploy do commit exato que passou nos gates e
  aguarda até que `/health` responda com esse mesmo commit.
- Ferramentas e actions fixadas por digest/SHA, permissões mínimas (`contents: read`).

## Achados e correções

| Ferramenta | Antes | Correção | Depois |
| :--- | :--- | :--- | :--- |
| Trivy (SCA) | 6 HIGH (lodash 4.17.15, jsonwebtoken 8.5.1, body-parser 1.20.8) e lockfile fora de sincronia | lodash 4.18.1, express 4.22.3, jsonwebtoken removido (não era usado), lockfile regenerado, `npm ci` | 0 |
| Trivy (imagem) | 23 CRITICAL / 572 HIGH (`node:14`, Debian 10 sem suporte), 1,36 GB | `node:26-alpine` fixada por digest, build multi-stage, npm removido da imagem final, `HEALTHCHECK`, usuário não-root | 0 / 0, 260 MB |
| Gitleaks | 0 achados — **falso negativo**: as regras padrão não detectavam os segredos do commit `51cf12b` | regra própria em [`.gitleaks.toml`](.gitleaks.toml); segredos rotacionados (valores novos só nas variáveis de ambiente do Render); os 3 achados históricos aceitos por fingerprint em [`.gitleaksignore`](.gitleaksignore) | 0, e qualquer segredo novo quebra o pipeline |
| Semgrep | 0 (corrigido no Bloco 2) | mantido | 0 |

Detalhes e recomendações: [`relatorio-bloco3.pdf`](relatorio-bloco3.pdf).

## Estrutura

```
bloco3/
├── app-student/          # aplicação do Bloco 2 com as correções deste bloco
├── .gitleaks.toml        # regras do Gitleaks (padrão + regra própria)
├── .gitleaksignore       # achados históricos aceitos após rotação
├── securanca-sast.yml    # cópia do workflow
├── relatorio-bloco3.pdf  # relatório de viabilidade (1 página)
├── prints/               # prints da pipeline e da aplicação no ar
└── README.md
```

## Prints

| Arquivo | Conteúdo |
| :--- | :--- |
| `prints/01-pipeline-verde.png` | Execução completa da pipeline na `main`, todos os jobs aprovados |
| `prints/02-deploy-render.png` | Deploy concluído no painel do Render (commit do merge) |
| `prints/03-health-render.png` | `/health` respondendo no Render com o commit publicado |
