function load_api() {
  const user_username_profile = document.querySelector(".user_username_profile");
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

        user_username_profile.innerHTML = `welcome ${data.details.username}`

        if (data.success === false) {
          location.href = "/validate";
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

document.querySelector(".logout_profile").addEventListener("click", () => {
  localStorage.setItem("token", null);
  location.href = "/";
})