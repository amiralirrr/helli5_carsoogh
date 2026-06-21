const ADMIN_PASSWORD = "12345678";

const adminModal = document.getElementById("adminModal");
const adminPanel = document.getElementById("adminPanel");
const openAdminBtn = document.getElementById("openAdminBtn");
const closeAdminModal = document.getElementById("closeAdminModal");
const closeAdminPanel = document.getElementById("closeAdminPanel");
const adminLoginForm = document.getElementById("adminLoginForm");
const adminPasswordInput = document.getElementById("adminPassword");
const loginMessage = document.getElementById("loginMessage");

const createWorkshopForm = document.getElementById("createWorkshopForm");
const workshopNameInput = document.getElementById("workshopName");

const workshopsList = document.getElementById("workshopsList");
const adminWorkshopsList = document.getElementById("adminWorkshopsList");

function getWorkshops() {
  const data = localStorage.getItem("workshops_h5");
  return data ? JSON.parse(data) : [];
}

function saveWorkshops(workshops) {
  localStorage.setItem("workshops_h5", JSON.stringify(workshops));
}

function createDefaultData() {
  const workshops = getWorkshops();
  if (workshops.length === 0) {
    const sample = [
      {
        id: Date.now(),
        name: "کارسوق نمونه",
        registrations: []
      }
    ];
    saveWorkshops(sample);
  }
}

function renderWorkshops() {
  const workshops = getWorkshops();
  workshopsList.innerHTML = "";

  if (workshops.length === 0) {
    workshopsList.innerHTML = `<p class="empty-text">هنوز هیچ کارسوقی ایجاد نشده است.</p>`;
    return;
  }

  workshops.forEach((workshop) => {
    const card = document.createElement("div");
    card.className = "workshop-card";

    card.innerHTML = `
      <div class="badge">فعال</div>
      <h3>${workshop.name}</h3>
      <div class="workshop-meta">تعداد ثبت‌نام: ${workshop.registrations.length}</div>

      <form class="registerForm" data-id="${workshop.id}">
        <input type="text" name="studentName" placeholder="نام شما" required />
        <button type="submit" class="secondary-btn">ثبت نوبت</button>
      </form>
    `;

    workshopsList.appendChild(card);
  });

  document.querySelectorAll(".registerForm").forEach((form) => {
    form.addEventListener("submit", handleRegister);
  });
}

function renderAdminWorkshops() {
  const workshops = getWorkshops();
  adminWorkshopsList.innerHTML = "";

  if (workshops.length === 0) {
    adminWorkshopsList.innerHTML = `<p class="empty-text">هیچ کارسوقی وجود ندارد.</p>`;
    return;
  }

  workshops.forEach((workshop) => {
    const wrapper = document.createElement("div");
    wrapper.className = "admin-workshop-item";

    let regsHtml = "";
    if (workshop.registrations.length === 0) {
      regsHtml = `<p class="empty-text">هنوز کسی نوبت ثبت نکرده است.</p>`;
    } else {
      regsHtml = `
        <ol class="registrations-list">
          ${workshop.registrations.map((name) => `<li>${name}</li>`).join("")}
        </ol>
      `;
    }

    wrapper.innerHTML = `
      <h4>${workshop.name}</h4>
      <div class="workshop-meta">تعداد ثبت‌نام: ${workshop.registrations.length}</div>
      ${regsHtml}
      <div class="admin-actions">
        <button class="danger-btn delete-btn" data-id="${workshop.id}">حذف کارسوق</button>
      </div>
    `;

    adminWorkshopsList.appendChild(wrapper);
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", handleDeleteWorkshop);
  });
}

function handleRegister(e) {
  e.preventDefault();

  const workshopId = Number(e.target.dataset.id);
  const studentName = e.target.studentName.value.trim();

  if (!studentName) return;

  const workshops = getWorkshops();
  const workshop = workshops.find((w) => w.id === workshopId);

  if (!workshop) return;

  workshop.registrations.push(studentName);
  saveWorkshops(workshops);

  e.target.reset();
  renderWorkshops();
  renderAdminWorkshops();

  alert("نوبت شما با موفقیت ثبت شد.");
}

function handleDeleteWorkshop(e) {
  const id = Number(e.target.dataset.id);
  let workshops = getWorkshops();

  workshops = workshops.filter((w) => w.id !== id);
  saveWorkshops(workshops);

  renderWorkshops();
  renderAdminWorkshops();
}

openAdminBtn.addEventListener("click", () => {
  adminModal.classList.remove("hidden");
  loginMessage.textContent = "";
  adminPasswordInput.value = "";
});

closeAdminModal.addEventListener("click", () => {
  adminModal.classList.add("hidden");
});

closeAdminPanel.addEventListener("click", () => {
  adminPanel.classList.add("hidden");
});

adminLoginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const password = adminPasswordInput.value.trim();

  if (password === ADMIN_PASSWORD) {
    loginMessage.textContent = "ورود موفق بود.";
    loginMessage.classList.add("success");

    setTimeout(() => {
      adminModal.classList.add("hidden");
      adminPanel.classList.remove("hidden");
      renderAdminWorkshops();
    }, 500);
  } else {
    loginMessage.textContent = "رمز عبور اشتباه است.";
    loginMessage.classList.remove("success");
  }
});

createWorkshopForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = workshopNameInput.value.trim();
  if (!name) return;

  const workshops = getWorkshops();
  workshops.push({
    id: Date.now(),
    name,
    registrations: []
  });

  saveWorkshops(workshops);
  workshopNameInput.value = "";

  renderWorkshops();
  renderAdminWorkshops();
});

window.addEventListener("click", (e) => {
  if (e.target === adminModal) adminModal.classList.add("hidden");
  if (e.target === adminPanel) adminPanel.classList.add("hidden");
});

createDefaultData();
renderWorkshops();
renderAdminWorkshops();
