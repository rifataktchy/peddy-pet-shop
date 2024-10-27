// Global variable declared
let petsList = [];

// create fetch all catagories
const loadCatagories = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};

// create fetch all pets
const loadPets = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
    .then((res) => res.json())
    .then((data) => {
        petsList = data.pets;
        displayPets(petsList); 
    })
    .catch((error) => console.log(error));
};

// for remove active color from category button
const removeActiveClass = () => {
   const buttons = document.getElementsByClassName("category-btn");
   console.log(buttons);
   for(let btn of buttons){
    btn.classList.remove("active");
   }
}

// fetch pet according to category
const loadCategoryWisePet = (category,id) => {
    
    fetch(`https://openapi.programming-hero.com/api/peddy/category/${category}`)
    .then((res) => res.json())
    .then((data) => {
        removeActiveClass();
        const activeBtn = document.getElementById(`btn-${id}`);
        activeBtn.classList.add("active");
        petsList = data.data; 
        displayPets(petsList);
    })
    .catch((error) => console.log(error));
}

// create display pets
const displayPets = (pets) => {   
    const petsContainer = document.getElementById("pets");
    petsContainer.innerHTML = '';
    if(pets.length == 0){
        petsContainer.classList.remove("grid");
        petsContainer.innerHTML = `
        <div class=" flex flex-col gap-5 justify-center items-center">
          <img src="images/error.webp">
          <h1>No Information Available</h1>
          <p>We don not have any available bird pet as our collection, we will update it if we collect any.</p>
        </div>
        `;
        return;
    }else{
        petsContainer.classList.add("grid");  
    }
   pets.forEach((pet) => {
    const {image, pet_name, breed, date_of_birth, gender, price, petId} = pet;

    const card = document.createElement("div");
    card.classList= "card";
    card.innerHTML=
    `
    <figure class="h-[150px] ">
    <img src=${image}
      class="h-full w-full object-cover rounded-lg"/>
    </figure>
    <div class="px-0 py-2">
       <div>
         <h1 class="font-bold text-xl">${pet_name}</h1>
         <div class="flex gap-2">
         <img width="15" height="3" src="https://img.icons8.com/sf-ultralight/25/four-squares.png" alt="four-squares"/>
         <h1>breed: ${breed || "Not available"}</h1>
        </div>
        <div class="flex gap-2">
         <img width="18" height="5" src="https://img.icons8.com/sf-ultralight/25/time-span.png" alt="time-span"/>
         <h1>Birth: ${date_of_birth || "Not available"}</h1>
        </div>
         <div class="flex gap-2">
         <img width="20" height="5" src="https://img.icons8.com/sf-ultralight/25/female.png" alt="female"/>
         <h1>Gender: ${gender || "Not available"}</h1>
        </div>
        <div class="flex gap-2">
         <img width="20" height="5" src="https://img.icons8.com/sf-ultralight/25/money-bag.png" alt="money-bag"/>
         <h1>Price: ${price || "Not available"}</h1>
        </div>
       </div>

      <div class="flex flex-row justify-between">
      <button onclick=imageSeen('${image}') class="btn btn-circle hover:bg-white">
      <img width="30" height="30" src="https://img.icons8.com/sf-regular/50/facebook-like.png" alt="facebook-like"/>
      </button>
      <button id="adopt-button" onclick="adoptSection(this)" class="text-[#0E7A81] font-bold hover:bg-[#0E7A81] hover:text-white px-2 rounded-2xl disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed">Adopt</button>
    
      <button onclick="petDetails('${petId}')" class="text-[#0E7A81] font-bold hover:bg-[#0E7A81] hover:text-white px-2 rounded-2xl">Details</button>
      </div>
    </div>
    `
    petsContainer.append(card);
    });
  };
   // Sort pets by price in descending order
   const sortByPrice = () => {
    const sortedPets = [...petsList].sort((a, b) => b.price - a.price);
    displayPets(sortedPets); 
    };
   // Event listener for sorting button
   document.getElementById("sort-price-btn").addEventListener("click", sortByPrice);

    document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("spinner").style.display = "block";
    setTimeout(() => {
    document.getElementById("spinner").style.display = "none";
        loadPets(); 
        loadCategoryWisePet();
    }, 3000); 
});

// modal for adoption
const adoptSection = (adoptButton) => {
    console.log(adoptButton)
   
    const modalContainer = document.getElementById("modal-container-first");

    modalContainer.innerHTML = `
    <dialog id="my_modal_3" class="modal">
      <div class="modal-box flex flex-col justify-center items-center">
        <h1 class="text-2xl font-bold" id="modal-text">Congrats</h1>
        <p>Adoption process is start for your pet</p>
        <p class="py-4 font-bold text-5xl" id="countdown"></p>
        <div class="modal-action">
          <form method="dialog">
          </form>
        </div>
      </div>
    </dialog>
    `;

    // Get the modal element and show it
    const modal = document.getElementById("my_modal_3");
    const countdownElement = document.getElementById("countdown");
    const closeModalButton = document.getElementById("close-modal-btn");

    modal.showModal();

    // Start the countdown from 3 to 1
    let count = 3;

    const countdownInterval = setInterval(() => {
        countdownElement.innerText = `${count}`; 
        count--;

        if (count < 0) {
            clearInterval(countdownInterval); 
            modal.close();
            adoptButton.disabled = true; 
        
        }
    }, 1000);
   
};

// pet details for model container
const petDetails = async(petId) => {
    console.log(petId);
    const response = await fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`);

    const data = await response.json();
    console.log(data.petData);
    const {image, pet_name, breed, price, gender, date_of_birth,pet_details} = data.petData;
    const modalContainer = document.getElementById("modal-container-second");
    modalContainer.innerHTML = `
    <dialog id="my_modal_1" class="modal">
        <div class="modal-box">
          <img src=${image} class="h-full w-full object-cover rounded-lg" />
          <h3 class="text-lg font-bold">${pet_name}</h3>
          <div class="flex gap-2">
         <img width="15" height="3" src="https://img.icons8.com/sf-ultralight/25/four-squares.png" alt="four-squares"/>
         <h1>breed: ${breed || "Not available"}</h1>
        </div>
        <div class="flex gap-2">
         <img width="18" height="5" src="https://img.icons8.com/sf-ultralight/25/time-span.png" alt="time-span"/>
         <h1>Birth: ${date_of_birth || "Not available"}</h1>
        </div>
         <div class="flex gap-2">
         <img width="20" height="5" src="https://img.icons8.com/sf-ultralight/25/female.png" alt="female"/>
         <h1>Gender: ${gender || "Not available"}</h1>
        </div>
        <div class="flex gap-2">
         <img width="20" height="5" src="https://img.icons8.com/sf-ultralight/25/money-bag.png" alt="money-bag"/>
         <h1>Price: ${price || "Not available"}</h1>
        </div>
        <div><span class="font-bold">Detail Information </span><br> ${pet_details || "Not available"}</div>
          <div class="modal-action">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    `
    my_modal_1.showModal()
}

// create area for image which have liked
const imageSeen = (image) => {
    const imageSeenContainer = document.getElementById("image-seen-container");
    const div = document.createElement("div");
    div.classList= "md:pl-0 pt-6 item-end flex justify-center lg:justify-end";
    div.innerHTML=
    `
    <figure class="h-[100px] w-[100px]">
    <img src=${image}
      class="h-full w-full object-cover rounded-lg"/>
    </figure>
    `
    imageSeenContainer.appendChild(div);
}


// create display categories
const displayCategories = (categories) => {
    const categoryContainer = document.getElementById("categories");

    categories.forEach((item) => {
    // console.log(item);
    // create a button in div
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("flex");
    // button.classList.add("btn", "border", "border-blue-500", "rounded-full", "flex", "items-center", "px-10", "py-2", "hover:bg-blue-100");

    buttonContainer.innerHTML = `
    <button id="btn-${item.id}" onclick="loadCategoryWisePet('${item.category}', '${item.id}')" class="btn category-btn w-full border-blue-500 rounded-full lg:px-10 md:px-10 hover:bg-blue-100 mx-auto px-6">
    <div class="flex justify-center items-center"><img src="${item.category_icon}" class="inline w-6 h-6 mr-2" /> ${item.category}<div>
    <button>`;

    categoryContainer.append(buttonContainer);
    })
}


loadCatagories();
loadPets();