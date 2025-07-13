        // Data Storage
        let currentUser = null;
        let currentSection = 'dashboard';
        let clients = [];
        let products = [];
        let scans = [];
        let charts = {};
        
        // Initialize app
        document.addEventListener('DOMContentLoaded', function() {
            initializeData();
            setupEventListeners();
            
            // Check if redirecting
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            if (code) {
                handleRedirect(code);
            }
        });
        
        function initializeData() {
            // Initialize with sample data
            clients = [
                {
                    id: 1,
                    name: 'Panadería Navarro',
                    email: 'cliente@demo.com',
                    password: 'cliente123',
                    status: 'active',
                    created: '2024-01-15'
                },
                {
                    id: 2,
                    name: 'Restaurante El Buen Sabor',
                    email: 'restaurante@demo.com',
                    password: 'restaurante123',
                    status: 'active',
                    created: '2024-01-20'
                }
            ];
            
            products = [
                {
                    id: 1,
                    code: 'H8G7D',
                    url: 'https://panaderianavarro.com/resenas',
                    defaultUrl: 'https://growtap.es/default',
                    clientId: 1,
                    status: 'active',
                    created: '2024-01-15'
                },
                {
                    id: 2,
                    code: 'Z3L1P',
                    url: 'https://linktr.ee/panaderianavarro',
                    defaultUrl: 'https://growtap.es/default',
                    clientId: 1,
                    status: 'active',
                    created: '2024-01-15'
                },
                {
                    id: 3,
                    code: 'W9E6Q',
                    url: 'https://restaurante.com/menu',
                    defaultUrl: 'https://growtap.es/default',
                    clientId: 2,
                    status: 'active',
                    created: '2024-01-20'
                }
            ];
            
            // Generate sample scan data
            scans = [];
            const now = new Date();
            for (let i = 0; i < 100; i++) {
                const scanDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
                scans.push({
                    id: i + 1,
                    productId: Math.floor(Math.random() * 3) + 1,
                    date: scanDate.toISOString(),
                    hour: scanDate.getHours()
                });
            }
        }
        
        function setupEventListeners() {
            // Login form
            document.getElementById('loginForm').addEventListener('submit', handleLogin);
            
            // Navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    e.preventDefault();
                    showSection(this.dataset.section);
                });
            });
            
            // Mobile menu
            document.getElementById('mobileMenuBtn').addEventListener('click', function() {
                document.getElementById('sidebar').classList.add('open');
            });
            
            document.getElementById('closeSidebarBtn').addEventListener('click', function() {
                document.getElementById('sidebar').classList.remove('open');
            });
            
            // Logout
            document.getElementById('logoutBtn').addEventListener('click', handleLogout);
            
            // Modal buttons
            document.getElementById('addClientBtn').addEventListener('click', function() {
                showClientModal();
            });
            
            document.getElementById('addProductBtn').addEventListener('click', function() {
                showProductModal();
            });
            
            document.getElementById('importProductsBtn').addEventListener('click', function() {
                showImportModal();
            });
            
            // Forms
            document.getElementById('clientForm').addEventListener('submit', handleClientSubmit);
            document.getElementById('productForm').addEventListener('submit', handleProductSubmit);
            document.getElementById('editUrlForm').addEventListener('submit', handleEditUrlSubmit);
            
            // Search and filters
            document.getElementById('clientSearch').addEventListener('input', filterClients);
            document.getElementById('clientStatusFilter').addEventListener('change', filterClients);
            document.getElementById('productSearch').addEventListener('input', filterProducts);
            document.getElementById('productStatusFilter').addEventListener('change', filterProducts);
            document.getElementById('productClientFilter').addEventListener('change', filterProducts);
            
            // Import CSV
            document.getElementById('csvFile').addEventListener('change', handleCSVSelect);
            document.getElementById('importBtn').addEventListener('click', handleImport);
            document.getElementById('downloadTemplate').addEventListener('click', downloadTemplate);
            
            // File upload drag and drop
            const fileUpload = document.getElementById('fileUpload');
            fileUpload.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('dragover');
            });
            
            fileUpload.addEventListener('dragleave', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
            });
            
            fileUpload.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    document.getElementById('csvFile').files = files;
                    handleCSVSelect();
                }
            });
            
            // Analytics filters
            document.getElementById('analyticsTimeFilter').addEventListener('change', updateAnalytics);
            document.getElementById('analyticsClientFilter').addEventListener('change', updateAnalytics);
        }
        
        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Show loading
            document.getElementById('loginSpinner').style.display = 'inline-block';
            
            setTimeout(() => {
                // Check admin credentials
                if (email === 'admin@growtap.es' && password === 'admin123') {
                    currentUser = { email, role: 'admin' };
                    showMainApp();
                } else {
                    // Check client credentials
                    const client = clients.find(c => c.email === email && c.password === password);
                    if (client) {
                        currentUser = { email, role: 'client', clientId: client.id };
                        showMainApp();
                    } else {
                        showNotification('Email o contraseña incorrectos', 'error');
                    }
                }
                
                document.getElementById('loginSpinner').style.display = 'none';
            }, 1000);
        }
        
        function showMainApp() {
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('mainApp').classList.remove('hidden');
            
            // Update UI based on user role
            document.getElementById('userEmail').textContent = currentUser.email;
            document.getElementById('userRole').textContent = currentUser.role === 'admin' ? 'Administrador' : 'Cliente';
            
            if (currentUser.role === 'admin') {
                document.getElementById('adminMenu').classList.remove('hidden');
                document.getElementById('clientMenu').classList.add('hidden');
                showSection('dashboard');
            } else {
                document.getElementById('adminMenu').classList.add('hidden');
                document.getElementById('clientMenu').classList.remove('hidden');
                showSection('client-dashboard');
            }
            
            updateData();
        }
        
        function showSection(section) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
            
            // Show selected section
            document.getElementById(section).classList.remove('hidden');
            
            // Update navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('bg-indigo-50', 'text-indigo-600');
            });
            
            document.querySelector(`[data-section="${section}"]`).classList.add('bg-indigo-50', 'text-indigo-600');
            
            currentSection = section;
            
            // Load section-specific data
            switch(section) {
                case 'dashboard':
                    updateDashboard();
                    break;
                case 'clients':
                    updateClientsTable();
                    break;
                case 'products':
                    updateProductsTable();
                    break;
                case 'analytics':
                    updateAnalytics();
                    break;
                case 'client-dashboard':
                    updateClientDashboard();
                    break;
                case 'client-products':
                    updateClientProducts();
                    break;
                case 'client-analytics':
                    updateClientAnalytics();
                    break;
            }
        }
        
        function updateData() {
            // Update dashboard stats
            document.getElementById('totalClients').textContent = clients.length;
            document.getElementById('totalProducts').textContent = products.length;
            document.getElementById('activeProducts').textContent = products.filter(p => p.status === 'active').length;
            document.getElementById('totalScans').textContent = scans.length;
            
            // Update filters
            updateFilters();
        }
        
        function updateFilters() {
            const clientFilters = document.querySelectorAll('#productClientFilter, #analyticsClientFilter');
            clientFilters.forEach(filter => {
                filter.innerHTML = '<option value="">Todos los clientes</option>';
                clients.forEach(client => {
                    filter.innerHTML += `<option value="${client.id}">${client.name}</option>`;
                });
            });
            
            if (currentUser.role === 'client') {
                const myProducts = products.filter(p => p.clientId === currentUser.clientId);
                document.getElementById('myProducts').textContent = myProducts.length;
                document.getElementById('myActiveProducts').textContent = myProducts.filter(p => p.status === 'active').length;
                
                const myScans = scans.filter(s => {
                    const product = products.find(p => p.id === s.productId);
                    return product && product.clientId === currentUser.clientId;
                });
                document.getElementById('myTotalScans').textContent = myScans.length;
                
                const today = new Date().toDateString();
                const todayScans = myScans.filter(s => new Date(s.date).toDateString() === today);
                document.getElementById('myScansToday').textContent = todayScans.length;
            }
        }
        
        function updateDashboard() {
            // Update charts
            updateDashboardCharts();
            updateTopClients();
        }
        
        function updateDashboardCharts() {
            const ctx = document.getElementById('scansChart').getContext('2d');
            
            // Prepare data for last 7 days
            const labels = [];
            const data = [];
            const now = new Date();
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                labels.push(date.toLocaleDateString());
                
                const dayScans = scans.filter(s => {
                    const scanDate = new Date(s.date);
                    return scanDate.toDateString() === date.toDateString();
                });
                data.push(dayScans.length);
            }
            
            if (charts.scansChart) {
                charts.scansChart.destroy();
            }
            
            charts.scansChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Escaneos',
                        data: data,
                        borderColor: '#4f46e5',
                        backgroundColor: 'rgba(79, 70, 229, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
        
        function updateTopClients() {
            const clientStats = clients.map(client => {
                const clientProducts = products.filter(p => p.clientId === client.id);
                const clientScans = scans.filter(s => {
                    const product = products.find(p => p.id === s.productId);
                    return product && product.clientId === client.id;
                });
                
                return {
                    name: client.name,
                    products: clientProducts.length,
                    scans: clientScans.length
                };
            });
            
            clientStats.sort((a, b) => b.scans - a.scans);
            
            const topClientsHtml = clientStats.slice(0, 5).map(client => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p class="font-medium">${client.name}</p>
                        <p class="text-sm text-gray-600">${client.products} productos</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-indigo-600">${client.scans}</p>
                        <p class="text-sm text-gray-600">escaneos</p>
                    </div>
                </div>
            `).join('');
            
            document.getElementById('topClients').innerHTML = topClientsHtml;
        }
        
        function updateClientsTable() {
            const tableBody = document.getElementById('clientsTableBody');
            
            const filteredClients = clients.filter(client => {
                const search = document.getElementById('clientSearch').value.toLowerCase();
                const statusFilter = document.getElementById('clientStatusFilter').value;
                
                const matchesSearch = client.name.toLowerCase().includes(search) || 
                                    client.email.toLowerCase().includes(search);
                const matchesStatus = !statusFilter || client.status === statusFilter;
                
                return matchesSearch && matchesStatus;
            });
            
            const html = filteredClients.map(client => {
                const clientProducts = products.filter(p => p.clientId === client.id);
                const statusBadge = client.status === 'active' ? 'badge-success' : 'badge-danger';
                
                return `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span class="text-indigo-600 font-medium">${client.name.charAt(0)}</span>
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">${client.name}</div>
                                    <div class="text-sm text-gray-500">ID: ${client.id}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${client.email}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${clientProducts.length}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="badge ${statusBadge}">${client.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onclick="editClient(${client.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteClient(${client.id})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
            
            tableBody.innerHTML = html;
        }
        
        function updateProductsTable() {
            const tableBody = document.getElementById('productsTableBody');
            
            const filteredProducts = products.filter(product => {
                const search = document.getElementById('productSearch').value.toLowerCase();
                const statusFilter = document.getElementById('productStatusFilter').value;
                const clientFilter = document.getElementById('productClientFilter').value;
                
                const matchesSearch = product.code.toLowerCase().includes(search) || 
                                    product.url.toLowerCase().includes(search);
                const matchesStatus = !statusFilter || product.status === statusFilter;
                const matchesClient = !clientFilter || product.clientId == clientFilter;
                
                return matchesSearch && matchesStatus && matchesClient;
            });
            
            const html = filteredProducts.map(product => {
                const client = clients.find(c => c.id === product.clientId);
                const productScans = scans.filter(s => s.productId === product.id);
                const statusBadge = product.status === 'active' ? 'badge-success' : 'badge-danger';
                
                return `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-qrcode text-green-600"></i>
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">${product.code}</div>
                                    <div class="text-sm text-gray-500">ID: ${product.id}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">${product.url}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${client ? client.name : 'Sin asignar'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${productScans.length}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="badge ${statusBadge}">${product.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onclick="editProduct(${product.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-900">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
            
            tableBody.innerHTML = html;
        }
        
        function updateClientProducts() {
            const tableBody = document.getElementById('myProductsTableBody');
            const clientProducts = products.filter(p => p.clientId === currentUser.clientId);
            
            const filteredProducts = clientProducts.filter(product => {
                const search = document.getElementById('myProductSearch').value.toLowerCase();
                const statusFilter = document.getElementById('myProductStatusFilter').value;
                
                const matchesSearch = product.code.toLowerCase().includes(search) || 
                                    product.url.toLowerCase().includes(search);
                const matchesStatus = !statusFilter || product.status === statusFilter;
                
                return matchesSearch && matchesStatus;
            });
            
            const html = filteredProducts.map(product => {
                const productScans = scans.filter(s => s.productId === product.id);
                const statusBadge = product.status === 'active' ? 'badge-success' : 'badge-danger';
                
                return `
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="flex items-center">
                                <div class="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-qrcode text-green-600"></i>
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">${product.code}</div>
                                    <div class="text-sm text-gray-500">https://app.growtap.es/qr/${product.code}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">${product.url}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${productScans.length}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span class="badge ${statusBadge}">${product.status === 'active' ? 'Activo' : 'Inactivo'}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button onclick="editUrl(${product.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                                <i class="fas fa-edit"></i> Editar URL
                            </button>
                            <button onclick="copyUrl('${product.code}')" class="text-green-600 hover:text-green-900">
                                <i class="fas fa-copy"></i> Copiar
                            </button>
                        </td>
                    </tr>
                `;
            }).join('');
            
            tableBody.innerHTML = html;
        }
        
        function updateClientDashboard() {
            updateClientStats();
            updateClientCharts();
            updateClientTopProducts();
        }
        
        function updateClientStats() {
            const clientProducts = products.filter(p => p.clientId === currentUser.clientId);
            const clientScans = scans.filter(s => {
                const product = products.find(p => p.id === s.productId);
                return product && product.clientId === currentUser.clientId;
            });
            
            document.getElementById('myProducts').textContent = clientProducts.length;
            document.getElementById('myActiveProducts').textContent = clientProducts.filter(p => p.status === 'active').length;
            document.getElementById('myTotalScans').textContent = clientScans.length;
            
            const today = new Date().toDateString();
            const todayScans = clientScans.filter(s => new Date(s.date).toDateString() === today);
            document.getElementById('myScansToday').textContent = todayScans.length;
        }
        
        function updateClientCharts() {
            const ctx = document.getElementById('myScansChart').getContext('2d');
            
            // Prepare data for last 7 days
            const labels = [];
            const data = [];
            const now = new Date();
            
            const clientProducts = products.filter(p => p.clientId === currentUser.clientId);
            
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                labels.push(date.toLocaleDateString());
                
                const dayScans = scans.filter(s => {
                    const scanDate = new Date(s.date);
                    const product = products.find(p => p.id === s.productId);
                    return scanDate.toDateString() === date.toDateString() && 
                           product && product.clientId === currentUser.clientId;
                });
                data.push(dayScans.length);
            }
            
            if (charts.myScansChart) {
                charts.myScansChart.destroy();
            }
            
            charts.myScansChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Mis Escaneos',
                        data: data,
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
        
        function updateClientTopProducts() {
            const clientProducts = products.filter(p => p.clientId === currentUser.clientId);
            const productStats = clientProducts.map(product => {
                const productScans = scans.filter(s => s.productId === product.id);
                return {
                    code: product.code,
                    url: product.url,
                    scans: productScans.length
                };
            });
            
            productStats.sort((a, b) => b.scans - a.scans);
            
            const topProductsHtml = productStats.slice(0, 5).map(product => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                        <p class="font-medium">${product.code}</p>
                        <p class="text-sm text-gray-600 truncate max-w-xs">${product.url}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-semibold text-green-600">${product.scans}</p>
                        <p class="text-sm text-gray-600">escaneos</p>
                    </div>
                </div>
            `).join('');
            
            document.getElementById('myTopProducts').innerHTML = topProductsHtml;
        }
        
        function updateAnalytics() {
            const timeFilter = document.getElementById('analyticsTimeFilter').value;
            const clientFilter = document.getElementById('analyticsClientFilter').value;
            
            updateTrendChart(timeFilter, clientFilter);
            updateClientDistributionChart(clientFilter);
            updateTopProductsTable(timeFilter, clientFilter);
        }
        
        function updateTrendChart(timeFilter, clientFilter) {
            const ctx = document.getElementById('trendChart').getContext('2d');
            const days = parseInt(timeFilter);
            
            const labels = [];
            const data = [];
            const now = new Date();
            
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                labels.push(date.toLocaleDateString());
                
                let dayScans = scans.filter(s => {
                    const scanDate = new Date(s.date);
                    return scanDate.toDateString() === date.toDateString();
                });
                
                if (clientFilter) {
                    dayScans = dayScans.filter(s => {
                        const product = products.find(p => p.id === s.productId);
                        return product && product.clientId == clientFilter;
                    });
                }
                
                data.push(dayScans.length);
            }
            
            if (charts.trendChart) {
                charts.trendChart.destroy();
            }
            
            charts.trendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Escaneos',
                        data: data,
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
        
        function updateClientDistributionChart(clientFilter) {
            const ctx = document.getElementById('clientDistributionChart').getContext('2d');
            
            let targetClients = clients;
            if (clientFilter) {
                targetClients = clients.filter(c => c.id == clientFilter);
            }
            
            const labels = [];
            const data = [];
            const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
            
            targetClients.forEach((client, index) => {
                const clientScans = scans.filter(s => {
                    const product = products.find(p => p.id === s.productId);
                    return product && product.clientId === client.id;
                });
                
                if (clientScans.length > 0) {
                    labels.push(client.name);
                    data.push(clientScans.length);
                }
            });
            
            if (charts.clientDistributionChart) {
                charts.clientDistributionChart.destroy();
            }
            
            charts.clientDistributionChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors.slice(0, data.length),
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
        
        function updateTopProductsTable(timeFilter, clientFilter) {
            const days = parseInt(timeFilter);
            const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
            
            let filteredScans = scans.filter(s => new Date(s.date) >= cutoffDate);
            
            if (clientFilter) {
                filteredScans = filteredScans.filter(s => {
                    const product = products.find(p => p.id === s.productId);
                    return product && product.clientId == clientFilter;
                });
            }
            
            const productStats = products.map(product => {
                const productScans = filteredScans.filter(s => s.productId === product.id);
                const client = clients.find(c => c.id === product.clientId);
                
                return {
                    code: product.code,
                    client: client ? client.name : 'Sin asignar',
                    scans: productScans.length,
                    trend: Math.random() > 0.5 ? 'up' : 'down'
                };
            });
            
            productStats.sort((a, b) => b.scans - a.scans);
            
            const html = productStats.slice(0, 10).map(product => `
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-qrcode text-blue-600 text-sm"></i>
                            </div>
                            <div class="ml-3">
                                <div class="text-sm font-medium text-gray-900">${product.code}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.client}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${product.scans}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <i class="fas fa-arrow-${product.trend === 'up' ? 'up text-green-600' : 'down text-red-600'}"></i>
                    </td>
                </tr>
            `).join('');
            
            document.getElementById('topProductsTableBody').innerHTML = html;
        }
        
        function updateClientAnalytics() {
            const timeFilter = document.getElementById('myAnalyticsTimeFilter').value;
            const productFilter = document.getElementById('myAnalyticsProductFilter').value;
            
            updateMyTrendChart(timeFilter, productFilter);
            updateMyProductDistributionChart(productFilter);
            updateHourlyChart();
            updateProductSummary();
        }
        
        function updateMyTrendChart(timeFilter, productFilter) {
            const ctx = document.getElementById('myTrendChart').getContext('2d');
            const days = parseInt(timeFilter);
            
            const labels = [];
            const data = [];
            const now = new Date();
            
            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
                labels.push(date.toLocaleDateString());
                
                let dayScans = scans.filter(s => {
                    const scanDate = new Date(s.date);
                    const product = products.find(p => p.id === s.productId);
                    return scanDate.toDateString() === date.toDateString() && 
                           product && product.clientId === currentUser.clientId;
                });
                
                if (productFilter) {
                    dayScans = dayScans.filter(s => s.productId == productFilter);
                }
                
                data.push(dayScans.length);
            }
            
            if (charts.myTrendChart) {
                charts.myTrendChart.destroy();
            }
            
            charts.myTrendChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Mis Escaneos',
                        data: data,
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
        
        function updateMyProductDistributionChart(productFilter) {
            const ctx = document.getElementById('myProductDistributionChart').getContext('2d');
            
            let clientProducts = products.filter(p => p.clientId === currentUser.clientId);
            if (productFilter) {
                clientProducts = clientProducts.filter(p => p.id == productFilter);
            }
            
            const labels = [];
            const data = [];
            const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
            
            clientProducts.forEach((product, index) => {
                const productScans = scans.filter(s => s.productId === product.id);
                
                if (productScans.length > 0) {
                    labels.push(product.code);
                    data.push(productScans.length);
                }
            });
            
            if (charts.myProductDistributionChart) {
                charts.myProductDistributionChart.destroy();
            }
            
            charts.myProductDistributionChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors.slice(0, data.length),
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
        
        function updateHourlyChart() {
            const ctx = document.getElementById('hourlyChart').getContext('2d');
            
            const hourlyData = new Array(24).fill(0);
            
            scans.forEach(scan => {
                const product = products.find(p => p.id === scan.productId);
                if (product && product.clientId === currentUser.clientId) {
                    hourlyData[scan.hour]++;
                }
            });
            
            const labels = [];
            for (let i = 0; i < 24; i++) {
                labels.push(i + ':00');
            }
            
            if (charts.hourlyChart) {
                charts.hourlyChart.destroy();
            }
            
            charts.hourlyChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Escaneos por Hora',
                        data: hourlyData,
                        backgroundColor: '#10b981',
                        borderColor: '#059669',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }
        
        function updateProductSummary() {
            const clientProducts = products.filter(p => p.clientId === currentUser.clientId);
            
            const productStats = clientProducts.map(product => {
                const productScans = scans.filter(s => s.productId === product.id);
                const today = new Date().toDateString();
                const todayScans = productScans.filter(s => new Date(s.date).toDateString() === today);
                
                return {
                    code: product.code,
                    url: product.url,
                    totalScans: productScans.length,
                    todayScans: todayScans.length,
                    status: product.status
                };
            });
            
            const html = productStats.map(product => `
                <div class="border border-gray-200 rounded-lg p-4">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="font-medium text-gray-900">${product.code}</h4>
                            <p class="text-sm text-gray-600 truncate max-w-xs">${product.url}</p>
                        </div>
                        <span class="badge ${product.status === 'active' ? 'badge-success' : 'badge-danger'}">
                            ${product.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="text-gray-600">Total</p>
                            <p class="font-semibold text-indigo-600">${product.totalScans}</p>
                        </div>
                        <div>
                            <p class="text-gray-600">Hoy</p>
                            <p class="font-semibold text-green-600">${product.todayScans}</p>
                        </div>
                    </div>
                </div>
            `).join('');
            
            document.getElementById('productSummary').innerHTML = html;
        }
        
        // Modal functions
        function showModal(modalId) {
            document.getElementById(modalId).classList.add('active');
        }
        
        function closeModal(modalId) {
            document.getElementById(modalId).classList.remove('active');
        }
        
        function showClientModal(clientId = null) {
            const modal = document.getElementById('clientModal');
            const form = document.getElementById('clientForm');
            const title = document.getElementById('clientModalTitle');
            
            if (clientId) {
                const client = clients.find(c => c.id === clientId);
                title.textContent = 'Editar Cliente';
                document.getElementById('clientName').value = client.name;
                document.getElementById('clientEmail').value = client.email;
                document.getElementById('clientPassword').value = client.password;
                document.getElementById('clientStatus').value = client.status;
                form.dataset.clientId = clientId;
            } else {
                title.textContent = 'Nuevo Cliente';
                form.reset();
                delete form.dataset.clientId;
            }
            
            showModal('clientModal');
        }
        
        function showProductModal(productId = null) {
            const modal = document.getElementById('productModal');
            const form = document.getElementById('productForm');
            const title = document.getElementById('productModalTitle');
            const clientSelect = document.getElementById('productClient');
            
            // Populate client select
            clientSelect.innerHTML = '<option value="">Sin asignar</option>';
            clients.forEach(client => {
                clientSelect.innerHTML += `<option value="${client.id}">${client.name}</option>`;
            });
            
            if (productId) {
                const product = products.find(p => p.id === productId);
                title.textContent = 'Editar Producto';
                document.getElementById('productCode').value = product.code;
                document.getElementById('productUrl').value = product.url;
                document.getElementById('productClient').value = product.clientId || '';
                document.getElementById('productStatus').value = product.status;
                form.dataset.productId = productId;
            } else {
                title.textContent = 'Nuevo Producto';
                form.reset();
                delete form.dataset.productId;
            }
            
            showModal('productModal');
        }
        
        function showImportModal() {
            document.getElementById('importModal').classList.add('active');
        }
        
        function editClient(clientId) {
            showClientModal(clientId);
        }
        
        function editProduct(productId) {
            showProductModal(productId);
        }
        
        function editUrl(productId) {
            const product = products.find(p => p.id === productId);
            
            document.getElementById('editUrlCode').value = product.code;
            document.getElementById('editUrlValue').value = product.url;
            document.getElementById('editUrlPreview').textContent = product.code;
            
            const form = document.getElementById('editUrlForm');
            form.dataset.productId = productId;
            
            showModal('editUrlModal');
        }
        
        function deleteClient(clientId) {
            if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
                clients = clients.filter(c => c.id !== clientId);
                updateData();
                updateClientsTable();
                showNotification('Cliente eliminado correctamente', 'success');
            }
        }
        
        function deleteProduct(productId) {
            if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
                products = products.filter(p => p.id !== productId);
                updateData();
                updateProductsTable();
                showNotification('Producto eliminado correctamente', 'success');
            }
        }
        
        function copyUrl(code) {
            const url = `https://app.growtap.es/qr/${code}`;
            navigator.clipboard.writeText(url).then(() => {
                showNotification('URL copiada al portapapeles', 'success');
            });
        }
        
        // Form handlers
        function handleClientSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const clientData = {
                name: document.getElementById('clientName').value,
                email: document.getElementById('clientEmail').value,
                password: document.getElementById('clientPassword').value,
                status: document.getElementById('clientStatus').value
            };
            
            if (e.target.dataset.clientId) {
                // Edit existing client
                const clientId = parseInt(e.target.dataset.clientId);
                const clientIndex = clients.findIndex(c => c.id === clientId);
                clients[clientIndex] = { ...clients[clientIndex], ...clientData };
                showNotification('Cliente actualizado correctamente', 'success');
            } else {
                // Add new client
                const newClient = {
                    id: Math.max(...clients.map(c => c.id)) + 1,
                    ...clientData,
                    created: new Date().toISOString()
                };
                clients.push(newClient);
                showNotification('Cliente creado correctamente', 'success');
            }
            
            updateData();
            updateClientsTable();
            closeModal('clientModal');
        }
        
        function handleProductSubmit(e) {
            e.preventDefault();
            
            const productData = {
                code: document.getElementById('productCode').value,
                url: document.getElementById('productUrl').value,
                defaultUrl: document.getElementById('productUrl').value,
                clientId: parseInt(document.getElementById('productClient').value) || null,
                status: document.getElementById('productStatus').value
            };
            
            if (e.target.dataset.productId) {
                // Edit existing product
                const productId = parseInt(e.target.dataset.productId);
                const productIndex = products.findIndex(p => p.id === productId);
                products[productIndex] = { ...products[productIndex], ...productData };
                showNotification('Producto actualizado correctamente', 'success');
            } else {
                // Add new product
                const newProduct = {
                    id: Math.max(...products.map(p => p.id)) + 1,
                    ...productData,
                    created: new Date().toISOString()
                };
                products.push(newProduct);
                showNotification('Producto creado correctamente', 'success');
            }
            
            updateData();
            updateProductsTable();
            closeModal('productModal');
        }
        
        function handleEditUrlSubmit(e) {
            e.preventDefault();
            
            const productId = parseInt(e.target.dataset.productId);
            const newUrl = document.getElementById('editUrlValue').value;
            
            const productIndex = products.findIndex(p => p.id === productId);
            products[productIndex].url = newUrl;
            
            updateData();
            updateClientProducts();
            closeModal('editUrlModal');
            showNotification('URL actualizada correctamente', 'success');
        }
        
        // CSV Import functions
        function handleCSVSelect() {
            const file = document.getElementById('csvFile').files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const content = e.target.result;
                    document.getElementById('importPreviewContent').textContent = content;
                    document.getElementById('importPreview').classList.remove('hidden');
                    document.getElementById('importBtn').disabled = false;
                };
                reader.readAsText(file);
            }
        }
        
        function handleImport() {
            const file = document.getElementById('csvFile').files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const lines = content.split('\n');
                const headers = lines[0].split(',');
                
                let importCount = 0;
                
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    
                    const values = line.split(',');
                    const code = values[0];
                    const url = values[1];
                    const email = values[2];
                    
                    if (code && url) {
                        let clientId = null;
                        if (email) {
                            const client = clients.find(c => c.email === email);
                            if (client) {
                                clientId = client.id;
                            }
                        }
                        
                        const newProduct = {
                            id: Math.max(...products.map(p => p.id)) + 1,
                            code: code,
                            url: url,
                            defaultUrl: url,
                            clientId: clientId,
                            status: 'active',
                            created: new Date().toISOString()
                        };
                        
                        products.push(newProduct);
                        importCount++;
                    }
                }
                
                updateData();
                updateProductsTable();
                closeModal('importModal');
                showNotification(`${importCount} productos importados correctamente`, 'success');
            };
            reader.readAsText(file);
        }
        
        function downloadTemplate() {
            const csvContent = 'codigo,url_defecto,email_cliente\nH8G7D,https://growtap.es/default,cliente@demo.com\nZ3L1P,https://growtap.es/default,\nW9E6Q,https://growtap.es/default,cliente@demo.com';
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'plantilla_productos.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        }
        
        // Filter functions
        function filterClients() {
            updateClientsTable();
        }
        
        function filterProducts() {
            updateProductsTable();
        }
        
        // Redirect handler
        function handleRedirect(code) {
            const product = products.find(p => p.code === code);
            
            if (product && product.status === 'active') {
                // Add scan record
                scans.push({
                    id: scans.length + 1,
                    productId: product.id,
                    date: new Date().toISOString(),
                    hour: new Date().getHours()
                });
                
                // Show redirect page briefly
                document.getElementById('redirectPage').classList.remove('hidden');
                document.getElementById('loginSection').style.display = 'none';
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    window.location.href = product.url;
                }, 2000);
            } else {
                // Show error page
                document.getElementById('errorPage').classList.remove('hidden');
                document.getElementById('loginSection').style.display = 'none';
            }
        }
        
        // Utility functions
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = `notification ${type}`;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }
        
        function handleLogout() {
            currentUser = null;
            document.getElementById('mainApp').classList.add('hidden');
            document.getElementById('loginSection').style.display = 'flex';
            document.getElementById('loginForm').reset();
            
            // Clear charts
            Object.values(charts).forEach(chart => {
                if (chart) chart.destroy();
            });
            charts = {};
        }
        
        // Initialize chart update listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Analytics filters
            document.getElementById('myAnalyticsTimeFilter').addEventListener('change', updateClientAnalytics);
            document.getElementById('myAnalyticsProductFilter').addEventListener('change', updateClientAnalytics);
            
            // Client product filters
            document.getElementById('myProductSearch').addEventListener('input', updateClientProducts);
            document.getElementById('myProductStatusFilter').addEventListener('change', updateClientProducts);
  });
    