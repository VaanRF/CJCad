// ===== DADOS DOS CURSOS POR DIA E HORÁRIO =====
const gradeCursos = {
    segunda: {
        manha: {
            "08:30 – 10:00": [
                { nome: "INFO - JM", tipo: "Profissionalizante" },
                { nome: "CÍRCULO DE PAZ", tipo: "Socioeducativo" },
                { nome: "ROBÓTICA AVANÇADO", tipo: "Profissionalizante" }
            ],
            "10:15 – 11:45": [
                { nome: "INFO - BÁSICO", tipo: "Profissionalizante" },
                { nome: "CÍRCULO DE PAZ", tipo: "Socioeducativo" },
                { nome: "ROBÓTICA AVANÇADO", tipo: "Profissionalizante" }
            ]
        },
        tarde: {
            "13:30 – 15:00": [
                { nome: "INFO - JM", tipo: "Profissionalizante" },
                { nome: "ADM - AVANÇADO", tipo: "Profissionalizante" },
                { nome: "CÍRCULO DE PAZ", tipo: "Socioeducativo" },
            ],
            "15:15 – 16:45": [
                { nome: "ADM - BÁSICO", tipo: "Socioeducativo" },
                { nome: "INFO - BÁSICO", tipo: "Profissionalizante" },
                { nome: "CÍRCULO DE PAZ", tipo: "Socioeducativo" }
            ]
        }
    },
    terca: {
        manha: {
            "08:30 – 10:00": [
                { nome: "INFO - BÁSICO", tipo: "Profissionalizante" },
                { nome: "BARBEARIA", tipo: "Profissionalizante" },
                { nome: "E.A.C", tipo: "Socioeducativo" }
            ],
            "10:15 – 11:45": [
                { nome: "INFO - BÁSICO", tipo: "Profissionalizante" },
                { nome: "BARBEARIA", tipo: "Profissionalizante" },
                { nome: "E.A.C", tipo: "Socioeducativo" }
            ]
        },
        tarde: {
            "13:30 – 15:00": [
                { nome: "ROBÓTICA AVANÇADO", tipo: "Profissionalizante" },
                { nome: "INFO - BÁSICO", tipo: "Profissionalizante" },
                { nome: "BARBEARIA", tipo: "Profissionalizante" },
                { nome: "ADM - BÁSICO", tipo: "Socioeducativo" },
                { nome: "E.A.C", tipo: "Socioeducativo" }
            ],
            "15:15 – 16:45": [
                { nome: "ROBÓTICA BÁSICO", tipo: "Profissionalizante" },
                { nome: "INFO - BÁSICO", tipo: "Profissionalizante" },
                { nome: "BARBEARIA", tipo: "Profissionalizante" },
                { nome: "ADM - BÁSICO", tipo: "Socioeducativo" },
                { nome: "E.A.C", tipo: "Socioeducativo" }
            ]
        }
    },
    quarta: {
        manha: {
            "08:30 – 10:00": [
                { nome: "LAZER E BEM ESTAR", tipo: "Socioeducativo" },
                { nome: "ROBÓTICA AVANÇADO", tipo: "Profissionalizante" }
            ],
            "10:15 – 11:45": [
                { nome: "LAZER E BEM ESTAR", tipo: "Socioeducativo" },
                { nome: "ROBÓTICA AVANÇADO", tipo: "Profissionalizante" }
            ]
        },
        tarde: {
            "13:30 – 15:00": [
                { nome: "E.A.C MÚSICA", tipo: "Socioeducativo" },
                { nome: "LAZER E BEM ESTAR", tipo: "Socioeducativo" },
                { nome: "ADM - JM", tipo: "Profissionalizante" }
            ],
            "15:15 – 16:45": [
                { nome: "E.A.C", tipo: "Socioeducativo" },
                { nome: "LAZER E BEM ESTAR", tipo: "Socioeducativo" },
                { nome: "ADM - JM", tipo: "Profissionalizante" }
            ]
        }
    },
    quinta: {
        manha: {
            "08:30 – 10:00": [
                { nome: "E.A.C", tipo: "Socioeducativo" },
                { nome: "GASTRONOMIA", tipo: "Profissionalizante" }
            ],
            "10:15 – 11:45": [
                { nome: "E.A.C", tipo: "Socioeducativo" },
                { nome: "GASTRONOMIA", tipo: "Profissionalizante" }
            ]
        },
        tarde: {
            "13:30 – 15:00": [
                { nome: "ROBÓTICA AVANÇADO", tipo: "Profissionalizante" },
                { nome: "GASTRONOMIA", tipo: "Profissionalizante" },
                { nome: "ADM - BÁSICO", tipo: "Profissionalizante" },
                { nome: "E.A.C", tipo: "Socioeducativo" }
            ],
            "15:15 – 16:45": [
                { nome: "ROBÓTICA BÁSICO", tipo: "Profissionalizante" },
                { nome: "GASTRONOMIA", tipo: "Profissionalizante" },
                { nome: "ADM - BÁSICO", tipo: "Profissionalizante" },
                { nome: "E.A.C", tipo: "Socioeducativo" }
            ]
        }
    },
    sexta: {
        manha: {
            "08:30 – 10:00": [
                { nome: "ADM - JM", tipo: "Profissionalizante" },
                { nome: "GASTRONOMIA", tipo: "Profissionalizante" },
                { nome: "ROBÓTICA AVANÇADO", tipo: "Profissionalizante" }
            ],
            "10:15 – 11:45": [
                { nome: "ADM - BÁSICO", tipo: "Profissionalizante" },
                { nome: "GASTRONOMIA", tipo: "Profissionalizante" },
                { nome: "ROBÓTICA AVANÇADO", tipo: "Profissionalizante" }
            ]
        },
        tarde: {
            "13:30 – 15:00": [
                { nome: "GASTRONOMIA", tipo: "Profissionalizante" },
                { nome: "INFO - AVANÇADO", tipo: "Profissionalizante" }

            ],
            "15:15 – 16:45": [
                { nome: "GASTRONOMIA", tipo: "Profissionalizante" },
                { nome: "INFO - AVANÇADO", tipo: "Profissionalizante" }
            ]
        }
    }
};

const diasSemana = {
    segunda: "Segunda-feira",
    terca: "Terça-feira",
    quarta: "Quarta-feira",
    quinta: "Quinta-feira",
    sexta: "Sexta-feira"
};

// ===== ELEMENTOS DA PÁGINA =====
const tituloDia = document.getElementById('tituloDia');
const containerManha = document.getElementById('containerManha');
const containerTarde = document.getElementById('containerTarde');

// ===== FUNÇÃO PARA RENDERIZAR UM DIA =====
function renderizarDia(dia) {
    const dados = gradeCursos[dia];
    if (!dados) return;

    tituloDia.textContent = diasSemana[dia];

    // Limpa os containers
    containerManha.innerHTML = '';
    containerTarde.innerHTML = '';

    // ===== MANHÃ =====
    const manha = dados.manha;
    const blocosManha = Object.keys(manha);

    if (blocosManha.length === 0) {
        containerManha.innerHTML = '<p class="vazio">Nenhum curso na manhã</p>';
    } else {
        blocosManha.forEach(horario => {
            const cursos = manha[horario];
            const bloco = document.createElement('div');
            bloco.className = 'bloco-horario';
            bloco.innerHTML = `
                <div class="horario-titulo">🕐 ${horario}</div>
                <ul class="lista-cursos">
                    ${cursos.map(curso => `
                        <li>
                            <span class="curso-nome">${curso.nome}</span>
                            <span class="curso-tipo">${curso.tipo}</span>
                        </li>
                    `).join('')}
                </ul>
            `;
            containerManha.appendChild(bloco);
        });
    }

    // ===== TARDE =====
    const tarde = dados.tarde;
    const blocosTarde = Object.keys(tarde);

    if (blocosTarde.length === 0) {
        containerTarde.innerHTML = '<p class="vazio">Nenhum curso na tarde</p>';
    } else {
        blocosTarde.forEach(horario => {
            const cursos = tarde[horario];
            const bloco = document.createElement('div');
            bloco.className = 'bloco-horario';
            bloco.innerHTML = `
                <div class="horario-titulo">🕐 ${horario}</div>
                <ul class="lista-cursos">
                    ${cursos.map(curso => `
                        <li>
                            <span class="curso-nome">${curso.nome}</span>
                            <span class="curso-tipo">${curso.tipo}</span>
                        </li>
                    `).join('')}
                </ul>
            `;
            containerTarde.appendChild(bloco);
        });
    }

    // Marca o botão ativo
    document.querySelectorAll('.dia-btn').forEach(btn => {
        btn.classList.toggle('ativo', btn.dataset.dia === dia);
    });
}

// ===== CONFIGURA OS BOTÕES =====
document.querySelectorAll('.dia-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        renderizarDia(btn.dataset.dia);
    });
});

// ===== CARREGA O PRIMEIRO DIA (SEGUNDA) =====
renderizarDia('segunda');