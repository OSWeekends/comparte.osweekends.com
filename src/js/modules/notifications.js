exports.MESSAGE = {
  "TWEET": {
    "OK": "Tweet enviado correctamente, pendiente de evaluación"
  },
  "STATE": {
    "PUBLISHED": "tu tweet ha sido aprobado",
    "REJECTED": "tu tweet ha sido rechazado"
  }
};

exports.showNotifications = function (error, message) {
  const body = document.querySelector('body');
  const template =
  `
    <div id="notifications"></div>
  `;

  body.insertAdjacentHTML('afterbegin', template);

  const notifications = document.querySelector('#notifications');
  const p = document.createElement('P');
  let text;
  if (error) {
    text = document.createTextNode(error);
    notifications.classList.add('alert-danger');
  } else {
    text = document.createTextNode(message);
    notifications.classList.add('alert-success');
  }

  p.appendChild(text);
  notifications.appendChild(p);

  setTimeout(() => {
    notifications.parentElement.removeChild(notifications);
  }, 3000);
};