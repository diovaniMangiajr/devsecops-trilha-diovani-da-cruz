const express = require("express");
const router = express.Router();
const { execFile } = require("child_process");

// GET /api/ping?host=<endereço> - diagnóstico de rede
router.get("/ping", (req, res) => {
  const { host } = req.query;
  if (!host) return res.status(400).json({ error: "Parâmetro 'host' é obrigatório" });

  // Validação estrita: aceita apenas nomes de domínio ou IPs válidos (letras, números, pontos e hífens)
  const isValidHost = /^[a-zA-Z0-9.-]+$/.test(host);
  if (!isValidHost) {
    return res.status(400).json({ error: "Parâmetro 'host' inválido" });
  }

  // Uso de execFile com array de argumentos em vez de concatenação em shell puro
  execFile("ping", ["-c", "2", host], (error, stdout, stderr) => {
    if (error) return res.status(500).json({ error: "Falha ao executar ping", details: stderr });
    res.json({ host, output: stdout });
  });
});

module.exports = router;