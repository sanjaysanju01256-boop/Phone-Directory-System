// app.js

// ==========================
// 1️⃣ Import Firebase Modules
// ==========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

// ==========================
// 2️⃣ Firebase Config
// ==========================
const firebaseConfig = {
  apiKey: "AIzaSyD88-zlT3LImMlM10-CM-rjkENwxCaIjZk",
  authDomain: "phonedirectoryapp-dff97.firebaseapp.com",
  databaseURL: "https://phonedirectoryapp-dff97-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "phonedirectoryapp-dff97",
  storageBucket: "phonedirectoryapp-dff97.firebasestorage.app",
  messagingSenderId: "587383816701",
  appId: "1:587383816701:web:efb624fedf990b964ed994"
};

// ==========================
// 3️⃣ Initialize Firebase
// ==========================
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ==========================
// 4️⃣ DOM Elements
// ==========================
const addContactForm = document.getElementById("addContactForm");
const searchContactForm = document.getElementById("searchContactForm");
const contactsListDiv = document.getElementById("contactsList");
const searchResultDiv = document.getElementById("searchResult");

// ==========================
// 5️⃣ Add Contact
// ==========================
addContactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();

  if(name && phone){
    const contactsRef = ref(database, "contacts");
    const newContactRef = push(contactsRef);
    set(newContactRef, {
      name: name,
      phone: phone
    }).then(() => {
      alert("Contact added successfully!");
      addContactForm.reset();
      renderContactsList();
    }).catch((error) => {
      alert("Error adding contact: " + error);
    });
  }
});

// ==========================
// 6️⃣ Render All Contacts
// ==========================
function renderContactsList() {
  contactsListDiv.innerHTML = "";
  const contactsRef = ref(database, "contacts");
  onValue(contactsRef, (snapshot) => {
    contactsListDiv.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      const contact = childSnapshot.val();
      const div = document.createElement("div");
      div.classList.add("mb-2");
      div.innerHTML = `<strong>${contact.name}</strong> - ${contact.phone}`;
      contactsListDiv.appendChild(div);
    });
  });
}

// ==========================
// 7️⃣ Search Contact
// ==========================
searchContactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.getElementById("searchQuery").value.trim().toLowerCase();
  searchResultDiv.innerHTML = "";
  const contactsRef = ref(database, "contacts");
  onValue(contactsRef, (snapshot) => {
    searchResultDiv.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
      const contact = childSnapshot.val();
      if(contact.name.toLowerCase().includes(query) || contact.phone.includes(query)){
        const div = document.createElement("div");
        div.classList.add("mb-2");
        div.innerHTML = `<strong>${contact.name}</strong> - ${contact.phone}`;
        searchResultDiv.appendChild(div);
      }
    });
  });
});

// ==========================
// 8️⃣ Initial Render
// ==========================
renderContactsList();
