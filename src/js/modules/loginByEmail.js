module.exports = function loginByEmail() {
  document.querySelector('header #header-welcome').style.display = 'none';
  document.querySelector('main').innerHTML = '';
  let template = '';
  template =
  `
  <div id="ows-login">
    <input id="login-email" type="text" placeholder="correo electrónico"/>
    <input id="login-password" type="password" placeholder="contraseña"/>
    <a href="#" id="login-login">entrar</a>
  </div>
  `;

  document.querySelector('main').insertAdjacentHTML('afterbegin', template);
  document.querySelector('#login-login').addEventListener('click', login, false);

}