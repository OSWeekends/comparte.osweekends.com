const utils = require('./utils');

function loginByEmail() {
  document.querySelector('header #header-welcome').style.display = 'none';
  document.querySelector('main').innerHTML = '';
  let template = '';
  template =
  `
  <div class="main-container">
    <div class="main-container--div">
      <div class="main-container--div--logo">
        <img src="./../src/img/icons/icon-72x72.png" />
      </div>

      <div id="ows-login">
        <input id="login-email" type="text" placeholder="correo electrónico"/>
        <input id="login-password" type="password" placeholder="contraseña"/>
        <a href="#" id="login-login">ENTRAR</a>
      </div>
    </div>
  </div>
  `;

  document.querySelector('main').insertAdjacentHTML('afterbegin', template);
  document.querySelector('#login-login').addEventListener('click', utils.login, false);

}

module.exports = loginByEmail;