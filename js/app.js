class FuelTracker {
    constructor() {
        this.trips = this.loadTrips();
        this.initializeElements();
        this.setupEventListeners();
        this.updateUI();
    }

    initializeElements() {
        // Formulaire principal
        this.form = document.getElementById('fuelForm');
        this.dateInput = document.getElementById('date');
        this.odometerInput = document.getElementById('odometer');
        this.fuelInput = document.getElementById('fuel');
        this.resetBtn = document.getElementById('resetBtn');
        
        // Éléments d'affichage
        this.currentConsumptionElement = document.getElementById('currentConsumption');
        this.averageConsumptionElement = document.getElementById('averageConsumption');
        this.historyTableBody = document.querySelector('#historyTable tbody');
        this.chart = null;

        // Modal d'édition
        this.modal = document.getElementById('editModal');
        this.editForm = document.getElementById('editForm');
        this.editIndex = document.getElementById('editIndex');
        this.editDate = document.getElementById('editDate');
        this.editOdometer = document.getElementById('editOdometer');
        this.editFuel = document.getElementById('editFuel');
        this.closeBtn = document.querySelector('.close');
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        this.dateInput.value = today;
    }

    setupEventListeners() {
        // Événements du formulaire principal
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.resetBtn.addEventListener('click', () => this.resetHistory());

        // Événements de la modale
        this.editForm.addEventListener('submit', (e) => this.handleEditSubmit(e));
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    loadTrips() {
        const stored = localStorage.getItem('fuelTrips');
        return stored ? JSON.parse(stored) : [];
    }

    saveTrips() {
        localStorage.setItem('fuelTrips', JSON.stringify(this.trips));
    }

    calculateConsumption(distance, fuel) {
        return distance > 0 ? (fuel * 100) / distance : 0; // L/100km
    }

    calculateDistance(currentOdometer, previousOdometer) {
        return currentOdometer - (previousOdometer || currentOdometer);
    }

    handleFormSubmit(e) {
        e.preventDefault();

        const currentOdometer = parseFloat(this.odometerInput.value);
        const previousTrip = this.trips[this.trips.length - 1];
        const previousOdometer = previousTrip ? previousTrip.odometer : currentOdometer;
        const distance = this.calculateDistance(currentOdometer, previousOdometer);
        const fuel = parseFloat(this.fuelInput.value);

        const newTrip = {
            date: this.dateInput.value,
            odometer: currentOdometer,
            distance: distance,
            fuel: fuel,
            consumption: this.calculateConsumption(distance, fuel)
        };

        this.trips.push(newTrip);
        this.saveTrips();
        this.updateUI();
        this.form.reset();
        
        // Reset date to today
        const today = new Date().toISOString().split('T')[0];
        this.dateInput.value = today;
    }

    handleEditSubmit(e) {
        e.preventDefault();
        const index = parseInt(this.editIndex.value);
        const currentOdometer = parseFloat(this.editOdometer.value);
        
        // Calculer la nouvelle distance en tenant compte des entrées avant et après
        let distance;
        if (index > 0) {
            const previousOdometer = this.trips[index - 1].odometer;
            distance = currentOdometer - previousOdometer;
        } else {
            distance = 0;
        }

        // Mettre à jour l'entrée
        this.trips[index] = {
            date: this.editDate.value,
            odometer: currentOdometer,
            distance: distance,
            fuel: parseFloat(this.editFuel.value),
            consumption: this.calculateConsumption(distance, parseFloat(this.editFuel.value))
        };

        // Mettre à jour la distance de l'entrée suivante si elle existe
        if (index < this.trips.length - 1) {
            const nextTrip = this.trips[index + 1];
            nextTrip.distance = nextTrip.odometer - currentOdometer;
            nextTrip.consumption = this.calculateConsumption(nextTrip.distance, nextTrip.fuel);
        }

        this.saveTrips();
        this.updateUI();
        this.closeModal();
    }

    editTrip(index) {
        const trip = this.trips[index];
        this.editIndex.value = index;
        this.editDate.value = trip.date;
        this.editOdometer.value = trip.odometer;
        this.editFuel.value = trip.fuel;
        this.modal.style.display = 'block';
    }

    deleteTrip(index) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
            this.trips.splice(index, 1);
            
            // Recalculer les distances et consommations pour les entrées suivantes
            for (let i = index; i < this.trips.length; i++) {
                const previousOdometer = i > 0 ? this.trips[i - 1].odometer : this.trips[i].odometer;
                this.trips[i].distance = this.trips[i].odometer - previousOdometer;
                this.trips[i].consumption = this.calculateConsumption(this.trips[i].distance, this.trips[i].fuel);
            }
            
            this.saveTrips();
            this.updateUI();
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
        this.editForm.reset();
    }

    resetHistory() {
        if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
            this.trips = [];
            this.saveTrips();
            this.updateUI();
        }
    }

    updateUI() {
        this.updateConsumptionDisplay();
        this.updateHistoryTable();
        this.updateChart();
    }

    updateConsumptionDisplay() {
        if (this.trips.length > 0) {
            const latest = this.trips[this.trips.length - 1];
            const average = this.trips.reduce((sum, trip) => sum + trip.consumption, 0) / this.trips.length;
            
            this.currentConsumptionElement.textContent = `${latest.consumption.toFixed(2)} L/100km`;
            this.averageConsumptionElement.textContent = `${average.toFixed(2)} L/100km`;
        } else {
            this.currentConsumptionElement.textContent = '-- L/100km';
            this.averageConsumptionElement.textContent = '-- L/100km';
        }
    }

    updateHistoryTable() {
        this.historyTableBody.innerHTML = '';
        
        this.trips.slice().reverse().forEach((trip, reversedIndex) => {
            const actualIndex = this.trips.length - 1 - reversedIndex;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${new Date(trip.date).toLocaleDateString()}</td>
                <td>${trip.odometer.toFixed(0)}</td>
                <td>${trip.distance.toFixed(1)}</td>
                <td>${trip.fuel.toFixed(1)}</td>
                <td>${trip.consumption.toFixed(2)}</td>
                <td>
                    <button style="width: 5rem; background-color: #87CEEB" class="action-btn edit-btn" onclick="fuelTracker.editTrip(${actualIndex})">Edit</button>
                    <button style="width: 5rem; background-color: #4682B4" class="action-btn delete-btn" onclick="fuelTracker.deleteTrip(${actualIndex})">Delete</button>
                </td>
            `;
            this.historyTableBody.appendChild(row);
        });
    }

    updateChart() {
        const ctx = document.getElementById('consumptionChart');
        
        // Détruire le graphique existant s'il existe
        if (this.chart instanceof Chart) {
            this.chart.destroy();
        }

        // Ne créer le graphique que s'il y a des données
        if (this.trips.length === 0) {
            return;
        }

        const chartData = this.trips.map(trip => ({
            x: new Date(trip.date),
            y: trip.consumption
        }));

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Consommation (L/100km)',
                    data: chartData,
                    borderColor: '#2196F3',
                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'dd/MM/yyyy'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'L/100km'
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y.toFixed(2)} L/100km`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Initialize the application
let fuelTracker;
document.addEventListener('DOMContentLoaded', () => {
    fuelTracker = new FuelTracker();
});
