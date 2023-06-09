/* document.addEventListener("DOMContentLoaded", function () {
    // Função para alternar o input de busca
    function toggleSearchInput() {
      const searchInput = document.querySelector('.search-input');
      searchInput.classList.toggle('active');
      if (searchInput.classList.contains('active')) {
        searchInput.style.width = '200px';
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
  
    setupSearchIcon();
    const searchInput = document.querySelector('.search-input');
    let searchTimeout;
    searchInput.addEventListener('input', handleSearchInput);
  });
   */