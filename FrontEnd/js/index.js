/////////////////////////////////////// Sélection des éléments HTML pertinents/////////////////////////////////////////////////////////////////////////////
const gallery = document.querySelector(".gallery"); // Sélectionne la galerie d'images
const filtres = document.querySelector(".filtres"); // Sélectionne les filtres de catégorie
const admintoken = sessionStorage.getItem("token"); // Récupère le token de l'administrateur depuis le sessionStorage

const modalContent1 = document.querySelector(".modalContent1");
const modalContent2 = document.querySelector(".modalContent2");
const backGallery = document.querySelector(".arrowLeft");
const addPhotoModal = document.querySelector(".add-photo-modal");
const adminToken = sessionStorage.getItem("token");

async function main() {
  await displayWorks(); // Affiche les projets
  displayFiltres(); // Affiche les filtres de catégorie
  admin();
  }
  
main(); // Appelle la fonction principale

// Affichage des projets


//////////////////////////////////////////////////////////// Fonction pour récupérer les projets depuis l'API//////////////////////////////////////////////////////////
async function getWorks() {
  try {
    const worksResponse = await fetch("http://localhost:5678/api/works");
    if (!worksResponse.ok) {
      throw new Error(`Erreur HTTP: ${worksResponse.status}`);
    }
    return worksResponse.json();
  } catch (error) {
    console.log(
      "Erreur lors de la récupération des projets depuis l'API :" + error
    );
  }
}
/////////////////////////////////////////////////////////////////////// Fonction pour afficher les projets//////////////////////////////////////////////////////////////
async function displayWorks(categorieId) {
  try {
    const dataworks = await getWorks();
    gallery.innerHTML = ""; // Vide la galerie d'images avant d'ajouter de nouveaux projets

    dataworks.forEach((works) => {
      if (categorieId == works.category.id || categorieId == null) {
        createWorks(works); // Crée un élément pour chaque projet et l'ajoute à la galerie
      }
    });
  } catch (error) {
    console.log("Erreur lors de l'affichage des projets :", error);
  }
}

///////////////////////////////////////////////////////////////////// Fonction pour créer un élément pour chaque projet///////////////////////////////////////////////
function createWorks(works) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");

  img.src = works.imageUrl;
  figcaption.innerText = works.title;
  figure.setAttribute("categorieId", works.category.id);

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

///////////////////////////////////////////////////////////////// Fonction pour récupérer les catégories depuis l'API///////////////////////////////////////////////////
async function getCategories() {
  try {
    const categoriesResponse = await fetch(
      "http://localhost:5678/api/categories"
    );
    return await categoriesResponse.json();
  } catch (error) {
    console.log("Erreur lors de la récupération des catégories depuis l'API");
  }
}

//////////////////////////////////////////////////////////// Fonction pour afficher les filtres de catégorie//////////////////////////////////////////////////////////
async function displayFiltres() {
  const dataCategories = await getCategories();

  dataCategories.forEach((category) => {
    const btnCategorie = document.createElement("button");
    btnCategorie.innerText = category.name;
    btnCategorie.classList.add("filterButton");
    btnCategorie.setAttribute("buttonId", category.id);
    filtres.appendChild(btnCategorie);
  });

  const buttons = document.querySelectorAll(".filtres button");
  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      let categorieId = button.getAttribute("buttonId");
      buttons.forEach((button) =>
        button.classList.remove("filterButtonActive")
      );
      this.classList.add("filterButtonActive");
      displayWorks(categorieId);
    });
  });
}

///////////////////////////////////////////////////////////////// Fonction pour vérifier si l'utilisateur est un administrateur///////////////////////////////////////
function admin() {
  if (admintoken) {
    logout(); // Déconnexion si l'utilisateur est administrateur
    adminDisplay(); // Affichage du mode édition
    gestionModal();
    displayWorksModal();
  }
}

// Fonction pour se déconnecter
function logout() {
  const connect = document.querySelector(".loginAdmin");
  connect.innerHTML = "<a href='#'>logout</a>";
  connect.addEventListener("click", (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    window.location.href = "index.html";
  });
}

// Fonction pour afficher le mode édition
function adminDisplay() {
  const banner = document.createElement("div");
  banner.classList.add("banner", "visibleBanner");

  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-pen-to-square");
  icon.style.color = "white";

  const title = document.createElement("h2");
  title.textContent = "Mode édition";

  banner.appendChild(icon);
  banner.appendChild(title);

  const currentParent = document.querySelector("body");
  const firstChild = currentParent.firstElementChild;

  if (firstChild) {
    currentParent.insertBefore(banner, firstChild);
  } else {
    currentParent.appendChild(banner);
  }

  const filtres = document.querySelector(".filtres");
  if (filtres) {
    filtres.parentNode.removeChild(filtres);
  } else {
    console.error("La bannière n'a pas été trouvée.");
  }
}

function gestionModal() {
  const conntainerBtnModify = document.querySelector(".portfolio-edit");
  const iconeBtnModify = document.createElement("i");
  iconeBtnModify.classList.add("fa-solid", "fa-pen-to-square");
  const btnModify = document.createElement("a");
  btnModify.href = "#modal1";
  btnModify.textContent = "modifier";
  conntainerBtnModify.appendChild(iconeBtnModify);
  conntainerBtnModify.appendChild(btnModify);

  conntainerBtnModify.addEventListener("click", openModal);

  window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
      closeModal(e);
    }
    if (e.key === "Tab" && Modal !== null) {
      focusInModal(e);
    }
  });

  /////////////////////////////////////////Sélectionnez la galerie photo et le bouton "Ajouter une photo" //////////////////////////////////////////////////////

  // Ajoutez un gestionnaire d'événements au clic sur le bouton "Ajouter une photo"
  document
    .getElementById("ajouterPhotoBtn")
    .addEventListener("click", function (e) {
      e.preventDefault(); // Empêche le comportement par défaut du lien
      modalContent1.style.display = "none";
      modalContent2.style.display = "block";
    });

  // Ajoutez un gestionnaire d'événements pour le clic sur l'icône de retour
  backGallery.addEventListener("click", function (e) {
    // Restaurez le contenu de la galerie en appelant la fonction displayWorksModal()
    e.preventDefault();
    modalContent1.style.display = "block";
    modalContent2.style.display = "none";
  });
}

let modal = null;
const focusableSelector = "button, a, input, textarea, img";
let focusElements = [];

const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};
const focusInModal = function (e) {
  e.preventDefault();
  let index = focusElements.findIndex(
    (f) => f === modal.querySelector(":focus")
  );
  index++;
  if (index >= focusElements.length) {
    index = 0;
  }
  focusElements[index].focus();
};

const stopPropagation = function (e) {
  e.stopPropagation();
};

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusElements = Array.from(modal.querySelectorAll(focusableSelector));
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
  // Affiche les projets dans la modal lorsque celle-ci est ouverte

  modalContent1.style.display = "block";
  modalContent2.style.display = "none";
};

// Fonction pour générer le contenu de la modal avec les projets récupérés
async function displayWorksModal() {
  

  try {
    const dataWorks = await getWorks(); // Récupère les projets
    const galleryModal = document.querySelector(".gallery-modal"); // Sélectionne le contenu de la modal

    // Vide le contenu de la modal avant d'ajouter de nouveaux projets
    galleryModal.innerHTML = "";

    // Ajoute chaque projet à la modal
    dataWorks.forEach((works) => {
      // Crée un conteneur pour l'image et l'icône de suppression
      const container = document.createElement("div"); // Crée un élément div qui va contenir le projet
      container.classList.add("image-container"); // Associe une class au div pour styliser ce dernier

      // Crée l'élément img pour l'image
      const img = document.createElement("img");
      img.src = works.imageUrl; // Définit la source de l'image
      container.appendChild(img); // Ajoute l'image au conteneur

      const deleteIcon = document.createElement("i"); // Crée l'icone de suppression
      deleteIcon.classList.add("fa-solid", "fa-trash-can");

      deleteIcon.setAttribute("aria-hidden", "true");
      deleteIcon.addEventListener("click", async () => {
        await deleteWorks(works.id); // Supprime le projet en fonction de son ID dans la base de données
        displayWorksModal(); // Rafraîchit la modal après la suppression
      });
      container.appendChild(deleteIcon); //  l'icone de suppression au conteneur
      galleryModal.appendChild(container); // le conteneur (avec l'image et l'icone) à la modal
    });
  } catch (error) {
    console.log(
      "Erreur lors de l'affichage des projets dans la modal :",
      error
    );
  }
}

// Fonction pour supprimer un projet
async function deleteWorks(workId) {
  const adminToken = sessionStorage.getItem("token");

  try {
    if (window.confirm("Êtes vous sûr de vouloir effacer ce projet?")) {
      let response = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        console.log("Projet supprimé avec succès.");
        displayWorks();
      } else if (response.status === 401) {
        console.error("Non autorisé à effectuer cette action.");
      }
    }
  } catch (error) {
    console.error("Erreur lors de la requête:", error);
  }
}

// Tableau des options avec leurs valeurs et textes correspondants
const options = [
  { value: "1", text: "Objets" },
  { value: "2", text: "Appartements" },
  { value: "3", text: "Hotels & restaurants" },
];

// Sélection de l'élément <select> par son ID
const displayCategoryWorks = document.getElementById("category");

//  des options à l'élément <select> en utilisant une boucle
options.forEach((option) => {
  const optionElement = document.createElement("option");
  optionElement.value = option.value;
  optionElement.textContent = option.text;
  displayCategoryWorks.appendChild(optionElement);
});

//  Récuperation des éléments du formulaire

document.addEventListener("DOMContentLoaded", function () {
  const previewImage = document.getElementById("previewImage");
  const addPhotoContainer = document.querySelector(".addPhoto");
  const photoInput = document.getElementById("photoInput"); 
  const photoInputTxt = document.querySelector(".photoInputTxt");
  const errorImg = document.querySelector(".errorImg");
  const btnPhotoInput = document.querySelector(".btnPhotoInput");

  // Ajoutez un gestionnaire d'événements pour écouter les changements sur le champ d'entrée de type fichier
  photoInput.addEventListener("change", function (event) {
    const file = event.target.files[0]; // Récupérez le fichier sélectionné par l'utilisateur
    if (file) {
      const reader = new FileReader(); // Utilisez FileReader pour lire le contenu du fichier
      reader.onload = function (e) {
        // Gérez l'événement onload pour afficher l'image dans un élément de prévisualisation
        previewImage.src = e.target.result;
      };
      reader.readAsDataURL(file); // Lire le contenu du fichier en tant qu'URL de données
      // Masquez le champ pour ajouter une photo une fois qu'une image est sélectionnée

      // Cacher les autres éléments
      photoInputTxt.classList.add("hidden");
      errorImg.classList.add("hidden");
      btnPhotoInput.classList.add("hidden");
    }
  });

  formModal.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(formModal);

    try {
        const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${adminToken}`, 
            },
        });

        if (response.ok) {
            // Gérer la réponse du serveur, rafraîchir la galerie
            displayWorks(); //  rafraîchir la galerie d'images après l'ajout d'une nouvelle photo
        
            // Une fois le projet envoyé, retour à la modale étape 1
            if (response.status === 201) {
                const step = 1;
                const img = document.querySelector('.add-photo-modal img');
                const photoInput = document.getElementById("photoInput");
                const editionDOM = document.querySelector(".modalContent1 .gallery-modal");
                const galleryDOM = document.querySelector(".gallery");
        
                img.src = "";
                photoInput.value = "";
                editionDOM.innerHTML = "";
                galleryDOM.innerHTML = "";
        
                stepUpdate(step);
            }
        } else {
            console.error("Erreur lors de l'ajout de la photo:", response.status)
        }
    } catch (error) {
        console.error("Erreur lors de la requête:", error);
    }
});
});




document.addEventListener('DOMContentLoaded', function() {
  const photoInput = document.getElementById('photoInput');
  const btnPhotoInput = document.querySelector('.btnPhotoInput');
  const previewImage = document.getElementById('previewImage');

  // Gestionnaire d'événement pour les changements dans les champs du formulaire
  photoInput.addEventListener('change', function () {
      const checkValue = "#photoInput, #title, #category";
      const allFilled = checkValue.split(', ').every(selector => {
          return document.querySelector(selector).value;
      });
      if (allFilled) {
          btnPhotoInput.removeAttribute('disabled');
      } else {
          btnPhotoInput.setAttribute('disabled', 'disabled');
      }
  });

  // Gestionnaire d'événement pour l'ajout d'une image
  photoInput.addEventListener('change', function (e) {
      console.log(this.files[0]);
      const reader = new FileReader();
      reader.onload = function (e) {
          previewImage.src = e.target.result;
      }
      reader.readAsDataURL(this.files[0]);
  });
});



