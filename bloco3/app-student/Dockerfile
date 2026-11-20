# Imagem base fixada por digest: builds reproduziveis e imunes a troca da tag
ARG NODE_IMAGE=node:26-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5

# Etapa 1: instala somente as dependencias de producao, exatamente como no lockfile
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Etapa 2: imagem final, sem npm/npx (nao sao usados em execucao e trazem CVEs proprias)
FROM ${NODE_IMAGE}
ENV NODE_ENV=production
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src
COPY uploads ./uploads

EXPOSE 3000

# Verifica a saude do container pela rota /health (wget do busybox, ja presente na imagem)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT:-3000}/health" >/dev/null || exit 1

# Define usuario sem privilegios de root para execucao segura do container
USER node

CMD ["node", "src/server.js"]
