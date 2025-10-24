// ==========================
// 1️⃣ Firebase Import
// ==========================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

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
const contactsRef = ref(database, "contacts");

// ==========================
// 5️⃣ Render Contacts (All Contacts)
// ==========================
function renderContacts(snapshot) {
  contactsListDiv.innerHTML = "";
  snapshot.forEach((childSnapshot) => {
    const contact = childSnapshot.val();
    const key = childSnapshot.key;

    const div = document.createElement("div");
    div.classList.add("mb-2", "d-flex", "justify-content-between", "align-items-center");
    div.innerHTML = `
      <span><strong>${contact.name}</strong> - ${contact.phone}</span>
      <button class="btn btn-danger btn-sm">Delete</button>
    `;

    // Delete contact
    div.querySelector("button").addEventListener("click", () => {
      if(confirm(`Are you sure you want to delete ${contact.name}?`)){
        remove(ref(database, "contacts/" + key));
      }
    });

    contactsListDiv.appendChild(div);
  });
}

// Live listener: updates list automatically when data changes
onValue(contactsRef, (snapshot) => {
  renderContacts(snapshot);
});

// ==========================
// 6️⃣ Add Contact
// ==========================
addContactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();

  if(name && phone){
    const newContactRef = push(contactsRef);
    set(newContactRef, { name, phone })
      .then(() => {
        // Bootstrap alert
        const alertContainer = document.getElementById("alertContainer");
        alertContainer.innerHTML = `
          <div class="alert alert-success alert-dismissible fade show" role="alert">
            Contact <strong>${name}</strong> added successfully!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
          </div>
        `;
        addContactForm.reset();
      })
      .catch((err) => alert("Error: " + err));
  }
});

// ==========================
// 7️⃣ Search Contacts
// ==========================
searchContactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.getElementById("searchQuery").value.toLowerCase();
  searchResultDiv.innerHTML = "";

  onValue(contactsRef, (snapshot) => {
    searchResultDiv.innerHTML = "";
    let found = false;
    snapshot.forEach((childSnapshot) => {
      const contact = childSnapshot.val();
      const key = childSnapshot.key;

      if(contact.name.toLowerCase().includes(query) || contact.phone.includes(query)){
        found = true;
        const div = document.createElement("div");
        div.classList.add("mb-2", "d-flex", "justify-content-between", "align-items-center");
        div.innerHTML = `
          <span><strong>${contact.name}</strong> - ${contact.phone}</span>
          <button class="btn btn-danger btn-sm">Delete</button>
        `;

        // Delete from search results
        div.querySelector("button").addEventListener("click", () => {
          if(confirm(`Are you sure you want to delete ${contact.name}?`)){
            remove(ref(database, "contacts/" + key));
          }
        });

        searchResultDiv.appendChild(div);
      }
    });

    if(!found){
      searchResultDiv.innerHTML = `<div class="text-muted">No contacts found for "<strong>${query}</strong>"</div>`;
    }
  });
});
