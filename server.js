// 1. Importações
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const basicAuth = require('express-basic-auth');

// 2. Criação do app (AGORA!)
const app = express();
const port = 3000;

// 3. Use o app (depois de criado)
app.use(express.static(path.join(__dirname, 'public')));
// ... o resto do seu código ...