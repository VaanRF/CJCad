// ===== URL DA API =====
const API_URL = 'https://cjcad.onrender.com';

// ===== REFERÊNCIAS DO FORMULÁRIO =====
const form = document.getElementById('formNovoAluno');
const mensagem = document.getElementById('mensagem');

// ===== FUNÇÃO PARA MASCARAR CPF =====
function mascaraCPF(input) {
    let valor = input.value.replace(/\D/g, '');
    if (valor.length <= 3) {
        input.value = valor;
    } else if (valor.length <= 6) {
        input.value = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    } else if (valor.length <= 9) {
        input.value = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else {
        input.value = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    }
}

// ===== APLICA MÁSCARA NOS CPFs =====
document.getElementById('cpf').addEventListener('input', function() {
    mascaraCPF(this);
});
document.getElementById('cpfResponsavel').addEventListener('input', function() {
    mascaraCPF(this);
});

// ===== ENVIA O FORMULÁRIO =====
form.addEventListener('submit', function(e) {
    e.preventDefault();

    // ===== VALIDAÇÃO BÁSICA =====
    const nome = document.getElementById('nome').value.trim();
    const nascimento = document.getElementById('nascimento').value;
    const telefone1 = document.getElementById('telefone1').value.trim();
    const responsavel = document.getElementById('responsavel').value.trim();

    if (!nome || !nascimento || !telefone1 || !responsavel) {
        mensagem.innerHTML = '❌ Preencha todos os campos obrigatórios (*).';
        mensagem.className = 'mensagem-erro';
        return;
    }

    // ===== MONTA O OBJETO DO ALUNO =====
    const novoAluno = {
        FIELD1: '', // será gerado pelo backend
        FIELD2: '',
        FIELD3: new Date().toLocaleDateString('pt-BR'),
        FIELD4: nome,
        FIELD5: nascimento.split('-').reverse().join('/'),
        FIELD6: calcularIdade(nascimento),
        FIELD7: document.getElementById('cpf').value || '',
        FIELD8: '',
        FIELD9: '',
        FIELD10: '',
        FIELD11: '',
        FIELD12: '',
        FIELD13: document.getElementById('endereco').value || '',
        FIELD14: document.getElementById('bairro').value || '',
        FIELD15: '',
        FIELD16: telefone1,
        FIELD17: document.getElementById('telefone2').value || '',
        FIELD18: '',
        FIELD19: '',
        FIELD20: document.getElementById('escola').value || '',
        FIELD21: '',
        FIELD22: document.getElementById('serie').value || '',
        FIELD23: '',
        FIELD24: document.getElementById('turnoEscola').value || '',
        FIELD25: document.getElementById('turnoCJ').value || '',
        FIELD26: '',
        FIELD27: '',
        FIELD28: responsavel,
        FIELD29: '',
        FIELD30: '',
        FIELD31: '',
        FIELD32: document.getElementById('cpfResponsavel').value || '',
        FIELD33: '',
        FIELD34: '',
        FIELD35: '',
        FIELD36: '',
        FIELD37: '',
        FIELD38: '',
        FIELD39: '',
        FIELD40: '',
        FIELD41: '',
        FIELD42: '',
        FIELD43: document.getElementById('observacoes').value || ''
    };

    // ===== ENVIA PARA A API =====
    fetch(`${API_URL}/alunos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoAluno)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar aluno');
        }
        return response.json();
    })
    .then(data => {
        mensagem.innerHTML = `✅ Aluno cadastrado com sucesso! ID: ${data.aluno.FIELD1}`;
        mensagem.className = 'mensagem-sucesso';
        form.reset();
        // Opcional: redirecionar para a página do aluno
        // window.location.href = `aluno.html?id=${data.aluno.FIELD1}`;
    })
    .catch(error => {
        console.error('Erro:', error);
        mensagem.innerHTML = '❌ Erro ao cadastrar aluno. Tente novamente.';
        mensagem.className = 'mensagem-erro';
    });
});

// ===== FUNÇÃO PARA CALCULAR IDADE =====
function calcularIdade(dataNasc) {
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const mes = hoje.getMonth() - nasc.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nasc.getDate())) {
        idade--;
    }
    return idade;
}