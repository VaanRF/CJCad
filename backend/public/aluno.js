// ===== URL DA API =====
const API_URL = 'https://cjcad.onrender.com';

// ===== PEGA O ID DA URL =====
function getParametro(nome) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nome);
}

// ===== FUNÇÃO AUXILIAR PARA DEFINIR VALOR =====
function setValor(seletor, valor) {
    const el = document.querySelector(seletor);
    if (el) {
        el.textContent = valor || '—';
    } else {
        console.warn(`Elemento não encontrado: ${seletor}`);
    }
}

// ===== EXIBE AS MATRÍCULAS (DEFINIDA ANTES DE SER CHAMADA) =====
function exibirMatriculas(matriculas) {
    const container = document.getElementById('listaMatriculas');
    if (!container) {
        console.warn('Elemento #listaMatriculas não encontrado.');
        return;
    }

    if (!matriculas || matriculas.length === 0) {
        container.innerHTML = '<p class="vazio">Nenhum curso matriculado.</p>';
        return;
    }

    const diasSemana = {
        segunda: 'Segunda-feira',
        terca: 'Terça-feira',
        quarta: 'Quarta-feira',
        quinta: 'Quinta-feira',
        sexta: 'Sexta-feira'
    };

    container.innerHTML = matriculas.map(mat => `
        <div class="matricula-item">
            <span class="matricula-curso">${mat.curso}</span>
            <span class="matricula-dia">${diasSemana[mat.dia] || mat.dia}</span>
            <span class="matricula-horario">${mat.horario}</span>
            <span class="matricula-status">${mat.status}</span>
        </div>
    `).join('');
}

// ===== PREENCHE A PÁGINA COM OS DADOS DO ALUNO =====
function preencherPagina(aluno) {
    console.log('🖊️ Preenchendo página com os dados...');

    // Avatar
    const iniciais = (aluno.FIELD4 || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const avatar = document.querySelector('.avatar');
    if (avatar) avatar.textContent = iniciais;

    // Nome
    const nomeEl = document.querySelector('.perfil h1');
    if (nomeEl) nomeEl.textContent = aluno.FIELD4 || 'Nome não informado';

    // Status
    const statusEl = document.querySelector('.badge.ativo');
    if (statusEl) statusEl.textContent = aluno.FIELD38 ? '✅ Ativo' : '⚠️ Pendente';

    // Dados Pessoais
    setValor('.card-dados .linha-id .valor', aluno.FIELD1);
    setValor('.card-dados .linha-nascimento .valor', aluno.FIELD5);
    setValor('.card-dados .linha-telefone1 .valor', aluno.FIELD16);
    setValor('.card-dados .linha-telefone2 .valor', aluno.FIELD17);
    setValor('.card-dados .linha-cpf .valor', aluno.FIELD7);
    setValor('.card-dados .linha-rg .valor', aluno.FIELD8);
    setValor('.card-dados .linha-nis .valor', aluno.FIELD9);
    setValor('.card-dados .linha-sus .valor', aluno.FIELD10);
    setValor('.card-dados .linha-genero .valor', aluno.FIELD11);
    setValor('.card-dados .linha-etnia .valor', aluno.FIELD12);
    setValor('.card-dados .linha-endereco .valor', aluno.FIELD13);
    setValor('.card-dados .linha-bairro .valor', aluno.FIELD14);
    setValor('.card-dados .linha-referencia .valor', aluno.FIELD15);

    // Responsável
    setValor('.card-responsavel .linha-nome .valor', aluno.FIELD28);
    setValor('.card-responsavel .linha-nascimento .valor', aluno.FIELD29);
    setValor('.card-responsavel .linha-cpf .valor', aluno.FIELD32);
    setValor('.card-responsavel .linha-telefone .valor', aluno.FIELD16);

    // Escola
    setValor('.card-escola .linha-escola .valor', aluno.FIELD20);
    setValor('.card-escola .linha-bairro-escola .valor', aluno.FIELD21);
    setValor('.card-escola .linha-serie .valor', aluno.FIELD22);
    setValor('.card-escola .linha-turno-escola .valor', aluno.FIELD24);
    setValor('.card-escola .linha-nivel .valor', aluno.FIELD26);

    // CJ
    setValor('.card-cj .linha-curso .valor', 'Informática (JM)');
    setValor('.card-cj .linha-turno-cj .valor', aluno.FIELD25);
    setValor('.card-cj .linha-matricula .valor', aluno.FIELD3);

    // Observações
    setValor('.card-obs .linha-saude .valor', aluno.FIELD27);
    setValor('.card-obs .linha-atendimento .valor', aluno.FIELD38);
    setValor('.card-obs .linha-renda .valor', aluno.FIELD40);
    setValor('.card-obs .linha-familia .valor', aluno.FIELD42);
    setValor('.card-obs .linha-como-soube .valor', aluno.FIELD41);
    setValor('.card-obs .linha-observacoes .valor', aluno.FIELD43);

    // ===== MATRÍCULAS (AGORA A FUNÇÃO JÁ ESTÁ DEFINIDA) =====
    exibirMatriculas(aluno.matriculas);
}

// ===== CARREGA OS DADOS DO ALUNO DA API =====
function carregarAluno() {
    const id = getParametro('id');
    console.log('🔍 ID recebido:', id);

    if (!id) {
        document.querySelector('.container').innerHTML = `
            <h1 style="color:#e74c3c;">⚠️ Aluno não encontrado</h1>
            <p>Nenhum ID foi passado na URL.</p>
            <a href="index.html" class="btn-voltar">← Voltar para a lista</a>
        `;
        return;
    }

    console.log('📡 Buscando aluno:', `/alunos/${id}`);

    fetch(`${API_URL}/alunos/${id}`)
        .then(response => {
            console.log('📥 Status da resposta:', response.status);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(aluno => {
            console.log('✅ Aluno encontrado:', aluno);
            preencherPagina(aluno);
        })
        .catch(error => {
            console.error('❌ Erro ao carregar aluno:', error);
            document.querySelector('.container').innerHTML = `
                <h1 style="color:#e74c3c;">⚠️ Aluno não encontrado</h1>
                <p>Erro ao buscar o aluno com ID ${id}.</p>
                <p><small>${error.message}</small></p>
                <a href="index.html" class="btn-voltar">← Voltar para a lista</a>
            `;
        });
}

// ===== REDIRECIONA PARA O FORMULÁRIO DE MATRÍCULA =====
function irParaMatricula() {
    const id = getParametro('id');
    if (id) {
        window.location.href = `matricula.html?id=${id}`;
    } else {
        alert('Erro: ID do aluno não encontrado.');
    }
}

// ===== INICIALIZA A PÁGINA =====
window.onload = function() {
    carregarAluno();

    const btn = document.getElementById('btnMatricular');
    if (btn) {
        btn.addEventListener('click', irParaMatricula);
    } else {
        console.warn('Botão "Matricular" não encontrado.');
    }
};