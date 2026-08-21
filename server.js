// ===== SERVE OS ARQUIVOS ESTÁTICOS (FRONTEND) =====
// Isso NÃO requer autenticação
app.use(express.static(path.join(__dirname, 'public')));

// ===== ROTA RAIZ (também sem autenticação) =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== MIDDLEWARES GERAIS =====
app.use(cors());
app.use(express.json());

// ===== CONFIGURAÇÃO DE AUTENTICAÇÃO APENAS PARA A API =====
const usuarios = {
    'admin': '123123',
};

// =============================================
// ===== ROTAS DA API (TODAS COM AUTENTICAÇÃO) =====
// =============================================

app.use('/alunos', basicAuth({ users: usuarios, challenge: true, unauthorizedResponse: '❌ Acesso negado.' }));

// ===== LISTAR TODOS OS ALUNOS =====
app.get('/alunos', (req, res) => {
    // ... seu código
});

// ===== BUSCAR ALUNO POR ID =====
app.get('/alunos/:id', (req, res) => {
    // ... seu código
});

// ... e assim por diante para as outras rotas que começam com /alunos (POST, PUT, PATCH, DELETE)