// Insulin Calculator - Two-step form
let currentStep = 1;
const totalSteps = 2;

// Data storage
const formData = {
    bloodGlucose: {}
};

// Days numbered 1-7
const daysOfWeek = ['Dia 1', 'Dia 2', 'Dia 3', 'Dia 4', 'Dia 5', 'Dia 6', 'Dia 7'];
const timePeriods = ['breakfast', 'lunch', 'dinner', 'night'];

// Initialize the form
function initializeForm() {
    generateTableRows();
    attachEventListeners();
    console.log('Insulin Calculator initialized');
}

// Generate table rows for 7 days
function generateTableRows() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    daysOfWeek.forEach((day, index) => {
        const row = document.createElement('tr');
        
        // Day cell
        const dayCell = document.createElement('td');
        dayCell.className = 'day-cell';
        dayCell.textContent = day;
        row.appendChild(dayCell);

        // Input cells for each time period
        timePeriods.forEach(period => {
            const cell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'data-input';
            input.placeholder = 'UI';
            input.min = '0';
            input.max = '100';
            input.step = '0.5';
            input.dataset.day = index;
            input.dataset.period = period;
            
            // Add input event to save data and auto-focus
            input.addEventListener('input', (e) => {
                saveInputData(index, period, e.target.value);
                
                // Auto-focus to next input when 2 digits are entered
                const value = e.target.value;
                if (value.length >= 2) {
                    focusNextInput(e.target);
                }
            });

            // Load saved data if exists
            const savedValue = formData.bloodGlucose[`day${index}_${period}`];
            if (savedValue) {
                input.value = savedValue;
            }

            cell.appendChild(input);
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

// Save input data
function saveInputData(dayIndex, period, value) {
    const key = `day${dayIndex}_${period}`;
    formData.bloodGlucose[key] = value;
    console.log(`Saved: ${key} = ${value}`);
}

// Focus next input
function focusNextInput(currentInput) {
    const allInputs = Array.from(document.querySelectorAll('#step1 .data-input'));
    const currentIndex = allInputs.indexOf(currentInput);
    
    if (currentIndex >= 0 && currentIndex < allInputs.length - 1) {
        allInputs[currentIndex + 1].focus();
    }
}

// Attach event listeners
function attachEventListeners() {
    // Clear button
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllInputs);
    }

    // Calculate button
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', handleCalculate);
    }

    // Back button
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', handleBack);
    }

    // Print button
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', handlePrint);
    }
}

// Clear all inputs
function clearAllInputs() {
    if (confirm('Tem certeza que deseja limpar todos os dados?')) {
        const inputs = document.querySelectorAll('.data-input');
        inputs.forEach(input => {
            input.value = '';
        });
        
        // Clear patient info
        document.getElementById('uiFixa').value = '';
        document.getElementById('peso').value = '';
        
        formData.bloodGlucose = {};
        console.log('All inputs cleared');
        
        // Add visual feedback
        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) {
            tableContainer.style.opacity = '0.5';
            setTimeout(() => {
                tableContainer.style.transition = 'opacity 0.3s ease';
                tableContainer.style.opacity = '1';
            }, 100);
        }
    }
}

// Validate data entry
function validateDataEntry() {
    const inputs = document.querySelectorAll('#step1 .data-input');
    const uiFixa = document.getElementById('uiFixa');
    const peso = document.getElementById('peso');
    
    let hasData = false;
    let invalidInputs = [];

    // Validate UI Fixa and Peso
    if (!uiFixa.value || parseFloat(uiFixa.value) <= 0) {
        alert('Por favor, insira o valor de UI Fixa.');
        uiFixa.focus();
        return false;
    }

    if (!peso.value || parseFloat(peso.value) <= 0) {
        alert('Por favor, insira o peso do paciente.');
        peso.focus();
        return false;
    }

    // Validate insulin data
    inputs.forEach(input => {
        if (input.value) {
            hasData = true;
            const value = parseFloat(input.value);
            if (value < 0 || value > 100) {
                invalidInputs.push(input);
            }
        }
    });

    if (!hasData) {
        alert('Por favor, insira pelo menos uma leitura de insulina.');
        return false;
    }

    if (invalidInputs.length > 0) {
        alert('Por favor, certifique-se de que todos os valores de insulina estão entre 0 e 100 UI.');
        invalidInputs[0].focus();
        return false;
    }

    return true;
}

// Handle calculate
function handleCalculate() {
    if (!validateDataEntry()) {
        return;
    }

    // Calculate results
    calculateResults();

    // Move to results page
    currentStep = 2;
    updateStepDisplay();
}

// Handle back to data
function handleBack() {
    currentStep = 1;
    updateStepDisplay();
}

// Handle print
function handlePrint() {
    window.print();
}

// Update step display
function updateStepDisplay() {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }

    // Update progress bar
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Calculate results and display
function calculateResults() {
    const resultsContent = document.getElementById('resultsContent');
    const uiFixa = parseFloat(document.getElementById('uiFixa').value);
    const peso = parseFloat(document.getElementById('peso').value);
    
    // Calculate statistics per time period
    const periods = {
        breakfast: { values: [], label: 'Café da Manhã 🌅', average: 0 },
        lunch: { values: [], label: 'Almoço ☀️', average: 0 },
        dinner: { values: [], label: 'Jantar 🌆', average: 0 },
        night: { values: [], label: '21:00 🌙', average: 0 }
    };

    // Collect values per period
    Object.entries(formData.bloodGlucose).forEach(([key, value]) => {
        if (value) {
            const period = key.split('_')[1];
            if (periods[period]) {
                periods[period].values.push(parseFloat(value));
            }
        }
    });

    // Calculate averages
    let sumOfAverages = 0;
    Object.keys(periods).forEach(period => {
        if (periods[period].values.length > 0) {
            periods[period].average = periods[period].values.reduce((a, b) => a + b, 0) / periods[period].values.length;
            sumOfAverages += periods[period].average;
        }
    });

    // Display patient info
    let html = `
        <div class="patient-summary">
            <div class="summary-item">
                <span class="summary-label">UI Fixa:</span>
                <span class="summary-value">${uiFixa} UI</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Peso:</span>
                <span class="summary-value">${peso} kg</span>
            </div>
        </div>
    `;

    // Display averages per time period
    html += '<div class="results-grid">';

    Object.entries(periods).forEach(([period, data]) => {
        if (data.values.length > 0) {
            html += `
                <div class="result-card">
                    <h3>${data.label}</h3>
                    <div class="stat-row highlighted">
                        <span class="stat-label">Média:</span>
                        <span class="stat-value">${data.average.toFixed(2)} UI</span>
                    </div>
                </div>
            `;
        }
    });

    html += '</div>';

    // Calculate Dose Total and Dose/Peso
    const doseTotal = sumOfAverages + uiFixa;
    const dosePorPeso = doseTotal / peso;

    // Display all final results in a row
    html += `
        <div class="final-results-container">
            <div class="final-result-card">
                <h3>Regular (UI)</h3>
                <div class="final-value">${sumOfAverages.toFixed(2)} <span class="unit">UI</span></div>
                <div class="final-description">Soma das médias</div>
            </div>
            
            <div class="final-result-card">
                <h3>Dose Total</h3>
                <div class="final-value">${doseTotal.toFixed(2)} <span class="unit">UI</span></div>
                <div class="final-description">Regular + UI Fixa</div>
            </div>
            
            <div class="final-result-card">
                <h3>Dose / Peso</h3>
                <div class="final-value">${dosePorPeso.toFixed(2)} <span class="unit">UI/kg</span></div>
                <div class="final-description">Dose Total ÷ Peso</div>
            </div>
        </div>
    `;

    resultsContent.innerHTML = html;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeForm);

console.log('Calculadora de Insulina Pediátrica carregada com sucesso');

