document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

function initializePage() {
    initializeForms();
    initializeInteractiveElements();
    initializeBranchMap();
    initializeCarFilters();
    initializeBookingCalculation();
}

function initializeForms() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBooking);
    }
    
    const addCardForm = document.getElementById('addCardForm');
    if (addCardForm) {
        addCardForm.addEventListener('submit', handleAddCard);
        initializeCardInputs();
    }
    
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const phone = formData.get('phone');
    const password = formData.get('password');
    
    if (!phone || !password) {
        alert('Пожалуйста, заполните все поля');
        return;
    }
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userPhone', phone);
    
    alert('Вход выполнен успешно!');
    window.location.href = 'profile.html';
}

function handleRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        alert('Пароли не совпадают');
        return;
    }
    
    const birthDate = new Date(formData.get('birthDate'));
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    
    if (age < 23) {
        alert('Для регистрации необходимо быть старше 23 лет');
        return;
    }
    
    alert('Регистрация прошла успешно!');
    window.location.href = 'login.html';
}

function handleBooking(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const requiredFields = ['startDate', 'endDate', 'branch', 'lastName', 'firstName', 'middleName', 'phone', 'passport', 'bankCard', 'birthDate'];
    
    for (let field of requiredFields) {
        if (!formData.get(field)) {
            alert(`Пожалуйста, заполните поле: ${field}`);
            return;
        }
    }
    
    const startDate = new Date(formData.get('startDate'));
    const endDate = new Date(formData.get('endDate'));
    
    if (startDate >= endDate) {
        alert('Дата возврата должна быть позже даты бронирования');
        return;
    }
    
    if (startDate < new Date()) {
        alert('Дата бронирования не может быть в прошлом');
        return;
    }
    
    const bookingCode = 'BR' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    alert(`Бронирование оформлено успешно!\nКод бронирования: ${bookingCode}`);
    window.location.href = 'profile.html';
}

function handleSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const carClass = formData.get('car-class');
    const brand = formData.get('brand');
    const model = formData.get('model');
    
    let url = 'car-select.html';
    const params = new URLSearchParams();
    
    if (carClass) params.append('class', carClass);
    if (brand) params.append('brand', brand);
    if (model) params.append('model', model);
    
    if (params.toString()) {
        url += '?' + params.toString();
    }
    
    window.location.href = url;
}

function initializeInteractiveElements() {
    const brandSelect = document.getElementById('brand');
    const modelSelect = document.getElementById('model');
    
    if (brandSelect && modelSelect) {
        brandSelect.addEventListener('change', function() {
            updateModels(this.value, modelSelect);
        });
    }
}

function updateModels(brand, modelSelect) {
    const models = {
        toyota: ['Camry', 'Corolla', 'RAV4', 'Land Cruiser'],
        bmw: ['3 Series', 'X5', '5 Series', 'X3'],
        mercedes: ['C-Class', 'E-Class', 'GLC', 'S-Class'],
        audi: ['A4', 'Q5', 'A6', 'Q7']
    };
    
    modelSelect.innerHTML = '<option value="">Выберите модель</option>';
    
    if (brand && models[brand]) {
        models[brand].forEach(model => {
            const option = document.createElement('option');
            option.value = model.toLowerCase().replace(' ', '-');
            option.textContent = model;
            modelSelect.appendChild(option);
        });
    }
}

function initializeBranchMap() {
    const branchMarkers = document.querySelectorAll('.branch-marker');
    const branchDetails = document.querySelectorAll('.branch-details');
    
    branchMarkers.forEach(marker => {
        marker.addEventListener('click', function() {
            const branchId = this.dataset.branch;
            showBranchDetails(branchId);
        });
    });
}

function showBranchDetails(branchId) {
    const branchDetails = document.querySelectorAll('.branch-details');
    
    branchDetails.forEach(detail => {
        detail.style.display = 'none';
    });
    
    const targetDetail = document.getElementById(`branch-${branchId}`);
    if (targetDetail) {
        targetDetail.style.display = 'block';
    }
}

function initializeCarFilters() {
    const filters = ['brandFilter', 'engineFilter', 'transmissionFilter'];
    
    filters.forEach(filterId => {
        const filter = document.getElementById(filterId);
        if (filter) {
            filter.addEventListener('change', filterCars);
        }
    });
}

function filterCars() {
    const brandFilter = document.getElementById('brandFilter')?.value || '';
    const engineFilter = document.getElementById('engineFilter')?.value || '';
    const transmissionFilter = document.getElementById('transmissionFilter')?.value || '';
    
    const carCards = document.querySelectorAll('.car-card');
    
    carCards.forEach(card => {
        const brand = card.dataset.brand || '';
        const engine = card.dataset.engine || '';
        const transmission = card.dataset.transmission || '';
        
        const brandMatch = !brandFilter || brand === brandFilter;
        const engineMatch = !engineFilter || engine === engineFilter;
        const transmissionMatch = !transmissionFilter || transmission === transmissionFilter;
        
        if (brandMatch && engineMatch && transmissionMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function initializeBookingCalculation() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput && endDateInput) {
        startDateInput.addEventListener('change', calculateBookingPrice);
        endDateInput.addEventListener('change', calculateBookingPrice);
    }
}

function calculateBookingPrice() {
    const startDate = document.getElementById('startDate')?.value;
    const endDate = document.getElementById('endDate')?.value;
    const dailyPrice = 2500; 
    
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) return;
    
    let discount = 0;
    if (days >= 3) {
        discount = Math.min(Math.floor(days / 3) * 5, 25);
    }
    
    const subtotal = days * dailyPrice;
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;
    
    const daysCountElement = document.getElementById('daysCount');
    const discountElement = document.getElementById('discount');
    const totalPriceElement = document.getElementById('totalPrice');
    
    if (daysCountElement) daysCountElement.textContent = days;
    if (discountElement) discountElement.textContent = discount + '%';
    if (totalPriceElement) totalPriceElement.textContent = total.toLocaleString() + ' ₽';
}

function openAddCardModal() {
    const modal = document.getElementById('addCardModal');
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeAddCardModal() {
    const modal = document.getElementById('addCardModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function initializeCardInputs() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
}

function handleAddCard(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cardNumber = formData.get('cardNumber').replace(/\s/g, '');
    
    let cardType = 'unknown';
    if (cardNumber.startsWith('1111')) cardType = 'visa';
    else if (cardNumber.startsWith('2222')) cardType = 'mastercard';
    else if (cardNumber.startsWith('3333')) cardType = 'mir';
    else if (cardNumber.startsWith('4')) cardType = 'visa';
    else if (cardNumber.startsWith('5')) cardType = 'mastercard';
    
    alert('Карта успешно добавлена!');
    closeAddCardModal();
    
    location.reload();
}

function removeCard(cardId) {
    if (confirm('Вы уверены, что хотите удалить эту карту?')) {
        alert('Карта удалена');
        location.reload();
    }
}

function selectCar() {
    window.location.href = 'car-select.html';
}

function selectCard() {
    window.location.href = 'cards.html';
}

function changeTariff() {
    alert('Функция изменения тарифа будет доступна в следующей версии');
}

function selectCar(carId) {
    alert(`Автомобиль ${carId} выбран!`);
    window.location.href = 'booking.html';
}

function cancelSelection() {
    if (confirm('Отменить выбор автомобиля?')) {
        window.history.back();
    }
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userPhone');
        window.location.href = 'index.html';
    }
}

window.addEventListener('click', function(e) {
    const modal = document.getElementById('addCardModal');
    if (e.target === modal) {
        closeAddCardModal();
    }
});

function checkAuth() {
    const protectedPages = ['profile.html', 'booking.html', 'history.html', 'cards.html'];
    const currentPage = window.location.pathname.split('/').pop();
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (protectedPages.includes(currentPage) && !isLoggedIn) {
        alert('Для доступа к этой странице необходимо войти в систему');
        window.location.href = 'login.html';
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);