# https://comparte.osweekends.com
Gestión de twitter automagica ^^

## Pre-Instalación

- Agregar la configuración del proyecto de Firebase al fichero `/src/js/config.js`

```javascript
const config = {
  apiKey: "XxXxXxXxXxXx",
  authDomain: "comparte-osweekends.firebaseapp.com",
  databaseURL: "https://comparte-osweekends.firebaseio.com",
  projectId: "comparte-osweekends",
  storageBucket: "comparte-osweekends.appspot.com",
  messagingSenderId: "1234567890"
};
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
- Instalar el plugin [live-server](https://github.com/ritwickdey/vscode-live-server) para VSCode

## Instalación

Instalar las dependecias de la applicaión y también las de las cloud functions (`/cloud-function/functions/package.json`)

```sh
npm i
```

## Uso

1. La primera vez lanzar el comando `npm run build` para generar la carpeta `dist` que contendrá la **app shell**
2. Abrir Chrome en la ruta `http://localhost:5500/#!/`
3. En VSCode, activar el **Live Server**, el botón estará en la barra inferior

> *Para **desarrollar** lanza el comando `npm run watch`. LA app debería de actualizarse cada vez que guardes un fichero*
