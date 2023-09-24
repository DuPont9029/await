// Aggiunto un gestore per il pulsante "Carica JSON da S3"



var selectedClasse;
var selectedSezione;
var link;





function delta(link) {


  var sezioneSelect = document.getElementById('sezione');
  selectedSezione = sezioneSelect.options[sezioneSelect.selectedIndex].value;

  // Recupera il valore della classe selezionata
  var classeSelect = document.getElementById('classe');
  selectedClasse = classeSelect.options[classeSelect.selectedIndex].value;

  // Ora puoi utilizzare selectedSezione e selectedClasse nella tua logica
  // Per esempio, puoi eseguire una richiesta o un'elaborazione dei dati con questi valori
  // Esempio di output dei valori
  console.log("Sezione selezionata:", selectedSezione);
  console.log("Classe selezionata:", selectedClasse);

  link = `https://github.com/DuPont9029/await/tree/main/jsons/${selectedSezione}/${selectedSezione}${selectedClasse}.json`;
  //link = `https://s3.cubbit.eu/tables/${selectedSezione}/${selectedSezione}${selectedClasse}.json`;
  console.log(link);
  fetch(link) // Sostituisci con l'URL del tuo file JSON in S3
    .then(response => {
      if (!response.ok) {
        throw new Error('Errore durante il caricamento del file JSON da github');
      }
      return response.json();
    })
    .then(json => {
      compareAppointments(json);
    })
    .catch(error => {
      console.error('Errore durante il caricamento del file JSON da S3:', error);
      alert('Errore durante il caricamento del file JSON da S3');
    });
  }









  // Aggiungi un ascoltatore di eventi agli elementi di selezione











/*
document.getElementById('json-file').addEventListener('click', function() {
  fetch('https://s3.cubbit.eu/tables/example.json') // Sostituisci con l'URL del tuo file JSON in S3
    .then(response => {
      if (!response.ok) {
        throw new Error('Errore durante il caricamento del file JSON da S3');
      }
      return response.json();
    })
    .then(json => {
      compareAppointments(json);
    })
    .catch(error => {
      console.error('Errore durante il caricamento del file JSON da S3:', error);
      alert('Errore durante il caricamento del file JSON da S3');
    });
});
*/

// Funzione per confrontare gli appuntamenti
function compareAppointments(appointments) {
  var currentTime = new Date();
  var currentDay = currentTime.getDay();
  var appointmentsDiv = document.getElementById('appointments');
  appointmentsDiv.innerHTML = '';

  appointments.sort(function(a, b) {
    var dayComparison = getDayValue(a.giorno) - getDayValue(b.giorno);
    if (dayComparison === 0) {
      var timeA = getTimeValue(a.inizio);
      var timeB = getTimeValue(b.inizio);
      return timeA - timeB;
    }
    return dayComparison;
  });

  var currentAppointment = null;
  var nextAppointment = null;

  for (var i = 0; i < appointments.length; i++) {
    var appointment = appointments[i];

    var appointmentDay = getDayValue(appointment.giorno);
    var appointmentStart = getTimeValue(appointment.inizio);
    var appointmentEnd = getTimeValue(appointment.fine);

    if (currentDay === appointmentDay && currentTime >= appointmentStart && currentTime <= appointmentEnd) {
      currentAppointment = appointment;
      if (i + 1 < appointments.length) {
        nextAppointment = appointments[i + 1];
      }
      break;
    }

    if (currentDay < appointmentDay || (currentDay === appointmentDay && currentTime < appointmentStart)) {
      nextAppointment = appointment;
      break;
    }
  }

  if (currentAppointment) {
    var currentAppointmentDiv = document.createElement('div');
    currentAppointmentDiv.classList.add('current-appointment');

    currentAppointmentDiv.innerHTML = 
      '<p>Impegno corrente: ' + currentAppointment.nome + '</p>' +
      '<p>Inizio: ' + currentAppointment.inizio + '</p>' +
      '<p>Fine: ' + currentAppointment.fine + '</p>' +
      '<p>Posto: ' + currentAppointment.posto + '</p>' +
      '<p>Giorno: ' + currentAppointment.giorno + '</p>';

    appointmentsDiv.appendChild(currentAppointmentDiv);
  }

  if (nextAppointment) {
    var nextAppointmentDiv = document.createElement('div');
    nextAppointmentDiv.classList.add('next-appointment');

    nextAppointmentDiv.innerHTML =
      '<p>Prossimo impegno: ' + nextAppointment.nome + '</p>' +
      '<p>Inizio: ' + nextAppointment.inizio + '</p>' +
      '<p>Fine: ' + nextAppointment.fine + '</p>' +
      '<p>Posto: ' + nextAppointment.posto + '</p>' +
      '<p>Giorno: ' + nextAppointment.giorno + '</p>';

    appointmentsDiv.appendChild(nextAppointmentDiv);
  }
}

// Funzione per ottenere l'indice del giorno
function getDayValue(day) {
  var days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
  return days.indexOf(day);
}

// Funzione per ottenere il valore dell'orario
function getTimeValue(time) {
  var [hours, minutes] = time.split(':');
  var date = new Date();
  date.setHours(hours, minutes);
  return date;
}


// Aggiunto l'intervallo per aggiornare l'orario corrente
setInterval(function() {
  updateCurrentTime();
}, 1000);

// Funzione per aggiornare l'orario corrente
function updateCurrentTime() {
  var currentTimeDiv = document.getElementById('current-time');
  currentTimeDiv.textContent = 'Current time: ' + getCurrentTime();
}

// Funzione per ottenere l'orario corrente
function getCurrentTime() {
  var now = new Date();
  var hours = now.getHours().toString().padStart(2, '0');
  var minutes = now.getMinutes().toString().padStart(2, '0');
  return hours + ':' + minutes;
}
