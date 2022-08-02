function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

window.addEventListener("load", function () {
  const authPage = document.querySelector("#auth");
  if (authPage) {
    const login = document.querySelector("#login");
    const register = document.querySelector("#register");

    login.classList.add("active");

    const buttonSwitchRegister = document.querySelector(
      "#button-register-switch"
    );
    const buttonSwitchLogin = document.querySelector("#button-login-switch");

    buttonSwitchRegister.addEventListener("click",           function () {
      if (login.classList.contains("active")) {
        login.classList.remove("active");
        register.classList.add("active");
      } else {
        login.classList.add("active");
        register.classList.remove("active");
      }
    });

    buttonSwitchLogin.addEventListener("click", function() {
      if (login.classList.contains("active")) {
        login.classList.remove("active");
        register.classList.add("active");
      } else {
        login.classList.add("active");
        register.classList.remove("active");
      }
    });

    // validation
    // login
    const loginButton = document.querySelector("#button-login");
    const loginEmail = document.querySelector("#user-email-login");
    const loginPassword = document.querySelector("#user-password-login");

    loginButton.addEventListener("click", function (e) {
      e.preventDefault(loginEmail.value, loginPassword.value);


      if (loginEmail.value.length == 0 || loginPassword.value.length == 0) {
        alert("please fill the blank");
      } else {
        fetch("/login", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail.value,
            password: loginPassword.value,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success === true) {
              localStorage.setItem("token", data.token);
  
              location.href = "/profile";
            } else {
              alert(data.error)
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });

    // register
    const registerButton = document.querySelector("#button-register");
    const registerEmail = document.querySelector("#user-email-register");
    const registerPassword = document.querySelector("#user-password-register");
    const registerUsername = document.querySelector("#user-username-register");
    const registerNumber = document.querySelector("#user-number-register");
    registerButton.addEventListener("click", function (e) {
      e.preventDefault();
      if (
        registerEmail.value.length == 0 ||
        registerUsername.value.length == 0 ||
        registerNumber.value.length == 0 ||
        registerPassword.value.length == 0
      ) {
        alert("please fill the blank");
      } else {
        
        fetch("/register", {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            username: registerUsername.value,
            email: registerEmail.value,
            password: registerPassword.value,
            number: registerNumber.value,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success === true) {
              console.log(data);
  
              localStorage.setItem("token", data.token);
  
              location.href = "/profile";
            } else {
              alert(data.error)
            }
          })
          .catch((err) => {
            console.log(err);
          });
        
      }
    });

    // email
    const emails = document.querySelectorAll(".user-email");
    let email;
    emails.forEach((email) => {
      var checkEmail = debounce(function (e) {
        var aT = /[@]/g;
        if (email.value.match(aT)) {
          email.classList.remove("invalid");
          email.classList.add("valid");
        } else {
          email.classList.remove("valid");
          email.classList.add("invalid");

          let alert = document.createElement("div");
          alert.classList.add("alert");
          alert.innerHTML = `<p>Please include an '@' in the email address. <span><strong>${email.value}</strong></span> is missing an '@'</p>`;

          email.parentElement.append(alert);
          setTimeout(function () {
            email.parentElement.removeChild(alert);
          }, 1500);
        }
      }, 10);
      email.addEventListener("input", checkEmail);
    });

    // password
    let passwords = document.querySelectorAll(".user-password");
    let password;
    passwords.forEach((password) => {
      var checkPassword = debounce(function (e) {
        if (password.value.length <= 3) {
          password.classList.remove("valid");
          password.classList.add("invalid");

          let alert = document.createElement("div");
          alert.classList.add("alert");
          alert.innerHTML = `<p>Please lengthen this text to 6 characters or more (you are currently using <span>${password.value.length} characters</span>).</p>`;

          password.parentElement.append(alert);
          setTimeout(function () {
            password.parentElement.removeChild(alert);
          }, 1000);
        } else {
          password.classList.remove("invalid");
          password.classList.add("valid");
        }
      }, 10);
      password.addEventListener("input", checkPassword);
    });

    // confirm password
    const passwordsConfirm = document.querySelectorAll(
      ".user-password-confirm"
    );
    passwordsConfirm.forEach((passwordConfirm) => {
      var passwordRegister = document.querySelector("#user-password-register");
      var checkPasswordConfirm = debounce(function (e) {
        if (passwordRegister.value !== passwordConfirm.value) {
          passwordConfirm.classList.remove("valid");
          passwordConfirm.classList.add("invalid");

          let alert = document.createElement("div");
          alert.classList.add("alert");
          alert.innerHTML = `<p>Password does not match</p>`;

          passwordConfirm.parentElement.append(alert);
          setTimeout(function () {
            passwordConfirm.parentElement.removeChild(alert);
          }, 500);
        } else {
          passwordConfirm.classList.remove("invalid");
          passwordConfirm.classList.add("valid");
        }
      }, 10);
      passwordConfirm.addEventListener("input", checkPasswordConfirm);
    });
  }
});