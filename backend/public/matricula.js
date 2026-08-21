// ===== URL DA API (VAZIA = MESMA ORIGEM) =====
const API_URL = 'https://cjcad.onrender.com';

// ===== PEGA O ID DO ALUNO DA URL =====
function getParametro(nome) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(nome);
}

const alunoId = getParametro('id');

// ===== CARREGA A LISTA DE CURSOS =====
function carregarCursos() {
    const select = document.getElementById('curso');

    // Primeiro, tenta carregar da API
    fetch(`${API_URL}/cursos`)
        .then(response => response.json())
        .then(cursos => {
            cursos.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso.nome;
                option.textContent = curso.nome;
                select.appendChild(option);
            });
        })
        .catch(() => {
            // Fallback: lista manual se a API falhar
            const cursosManuais = [
                'INFO - JM', 'INFO - BÁSICO', 'INFO - AVANÇADO',
                'ROBÓTICA INTRODUÇÃO', 'ROBÓTICA AVANÇADO',
                'GASTRONOMIA', 'ADM - JM', 'ADM - BÁSICO', 'ADM - AVANÇADO',
                'LAZER E BEM ESTAR', 'E.A.C', 'E.A.C MÚSICA',
                'BARBEARIA', 'CÍRCULO DE PAZ'
            ];
            cursosManuais.forEach(curso => {
                const option = document.createElement('option');
                option.value = curso;
                option.textContent = curso;
                select.appendChild(option);
            });
        });
}

// ===== ENVIA O FORMULÁRIO =====
document.getElementById('formMatricula').addEventListener('submit', function(e) {
    e.preventDefault();

    if (!alunoId) {
        alert('❌ ID do aluno não encontrado.');
        return;
    }

    const novaMatricula = {
        curso: document.getElementById('curso').value,
        dia: document.getElementById('dia').value,
        horario: document.getElementById('horario').value,
        status: document.getElementById('status').value
    };

    // Validação simples
    if (!novaMatricula.curso) {
        alert('Por favor, selecione um curso.');
        return;
    }

    fetch(`${API_URL}/alunos/${alunoId}/matricular`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novaMatricula)
    })
    .then(response => response.json())
    .then(data => {
        alert('✅ Matrícula realizada com sucesso!');
        window.location.href = `aluno.html?id=${alunoId}`;
    })
    .catch(error => {
        console.error('Erro ao matricular:', error);
        alert('❌ Erro ao matricular. Tente novamente.');
    });
});

// ===== CARREGA OS CURSOS AO INICIAR =====
window.onload = carregarCursos;