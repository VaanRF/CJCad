const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const basicAuth = require('express-basic-auth');

const app = express();
const port = 3000;

// ===== CONFIGURAÇÃO DE AUTENTICAÇÃO =====
// ⚠️ ALTERE O USUÁRIO E A SENHA PARA ALGO SEGURO!
const usuarios = {
    'admin': '123123', // Substitua por uma senha forte de verdade
    // Você pode adicionar mais usuários se quiser
};

app.use(
    basicAuth({
        users: usuarios,
        challenge: true,            // Exibe o pop-up de login no navegador
        unauthorizedResponse: '❌ Acesso negado. Use um nome de usuário e senha válidos.'
    })
);

// ===== SERVE OS ARQUIVOS ESTÁTICOS (FRONTEND) =====
// OBS: O frontend NÃO precisa de autenticação para ser acessado
app.use(express.static(path.join(__dirname, 'public')));

// ===== ROTA RAIZ (também sem autenticação) =====
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== MIDDLEWARES GERAIS =====
app.use(cors());
app.use(express.json());

// ===== CAMINHO DO BANCO DE DADOS =====
// Certifique-se de que o caminho está correto para sua estrutura
const arquivoDados = path.join(__dirname, 'dados', 'alunos.json');

// ===== FUNÇÕES DE LEITURA/ESCRITA =====
function lerAlunos() {
    const dados = fs.readFileSync(arquivoDados, 'utf-8');
    return JSON.parse(dados);
}

function escreverAlunos(alunos) {
    fs.writeFileSync(arquivoDados, JSON.stringify(alunos, null, 2));
}

// =============================================
// ===== ROTAS DA API (TODAS COM AUTENTICAÇÃO) =====
// =============================================

// ===== LISTAR TODOS OS ALUNOS =====
app.get('/alunos', (req, res) => {
    try {
        const alunos = lerAlunos();
        res.json(alunos);
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao ler os dados' });
    }
});

// ===== BUSCAR ALUNO POR ID =====
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

// ===== ADICIONAR NOVO ALUNO =====
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

// ===== EDITAR ALUNO =====
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

// ===== ALTERAR STATUS DO ALUNO =====
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

// ===== REMOVER ALUNO =====
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

// ===== MATRICULAR ALUNO EM CURSO =====
app.post('/alunos/:id/matricular', (req, res) => {
    try {
        const alunos = lerAlunos();
        const id = req.params.id;
        const index = alunos.findIndex(a => String(a.FIELD1) === String(id));

        if (index === -1) {
            return res.status(404).json({ erro: 'Aluno não encontrado' });
        }

        const novaMatricula = req.body;

        if (!alunos[index].matriculas) {
            alunos[index].matriculas = [];
        }

        alunos[index].matriculas.push(novaMatricula);
        escreverAlunos(alunos);

        res.json({ mensagem: 'Matrícula realizada com sucesso!', aluno: alunos[index] });
    } catch (error) {
        console.error('Erro ao matricular:', error);
        res.status(500).json({ erro: 'Erro ao matricular aluno' });
    }
});

// =============================================
// ===== INICIA O SERVIDOR =====
app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    console.log(`📁 Dados salvos em: ${arquivoDados}`);
    console.log(`🌐 Frontend disponível em http://localhost:${port}/`);
    console.log(`🔒 Rotas da API protegidas por autenticação básica.`);
});