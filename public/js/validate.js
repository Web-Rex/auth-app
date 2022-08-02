const fetchTOKEN = (token, send) => {
  fetch("/sendcode", {
    method: "post",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      let time = data.time

      if (time) {
        
          updateDOM(data, time);

          if (send === true) {
            alert(`your token is ${data.token}`)
          }
        
      }

      if (data.sucess === false) {
        this.location.href = "/";
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

const updateDOM = (data, time) => {
  const interval = setInterval(() => {
          
    if (time === 1) {
      this.clearInterval(interval)
    }

    time-- 
    document.querySelector("#time_left").innerHTML = time;

  }, 1000);
}

document.querySelector("#button-resend-switch").addEventListener("click", function () {

  if (document.querySelector("#time_left").innerHTML === "0") {
    const token = localStorage.token;

  // console.log(localStorage);

  if (token) {
    // console.log(token);

    fetchTOKEN(token, true)
  } else {
    console.log("no token");
  }
  }else{
    alert("pleas wait for the countdown to reach 0")
  }

  // console.log(document.querySelector("#time_left").innerHTML);
})

const editIsValid = (token) => {
  fetch("/setverified", {
    method: "post",
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success === true) {
        location.href = "/profile"
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

window.addEventListener("load", function () {
  const token = localStorage.token;

  // console.log(localStorage);

  if (token) {
    // console.log(token);

    fetch("/private", {
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success === true) {
          location.href = "/profile";

          console.log("true");
        }
        if (data.details === 'not authorised to access this rout pleas verify your number') {
          fetchTOKEN(token, false)
        }
      })
      .catch((err) => {
        console.log(err);
        location.href = "/";
      });
  } else {
    console.log("no token");
  }

  const authPage = document.querySelector("#auth");
  if (authPage) {
    const login = document.querySelector("#login");

    login.classList.add("active");

    // validation
    // login
    const validateButton = document.querySelector("#button-validate");
    const validatePassword = document.querySelector("#user-validate-login");

    validateButton.addEventListener("click", function (e) {
      const token = localStorage.token;
      e.preventDefault(validatePassword.value);

      if (validatePassword.value.length == 0) {
        alert("please fill the blank");
      } else {
        fetch("/verifytoken", {
          method: "post",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            token: validatePassword.value,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.valid === true) {
              editIsValid(token)
            }else {
              alert("wrong code inputed")
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  }
});
