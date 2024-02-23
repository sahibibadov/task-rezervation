const steb = ["Staff", "Service", "Date & Time", "Confirmation"];

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

// Get the <span> element that closes the modal
let span = document.querySelector(".close");
span.addEventListener("click", function () {
  modal.classList.remove("open");
});
function openModal(title, color) {
  modal.classList.add("open");
  let desc = document.querySelector("#myModal .modal-desc");
  desc.textContent = title;
  desc.style.color = color;
}

let currentStep = 1;

function showStep(stepNumber) {
  for (let i = 1; i <= 4; i++) {
    const stepElement = document.getElementById("step" + i);

    stepElement.style.display = "none";

    document
      .querySelector('.step-link[data-step="' + i + '"]')
      .classList.remove("active", "completed");

    const stepLink = document.querySelector(
      '.step-link[data-step="' + i + '"]'
    );
    const stepLinkNumber = document.querySelector(
      '.step-link[data-step="' + i + '"] span'
    );
    const stepLinkIcon = document.querySelector(
      '.step-link[data-step="' + i + '"] i'
    );
    // Add an icon to the completed steps
    if (i < stepNumber) {
      const stepLink = document.querySelector(
        '.step-link[data-step="' + i + '"]'
      );

      stepLink.classList.add("completed");
    }
    if (i < stepNumber) {
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
  }

  document.getElementById("step" + stepNumber).style.display = "block";
  currentStep = stepNumber;

  document.getElementById("prevButton").style.display =
    currentStep === 1 ? "none" : "inline-block";

  const nextButton = document.getElementById("nextButton");
  if (currentStep === 4) {
    nextButton.innerHTML = "Confirm";
  } else {
    nextButton.innerHTML = "Next";
  }

  document
    .querySelector('.step-link[data-step="' + currentStep + '"]')
    .classList.add("active");
}

function prevStep() {
  if (currentStep > 1) {
    showStep(currentStep - 1);
  }
}

function nextStep() {
  let errorMessage = null;

  // ConfirmData boşsa, yani gerekli bilgiler tamamlanmamışsa uygun hata mesajını göster
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
  if (errorMessage === "add confirm") {
    openModal("Please, fill the all required fields!", "#F39C12");
    return;
  }
  if (errorMessage) {
    launch_toast(errorMessage);
    return;
  }

  if (currentStep < 4) {
    showStep(currentStep + 1);
  } else if (currentStep === 4) {
    openModal("Confirmation successfully completed!", "#38CF78");

    // ConfirmData'yi logla ve sayfayı yenile
    console.log(confirmData);

    // Formu sıfırla ve ilk adıma geç
    resetForm();
  }
}

// ConfirmData'yi logla ve içini boşalt

// ConfirmData'nın geçerli olup olmadığını kontrol et
function confirmDataIsValid() {
  switch (currentStep) {
    case 1:
      return confirmData.staff_id !== null;
    case 2:
      return confirmData.service_id !== null;
    case 3:
      return confirmData.date !== null && confirmData.time !== null;
    case 4:
      // Diğer kontrolleri buraya ekleyebilirsiniz
      return updateConfirmDataFromForm();
    default:
      return false;
  }
}

function resetForm() {
  // İlk adıma geç
  showStep(1);

  // Tüm active ve selected class'ları temizle
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
  // Onay ayrıntılarını güncelle
  updateConfirmationDetails();
}

// add staff
function generateStaffContent() {
  const staffContentElement = document.getElementById("staffContent");
  const nextButton = document.getElementById("nextButton");

  // Staff verilerini dönerek içerik oluştur
  staffs.forEach((staff) => {
    const staffElement = document.createElement("div");
    staffElement.classList.add("staff-item");

    const staffImageElement = document.createElement("img");
    staffImageElement.src = staff.image;
    staffImageElement.alt = staff.name;

    const staffInfoElement = document.createElement("div");
    staffInfoElement.classList.add("staff-info");

    const staffNameElement = document.createElement("h3");
    staffNameElement.textContent = staff.name;

    const staffEmailElement = document.createElement("p");
    staffEmailElement.textContent = staff.email;

    staffInfoElement.appendChild(staffNameElement);
    staffInfoElement.appendChild(staffEmailElement);

    staffElement.appendChild(staffImageElement);
    staffElement.appendChild(staffInfoElement);

    staffElement.addEventListener("click", function () {
      // Seçili staff'ı güncelle ve border rengini değiştir
      const selectedStaff = document.querySelector(".staff-item.selected");
      if (selectedStaff) {
        selectedStaff.classList.remove("selected");
      }

      confirmData.staff_id = staff.id;
      if (confirmData.staff_id !== null) {
        this.classList.add("selected");
      } else {
        this.classList.remove("selected");
      }
      if (confirmData.staff_id == null) {
        nextButton.onclick = null;
      }

      if (confirmData.staff_id !== null) {
        nextButton.onclick = nextStep;
      }
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

    const serviceDetailsElement = document.createElement("div");
    serviceDetailsElement.classList.add("service-details");

    const serviceImageElement = document.createElement("img");
    serviceImageElement.src = service.image;
    serviceImageElement.alt = service.name;

    const serviceNameElement = document.createElement("h3");
    serviceNameElement.textContent = service.name;

    const serviceDurationElement = document.createElement("p");
    serviceDurationElement.textContent = `Duration: ${service.duration}`;

    const servicePriceElement = document.createElement("p");
    servicePriceElement.textContent = `${service.price}$`;
    servicePriceElement.classList.add("service-price");

    serviceElement.appendChild(serviceImageElement);
    serviceElement.appendChild(serviceDetailsElement);
    serviceDetailsElement.appendChild(serviceNameElement);
    serviceDetailsElement.appendChild(serviceDurationElement);
    serviceElement.appendChild(servicePriceElement);

    serviceElement.addEventListener("click", function () {
      // Seçili hizmeti güncelle ve border rengini değiştir
      const selectedService = document.querySelector(".service-item.selected");
      if (selectedService) {
        selectedService.classList.remove("selected");
      }

      confirmData.service_id = service.id;
      confirmData.price = service.price;
      if (confirmData.service_id !== null) {
        this.classList.add("selected");
      } else {
        this.classList.remove("selected");
      }

      if (confirmData.service_id == null) {
        nextButton.onclick = null;
      }
      if (confirmData.service_id !== null) {
        nextButton.onclick = nextStep;
      }
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
    timeLabel.innerHTML = `<span>${timeValue.startTime}</span><span>${timeValue.endTime}</span>`;
    timeLabel.appendChild(timeInput);

    timeOptionsContainer.appendChild(timeLabel);

    // Zaman seçildiğinde bir sonraki adıma geç
    timeInput.addEventListener("change", function () {
      confirmData.time = this.value;

      updateConfirmationDetails();
    });
  });
}

function updateConfirmDataFromForm() {
  const nameInput = document.getElementById("name");
  const surnameInput = document.getElementById("surname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  if (
    nameInput.value !== "" &&
    surnameInput.value !== "" &&
    emailInput.value !== "" &&
    phoneInput.value !== ""
  ) {
    confirmData.customer.name = nameInput.value;
    confirmData.customer.surname = surnameInput.value;
    confirmData.customer.email = emailInput.value;
    confirmData.customer.phone = phoneInput.value;
    return true;
  } else {
    return false;
  }
}

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
  confirmStepDetailsDate.innerHTML = `Date: <span>${confirmData.date} / ${confirmData.time}</span>`;

  confirmStepDetailsPrice.innerHTML = `Total Price:  <span>$${confirmData.price}</span>`;
}

// toast
function launch_toast(desc) {
  var x = document.getElementById("toast");
  var spanDesc = document.querySelector(".toast-desc");
  spanDesc.textContent = desc;
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 3500);
}

document.addEventListener("DOMContentLoaded", function () {
  showStep(1);
  document.getElementById("prevButton").style.display = "none";
  document.querySelector('.step-link[data-step="1"]').classList.add("active");

  generateStaffContent();
  generateServicesContent();
  generateDateOptions();
  generateTimeOptions();

  const nextButton = document.getElementById("nextButton");
  const prevButton = document.getElementById("prevButton");
  const dateInput = document.querySelector("#selectedDate");

  nextButton.onclick = nextStep;
  prevButton.onclick = prevStep;
});
