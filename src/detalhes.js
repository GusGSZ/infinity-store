document.addEventListener("DOMContentLoaded", function () {

    function getProductDetails() {
        // Obtém os parâmetros da URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        fetch(`https://fakestoreapi.com/products/${productId}`)
            .then(response => response.json())
            .then(product => {
                renderDetails(product);
            })
    }

    function renderDetails(product) {
        const container = document.querySelector('.product-image');
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.title;
        container.appendChild(image);

        const productTitle = document.querySelector('.product-title');
        productTitle.textContent = product.title;

        const productRating = document.querySelector('.product-rating');
        productRating.textContent = `Rating — ${product.rating.rate}`;

        const productPrice = document.querySelector('.product-price');
        productPrice.textContent = `R$ ${product.price}`;

        const descriptionDisplay = document.querySelector('.product-description');
        const description = document.createElement('p');
        description.classList.add('description-text');
        description.textContent = product.description;
        descriptionDisplay.appendChild(description);
    }

    getProductDetails();
});
