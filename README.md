# https://comparte.osweekends.com
Gestión de twitter automagica ^^

> *En desarrollo, estamos trabajando en ello...*

## Tecnología Utilizada

- HTML5
- CSS (Flexbox)
- JS (ES6)
- Browserify
- PWA (Workbox)
- Cloud functions
- NPM Scripts

## Pre-Instalación

- Agregar la configuración del proyecto de Firebase al index `/index.html`

```javascript
<script src="https://www.gstatic.com/firebasejs/5.8.2/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.8.2/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/5.8.2/firebase-database.js"></script>
const config = {
  apiKey: "XxXxXxXxXxXx",
  authDomain: "comparte-osweekends.firebaseapp.com",
  databaseURL: "https://comparte-osweekends.firebaseio.com",
  projectId: "comparte-osweekends",
  storageBucket: "comparte-osweekends.appspot.com",
  messagingSenderId: "1234567890"
};
firebase.initializeApp(config)
```

- Crear una aplicación en [developer.twitter.com](developer.twitter.com) y agregar los **keys and token** al fichero `/cloud-function/functions/config.js`

```javascript
module.exports = {
  consumer_key: '(API key)',
  consumer_secret: '(API secret key)',
  access_token: '(Access token)',
  access_token_secret: '(Access token secret)'
};
```

- Dentro de Firebase, en `authentication/métodos de inicio de sesión`, habilitar **Twitter** y copiar las **api keys**
```
'(API key)',
'(API secret key)',
```

- Instalar el plugin [live-server](https://github.com/ritwickdey/vscode-live-server) para VSCode

## Instalación

Instalar las dependecias de la applicaión y también las de las cloud functions (`/cloud-function/functions/package.json`)

```sh
npm i
```

## Uso

1. La primera vez lanzar el comando `npm run build` para generar la carpeta `dist` que contendrá la **app shell**
2. En VSCode, activar el **Live Server**, el botón estará en la barra inferior
3. Abrir Chrome en la ruta `http://localhost:5500/#!/`
4. Al ser una app pensada para móvil, activar en las herramientas de desarrollador `Toggle Device Toolbar (command + shit + M)`

> *Para **desarrollar** lanza el comando `npm run watch`. La app debería de actualizarse cada que se guarda un fichero*
