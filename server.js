const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const basicAuth = require('express-basic-auth');

const app = express();
const port = process.env.PORT || 3000;

// ===== MIDDLEWARES =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== ROTA RAIZ (SEM AUTENTICAÇÃO) =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== AUTENTICAÇÃO APENAS PARA A API =====
const usuarios = { 'admin': '123123' };
app.use('/alunos', basicAuth({
    users: usuarios,
    challenge: true,
    unauthorizedResponse: '❌ Acesso negado.'
}));

// ===== CAMINHO DO BANCO DE DADOS =====
const arquivoDados = path.join(__dirname, 'dados', 'alunos.json');

// ===== FUNÇÃO PARA GARANTIR QUE O ARQUIVO EXISTA =====
function inicializarArquivo() {
    const pasta = path.dirname(arquivoDados);
    if (!fs.existsSync(pasta)) {
        fs.mkdirSync(pasta, { recursive: true });
        console.log(`📁 Pasta criada: ${pasta}`);
    }

    if (!fs.existsSync(arquivoDados)) {
        fs.writeFileSync(arquivoDados, JSON.stringify([], null, 2));
        console.log(`📄 Arquivo criado: ${arquivoDados}`);
    } else {
        const conteudo = fs.readFileSync(arquivoDados, 'utf-8');
        if (!conteudo || conteudo.trim() === '') {
            fs.writeFileSync(arquivoDados, JSON.stringify([], null, 2));
            console.log(`📄 Arquivo recriado (estava vazio): ${arquivoDados}`);
        } else {
            try {
                JSON.parse(conteudo);
            } catch (e) {
                fs.writeFileSync(arquivoDados, JSON.stringify([], null, 2));
                console.log(`📄 Arquivo recriado (estava corrompido): ${arquivoDados}`);
            }
        }
    }
}

function lerAlunos() {
    inicializarArquivo();
    const dados = fs.readFileSync(arquivoDados, 'utf-8');
    return JSON.parse(dados);
}

function escreverAlunos(alunos) {
    fs.writeFileSync(arquivoDados, JSON.stringify(alunos, null, 2));
}

// ===== ROTAS DA API =====
app.get('/alunos', (req, res) => {
    try {
        const alunos = lerAlunos();
        res.json(alunos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao ler os dados' });
    }
});

app.get('/alunos/:id', (req, res) => {
    try {
        const alunos = lerAlunos();
        const id = req.params.id;
        const aluno = alunos.find(a => String(a.FIELD1) === String(id));
        if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado' });
        res.json(aluno);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar o aluno' });
    }
});

app.post('/alunos', (req, res) => {
    try {
        const alunos = lerAlunos();
        const novoAluno = req.body;
        const ultimoId = alunos.reduce((max, a) => Math.max(max, parseInt(a.FIELD1) || 0), 0);
        novoAluno.FIELD1 = String(ultimoId + 1);
        alunos.push(novoAluno);
        escreverAlunos(alunos);
        res.status(201).json({ mensagem: 'Aluno adicionado com sucesso!', aluno: novoAluno });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao adicionar o aluno' });
    }
});

app.put('/alunos/:id', (req, res) => {
    try {
        const alunos = lerAlunos();
        const id = req.params.id;
        const index = alunos.findIndex(a => String(a.FIELD1) === String(id));
        if (index === -1) return res.status(404).json({ erro: 'Aluno não encontrado' });
        const alunoAtualizado = { ...alunos[index], ...req.body, FIELD1: id };
        alunos[index] = alunoAtualizado;
        escreverAlunos(alunos);
        res.json({ mensagem: 'Aluno atualizado com sucesso!', aluno: alunoAtualizado });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar o aluno' });
    }
});

app.patch('/alunos/:id/status', (req, res) => {
    try {
        const alunos = lerAlunos();
        const id = req.params.id;
        const { status } = req.body;
        const index = alunos.findIndex(a => String(a.FIELD1) === String(id));
        if (index === -1) return res.status(404).json({ erro: 'Aluno não encontrado' });
        alunos[index].STATUS = status;
        escreverAlunos(alunos);
        res.json({ mensagem: 'Status atualizado com sucesso!', aluno: alunos[index] });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao atualizar o status' });
    }
});

app.delete('/alunos/:id', (req, res) => {
    try {
        const alunos = lerAlunos();
        const id = req.params.id;
        const index = alunos.findIndex(a => String(a.FIELD1) === String(id));
        if (index === -1) return res.status(404).json({ erro: 'Aluno não encontrado' });
        const alunoRemovido = alunos.splice(index, 1);
        escreverAlunos(alunos);
        res.json({ mensagem: 'Aluno removido com sucesso!', aluno: alunoRemovido[0] });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao remover o aluno' });
    }
});

app.post('/alunos/:id/matricular', (req, res) => {
    try {
        const alunos = lerAlunos();
        const id = req.params.id;
        const index = alunos.findIndex(a => String(a.FIELD1) === String(id));
        if (index === -1) return res.status(404).json({ erro: 'Aluno não encontrado' });
        const novaMatricula = req.body;
        if (!alunos[index].matriculas) {
            alunos[index].matriculas = [];
        }
        alunos[index].matriculas.push(novaMatricula);
        escreverAlunos(alunos);
        res.json({ mensagem: 'Matrícula realizada com sucesso!', aluno: alunos[index] });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao matricular aluno' });
    }
});

// ===== INICIA O SERVIDOR =====
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    console.log(`📁 Dados salvos em: ${arquivoDados}`);
});