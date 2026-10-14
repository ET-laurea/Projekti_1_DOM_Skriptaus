
let foodLog = JSON.parse(localStorage.getItem('foodLog')) || [];

const foodForm = document.getElementById('foodForm');
const daySelect = document.getElementById('daySelect');
const foodTypeInput = document.getElementById('foodType');
const weightInput = document.getElementById('weight');
const caloriesInput = document.getElementById('calories');
const proteinsInput = document.getElementById('proteins');
const fatsInput = document.getElementById('fats');
const carbsInput = document.getElementById('carbs');
const daysContainer = document.getElementById('daysContainer');
const clearWeekBtn = document.getElementById('clearWeekBtn');

const weekDays = ["Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai", "Sunnuntai"];

function validateInput() {
    let isValid = true;

    foodTypeInput.classList.remove('invalid');
    weightInput.classList.remove('invalid');
    document.getElementById('foodTypeError').textContent = '';
    document.getElementById('weightError').textContent = '';

    if (foodTypeInput.value.trim().length < 2) {
        foodTypeInput.classList.add('invalid');
        document.getElementById('foodTypeError').textContent = 'Anna nimi (väh. 2 merkkiä).';
        isValid = false;
    }

    if (!weightInput.value || Number(weightInput.value) <= 0) {
        weightInput.classList.add('invalid');
        document.getElementById('weightError').textContent = 'Syötä kelvollinen paino.';
        isValid = false;
    }

    return isValid;
}

foodForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateInput()) return;

    const newEntry = {
        id: Date.now(),
        day: daySelect.value,
        name: foodTypeInput.value.trim(),
        weight: Number(weightInput.value) || 0,
        calories: Number(caloriesInput.value) || 0,
        proteins: Number(proteinsInput.value) || 0,
        fats: Number(fatsInput.value) || 0,
        carbs: Number(carbsInput.value) || 0
    };

    foodLog.push(newEntry);
    saveAndRender();
    foodForm.reset();
});

daysContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const idToDelete = Number(e.target.dataset.id);
        foodLog = foodLog.filter(item => item.id !== idToDelete);
        saveAndRender();
    }
});

clearWeekBtn.addEventListener('click', () => {
    if (confirm('Haluatko varmasti poistaa kaikkien päivien kirjaukset?')) {
        foodLog = [];
        saveAndRender();
    }
});

function saveAndRender() {
    localStorage.setItem('foodLog', JSON.stringify(foodLog));
    render();
}

function render() {
    daysContainer.innerHTML = '';

    weekDays.forEach(day => {
        const dayEntries = foodLog.filter(item => item.day === day);
        if (dayEntries.length === 0) return; // Ei näytetä tyhjiä päiviä

        const totals = dayEntries.reduce((acc, curr) => ({
            weight: acc.weight + curr.weight,
            calories: acc.calories + curr.calories,
            proteins: acc.proteins + curr.proteins,
            fats: acc.fats + curr.fats,
            carbs: acc.carbs + curr.carbs
        }), { weight: 0, calories: 0, proteins: 0, fats: 0, carbs: 0 });

        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';

        const rowsHtml = dayEntries.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.weight} g</td>
                <td>${item.calories} kcal</td>
                <td>${item.proteins} g</td>
                <td>${item.fats} g</td>
                <td>${item.carbs} g</td>
                <td><button class="delete-btn" data-id="${item.id}">Poista</button></td>
            </tr>
        `).join('');

        dayCard.innerHTML = `
            <h3>${day}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Ruoka-aines</th>
                        <th>Paino</th>
                        <th>Kalorit</th>
                        <th>Proteiini</th>
                        <th>Rasva</th>
                        <th>Hiilihydraatti</th>
                        <th>Toiminto</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <th>Yhteensä</th>
                        <th>${totals.weight} g</th>
                        <th>${totals.calories} kcal</th>
                        <th>${totals.proteins} g</th>
                        <th>${totals.fats} g</th>
                        <th>${totals.carbs} g</th>
                        <th></th>
                    </tr>
                </tfoot>
            </table>
        `;

        daysContainer.appendChild(dayCard);
    });
}

render();