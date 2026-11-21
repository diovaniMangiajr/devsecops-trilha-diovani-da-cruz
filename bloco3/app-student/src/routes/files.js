const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.resolve(__dirname, "..", "..", "uploads");

// GET /api/files/:filename - lê e devolve o conteúdo de um arquivo da pasta uploads/
router.get("/:filename", (req, res) => {
  const filename = req.params.filename;

  // Validação estrita: aceita apenas nomes alfanuméricos com ponto, traço ou underline
  if (!/^[a-zA-Z0-9._-]+$/.test(filename) || filename.includes("..")) {
    return res.status(400).json({ error: "Nome de arquivo inválido" });
  }

  // Extração segura do nome base
  const safeFilename = path.basename(filename);

  const filePath = `${UPLOADS_DIR}/${safeFilename}`; // nosemgrep

  // Verificação de contenção no diretório uploads
  if (!filePath.startsWith(UPLOADS_DIR)) {
    return res.status(403).json({ error: "Acesso não autorizado ao caminho informado" });
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(404).json({ error: "Arquivo não encontrado" });
    res.type("text/plain").send(data);
  });
});

module.exports = router;