function load_api() {
  const token = this.localStorage.token;

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
          location.href = "/validate";

          console.log("true");
        }
      })
      .catch((err) => {
        console.log(err);
        location.href = "/";
      });
  } else {
    console.log("no token");
  }
} 

window.addEventListener("load", function () {
  load_api();
});