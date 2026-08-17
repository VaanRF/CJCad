// ===== URL DA API =====
const API_URL = '';

// ===== DIAS E HORÁRIOS =====
const dias = ['segunda', 'terca', 'quarta', 'quinta', 'sexta'];
const diasSemana = {
    segunda: 'Segunda-feira',
    terca: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira'
};
const horarios = [
    { label: '08:30 – 10:00', turno: 'Manhã 1' },
    { label: '10:15 – 11:45', turno: 'Manhã 2' },
    { label: '13:30 – 15:00', turno: 'Tarde 1' },
    { label: '15:15 – 16:45', turno: 'Tarde 2' }
];

// ===== ELEMENTOS DA PÁGINA =====
const gradeContainer = document.getElementById('gradeHorarios');

// ===== FUNÇÃO PARA RENDERIZAR UM DIA =====
function renderizarDia(dia) {
    fetch(`${API_URL}/alunos`)
        .then(response => response.json())
        .then(alunos => {
            gradeContainer.innerHTML = '';

            horarios.forEach(horario => {
                // Filtra alunos matriculados em qualquer curso que contenha "E.A.C"
                const matriculados = alunos.filter(aluno =>
                    aluno.matriculas && aluno.matriculas.some(mat =>
                        mat.curso && mat.curso.includes('E.A.C') &&
                        mat.dia === dia &&
                        mat.horario === horario.label &&
                        mat.status === 'Matriculado'
                    )
                );

                const espera = alunos.filter(aluno =>
                    aluno.matriculas && aluno.matriculas.some(mat =>
                        mat.curso && mat.curso.includes('E.A.C') &&
                        mat.dia === dia &&
                        mat.horario === horario.label &&
                        mat.status === 'Aguardando'
                    )
                );

                const bloco = document.createElement('div');
                bloco.className = 'bloco-horario';
                bloco.innerHTML = `
                    <h3>${horario.turno} <span>${horario.label}</span></h3>
                    <ul class="lista-alunos">
                        ${matriculados.length > 0 
                            ? matriculados.map(aluno => `
                                <li>
                                    <a href="aluno.html?id=${aluno.FIELD1}" class="link-aluno">
                                        ${aluno.FIELD4} (${aluno.matriculas.find(m => m.curso.includes('E.A.C') && m.dia === dia && m.horario === horario.label).curso})
                                    </a>
                                </li>
                            `).join('')
                            : '<li class="vazio">Nenhum aluno matriculado</li>'
                        }
                    </ul>
                    ${espera.length > 0 ? `
                        <div class="lista-espera">
                            <div class="titulo-espera">⏳ Lista de Espera</div>
                            <ul class="lista-alunos">
                                ${espera.map(aluno => `
                                    <li>
                                        <a href="aluno.html?id=${aluno.FIELD1}" class="link-aluno link-espera">
                                            ${aluno.FIELD4} (${aluno.matriculas.find(m => m.curso.includes('E.A.C') && m.dia === dia && m.horario === horario.label).curso})
                                        </a>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                `;
                gradeContainer.appendChild(bloco);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar alunos:', error);
            gradeContainer.innerHTML = `<p style="color:#e74c3c;">Erro ao carregar os dados.</p>`;
        });
}

// ===== CONFIGURA OS BOTÕES =====
document.querySelectorAll('.dia-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.dia-btn').forEach(b => b.classList.remove('ativo'));
        this.classList.add('ativo');
        renderizarDia(this.dataset.dia);
    });
});

// ===== CARREGA A SEGUNDA-FEIRA POR PADRÃO =====
renderizarDia('segunda');