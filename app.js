// ==========================================================================
// PRÀCTICA: CALENDARI I AGENDA EN JAVASCRIPT VANILLA
// ==========================================================================

// --- ESTAT GLOBAL I ELEMENTS DEL DOM ---

let currentDate = new Date(); // Data actual que es mostra al calendari
let selectedDateKey = null;   // Data seleccionada en format 'YYYY-MM-DD'

// En la Fase 1 i 2 farem servir aquest objecte en memòria.
// En la Fase 3 el connectarem amb LocalStorage!
let events = {};

// Selecció d'elements del DOM (Ja completat)
const monthYearDisplay = document.getElementById('month-year-display');
const daysGrid = document.getElementById('days-grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const selectedDateDisplay = document.getElementById('selected-date-display');
const eventForm = document.getElementById('event-form');
const eventInput = document.getElementById('event-input');
const eventsList = document.getElementById('events-list');

const notifyBtn = document.getElementById('notify-btn');
const shareBtn = document.getElementById('share-btn');

const monthNames = [
  "Gener", "Febrer", "Març", "Abril", "Maig", "Juny", 
  "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
];


// ==========================================================================
// FASE 1: RENDERITZAT DEL CALENDARI I NAVEGACIÓ (DATE + DOM)
// ==========================================================================

/**
 * Retorna una data en format YYYY-MM-DD amb zeros a l'esquerra si cal.
 */

function formatDateKey(year, month, day) {
  const formattedMonth = String(month + 1).padStart(2, '0');
  const formattedDay = String(day).padStart(2, '0');
  return `${year}-${formattedMonth}-${formattedDay}`;
}
  // TODO: Converteix el mes (+1) i el dia, respectivament, a String i omple amb zeros a l'esquerra amb .padStart(2, '0')
  // TODO: Retorna data en format YYYY-MM-DD


/**
 * Genera i dibuixa la graella de dies del mes actual.
 */
function renderCalendar() {
  // TODO 1: Neteja el contingut actual de 'daysGrid'
  daysGrid.innerHTML = '';
  // TODO 2: Obtén l'any i el mes de 'currentDate' i actualitza el text de '#monthYearDisplay'
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
  // TODO 3: Càlcul de caselles buides inicials (padding):
  const firstDayIndex = new Date(year, month, 1).getDay();
  const paddingDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  for (let i = 0; i < paddingDays; i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('day', 'empty');
    daysGrid.appendChild(emptyDiv);
  }
  // TODO 4: Càlcul de dies totals del mes:
  const totalDays = new Date(year, month + 1, 0).getDate();
  // TODO 5: Bucle per dibuixar cada dia (1..totalDays):
  const today = new Date();
  for (let day = 1; day <= totalDays; day++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = day;
    const dateKey = formatDateKey(year, month, day);
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayElement.classList.add('today');
    }
    if (events[dateKey] && events[dateKey].length > 0) {
      dayElement.classList.add('has-events');
    }
    if (dateKey === selectedDateKey) {
      dayElement.classList.add('selected');
    }
    dayElement.addEventListener('click', () => {
      selectDate(dateKey, dayElement);
    });
    daysGrid.appendChild(dayElement);
  }
}
  //  - Crea un div amb la classe .day i el text del número de dia
  //  - Genera la clau 'dateKey' fent servir formatDateKey()
  //  - Afegeix la classe .today si el dia, mes i any coincideixen amb la data actual d'avui (new Date())
  //  - Afegeix la classe .has-events si existeix events[dateKey] amb elements
  //  - Afegeix la classe .selected si dateKey === selectedDateKey
  //  - Assigna l'esdeveniment click per cridar a selectDate(dateKey, dayElement) ALERTA, FUNCIÓ NO IMPLEMENTADA ENCARA
  //  - Afegeix la casella a 'daysGrid' (appendChild)

  

// TODO: Escoltadors d'esdeveniments per als botons de navegació prevBtn i nextBtn
// (Sumar o restar 1 mes a 'currentDate' i tornar a cridar renderCalendar())
prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});


// ==========================================================================
// FASE 2: SELECCIÓ DE DIA I GESTIÓ D'ESDEVENIMENTS EN MEMÒRIA
// ==========================================================================

/**
 * Selecciona un dia del calendari i actualitza la interfície.
 */
function selectDate(dateKey, element) {
  // TODO 1: Elimina la classe .selected de tots els dies (.day)
  const allDays = document.querySelectorAll('.day');
  allDays.forEach(day => day.classList.remove('selected'));

  // TODO 2: Afegeix la classe .selected al dia clicat i actualitza 'selectedDateKey'
  element.classList.add('selected');
  selectedDateKey = dateKey;

  // TODO 3: Actualitza el títol 'selectedDateDisplay' i crida a renderEvents()
  selectedDateDisplay.textContent = `Esdeveniments de: ${selectedDateKey}`;
  renderEvents();
}

/**
 * Renderitza la llista d'esdeveniments del dia seleccionat.
 */
function renderEvents() {
  // TODO 1: Neteja 'eventsList'
  eventsList.innerHTML = '';

  // TODO 2: Si no hi ha 'selectedDateKey', surt de la funció
  if (!selectedDateKey) return;

  // TODO 3: Obtén els esdeveniments de 'selectedDateKey' o un array buit
  const dayEvents = events[selectedDateKey] || [];

  // TODO 4: Recorre els esdeveniments i crea els <li> amb un <span> (✕) per eliminar-los
  dayEvents.forEach((eventText, index) => {
    const li = document.createElement('li');
    li.textContent = eventText;

    const deleteSpan = document.createElement('span');
    deleteSpan.textContent = ' ✕';
    deleteSpan.classList.add('delete-btn');
    deleteSpan.addEventListener('click', (e) => {
      e.stopPropagation();
      removeEvent(index);
    });

    li.appendChild(deleteSpan);
    eventsList.appendChild(li);
  });
}

/**
 * Afegir un nou esdeveniment a la data seleccionada.
 */
function addEvent(e) {
  e.preventDefault();
  // TODO 1: Valida que hi hagi un dia seleccionat (selectedDateKey) i text a l'input
  if (!selectedDateKey) {
    alert('Per favor, selecciona primer un dia al calendari.');
    return;
  }

  const text = eventInput.value.trim();
  if (!text) return;

  // TODO 2: Si no existeix events[selectedDateKey], inicialitza-ho com un array buit []
  if (!events[selectedDateKey]) {
    events[selectedDateKey] = [];
  }

  // TODO 3: Afegeix el text a l'array d'esdeveniments de la data
  events[selectedDateKey].push(text);

  // Desa a LocalStorage
  saveEvents();

  // Envia notificació del sistema
  sendNotification('Nova tasca afegida', `Tasca: "${text}" per al dia ${selectedDateKey}`);

  // TODO 4: Neteja l'input i torna a cridar renderEvents() i renderCalendar()
  eventInput.value = '';
  renderEvents();
  renderCalendar();
}

/**
 * Elimina un esdeveniment per la seva posició (índex).
 */
function removeEvent(index) {
  if (!selectedDateKey || !events[selectedDateKey]) return;

  // TODO 1: Elimina l'element de l'array amb splice(index, 1)
  events[selectedDateKey].splice(index, 1);

  // TODO 2: Si l'array es queda buit, elimina la clau de l'objecte 'events' amb 'delete'
  if (events[selectedDateKey].length === 0) {
    delete events[selectedDateKey];
  }

  // Desa a LocalStorage
  saveEvents();

  // TODO 3: Torna a cridar renderEvents() i renderCalendar()
  renderEvents();
  renderCalendar();
}

// TODO: Escoltador d'esdeveniment per al formulari eventForm (submit -> addEvent)
eventForm.addEventListener('submit', addEvent);


// ==========================================================================
// FASE 3: PERSISTÈNCIA DE DADES (LOCALSTORAGE I JSON)
// ==========================================================================

/**
 * Desa l'objecte 'events' a LocalStorage convertit a text JSON.
 */
function saveEvents() {
  // TODO: Utilitza JSON.stringify(events) i localStorage.setItem('calendar_events', ...)
  localStorage.setItem('calendar_events', JSON.stringify(events));
}

/**
 * Carrega els esdeveniments de LocalStorage en iniciar l'aplicació.
 */
function loadEvents() {
  // TODO: Utilitza localStorage.getItem('calendar_events') i JSON.parse()
  // Retorna l'objecte obtingut o un objecte buit {} si no hi havia res guardat.
  const saved = localStorage.getItem('calendar_events');
  return saved ? JSON.parse(saved) : {};
}

// TODO: Modifica addEvent() i removeEvent() perquè cridin a saveEvents() després de modificar dades.


// ==========================================================================
// FASE 4: RESTA D'APIS DEL NAVEGADOR (NOTIFICATION I WEB SHARE)
// ==========================================================================

/**
 * Mostra una notificació del sistema si tenim permís concedit.
 */
function sendNotification(title, body) {
  // TODO: Comprova si Notification.permission === 'granted' i crea una new Notification()
  // Mira a la pràctica AC2 com es fa!
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

// TODO: Escoltador d'esdeveniment per a 'notifyBtn' (Sol·licitar permisos de notificació)
// Mira a la pràctica AC2 com es fa!
notifyBtn.addEventListener('click', () => {
  if (!('Notification' in window)) {
    alert('Aquest navegador no suporta notificacions.');
    return;
  }

  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      sendNotification('Notificacions Activades', 'Rebràs alertes quan afegixis esdeveniments.');
    }
  });
});

// TODO: Escoltador d'esdeveniment per a 'shareBtn' (Web Share API amb fallback a clipboard)
// Mira a la pràctica AC2 com es fa!
shareBtn.addEventListener('click', async () => {
  if (!selectedDateKey) {
    alert('Selecciona un dia per compartir els seus esdeveniments.');
    return;
  }

  const dayEvents = events[selectedDateKey] || [];
  const textSummary = dayEvents.length > 0
    ? `Tasques per a ${selectedDateKey}:\n- ` + dayEvents.join('\n- ')
    : `No hi ha tasques programades per a ${selectedDateKey}.`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: `Agenda del dia ${selectedDateKey}`,
        text: textSummary
      });
    } catch (err) {
      console.log('Compartir cancel·lat');
    }
  } else {
    try {
      await navigator.clipboard.writeText(textSummary);
      alert('Resum copiat al porta-retalls!');
    } catch (err) {
      alert('No s\'ha pogut copiar al porta-retalls.');
    }
  }
});


// ==========================================================================
// INICIALITZACIÓ DE L'APLICACIÓ
// ==========================================================================

function initApp() {
  // TODO 1: Carrega els esdeveniments des de LocalStorage cridant loadEvents()
  events = loadEvents();

  // TODO 2: Crida inicial a renderCalendar() per dibuixar la interfície inicial
  renderCalendar();
}

initApp();