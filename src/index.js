document.addEventListener("DOMContentLoaded", function () {
  /* Search */

  function toggleSearchInput() {
    const searchInput = document.querySelector(".search-input");
    searchInput.classList.toggle("active");
    if (searchInput.classList.contains("active")) {
      searchInput.style.width = window.innerWidth < 640 ? "80px" : "200px";
      searchInput.style.fontSize = window.innerWidth < 640 ? "11px" : "14px";
      searchInput.style.opacity = "1";
      searchInput.focus();
    } else {
      searchInput.style.width = "0";
      searchInput.style.opacity = "0";
      searchInput.blur();
    }
  }

  function setupSearchIcon() {
    const searchIcon = document.querySelector(".search-icon");
    searchIcon.addEventListener("click", toggleSearchInput);
  }

  function handleSearchInput() {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      const searchTerm = searchInput.value.trim();
      const paginationContainer = document.querySelector('.pagination');

      if (searchTerm !== "") {
        searchProducts(searchTerm);
        paginationContainer.style.display = 'none';
      } else {
        paginationContainer.style.display = 'block';
        getProducts();
      }
    }, 300);
  }

  function searchProducts(searchTerm) {
    fetch(
      `https://diwserver.vps.webdock.cloud/products/search?query=${searchTerm}`
    )
      .then((response) => response.json())
      .then((products) => {
        renderCards(products);
      });
  }

  /* Produtos */

  function getProducts() {
    fetch(`https://diwserver.vps.webdock.cloud/products?page=1&page_items=${itensPorPagina}`)
      .then((res) => res.json())
      .then((data) => {
        renderCards(data.products);
      });
  }

  /* Categorias */

  function initializeCategoriesFilter() {
    const btnAbrirModal = document.getElementById("btnAbrirModal");
    const modal = document.getElementById("modal");

    btnAbrirModal.addEventListener("click", function () {
      modal.style.display = "block";
      exibirCategorias();
    });

    modal.addEventListener("click", function (event) {
      if (event.target.classList.contains("close")) {
        modal.style.display = "none";
      }
    });
  }

  function getByCategory(category) {
    if (category === "allproducts") getProducts();
    else
      fetch(`https://diwserver.vps.webdock.cloud/products/category/${category}`)
        .then((res) => res.json())
        .then((data) => renderCards(data.products));
  }

  function exibirCategorias() {
    const listaCategorias = document.getElementById("listaCategorias");
    listaCategorias.innerHTML = "";

    const li = document.createElement("li");
    li.textContent = "All Products";
    li.addEventListener("click", function () {
      getByCategory("allproducts");
      modal.style.display = "none";
    });
    listaCategorias.appendChild(li);
    fetch(`https://diwserver.vps.webdock.cloud/products/categories`)
      .then((res) => res.json())
      .then((categories) =>
        categories.forEach((categoria) => {
          const li = document.createElement("li");
          li.textContent = categoria;
          li.addEventListener("click", function () {
            getByCategory(categoria);
            modal.style.display = "none";
          });
          listaCategorias.appendChild(li);
        })
      );
  }

  async function returnProductsByPage(page) {
    const resposta = await fetch(
      `https://diwserver.vps.webdock.cloud/products?page=${page}&page_items=20`
    );
    const data = await resposta.json();

    return data.products;
  }

  /* Renderizar cards */

  function renderCards(data) {
    const container = document.querySelector(".produtos-grid");
    container.innerHTML = "";

    if (data.length === 0) {
      container.textContent = "Nenhum produto correspondente encontrado.";
      return;
    }

    data.forEach((product) => {
      const card = document.createElement("div");
      card.classList.add("product-card");

      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("image-wrapper");
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.name;
      imageWrapper.appendChild(image);
      card.appendChild(imageWrapper);

      const details = document.createElement("a");
      details.classList.add("details");
      const productName = document.createElement("h5");
      productName.textContent = product.title;
      const productDescription = document.createElement("p");
      productDescription.textContent = `${product.rating.rate} stars`;
      const productPrice = document.createElement("p");
      productPrice.textContent = `R$ ${product.price}`;
      productPrice.classList.add("price");
      const buyButton = document.createElement("a");
      details.href = `src/detalhes.html?id=${product.id}`;

      details.appendChild(productName);
      details.appendChild(productDescription);
      details.appendChild(productPrice);
      details.appendChild(buyButton);
      card.appendChild(details);

      container.appendChild(card);
    });
  }

  /* Paginação */

  function criarLinksPaginacao(totalItens, itensPorPagina, linksPorPagina) {
    const paginationContainer = document.querySelector(".pagination ul");
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);

    let paginaAtual = 1;

    function criarLinkPagina(numeroPagina) {
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = numeroPagina;

      link.addEventListener("click", function () {
        exibirPagina(numeroPagina);
      });
  
      return link;
    }

    function exibirLinksPagina(inicio, fim) {
      paginationContainer.innerHTML = "";

      for (let i = inicio; i <= fim; i++) {
        const link = criarLinkPagina(i);
        paginationContainer.appendChild(link);
      }
    }

    async function exibirPagina(numeroPagina) {
      paginaAtual = numeroPagina;

      const products = await returnProductsByPage(numeroPagina);
      renderCards(products);

      const totalLinksPagina = Math.min(linksPorPagina, totalPaginas);
      const metadeLinksPagina = Math.floor(totalLinksPagina / 2);
      let inicio, fim;

      if (paginaAtual <= metadeLinksPagina) {
        inicio = 1;
        fim = totalLinksPagina;
      } else if (paginaAtual + metadeLinksPagina >= totalPaginas) {
        inicio = totalPaginas - totalLinksPagina + 1;
        fim = totalPaginas;
      } else {
        inicio = paginaAtual - metadeLinksPagina;
        fim = paginaAtual + metadeLinksPagina;
      }

      exibirLinksPagina(inicio, fim);

      const linksPagina = document.querySelectorAll(".pagination a");
      linksPagina.forEach((link) => {
        if (parseInt(link.textContent) === paginaAtual) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }

    exibirPagina(1);
  }

  /* Main */

  const totalItens = 12133;
  const itensPorPagina = 12;
  const linksPorPagina = 5;
  const searchInput = document.querySelector(".search-input");
  let searchTimeout;
  searchInput.addEventListener("input", handleSearchInput);
  setupSearchIcon();
  initializeCategoriesFilter();
  getProducts();
  criarLinksPaginacao(totalItens, itensPorPagina, linksPorPagina);
});