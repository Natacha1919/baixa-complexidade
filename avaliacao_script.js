document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('evaluationForm');
    const N1Container = document.getElementById('N1-criteria');
    const N2Container = document.getElementById('N2-criteria');
    const N3Container = document.getElementById('N3-criteria');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submitBtn');

    // ** CONFIGURAÇÃO **
    // Use o mesmo URL do seu Web App
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyNJBrMKWVQVdQB3Bi2wSz2lixIZfY74KEnw7S9WrEBWlFJjcc6Jx9fWX_Wfg6Q08_72g/exec'; 

    // Dados dos critérios baseados no PDF (Simplificados para atribuição de NOTA 0-10)
    const criteria = {
        N1: [
            "Relacionar teoria e prática nas ações vigilância em Saúde",
            "Desenvolvimento das ações gerenciais: planejamento, organização, gestão, direção e controle",
            "Interesse na aprendizagem, proatividade",
            "Atuação em Procedimento de Enfermagem de Baixa e Média Complexidade",
            "Capacidade de aprendizagem; Atividades realizadas baseadas em evidências"
        ],
        N2: [
            "Ética no trabalho, respeito a hierarquia; Desenvolvimento do trabalho em equipe",
            "Resolução de problemas; Trabalho sob pressão; Estabilidade emocional; Responsabilidade",
            "Liderança positiva nas ações",
            "Aparência pessoal - uso do uniforme, NR32, Crachá",
            "Criatividade; Interesse, Segurança; Cooperação",
            "Assiduidade, pontualidade",
            "Comunicação verbal/não verbal nas ações de saúde",
            "Relação interpessoal (paciente, família, equipe, colegas e docente)"
        ],
        N3: [
            "Comportamento Psicomotor: destreza manual/coordenação motora",
            "Aplicação e visão crítica em todas as Etapas da Sistematização da Assistência de Enfermagem (SAE)",
            "Organização e gestão do tempo, Capacidade de agir com rapidez, eficiência e eficácia",
            "Domínio e utilização de termos Técnicos Científicos",
            "Desenvolvimento de Ações em Educação Permanente",
            "Qualidade do trabalho executado"
        ]
    };

    /**
     * Gera a estrutura HTML para cada seção de notas (N1, N2, N3).
     * @param {Array<string>} list - Lista de descrições dos critérios.
     * @param {string} sectionId - O ID da seção (N1, N2, N3).
     * @returns {string} - HTML dos campos de notas.
     */
    function renderCriteria(list, sectionId) {
        return list.map((description, index) => {
            const inputId = `${sectionId}_item_${index + 1}`;
            return `
                <div class="form-group criteria-group">
                    <label for="${inputId}">${description}</label>
                    <input type="number" 
                           id="${inputId}" 
                           name="${inputId}" 
                           required 
                           min="0" 
                           max="10" 
                           step="0.5"
                           placeholder="0 a 10" 
                           aria-label="Nota para ${description}">
                </div>
            `;
        }).join('');
    }

    // Renderiza o HTML dos critérios nas respectivas seções
    N1Container.innerHTML = renderCriteria(criteria.N1, 'N1');
    N2Container.innerHTML = renderCriteria(criteria.N2, 'N2');
    N3Container.innerHTML = renderCriteria(criteria.N3, 'N3');


    /**
     * Exibe uma mensagem de status (sucesso/erro).
     */
    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.classList.remove('hidden');
        formStatus.focus();
        setTimeout(() => formStatus.classList.add('hidden'), 8000);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!form.checkValidity()) {
            showStatus('Por favor, preencha todos os campos obrigatórios e corrija as notas inválidas.', 'error');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        formStatus.classList.add('hidden');

        const formData = new FormData(form);
        const dataToSend = new URLSearchParams(formData);

        try {
            const response = await fetch(WEB_APP_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: dataToSend, 
            });

            showStatus('Avaliação enviada com sucesso! A nota final será calculada na Planilha.', 'success');
            form.reset();

        } catch (error) {
            console.error('Erro ao enviar o formulário:', error);
            showStatus('Ocorreu um erro ao conectar-se ao servidor. Tente novamente.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Avaliação de Desempenho';
        }
    });
});