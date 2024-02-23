const step = ["Staff", "Service", "Date & Time", "Confirmation"];

const staffs = [
  {
    id: 1,
    name: "Alex Rosetta",
    email: "alexrosetta@gmail.com",
    image: "/image/staff-1.jpg",
  },
  {
    id: 2,
    name: "Maria Juli",
    email: "mariajuli@gmail.com",
    image: "/image/staff-2.jpg",
  },
];

const services = [
  {
    id: 1,
    name: "Oral hygiene",
    image: "/image/service-1.jpg",
    duration: "1 hour",
    price: "100",
  },
  {
    id: 2,
    name: "Implants",
    image: "/image/service-2.jpg",
    duration: "1 hour 30 min ",
    price: "200",
  },
];

const date = ["2024-01-12", "2024-01-13", "2024-01-14"];

const time = [
  {
    startTime: "09:00",
    endTime: "17:00",
  },
  {
    startTime: "09:30",
    endTime: "10:00",
  },
  {
    startTime: "10:30",
    endTime: "11:00",
  },
];

let confirmData = {
  staff_id: null,
  service_id: null,
  date: null,
  time: null,
  price: null,
  customer: {
    name: null,
    surname: null,
    email: null,
    phone: null,
  },
};

// modal
let modal = document.getElementById("myModal");

// close butonu ile modal baglamaq
let span = document.querySelector(".close");
span.addEventListener("click", function () {
  modal.classList.remove("open");
});
// open modal func
function openModal(title, color) {
  modal.classList.add("open");
  let desc = document.querySelector("#myModal .modal-desc");
  desc.textContent = title;
  desc.style.color = color;
}

let currentStep = 1;
let dataChanged = false;

// steplere klikden sonra steplerin gosterilmesi
function showStep(stepNumber) {
  step.forEach((_, i) => {
    const stepElement = document.getElementById(`step${i + 1}`);
    const stepLink = document.querySelector(`.step-link[data-step="${i + 1}"]`);
    const stepLinkNumber = stepLink.querySelector("span");
    const stepLinkIcon = stepLink.querySelector("i");

    stepElement.style.display = "none";
    stepLink.classList.remove("active", "completed");

    // tamamlanmis stepe icon elave etmek ve nomreni gizlemek
    if (i < stepNumber - 1) {
      stepLink.classList.add("completed");
      stepLinkNumber.style.display = "none";
      stepLinkIcon.classList.add("fa-check");
      stepLinkIcon.style.display = "flex";
      stepLink.classList.add("passed");
    } else {
      stepLinkNumber.style.display = "flex";
      stepLinkIcon.classList.remove("fa-check");
      stepLinkIcon.style.display = "none";
      stepLink.classList.remove("passed");
    }
  });
  // ilk step contentin gorunen etmek
  document.getElementById(`step${stepNumber}`).style.display = "block";
  currentStep = stepNumber;
  // ilk stepde back butonunu gizleme
  document.getElementById("prevButton").style.display =
    currentStep === 1 ? "none" : "inline-block";
  // sonuncu stepde next yerine confirm yazdirmaq
  const nextButton = document.getElementById("nextButton");
  nextButton.innerHTML = currentStep === 4 ? "Confirm Booking" : "Next";
  // stepe active clasielave etmek
  document
    .querySelector(`.step-link[data-step="${currentStep}"]`)
    .classList.add("active");
}

// klikde bir onceki stepi gostermek
function prevStep() {
  if (currentStep > 1) {
    // Kullanıcı verileri değiştirdiyse sonraki adımlardaki dataları sıfırla

    showStep(stepNumber - 1);
  }
}
// sonraki step
function nextStep() {
  // her step deyisende gosterilecek error mesaji
  let errorMessage = null;

  // stepe gore xeta mesajin yazdirmaq
  switch (currentStep) {
    case 1:
      if (!confirmData.staff_id) {
        errorMessage = "Select Staff";
      }
      break;
    case 2:
      if (!confirmData.service_id) {
        errorMessage = "select Service";
      }
      break;
    case 3:
      if (!confirmData.date || !confirmData.time) {
        errorMessage = "Select Date & Time";
      }
      break;
    case 4:
      if (!updateConfirmDataFromForm()) {
        errorMessage = "add confirm";
      }
      break;
    default:
      break;
  }

  // step 4un xetasin toast yerine modalda gostermek
  if (errorMessage === "add confirm") {
    openModal("Please, fill the all required fields!", "#F39C12");
    return;
  }
  //  error mesajini toast ile gostermek
  if (errorMessage) {
    launch_toast(errorMessage);
    return;
  }

  if (currentStep < 4) {
    showStep(currentStep + 1);
  } else if (currentStep === 4) {
    // sonuncu stepde ugurlu confirmden sonra modal gostermek
    openModal("Confirmation successfully completed!", "#38CF78");

    // ConfirmData'yi loglamaq
    console.log(confirmData);

    // butun datani sıfırlamaq ve ilk adıma geçmek
    resetForm();
  }
}

function resetForm() {
  // İlk adıma gecmek
  showStep(1);

  // Tüm active ve selected classların temizlemek
  const activeElements = document.querySelectorAll(".active");
  const selectedElements = document.querySelectorAll(".selected");
  const faIcons = document.querySelectorAll(".fa-check");
  const numbers = document.querySelectorAll(".number");
  faIcons.forEach((icon) => {
    icon.classList.remove("fa-check");
  });
  numbers.forEach((number) => {
    number.style.display = "flex";
  });
  activeElements.forEach((element) => {
    element.classList.remove("active");
  });

  selectedElements.forEach((element) => {
    element.classList.remove("selected");
  });

  const sidebarActive = document.querySelector('.sidebar a[data-step="1"]');
  sidebarActive.classList.add("active");
  // ConfirmData'yı sıfırla

  // Sayfadaki tarih ve saat seçeneklerini sıfırla
  const dateInput = document.getElementById("selectedDate");
  dateInput.value = date[0];

  const timeOptions = document.querySelectorAll('input[name="selectedTime"]');
  timeOptions.forEach((timeOption) => {
    timeOption.checked = false;
  });
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  nameInput.value = "";
  surnameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";

  confirmData = {
    staff_id: null,
    service_id: null,
    date: null,
    time: null,
    customer: {
      name: null,
      surname: null,
      email: null,
      phone: null,
    },
  };
  // confirm verilerini guncellemek
  updateConfirmationDetails();
}

// add staff step
function generateStaffContent() {
  const staffContentElement = document.getElementById("staffContent");
  const nextButton = document.getElementById("nextButton");

  staffs.forEach((staff) => {
    const staffElement = document.createElement("div");
    staffElement.classList.add("staff-item");

    staffElement.innerHTML = `
      <img src="${staff.image}" alt="${staff.name}">
      <div class="staff-info">
        <h3>${staff.name}</h3>
        <p>${staff.email}</p>
      </div>
    `;
    // staff elementine clikde active clasin elave etmek
    staffElement.addEventListener("click", function () {
      const selectedStaff = document.querySelector(".staff-item.selected");
      // selecet clasi varsa silmek
      if (selectedStaff) {
        selectedStaff.classList.remove("selected");
      }
      // confirmdatani guncellemek
      confirmData.staff_id = staff.id;

      // uygun data varsa select clasin elave etmek ve silmek
      if (confirmData.staff_id !== null) {
        this.classList.add("selected");
      } else {
        this.classList.remove("selected");
      }

      // eger secilibse nexte step funcun elave etmek
      nextButton.onclick = confirmData.staff_id !== null ? nextStep : null;
    });

    updateConfirmationDetails();

    staffContentElement.appendChild(staffElement);
  });
}

function generateServicesContent() {
  const servicesContentElement = document.getElementById("servicesContent");
  const nextButton = document.getElementById("nextButton");

  // Hizmet verilerini dönerek içerik oluştur
  services.forEach((service) => {
    const serviceElement = document.createElement("div");
    serviceElement.classList.add("service-item");

    serviceElement.innerHTML = `
      <img src="${service.image}" alt="${service.name}">
      <div class="service-details">
        <h3>${service.name}</h3>
        <p>Duration: ${service.duration}</p>
        </div>
        <p class="service-price">${service.price}$</p>
    `;

    serviceElement.addEventListener("click", function () {
      // Seçili hizmeti güncelle ve border rengini değiştir
      const selectedService = document.querySelector(".service-item.selected");
      if (selectedService) {
        selectedService.classList.remove("selected");
      }
      // confirmdatani guncellemek
      confirmData.service_id = service.id;
      confirmData.price = service.price;

      // uygun data varsa select clasin elave etmek ve silmek
      if (confirmData.service_id !== null) {
        this.classList.add("selected");
      } else {
        this.classList.remove("selected");
      }
      // eger secilibse nexte step funcun elave etmek
      nextButton.onclick = confirmData.service_id !== null ? nextStep : null;

      updateConfirmationDetails();
    });

    servicesContentElement.appendChild(serviceElement);
  });
}

// date time
function generateDateOptions() {
  const dateInput = document.createElement("input");
  const defaultDate = document.querySelector(".time");
  dateInput.type = "date";
  dateInput.name = "selectedDate";
  dateInput.id = "selectedDate";

  // Minimum ve maksimum tarih aralığını belirle
  dateInput.min = date[0];
  dateInput.max = date[date.length - 1];

  const dateOptionsContainer = document.getElementById("date-options");
  dateOptionsContainer.appendChild(dateInput);

  defaultDate.textContent = date[0];
  // Tarih değiştiğinde bir sonraki adıma geç
  dateInput.addEventListener("change", function () {
    confirmData.date = this.value;
    defaultDate.textContent = `${confirmData.date}`;
    updateConfirmationDetails();
  });
}

function generateTimeOptions() {
  const timeOptionsContainer = document.getElementById("time-options");

  time.forEach((timeValue) => {
    const timeInput = document.createElement("input");
    timeInput.type = "radio";
    timeInput.name = "selectedTime";
    timeInput.value = `${timeValue.startTime} - ${timeValue.endTime}`;

    const timeLabel = document.createElement("label");
    timeLabel.classList.add("radio-label");
    timeLabel.innerHTML = `
      <span>${timeValue.startTime}</span>
      <span>${timeValue.endTime}</span>
    `;
    timeLabel.appendChild(timeInput);

    timeOptionsContainer.appendChild(timeLabel);

    // Zaman seçildiğinde bir sonraki adıma geç
    timeInput.addEventListener("change", function () {
      confirmData.time = this.value;

      updateConfirmationDetails();
    });
  });
}

// formdaki verileri confirm dataya elave etmek
function updateConfirmDataFromForm() {
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  // inputun bos olub olmamagin yoxlayan funksiya
  const isNotEmpty = (input) => input.value.trim() !== "";
  if (
    isNotEmpty(nameInput) &&
    isNotEmpty(surnameInput) &&
    isNotEmpty(emailInput) &&
    isNotEmpty(phoneInput)
  ) {
    confirmData.customer = {
      name: nameInput.value,
      surname: surnameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
    };
    return true;
  } else {
    return false;
  }
}
// step 4 deki verileri ekrana  elave etmek
function updateConfirmationDetails() {
  const confirmStepDetailsStaff = document.getElementById(
    "confirm-step-details-staff"
  );
  const confirmStepDetailsServices = document.getElementById(
    "confirm-step-details-services"
  );
  const confirmStepDetailsDate = document.querySelector(
    "#confirm-step-details-date-time "
  );

  const confirmStepDetailsPrice = document.getElementById(
    "confirm-step-details-total-price"
  );
  const staff = staffs.find((staff) =>
    staff.id === confirmData.staff_id ? staff.name : "Not Selected"
  );
  const service = services.find((service) =>
    service.id === confirmData.service_id ? service.name : "Not Selected"
  );
  confirmStepDetailsStaff.innerHTML = `Staff: <span>${staff.name}</span>`;
  confirmStepDetailsServices.innerHTML = `Service: <span>${service.name}</span>`;
  confirmStepDetailsDate.innerHTML = `Date & Time: <span>${confirmData.date} / ${confirmData.time}</span>`;
  confirmStepDetailsPrice.innerHTML = `Total Price:  <span>$${confirmData.price}</span>`;
}

// toast funksiyasi
function launch_toast(desc) {
  var x = document.getElementById("toast");
  var spanDesc = document.querySelector(".toast-desc");
  spanDesc.textContent = desc;
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3500);
}

// sehife ilk yuklenende calisacaq funclar
document.addEventListener("DOMContentLoaded", function () {
  // ilk stepe yonlendirme
  showStep(1);

  generateStaffContent();
  generateServicesContent();
  generateDateOptions();
  generateTimeOptions();

  // butonlara event listener eklemek
  const nextButton = document.getElementById("nextButton");
  nextButton.onclick = nextStep;

  // Önceki adıma dönmek için geri düğmesine tıklama olayını ekleyin
  const prevButton = document.getElementById("prevButton");
  prevButton.onclick = prevStep;
});
