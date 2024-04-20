const formLogin = document.querySelector("form");

formLogin.addEventListener("submit", (e) => {
  // Modification de la cible de l'écouteur d'événement
  e.preventDefault();
  login();
});

async function login() {
  const emailLogin = document.getElementById("email").value;
  const passwordLogin = document.getElementById("password").value;

  const user = {
    email: emailLogin,
    password: passwordLogin,
  };

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const data = await response.json();
      const userdata = data.token;
      sessionStorage.setItem("token", userdata); // Correction de la faute de frappe ici
      document.location.href = "index.html"; // Redirection vers la page d'accueil
    } else {
      document.querySelector(".error").innerHTML =
        "Erreur dans l’identifiant ou le mot de passe";
    }
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    // Gérez les erreurs de connexion ici
    document.querySelector(".error").innerHTML =
      "Probléme technique , veuillez réessayer ultérieurement";
  }
}


