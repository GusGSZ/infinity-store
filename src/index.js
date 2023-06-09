document.addEventListener("DOMContentLoaded", function () {
  // Função para alternar o input de busca
  function toggleSearchInput() {
    const searchInput = document.querySelector('.search-input');
    searchInput.classList.toggle('active');
    if (searchInput.classList.contains('active')) {
      searchInput.style.width = window.innerWidth < 640 ? '80px' : '200px';
      searchInput.style.fontSize = window.innerWidth < 640 ? '11px' : '14px';
      searchInput.style.opacity = '1';
      searchInput.focus();
    } else {
      searchInput.style.width = '0';
      searchInput.style.opacity = '0';
      searchInput.blur();
    }
  }

  // Função para configurar o ícone de busca
  function setupSearchIcon() {
    const searchIcon = document.querySelector('.search-icon');
    searchIcon.addEventListener('click', toggleSearchInput);
  }

  function handleSearchInput() {
    clearTimeout(searchTimeout);

    // Aguardar um pequeno intervalo para evitar chamadas excessivas à API durante a digitação
    searchTimeout = setTimeout(() => {
      const searchTerm = searchInput.value.trim();
      const radios = document.querySelectorAll('input[type="radio"]')
      radios.forEach(radio => {
        if (radio.id === 'allproducts' && !radio.checked) radio.checked = true;
      });
      
      if (searchTerm !== '') {
        searchProducts(searchTerm);
      } else {
        getProducts();
      }
    }, 300); // Aguarda 300ms após a digitação antes de realizar a pesquisa
  }

  function searchProducts(searchTerm) {
    // Realizar a request para obter os produtos correspondentes à pesquisa
    fetch(`https://fakestoreapi.com/products/`)
      .then(response => response.json())
      .then(products => {
        const filteredProducts = products.filter(product =>
          product.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        );
        renderCards(filteredProducts);
      })
  }

  function getProducts() {

    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        renderCards(data);
      })
  }

  function initializeRadiosListeners() {
    const radios = document.querySelectorAll('input[type="radio"]')
    radios[0].addEventListener('change', getByCategory);
    radios[1].addEventListener('change', getByCategory);
    radios[2].addEventListener('change', getByCategory);
    radios[3].addEventListener('change', getByCategory);
    radios[4].addEventListener('change', getByCategory);
  }

  function getByCategory() {
    const radios = document.querySelectorAll('input[type="radio"]')
    let activeRadio = null;
    radios.forEach(radio => {
      if (radio.checked) activeRadio = radio;
    });

    if (activeRadio.id === 'allproducts') getProducts();
    else fetch(`https://fakestoreapi.com/products/category/${activeRadio.id}`)
      .then(res => res.json())
      .then(data => renderCards(data))
  }

  function renderCards(data) {
    const container = document.querySelector('.produtos-grid');
    // Limpar o conteúdo atual do container
    container.innerHTML = '';

    // Verificar se há produtos correspondentes
    if (data.length === 0) {
      container.textContent = 'Nenhum produto correspondente encontrado.';
      return;
    }
    // Itere sobre os dados dos produtos
    data.forEach(product => {
      // Crie um elemento <div> para cada card
      const card = document.createElement('div');
      card.classList.add('product-card');

      // Crie um elemento <div> para a imagem
      const imageWrapper = document.createElement('div');
      imageWrapper.classList.add('image-wrapper');
      const image = document.createElement('img');
      image.src = product.image;
      image.alt = product.name;
      imageWrapper.appendChild(image);
      card.appendChild(imageWrapper);

      // Crie um elemento <div> para os detalhes
      const details = document.createElement('a');
      details.classList.add('details');
      const productName = document.createElement('h5');
      productName.textContent = product.title;
      const productDescription = document.createElement('p');
      productDescription.textContent = `${product.rating.rate} stars`;
      const productPrice = document.createElement('p');
      productPrice.textContent = `R$ ${product.price}`;
      productPrice.classList.add('price')
      const buyButton = document.createElement('a');
      details.href = `src/detalhes.html?id=${product.id}`;

      details.appendChild(productName);
      details.appendChild(productDescription);
      details.appendChild(productPrice);
      details.appendChild(buyButton);
      card.appendChild(details);

      // Adicione o card ao container
      container.appendChild(card);
    });
  }

  const searchInput = document.querySelector('.search-input');
  let searchTimeout;
  searchInput.addEventListener('input', handleSearchInput);
  setupSearchIcon();
  getProducts();
  initializeRadiosListeners();
});
