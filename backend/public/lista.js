// ===== URL DA API =====
const API_URL = 'https://cjcad.onrender.com'; // Vazio, usa a mesma origem

fetch('/alunos') // Em vez de fetch('https://.../alunos')

let alunos = [];

// ===== CARREGA OS ALUNOS DA API =====
function carregarAlunos() {
    console.log('1️⃣ Iniciando carregamento dos alunos...');
    
    fetch(`${API_URL}/alunos`)
        .then(response => {
            console.log('2️⃣ Resposta recebida da API. Status:', response.status);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('3️⃣ Dados recebidos. Total de alunos:', data.length);
            alunos = data;
            renderizarTabela(alunos);
        })
        .catch(error => {
            console.error('4️⃣ ERRO ao carregar alunos:', error.message);
            console.error('Erro completo:', error);
            document.getElementById('corpoTabela').innerHTML = `
                <tr><td colspan="5" style="text-align:center; color:#e74c3c;">
                    ⚠️ Erro ao carregar os dados. Verifique se o servidor está rodando.
                    <br><small>${error.message}</small>
                </td></tr>
            `;
            document.getElementById('contador').textContent = '0 alunos';
        });
}

// ===== FUNÇÃO PARA RENDERIZAR A TABELA =====
function renderizarTabela(lista) {
    console.log('5️⃣ Renderizando tabela...');
    const corpo = document.getElementById('corpoTabela');
    const contador = document.getElementById('contador');
    const mensagemVazia = document.getElementById('mensagemVazia');

    corpo.innerHTML = '';

    if (!lista || lista.length === 0) {
        console.log('6️⃣ Nenhum aluno encontrado.');
        mensagemVazia.style.display = 'block';
        contador.textContent = '0 alunos';
        return;
    }

    mensagemVazia.style.display = 'none';
    contador.textContent = `${lista.length} aluno${lista.length > 1 ? 's' : ''}`;

    lista.forEach(aluno => {
        const id = aluno.Inscrição || aluno.FIELD1 || aluno.id || '';
        const nome = aluno["Nome Completo"] || aluno.FIELD4 || aluno.nome || '';
        const cpf = aluno.CPF || aluno.FIELD7 || aluno.cpf || '';
        const telefone = aluno["Telefone 1 (Celular/Whatsapp)"] || aluno.FIELD16 || aluno.telefone || '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${id}</td>
            <td><strong>${nome}</strong></td>
            <td>${cpf}</td>
            <td>${telefone}</td>
            <td>
                <a href="aluno.html?id=${id}" class="btn-ver">Ver</a>
            </td>
        `;
        corpo.appendChild(tr);
    });
    console.log('7️⃣ Tabela renderizada com sucesso!');
}

// ===== FUNÇÃO DE FILTRO =====
function filtrarAlunos() {
    const termo = document.getElementById('campoBusca').value.toLowerCase().trim();

    if (termo === '') {
        renderizarTabela(alunos);
        return;
    }

    const filtrados = alunos.filter(aluno => {
        const id = String(aluno.Inscrição || aluno.FIELD1 || aluno.id || '');
        const nome = (aluno["Nome Completo"] || aluno.FIELD4 || aluno.nome || '').toLowerCase();
        const cpf = (aluno.CPF || aluno.FIELD7 || aluno.cpf || '').replace(/[.\-]/g, '');
        const busca = termo.replace(/[.\-]/g, '');

        return id.includes(termo) ||
               nome.includes(termo) ||
               cpf.includes(busca);
    });

    renderizarTabela(filtrados);
}

// ===== INICIALIZA A PÁGINA =====
window.onload = carregarAlunos;