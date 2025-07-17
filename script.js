document.addEventListener('DOMContentLoaded', () => {
    // URL da nossa API Rails. IMPORTANTE: seu servidor Rails deve estar rodando!
    const API_BASE_URL = 'https://fallout-api-check-list.onrender.com/api/v1';

    // Função principal que busca os dados e constrói uma lista na tela
    async function populateList(category) {
        const listElement = document.getElementById(`${category}-list`);
        if (!listElement) return;

        try {
            // 1. Busca os dados da nossa API
            const response = await fetch(`${API_BASE_URL}/${category}`);
            const items = await response.json();

            // 2. Carrega a lista de IDs que já foram marcados, salvos no aparelho
            const checkedItems = JSON.parse(localStorage.getItem(`checked_${category}`)) || [];

            // Limpa a lista antes de adicionar novos itens (para evitar duplicação)
            listElement.innerHTML = ''; 

            // 3. Para cada item recebido da API, cria um elemento na lista
            items.forEach(item => {
                const li = document.createElement('li');
                li.dataset.id = item.id; // Guarda o ID do item no próprio elemento

                // Cria o span para o nome e raridade
                const itemName = document.createElement('span');
                itemName.textContent = item.name;

                const itemRarity = document.createElement('span');
                itemRarity.className = 'item-rarity';
                itemRarity.textContent = item.rarity;

                li.appendChild(itemName);
                li.appendChild(itemRarity);

                // 4. Verifica se este item já estava marcado
                if (checkedItems.includes(item.id)) {
                    li.classList.add('checked');
                }

                // 5. Adiciona o evento de "click" (ou toque) para marcar/desmarcar
                li.addEventListener('click', () => {
                    // Alterna a classe visual 'checked'
                    li.classList.toggle('checked');
                    // Salva o estado atualizado no armazenamento do aparelho
                    updateCheckedItems(category);
                });

                listElement.appendChild(li);
            });
        } catch (error) {
            listElement.innerHTML = `<li>Falha ao carregar itens. Sua API Rails está rodando?</li>`;
            console.error('Erro ao buscar dados:', error);
        }
    }

    // Função que salva a lista de itens marcados no localStorage
    function updateCheckedItems(category) {
        const listElement = document.getElementById(`${category}-list`);
        const checkedElements = listElement.querySelectorAll('li.checked');
        
        // Pega o ID de cada elemento marcado e cria um array
        const checkedIds = Array.from(checkedElements).map(el => parseInt(el.dataset.id));
        
        // Salva esse array como texto no localStorage
        localStorage.setItem(`checked_${category}`, JSON.stringify(checkedIds));
    }

    // Inicia o processo para cada uma das nossas 4 categorias
    populateList('weapons');
    populateList('outfits');
    populateList('pets');
    populateList('dwellers');
});
