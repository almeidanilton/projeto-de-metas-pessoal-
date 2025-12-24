document.addEventListener('DOMContentLoaded', function() {
    // --- Seletores de DOM ---
    const metaForm = document.getElementById('meta-form');
    const listaMetas = document.getElementById('lista-metas');
    const fireworksContainer = document.getElementById('fireworks-container');
    const congratsModal = document.getElementById('congrats-modal');
    const completedGoalName = document.getElementById('completed-goal-name');

    // --- Funções de Formatação ---
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const formatCurrency = (value) => {
        const number = parseFloat(value);
        if (isNaN(number)) return 'R$ 0,00';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(number);
    };

    // --- Lógica de Metas (LocalStorage) ---
    function getGoals() {
        return JSON.parse(localStorage.getItem('metas')) || [];
    }

    function saveGoals(goals) {
        localStorage.setItem('metas', JSON.stringify(goals));
    }

    function addGoal(goal) {
        const goals = getGoals();
        goals.push(goal);
        saveGoals(goals);
        renderGoals();
    }

    function deleteGoal(id) {
        let goals = getGoals();
        goals = goals.filter(goal => goal.id !== id);
        saveGoals(goals);
        renderGoals();
    }

    function toggleComplete(id) {
        let goals = getGoals();
        const goalIndex = goals.findIndex(g => g.id === id);
        if (goalIndex > -1) {
            goals[goalIndex].completed = !goals[goalIndex].completed;
            saveGoals(goals);
            renderGoals();

            if (goals[goalIndex].completed) {
                triggerFireworks();
                showCongratsMessage(goals[goalIndex].nome);
            }
        }
    }

    // --- Renderização ---
    function renderGoals() {
        const goals = getGoals();
        listaMetas.innerHTML = ''; 

        if (goals.length === 0) {
            listaMetas.innerHTML = '<li class="empty-list-message">Nenhuma meta cadastrada ainda. Adicione uma acima!</li>';
            return;
        }
        
        goals.forEach(function(goal) {
            const li = document.createElement('li');
            li.className = `goal-item ${goal.categoria}`;
            if (goal.completed) {
                li.classList.add('completed');
            }
            li.dataset.id = goal.id;

            li.innerHTML = `
                <div class="goal-info">
                    <span><strong>${goal.nome}</strong></span>
                    <span>Valor: ${formatCurrency(goal.valor)}</span>
                    <span>Prazo: ${formatDate(goal.prazo)}</span>
                </div>
                <div class="goal-actions">
                    <button class="complete-btn">${goal.completed ? 'Desfazer' : 'Concluir'}</button>
                    <button class="delete-btn">Excluir</button>
                </div>
            `;
            listaMetas.appendChild(li);
        });
    }
    
    // --- Animações ---
    function showCongratsMessage(goalName) {
        completedGoalName.textContent = `"${goalName}"`;
        congratsModal.classList.add('visible');

        setTimeout(() => {
            congratsModal.classList.remove('visible');
        }, 4000); // A mensagem some após 4 segundos
    }

    function triggerFireworks() {
        fireworksContainer.style.display = 'block';
        for (let i = 0; i < 50; i++) {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = '50%';
            firework.style.top = '90%';
            
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * (window.innerWidth / 3);
            const x = Math.cos(angle) * radius;
            const y = -Math.random() * window.innerHeight * 0.7; // Movimento para cima
            
            firework.style.setProperty('--x', `${x}px`);
            firework.style.setProperty('--y', `${y}px`);
            
            fireworksContainer.appendChild(firework);
            
            firework.addEventListener('animationend', () => {
                firework.remove();
                if (fireworksContainer.childElementCount === 0) {
                    fireworksContainer.style.display = 'none';
                }
            });
        }
    }

    // --- Event Listeners ---
    metaForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const goal = {
            id: Date.now(),
            nome: document.getElementById('meta-nome').value,
            categoria: document.getElementById('meta-categoria').value,
            valor: document.getElementById('meta-valor').value,
            prazo: document.getElementById('meta-prazo').value,
            completed: false
        };

        addGoal(goal);
        metaForm.reset();
    });

    listaMetas.addEventListener('click', function(e) {
        const target = e.target;
        const parentLi = target.closest('li[data-id]');
        if (!parentLi) return;

        const goalId = Number(parentLi.dataset.id);

        if (target.classList.contains('complete-btn')) {
            toggleComplete(goalId);
        } else if (target.classList.contains('delete-btn')) {
            if (confirm('Tem certeza que deseja excluir esta meta?')) {
                deleteGoal(goalId);
            }
        }
    });

    // --- Inicialização ---
    renderGoals();
});
