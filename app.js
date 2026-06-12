/* ==========================================================================
   Akıllı Aile Bütçesi - Ana İş Mantığı (Core App Controller)
   ========================================================================== */

// varsayılan bütçe durum şablonu (Kullanıcı ilk açtığında wow etkisi yaratacak hazır veriler)
// Demo verileri (Kullanıcı dilediğinde sistemi doldurabilmesi için)
const DEMO_DATA_STATE = {
    profiles: [
        { id: "p1", name: "Faruk", role: "Ebeveyn", avatar: "fa-user-tie", balanceContribution: 32000, pin: "1234", points: 350, badges: ["Bütçe Koruyucusu", "Kumbara Ortağı"] },
        { id: "p2", name: "Ayşe", role: "Ebeveyn", avatar: "fa-user-nurse", balanceContribution: 18000, pin: "5678", points: 280, badges: ["Bütçe Koruyucusu"] },
        { id: "p3", name: "Can", role: "Çocuk", avatar: "fa-user-astronaut", balanceContribution: 250, pin: "", points: 150, badges: ["Görev Canavarı"] }
    ],
    activeProfileId: "p1",
    transactions: [
        { id: "t1", desc: "Aylık Maaş - Faruk", amount: 45000, type: "income", category: "Maaş", date: "2026-06-01", memberId: "p1", isRecurring: true },
        { id: "t2", desc: "Aylık Maaş - Ayşe", amount: 25000, type: "income", category: "Maaş", date: "2026-06-01", memberId: "p2", isRecurring: true },
        { id: "t3", desc: "Ev Kirası", amount: 18000, type: "expense", category: "Kira", date: "2026-06-02", memberId: "p1", isRecurring: true },
        { id: "t4", desc: "Migros Market Alışverişi", amount: 4500, type: "expense", category: "Market", date: "2026-06-05", memberId: "p2", isRecurring: false },
        { id: "t5", desc: "Elektrik Faturası", amount: 950, type: "expense", category: "Fatura", date: "2026-06-08", memberId: "p1", isRecurring: false },
        { id: "t6", desc: "Su Faturası", amount: 350, type: "expense", category: "Fatura", date: "2026-06-08", memberId: "p1", isRecurring: false },
        { id: "t7", desc: "İnternet Aboneliği", amount: 300, type: "expense", category: "Fatura", date: "2026-06-02", memberId: "p1", isRecurring: true },
        { id: "t8", desc: "Netflix Aboneliği", amount: 229, type: "expense", category: "Abonelik", date: "2026-06-03", memberId: "p2", isRecurring: true },
        { id: "t9", desc: "Spotify Premium", amount: 79, type: "expense", category: "Abonelik", date: "2026-06-03", memberId: "p2", isRecurring: true },
        { id: "t10", desc: "Benzin - Shell", amount: 1500, type: "expense", category: "Ulaşım", date: "2026-06-10", memberId: "p1", isRecurring: false }
    ],
    debts: [
        { id: "d1", title: "Mortgage Ev Kredisi", creditor: "Garanti BBVA", totalAmount: 180000, interestRate: 12.0, minPayment: 8500 },
        { id: "d2", title: "Taşıt Kredisi", creditor: "Yapı Kredi", totalAmount: 60000, interestRate: 18.0, minPayment: 5000 },
        { id: "d3", title: "Elden Borç (Enişte)", creditor: "Ahmet Enişte", totalAmount: 10000, interestRate: 0.0, minPayment: 2000 }
    ],
    goals: [
        { id: "g1", title: "PlayStation 5 Pro", cost: 28000, memberId: "p3" },
        { id: "g2", title: "Yaz Tatili (Bodrum)", cost: 60000, memberId: "p1" }
    ],
    scenarios: [
        { id: "s1", name: "Kira Artışı (%50)", type: "expense", amount: 9000, duration: 12, startMonth: 2, active: false }
    ],
    tasks: [
        { id: "tk1", title: "Haftalık 2 Kitap Okumak", reward: 80, assignedTo: "p3", status: "completed" },
        { id: "tk2", title: "Odasını Düzenli Toplamak", reward: 50, assignedTo: "p3", status: "review" },
        { id: "tk3", title: "Akşam Sofra Kurumuna Yardım", reward: 30, assignedTo: "p3", status: "pending" }
    ],
    categoryLimits: {
        "Market": 8000,
        "Fatura": 3000,
        "Kira": 25000,
        "Ulaşım": 4000,
        "Abonelik": 1000,
        "Eğitim": 5000,
        "Sağlık": 3000,
        "Giyim": 5000,
        "Diğer": 2000
    }
};

// Temiz Başlangıç Durumu
const DEFAULT_STATE = {
    account: null, // { email, password }
    profiles: [],
    activeProfileId: null,
    transactions: [],
    debts: [],
    goals: [],
    scenarios: [],
    tasks: [],
    onboardingCompleted: false,
    categoryLimits: {
        "Market": 8000,
        "Fatura": 3000,
        "Kira": 25000,
        "Ulaşım": 4000,
        "Abonelik": 1000,
        "Eğitim": 5000,
        "Sağlık": 3000,
        "Giyim": 5000,
        "Diğer": 2000
    }
};

// Global Uygulama Durum Değişkenleri
let state = null;
let selectedProfileForPinId = null;
let enteredPin = "";

// İnteraktif Tur Adımları
const tourSteps = [
    { target: ".sidebar-nav", title: "Menü ve Gezinme", text: "Buradan Bütçe Paneli, Gelir/Gider geçmişi, Borç Stratejileri ve Karar Simülatörü sayfaları arasında geçiş yapabilirsiniz.", position: "right" },
    { target: ".header-summary-card", title: "Ortak Bakiye", text: "Ailenizin ortak bütçesindeki toplam parayı buradan anlık takip edebilirsiniz.", position: "bottom" },
    { target: ".profile-widget", title: "Profil Değiştirici", text: "Eşiniz veya çocuklarınızın hesapları arasında şık ve güvenli PIN kodlarıyla buradan geçiş yapabilirsiniz.", position: "right" },
    { target: "#demoDataAlert", title: "Demo Veri Yükle", text: "Sisteminiz şu an tamamen temiz. Uygulamanın tüm özelliklerini doldurulmuş grafiklerle görmek için bu butona basarak demo verilerini hemen yükleyebilirsiniz!", position: "bottom" }
];
let currentTourStep = 0;

// ==========================================================================
// UYGULAMA BAŞLANGICI VE LOAD İŞLEMLERİ
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

function initApp() {
    const storedState = localStorage.getItem("smart_budget_state");
    if (storedState) {
        try {
            state = JSON.parse(storedState);
        } catch (e) {
            console.error("State parse hatası, varsayılan yükleniyor...", e);
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    } else {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState();
    }

    // Tarih inputunu bugün yap
    const dateInput = document.getElementById("transDate");
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Event Dinleyicilerini Bağla
    bindEvents();

    // Hoş geldiniz ekranı & Giriş akışını kontrol et
    checkWelcomeFlow();
}

function checkWelcomeFlow() {
    const overlay = document.getElementById("welcomeOverlay");
    
    if (!state.account) {
        // Adım 1: Kayıt / Giriş Ekranı
        overlay.style.display = "flex";
        document.getElementById("welcomeAuthScreen").style.display = "block";
        document.getElementById("welcomeProfileSetupScreen").style.display = "none";
    } else if (state.profiles.length === 0) {
        // Adım 2: Profil Kurulum Ekranı
        overlay.style.display = "flex";
        document.getElementById("welcomeAuthScreen").style.display = "none";
        document.getElementById("welcomeProfileSetupScreen").style.display = "block";
        renderSetupProfilesList();
    } else {
        // Adım 3: Sitemizi Göster
        overlay.style.display = "none";
        
        // Eğer aktif profil yoksa profil seçme modalını zorunlu aç
        if (!state.activeProfileId) {
            openModal("profileSelectorModal");
        } else {
            updateUI();
            
            // Eğer tanıtım turu tamamlanmadıysa başlat (Sadece Ebeveyn için)
            const activeProfile = getActiveProfile();
            if (!state.onboardingCompleted && activeProfile && activeProfile.role === "Ebeveyn") {
                setTimeout(() => {
                    startOnboardingTour();
                }, 1000);
            }
        }
    }
}

function saveState() {
    localStorage.setItem("smart_budget_state", JSON.stringify(state));
}

// ==========================================================================
// EVENT LISTENERS & DOM ETKİLEŞİMLERİ
// ==========================================================================
function bindEvents() {
    // Sekme Değiştirme (Sidebar Nav)
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            
            const tabName = item.getAttribute("data-tab");
            switchTab(tabName);
        });
    });

    // Profil Değiştirme Butonu (Sidebar)
    document.getElementById("switchProfileBtn").addEventListener("click", () => {
        openModal("profileSelectorModal");
    });

    // Profil Ekleme Formu Açma
    document.getElementById("openAddProfileBtn").addEventListener("click", () => {
        openModal("addProfileModal");
    });

    // Yeni Profil Kaydetme
    document.getElementById("profileForm").addEventListener("submit", (e) => {
        e.preventDefault();
        addNewProfile();
    });

    // İşlem Kaydetme Formu
    document.getElementById("transactionForm").addEventListener("submit", (e) => {
        e.preventDefault();
        saveTransaction();
    });

    // Otomatik Kategori Eşleme Analizcisi
    document.getElementById("transDesc").addEventListener("input", (e) => {
        suggestCategory(e.target.value);
    });

    // Borç Ekleme Formu
    document.getElementById("debtForm").addEventListener("submit", (e) => {
        e.preventDefault();
        saveDebt();
    });

    // Hedef Modalını Aç
    document.getElementById("openAddGoalModalBtn").addEventListener("click", () => {
        openModal("addGoalModal");
    });

    // Hedef Kaydetme Formu
    document.getElementById("goalForm").addEventListener("submit", (e) => {
        e.preventDefault();
        saveGoal();
    });

    // Senaryo Modalı Aç
    document.getElementById("openAddScenarioModalBtn").addEventListener("click", () => {
        openModal("addScenarioModal");
    });

    // Senaryo Kaydetme Formu
    document.getElementById("scenarioForm").addEventListener("submit", (e) => {
        e.preventDefault();
        saveScenario();
    });

    // Çocuk Görevi Ekleme Modalı Aç
    document.getElementById("openAddTaskModalBtn").addEventListener("click", () => {
        openModal("addTaskModal");
    });

    // Çocuk Görevi Ekleme Formu
    document.getElementById("taskForm").addEventListener("submit", (e) => {
        e.preventDefault();
        saveTask();
    });

    // Borç Stratejisi Değiştirme (Snowball vs Avalanche)
    document.querySelectorAll("input[name='debtStrategy']").forEach(radio => {
        radio.addEventListener("change", () => {
            renderDebts();
        });
    });

    // Karar Simülatörü Slider Değişimleri
    const sliderInflation = document.getElementById("sliderInflation");
    const sliderSavings = document.getElementById("sliderSavings");
    
    sliderInflation.addEventListener("input", (e) => {
        document.getElementById("sliderInflationVal").innerText = e.target.value + "%";
        updateSandboxCharts();
    });

    sliderSavings.addEventListener("input", (e) => {
        document.getElementById("sliderSavingsVal").innerText = formatCurrency(e.target.value);
        updateSandboxCharts();
        renderWishlistAssistant();
    });

    // Dashboard "Tümünü Gör" Butonu
    document.getElementById("goToTransactionsBtn").addEventListener("click", () => {
        document.querySelector("[data-tab='transactions']").click();
    });

    // Ortak Gider Sıfırlama (Mahsuplaşma) Butonu
    document.getElementById("settleBalancesBtn").addEventListener("click", () => {
        settleSharedBalances();
    });

    // Modalları Kapatma Butonları
    document.querySelectorAll(".close-modal-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            closeModal(btn.getAttribute("data-modal"));
        });
    });

    // İşlem Listesi Filtreleme Değişiklikleri
    document.getElementById("filterMember").addEventListener("change", renderTransactions);
    document.getElementById("filterCategory").addEventListener("change", renderTransactions);
    document.getElementById("filterType").addEventListener("change", renderTransactions);

    // PIN Klavye Numpad Tıklamaları
    document.querySelectorAll(".num-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const val = btn.getAttribute("data-val");
            handlePinInput(val);
        });
    });

    // Geri Butonu (PIN Ekranından Profil Seçimine)
    document.getElementById("backToProfilesBtn").addEventListener("click", () => {
        showProfileSelectScreen();
    });

    // === HOŞ GELDİNİZ, KAYIT & PROFİL KURULUMU EVENT BINDINGS ===
    const tabRegister = document.getElementById("tabRegister");
    const tabLogin = document.getElementById("tabLogin");
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    
    if (tabRegister && tabLogin) {
        tabRegister.addEventListener("change", () => {
            registerForm.style.display = "block";
            loginForm.style.display = "none";
        });
        tabLogin.addEventListener("change", () => {
            registerForm.style.display = "none";
            loginForm.style.display = "block";
        });
    }

    document.getElementById("registerForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPass").value;
        
        // Eski sürümden kalan localStorage profillerini ve bütçe kalıntılarını tamamen sıfırla
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        state.account = { email, password };
        saveState();
        
        document.getElementById("regEmail").value = "";
        document.getElementById("regPass").value = "";
        
        checkWelcomeFlow();
    });

    document.getElementById("loginForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("logEmail").value.trim();
        const password = document.getElementById("logPass").value;
        
        if (state.account && state.account.email === email && state.account.password === password) {
            checkWelcomeFlow();
        } else {
            alert("E-posta veya şifre hatalı! Lütfen tekrar deneyiniz.");
        }
    });

    document.getElementById("setupProfileForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("setupProfName");
        const roleInput = document.getElementById("setupProfRole");
        const pinInput = document.getElementById("setupProfPin");
        const avatarInput = document.querySelector("input[name='setupAvatar']:checked");
        
        const newProfile = {
            id: "p_" + Date.now(),
            name: nameInput.value.trim(),
            role: roleInput.value,
            pin: pinInput.value.trim(),
            avatar: avatarInput ? avatarInput.value : "fa-user-tie",
            balanceContribution: 0 // Temiz başlangıç
        };
        
        state.profiles.push(newProfile);
        saveState();
        
        nameInput.value = "";
        pinInput.value = "";
        
        renderSetupProfilesList();
    });

    document.getElementById("finishSetupBtn").addEventListener("click", () => {
        if (state.profiles.length > 0) {
            state.activeProfileId = state.profiles[0].id;
            saveState();
            
            document.getElementById("welcomeOverlay").style.display = "none";
            updateUI();
            
            if (!state.onboardingCompleted) {
                setTimeout(() => {
                    startOnboardingTour();
                }, 1000);
            }
        }
    });

    // === ONBOARDING TOUR EVENT BINDINGS ===
    document.getElementById("nextTourBtn").addEventListener("click", () => {
        currentTourStep++;
        if (currentTourStep < tourSteps.length) {
            showTourStep(currentTourStep);
        } else {
            endTour();
        }
    });

    document.getElementById("skipTourBtn").addEventListener("click", () => {
        endTour();
    });

    // === DEMO VERİLERİNİ YÜKLEME DINLEYICISI ===
    const loadDemoBtn = document.getElementById("loadDemoDataBtn");
    if (loadDemoBtn) {
        loadDemoBtn.addEventListener("click", () => {
            loadDemoData();
        });
    }

    // === KATEGORİ LİMİTLERİ YÖNETİMİ DINLEYICILERI ===
    const openManageLimitsBtn = document.getElementById("openManageLimitsBtn");
    if (openManageLimitsBtn) {
        openManageLimitsBtn.addEventListener("click", () => {
            renderManageLimitsForm();
            openModal("manageLimitsModal");
        });
    }

    const categoryLimitsForm = document.getElementById("categoryLimitsForm");
    if (categoryLimitsForm) {
        categoryLimitsForm.addEventListener("submit", (e) => {
            e.preventDefault();
            saveCategoryLimits();
        });
    }
}

// ==========================================================================
// KURULUM OVERLAY PROFİL LİSTELEYİCİ VE YARDIMCI METOTLAR
// ==========================================================================
function renderSetupProfilesList() {
    const list = document.getElementById("addedSetupProfilesList");
    const finishBtn = document.getElementById("finishSetupBtn");
    if (!list) return;
    
    list.innerHTML = "";
    
    if (state.profiles.length === 0) {
        list.innerHTML = `<p class="text-muted text-center py-2" style="font-size: 13px;">Henüz hiç üye eklenmedi. Lütfen en az 1 üye ekleyin.</p>`;
        if (finishBtn) finishBtn.disabled = true;
        return;
    }
    
    state.profiles.forEach(p => {
        const item = document.createElement("div");
        item.className = "setup-profile-item glass-card";
        item.style.display = "flex";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";
        item.style.padding = "10px 14px";
        item.style.marginBottom = "8px";
        item.style.borderRadius = "var(--border-radius-md)";
        item.style.background = "rgba(255,255,255,0.03)";
        item.style.border = "1px solid var(--border-color)";
        item.style.width = "100%";
        
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div class="active-profile-avatar" style="width: 36px; height: 36px; font-size: 14px;">
                    <i class="fa-solid ${p.avatar}"></i>
                </div>
                <div>
                    <h5 style="margin: 0; font-size: 14px;">${p.name}</h5>
                    <small class="text-muted" style="font-size: 11px;">${p.role} ${p.pin ? '(PIN\'li)' : ''}</small>
                </div>
            </div>
            <button class="delete-row-btn" onclick="removeSetupProfile('${p.id}')" title="Üyeyi Sil">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;
        list.appendChild(item);
    });
    
    if (finishBtn) finishBtn.disabled = false;
}

function removeSetupProfile(profileId) {
    const idx = state.profiles.findIndex(p => p.id === profileId);
    if (idx !== -1) {
        state.profiles.splice(idx, 1);
        saveState();
        renderSetupProfilesList();
    }
}
window.removeSetupProfile = removeSetupProfile;

// ==========================================================================
// INTERAKTIF TANITIM TURU (ONBOARDING TOOLTIP) SİSTEMİ
// ==========================================================================
function startOnboardingTour() {
    currentTourStep = 0;
    showTourStep(currentTourStep);
}

function showTourStep(idx) {
    const tooltip = document.getElementById("onboardingTooltip");
    if (!tooltip) return;
    
    if (idx < 0 || idx >= tourSteps.length) {
        endTour();
        return;
    }
    
    const step = tourSteps[idx];
    const targetEl = document.querySelector(step.target);
    
    if (!targetEl || targetEl.offsetParent === null) {
        currentTourStep++;
        if (currentTourStep < tourSteps.length) {
            showTourStep(currentTourStep);
        } else {
            endTour();
        }
        return;
    }
    
    document.getElementById("tourTitle").innerText = step.title;
    document.getElementById("tourText").innerText = step.text;
    
    const nextBtn = document.getElementById("nextTourBtn");
    if (idx === tourSteps.length - 1) {
        nextBtn.innerHTML = `Turu Bitir <i class="fa-solid fa-check"></i>`;
    } else {
        nextBtn.innerHTML = `İleri <i class="fa-solid fa-arrow-right"></i>`;
    }
    
    tooltip.style.display = "block";
    tooltip.style.position = "absolute";
    
    const targetRect = targetEl.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    tooltip.classList.remove("arrow-top", "arrow-bottom", "arrow-left", "arrow-right");
    
    let top = 0;
    let left = 0;
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;
    
    if (step.position === "right") {
        top = targetRect.top + scrollY + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.right + scrollX + 12;
        tooltip.classList.add("arrow-left");
    } else if (step.position === "bottom") {
        top = targetRect.bottom + scrollY + 12;
        left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
        tooltip.classList.add("arrow-top");
    } else if (step.position === "top") {
        top = targetRect.top + scrollY - tooltipRect.height - 12;
        left = targetRect.left + scrollX + (targetRect.width / 2) - (tooltipRect.width / 2);
        tooltip.classList.add("arrow-bottom");
    } else if (step.position === "left") {
        top = targetRect.top + scrollY + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.left + scrollX - tooltipRect.width - 12;
        tooltip.classList.add("arrow-right");
    }
    
    if (left < 0) left = 10;
    if (left + tooltipRect.width > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - 10;
    }
    if (top < 0) top = 10;
    
    tooltip.style.top = top + "px";
    tooltip.style.left = left + "px";
}

function endTour() {
    const tooltip = document.getElementById("onboardingTooltip");
    if (tooltip) {
        tooltip.style.display = "none";
    }
    state.onboardingCompleted = true;
    saveState();
}

// ==========================================================================
// DEMO VERİLERİNİ YÜKLEME SİSTEMİ
// ==========================================================================
function loadDemoData() {
    const confirmLoad = confirm("Uygulamayı dolu verilerle hızlıca test etmek için demo verilerini yüklemek istiyor musunuz?");
    if (confirmLoad) {
        const currentAccount = state.account;
        state = JSON.parse(JSON.stringify(DEMO_DATA_STATE));
        state.account = currentAccount;
        state.onboardingCompleted = true;
        saveState();
        updateUI();
        
        const tooltip = document.getElementById("onboardingTooltip");
        if (tooltip) tooltip.style.display = "none";
        
        alert("Demo verileri başarıyla yüklendi!");
    }
}

// ==========================================================================
// SEKME YÖNETİMİ
// ==========================================================================
function switchTab(tabName) {
    document.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));
    const activePanel = document.getElementById(tabName + "Panel");
    if (activePanel) {
        activePanel.classList.add("active");
    }

    const titleMap = {
        dashboard: { title: "Finansal Durum", subtitle: "Ailenizin anlık finansal durum özeti ve analizleri." },
        transactions: { title: "Gelir & Giderler", subtitle: "Tüm aile bireylerinin gelir ve harcama kayıtları." },
        debts: { title: "Borç & Taksit Takibi", subtitle: "Borçlarınızı akıllı ödeme stratejileriyle yönetin." },
        sandbox: { title: "Karar Simülatörü", subtitle: "Finansal kararlar almadan önce gelecek bütçenizi simüle edin." },
        kidzone: { title: "Çocuk Dünyası", subtitle: "Görevlerinizi tamamlayarak harçlık biriktirin ve bütçenizi yönetin." }
    };

    if (titleMap[tabName]) {
        document.getElementById("tabTitle").innerText = titleMap[tabName].title;
        document.getElementById("tabSubtitle").innerText = titleMap[tabName].subtitle;
    }

    // Grafiklerin tekrar düzgün çizilmesini sağlamak için tetikleme yapalım
    if (tabName === "dashboard") {
        renderDashboardCharts();
    } else if (tabName === "sandbox") {
        updateSandboxCharts();
        renderWishlistAssistant();
    }
}

// ==========================================================================
// MODAL İŞLEMLERİ
// ==========================================================================
function openModal(modalId) {
    document.getElementById(modalId).classList.add("show");
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove("show");
}

// ==========================================================================
// PROFİL YÖNETİMİ & GİRİŞ MODU
// ==========================================================================
function getActiveProfile() {
    return state.profiles.find(p => p.id === state.activeProfileId) || state.profiles[0];
}

function renderProfiles() {
    const activeProfile = getActiveProfile();
    
    // Sidebar'daki aktif profili güncelle
    document.getElementById("activeProfileName").innerText = activeProfile.name;
    document.getElementById("activeProfileRole").innerText = activeProfile.role;
    
    const avatarContainer = document.getElementById("activeProfileAvatar");
    avatarContainer.innerHTML = `<i class="fa-solid ${activeProfile.avatar}"></i>`;

    // Rol sınıfını body elementine ekleyerek CSS üzerinden izin kontrollerini yapalım
    document.body.className = activeProfile.role === "Ebeveyn" ? "dark-theme role-parent" : "dark-theme role-child";

    // Profil Seçici Giriş Modalı Listesi
    const grid = document.getElementById("profileGrid");
    grid.innerHTML = "";
    
    state.profiles.forEach(p => {
        const card = document.createElement("div");
        card.className = "profile-card";
        if (p.id === state.activeProfileId) card.classList.add("active-border");
        
        card.innerHTML = `
            <div class="profile-avatar"><i class="fa-solid ${p.avatar}"></i></div>
            <span>${p.name}</span>
            <small>${p.role}</small>
        `;
        
        card.addEventListener("click", () => {
            selectProfile(p.id);
        });
        
        grid.appendChild(card);
    });

    // Formlardaki profil seçeneklerini güncelle
    updateProfileDropdowns();
}

function selectProfile(profileId) {
    const profile = state.profiles.find(p => p.id === profileId);
    if (profile && profile.pin && profile.pin.trim() !== "") {
        // PIN ekranını aç
        selectedProfileForPinId = profileId;
        enteredPin = "";
        updatePinDots();
        document.getElementById("pinScreenTitle").innerText = `Giriş Yap: ${profile.name}`;
        document.getElementById("profileSelectScreen").style.display = "none";
        document.getElementById("profilePinScreen").style.display = "block";
    } else {
        // Şifresiz giriş yap
        finalizeProfileSelection(profileId);
    }
}

function showProfileSelectScreen() {
    selectedProfileForPinId = null;
    enteredPin = "";
    document.getElementById("profilePinScreen").style.display = "none";
    document.getElementById("profileSelectScreen").style.display = "block";
}

function finalizeProfileSelection(profileId) {
    state.activeProfileId = profileId;
    saveState();
    closeModal("profileSelectorModal");
    
    // UI ve ekran geçişi sıfırlama
    showProfileSelectScreen();
    
    renderProfiles();
    updateUI();

    const activeProfile = getActiveProfile();
    if (activeProfile.role === "Çocuk") {
        document.querySelector("[data-tab='kidzone']").click();
    } else {
        document.querySelector("[data-tab='dashboard']").click();
        
        // Ebeveyn girişi sonrası eğer tanıtım turu tamamlanmadıysa başlat
        if (!state.onboardingCompleted) {
            setTimeout(() => {
                startOnboardingTour();
            }, 1000);
        }
    }
}

function handlePinInput(val) {
    if (!selectedProfileForPinId) return;
    const profile = state.profiles.find(p => p.id === selectedProfileForPinId);
    if (!profile) return;

    if (val === "clear") {
        enteredPin = "";
    } else if (val === "backspace") {
        enteredPin = enteredPin.slice(0, -1);
    } else {
        if (enteredPin.length < 4) {
            enteredPin += val;
        }
    }

    updatePinDots();

    if (enteredPin.length === 4) {
        if (enteredPin === profile.pin) {
            // Başarılı giriş
            setTimeout(() => {
                finalizeProfileSelection(selectedProfileForPinId);
            }, 200);
        } else {
            // Hatalı PIN - salla ve sıfırla
            const pinDotsDiv = document.getElementById("pinDots");
            pinDotsDiv.classList.add("shake");
            
            setTimeout(() => {
                pinDotsDiv.classList.remove("shake");
                enteredPin = "";
                updatePinDots();
            }, 400);
        }
    }
}

function updatePinDots() {
    const dots = document.querySelectorAll("#pinDots .dot");
    dots.forEach((dot, idx) => {
        if (idx < enteredPin.length) {
            dot.classList.add("filled");
        } else {
            dot.classList.remove("filled");
        }
    });
}

function addNewProfile() {
    const nameInput = document.getElementById("profName");
    const roleInput = document.getElementById("profRole");
    const pinInput = document.getElementById("profPin");
    const avatarInput = document.querySelector("input[name='avatar']:checked");

    const newProfile = {
        id: "p_" + Date.now(),
        name: nameInput.value.trim(),
        role: roleInput.value,
        pin: pinInput.value.trim(),
        avatar: avatarInput.value,
        balanceContribution: roleInput.value === "Çocuk" ? 0 : 5000 // başlangıç simülasyon bakiyesi
    };

    state.profiles.push(newProfile);
    saveState();

    nameInput.value = "";
    pinInput.value = "";
    closeModal("addProfileModal");
    renderProfiles();
}

function updateProfileDropdowns() {
    const selectMember = document.getElementById("transMember");
    const goalMember = document.getElementById("goalMember");
    const taskAssignedTo = document.getElementById("taskAssignedTo");
    
    if (selectMember) {
        selectMember.innerHTML = state.profiles
            .filter(p => p.role === "Ebeveyn")
            .map(p => `<option value="${p.id}">${p.name}</option>`)
            .join("");
    }
    
    if (goalMember) {
        goalMember.innerHTML = state.profiles
            .map(p => `<option value="${p.id}">${p.name}</option>`)
            .join("");
    }

    if (taskAssignedTo) {
        taskAssignedTo.innerHTML = state.profiles
            .filter(p => p.role === "Çocuk")
            .map(p => `<option value="${p.id}">${p.name}</option>`)
            .join("");
    }

    // Filtre dropdowns
    const filterMember = document.getElementById("filterMember");
    if (filterMember) {
        filterMember.innerHTML = `<option value="all">Tüm Üyeler</option>` + 
            state.profiles.map(p => `<option value="${p.id}">${p.name}</option>`).join("");
    }
}

// ==========================================================================
// HESAPLAMA MOTORU (BAKİYE & ORANLAR)
// ==========================================================================
function getFamilyBalance() {
    const activeProfile = getActiveProfile();
    
    if (activeProfile.role === "Çocuk") {
        // Çocuk sadece kendi kumbarasını görür
        return activeProfile.balanceContribution;
    }
    
    // Ebeveyn ortak bütçeyi (tüm ebeveynlerin bakiye katkısını) görür. Çocuk bakiyesi hariç.
    return state.profiles
        .filter(p => p.role === "Ebeveyn")
        .reduce((sum, p) => sum + p.balanceContribution, 0);
}

function calculateFinancials() {
    // Aylık gelir ve giderleri hesapla
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    // Normal ve her ay tekrarlayan işlemleri filtrele
    state.transactions.forEach(t => {
        // Aylık ortalamayı bulabilmek için o ayki işlemlere bakalım
        if (t.type === "income") {
            monthlyIncome += t.amount;
        } else {
            monthlyExpense += t.amount;
        }
    });

    // Toplam aktif borcu bul
    const totalDebt = state.debts.reduce((sum, d) => sum + d.totalAmount, 0);

    return { monthlyIncome, monthlyExpense, totalDebt };
}

// ==========================================================================
// GELİR & GIDER (TRANSACTIONS) YÖNETİMİ
// ==========================================================================
function saveTransaction() {
    const desc = document.getElementById("transDesc").value.trim();
    const category = document.getElementById("transCategory").value;
    const amount = parseFloat(document.getElementById("transAmount").value);
    const date = document.getElementById("transDate").value;
    const memberId = document.getElementById("transMember").value;
    const isRecurring = document.getElementById("transIsRecurring").checked;
    const type = document.querySelector("input[name='transType']:checked").value;

    const newTrans = {
        id: "t_" + Date.now(),
        desc,
        amount,
        type,
        category,
        date,
        memberId,
        isRecurring
    };

    // Kategori limiti aşım kontrolü
    if (type === "expense" && state.categoryLimits) {
        const limit = state.categoryLimits[category] || 0;
        if (limit > 0) {
            const currentMonth = new Date(date).getMonth();
            const currentYear = new Date(date).getFullYear();
            
            const totalSpent = state.transactions
                .filter(t => t.type === "expense" && t.category === category && new Date(t.date).getMonth() === currentMonth && new Date(t.date).getFullYear() === currentYear)
                .reduce((sum, t) => sum + t.amount, 0) + amount;
                
            if (totalSpent >= limit) {
                alert(`⚠️ DİKKAT: "${category}" bütçe limiti aşıldı! Limit: ${formatCurrency(limit)}, Toplam harcama: ${formatCurrency(totalSpent)}`);
            } else if (totalSpent >= limit * 0.8) {
                alert(`⚠️ UYARI: "${category}" bütçesi sınırda! Toplam harcama bütçenin %80'ine ulaştı. (${formatCurrency(totalSpent)} / ${formatCurrency(limit)})`);
            }
        }
    }

    // Aile bireyinin bakiye katkısını güncelle
    const member = state.profiles.find(p => p.id === memberId);
    if (member) {
        if (type === "income") {
            member.balanceContribution += amount;
        } else {
            member.balanceContribution -= amount;
        }
    }

    state.transactions.unshift(newTrans);
    
    // Oyunlaştırma puanı ekle
    awardPoints(memberId, type === "income" ? 10 : 5, type === "income" ? "Gelir Kaydetme" : "Gider Kaydetme");
    
    // Kumbara coin animasyonunu tetikle (Gelir ise)
    if (type === "income") {
        setTimeout(triggerCoinDrop, 100);
    }
    
    saveState();

    // Formu temizle
    document.getElementById("transDesc").value = "";
    document.getElementById("transAmount").value = "";
    document.getElementById("transIsRecurring").checked = false;

    updateUI();
}

function deleteTransaction(id) {
    const idx = state.transactions.findIndex(t => t.id === id);
    if (idx !== -1) {
        const trans = state.transactions[idx];
        
        // Üyenin bakiyesini ters işlemle geri al
        const member = state.profiles.find(p => p.id === trans.memberId);
        if (member) {
            if (trans.type === "income") {
                member.balanceContribution -= trans.amount;
            } else {
                member.balanceContribution += trans.amount;
            }
        }
        
        state.transactions.splice(idx, 1);
        saveState();
        updateUI();
    }
}

// Akıllı Kategori Eşleme Analizcisi
function suggestCategory(text) {
    const rules = [
        { keywords: ["migros", "carrefour", "bim", "a101", "şok", "market", "bakkal", "kasap", "manav", "yemek", "restoran", "cafe", "kahve", "lokanta"], category: "Market" },
        { keywords: ["elektrik", "su", "doğalgaz", "fatura", "turkcell", "vodafone", "telekom", "telefon", "internet", "d-smart", "digiturk"], category: "Fatura" },
        { keywords: ["kira", "ev", "aidat", "depozito"], category: "Kira" },
        { keywords: ["shell", "opet", "akaryakit", "benzin", "otobus", "metro", "taksi", "uber", "bilet", "otopark"], category: "Ulaşım" },
        { keywords: ["netflix", "spotify", "youtube", "premium", "disney", "prime", "oyun", "sinema", "tiyatro"], category: "Abonelik" },
        { keywords: ["okul", "kurs", "kitap", "kolej", "kırtasiye", "ders", "üniversite"], category: "Eğitim" },
        { keywords: ["hastane", "eczane", "ilac", "doktor", "muayene", "sağlık", "diş"], category: "Sağlık" },
        { keywords: ["koton", "zara", "lcw", "giyim", "ayakkabi", "elbise", "pantolon", "trendyol", "hepsiburada"], category: "Giyim" },
        { keywords: ["maas", "hakedis", "ek gelir", "prim", "avans", "kazanç"], category: "Maaş" },
        { keywords: ["faiz", "borsa", "kripto", "temettü", "altın", "fon"], category: "Yatırım Geliri" }
    ];

    const cleanText = text.toLowerCase();
    const select = document.getElementById("transCategory");
    const helper = document.getElementById("categorySuggestText");

    for (let rule of rules) {
        if (rule.keywords.some(kw => cleanText.includes(kw))) {
            select.value = rule.category;
            helper.innerHTML = `<i class="fa-solid fa-magic text-neon-cyan"></i> Otomatik tahmin edildi: <strong>${rule.category}</strong>`;
            
            // İşlem türünü otomatik ayarla
            const typeExpense = document.getElementById("typeExpense");
            const typeIncome = document.getElementById("typeIncome");
            if (rule.category === "Maaş" || rule.category === "Yatırım Geliri") {
                typeIncome.checked = true;
            } else {
                typeExpense.checked = true;
            }
            return;
        }
    }
    helper.innerHTML = "Kategori açıklamaya göre otomatik tahmin edilir.";
}

function renderTransactions() {
    const tbody = document.getElementById("transactionsTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const filterMember = document.getElementById("filterMember").value;
    const filterCategory = document.getElementById("filterCategory").value;
    const filterType = document.getElementById("filterType").value;

    const filtered = state.transactions.filter(t => {
        if (filterMember !== "all" && t.memberId !== filterMember) return false;
        if (filterCategory !== "all" && t.category !== filterCategory) return false;
        if (filterType !== "all" && t.type !== filterType) return false;
        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">Aramanıza uygun işlem bulunamadı.</td></tr>`;
        return;
    }

    // Kategorileri filtre dropdown'ına doldur (yalnızca mevcut olanları göstermek yerine standart listeyi de ekleyebiliriz)
    const categorySelect = document.getElementById("filterCategory");
    if (categorySelect.options.length <= 1) {
        const categories = [...new Set(state.transactions.map(t => t.category))];
        categories.forEach(cat => {
            const opt = document.createElement("option");
            opt.value = cat;
            opt.innerText = cat;
            categorySelect.appendChild(opt);
        });
    }

    filtered.forEach(t => {
        const tr = document.createElement("tr");
        const member = state.profiles.find(p => p.id === t.memberId);
        
        tr.innerHTML = `
            <td>${formatDate(t.date)}</td>
            <td><i class="fa-solid ${member ? member.avatar : 'fa-user'}"></i> ${member ? member.name : 'Silinmiş Üye'}</td>
            <td><span class="category-badge-text">${t.category}</span></td>
            <td>${t.desc} ${t.isRecurring ? '<i class="fa-solid fa-arrows-spin text-muted" title="Sabit Harcama"></i>' : ''}</td>
            <td class="${t.type === 'income' ? 'text-green' : 'text-red'} font-weight-bold">
                ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
            </td>
            <td>
                <button class="delete-row-btn" onclick="deleteTransaction('${t.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderRecentTransactions() {
    const list = document.getElementById("recentTransactionsList");
    if (!list) return;

    list.innerHTML = "";
    
    // Son 4 işlemi göster
    const recent = state.transactions.slice(0, 4);

    if (recent.length === 0) {
        list.innerHTML = `<p class="text-muted text-center py-3">Henüz kaydedilmiş bir işlem yok.</p>`;
        return;
    }

    recent.forEach(t => {
        const item = document.createElement("div");
        item.className = "transaction-item";
        
        const member = state.profiles.find(p => p.id === t.memberId);
        const iconClass = t.type === 'income' ? 'fa-circle-plus income' : 'fa-circle-minus expense';

        item.innerHTML = `
            <div class="item-left">
                <div class="category-badge ${t.type}">
                    <i class="fa-solid ${iconClass}"></i>
                </div>
                <div>
                    <h5 class="item-title">${t.desc}</h5>
                    <div class="item-meta">
                        <span>${t.category}</span>
                        <span><i class="fa-solid ${member ? member.avatar : 'fa-user'}"></i> ${member ? member.name : ''}</span>
                    </div>
                </div>
            </div>
            <div class="item-right ${t.type}">
                ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
            </div>
        `;
        list.appendChild(item);
    });
}

// ==========================================================================
// BORÇ YÖNETİMİ & AKILLI GERİ ÖDEME (SNOWBALL/AVALANCHE)
// ==========================================================================
function saveDebt() {
    const title = document.getElementById("debtTitle").value.trim();
    const creditor = document.getElementById("debtCreditor").value.trim();
    const totalAmount = parseFloat(document.getElementById("debtTotal").value);
    const interestRate = parseFloat(document.getElementById("debtInterest").value) || 0;
    const minPayment = parseFloat(document.getElementById("debtMinPayment").value);

    const newDebt = {
        id: "d_" + Date.now(),
        title,
        creditor,
        totalAmount,
        interestRate,
        minPayment
    };

    state.debts.push(newDebt);
    saveState();

    // Form temizliği
    document.getElementById("debtTitle").value = "";
    document.getElementById("debtCreditor").value = "";
    document.getElementById("debtTotal").value = "";
    document.getElementById("debtInterest").value = "0";
    document.getElementById("debtMinPayment").value = "";

    updateUI();
}

function deleteDebt(id) {
    const idx = state.debts.findIndex(d => d.id === id);
    if (idx !== -1) {
        state.debts.splice(idx, 1);
        saveState();
        updateUI();
    }
}

function renderDebts() {
    const tbody = document.getElementById("debtsTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    if (state.debts.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">Aktif borcunuz bulunmamaktadır! Harika iş.</td></tr>`;
        document.getElementById("debtFreeDate").innerText = "Hemen Şimdi!";
        document.getElementById("debtTimelineFill").style.width = "100%";
        document.getElementById("strategyExplanation").innerHTML = `<i class="fa-solid fa-circle-check text-green"></i> <p>Tebrikler, tüm borçlarınız kapatılmış durumda!</p>`;
        return;
    }

    // Seçili borç kapatma stratejisi
    const strategy = document.querySelector("input[name='debtStrategy']:checked").value;
    
    // Borçları stratejiye göre sırala
    let sortedDebts = [...state.debts];
    
    if (strategy === "snowball") {
        // Kartopu: En küçük bakiye ilk sıraya (kolay motivasyon)
        sortedDebts.sort((a, b) => a.totalAmount - b.totalAmount);
        document.getElementById("strategyExplanation").innerHTML = `
            <i class="fa-solid fa-snowflake text-neon-cyan"></i>
            <p><strong>Kartopu (Snowball) Stratejisi:</strong> Borçlar en küçük tutardan en büyüğe doğru sıralanır. En küçük borcu hızla kapatıp psikolojik başarı kazanarak motivasyonunuzu korursunuz.</p>
        `;
    } else {
        // Çığ: En yüksek faiz/maliyet oranı ilk sıraya (en karlı matematiksel yol)
        sortedDebts.sort((a, b) => b.interestRate - a.interestRate);
        document.getElementById("strategyExplanation").innerHTML = `
            <i class="fa-solid fa-fire text-neon-cyan"></i>
            <p><strong>Çığ (Avalanche) Stratejisi:</strong> Borçlar faiz oranı en yüksek olandan en düşüğe göre sıralanır. Finansal olarak en rasyonel olan yöntemdir; en az faizi ödeyerek toplam borç maliyetini azaltır.</p>
        `;
    }

    // Aile içi net savings'i (ek ödeme tamponunu) bul
    const financials = calculateFinancials();
    const netMonthlySavings = Math.max(0, financials.monthlyIncome - financials.monthlyExpense);
    
    // Borçsuz kalma takvimi hesaplama simülasyonu
    let simDebts = sortedDebts.map(d => ({ ...d, currentTotal: d.totalAmount }));
    let monthsToPayOff = 0;
    const maxSimMonths = 120; // max 10 yıl simüle et

    while (simDebts.some(d => d.currentTotal > 0) && monthsToPayOff < maxSimMonths) {
        monthsToPayOff++;
        let extraPayment = netMonthlySavings; // O ayki birikim fazlası ilk borca eklenecek

        for (let i = 0; i < simDebts.length; i++) {
            let debt = simDebts[i];
            if (debt.currentTotal <= 0) continue;

            // Aylık faiz ekle
            if (debt.interestRate > 0) {
                const monthlyInterest = debt.currentTotal * ((debt.interestRate / 100) / 12);
                debt.currentTotal += monthlyInterest;
            }

            // Normal asgari ödemeyi uygula
            let payment = Math.min(debt.currentTotal, debt.minPayment);
            debt.currentTotal -= payment;

            // Eğer stratejideki birikim fazlası varsa ve bu borç hala açıktaysa, birikim fazlasını buraya yatır
            if (extraPayment > 0 && debt.currentTotal > 0) {
                let extraPaid = Math.min(debt.currentTotal, extraPayment);
                debt.currentTotal -= extraPaid;
                extraPayment -= extraPaid;
            }
        }
    }

    // Borçsuz kalma tarihini ay cinsinden göster
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + monthsToPayOff);
    
    document.getElementById("debtFreeDate").innerText = `${monthsToPayOff} Ay Sonra (${targetDate.toLocaleString('tr-TR', { month: 'long', year: 'numeric' })})`;
    
    // Timeline yüzdesi (Ödenen borç tutarı oranı)
    const initialTotal = state.debts.reduce((sum, d) => sum + d.totalAmount, 0);
    const progressPercent = Math.max(0, Math.min(100, (1 - (simDebts.reduce((sum, d) => sum + d.currentTotal, 0) / initialTotal)) * 100));
    document.getElementById("debtTimelineFill").style.width = `${progressPercent}%`;

    // Tabloyu doldur
    sortedDebts.forEach((d, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${d.title}</strong></td>
            <td>${d.creditor}</td>
            <td>${formatCurrency(d.totalAmount)}</td>
            <td>%${d.interestRate}</td>
            <td>${formatCurrency(d.minPayment)}</td>
            <td>
                <span class="task-status-badge ${idx === 0 ? 'completed' : 'pending'}">
                    ${idx === 0 ? 'Öncelikli Geri Ödeme' : `${idx + 1}. Sırada`}
                </span>
            </td>
            <td>
                <button class="delete-row-btn" onclick="deleteDebt('${d.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================================================
// ORTAK GİDER BÖLÜŞTÜRÜCÜ & MAHSUPLAŞMA
// ==========================================================================
function getSharedSplitBalances() {
    const ebeveynler = state.profiles.filter(p => p.role === "Ebeveyn");
    if (ebeveynler.length <= 1) return [];

    // Maaş/recurring hariç bu ayki ortak giderlerin toplamını bulalım
    const sharedExpenses = state.transactions.filter(t => t.type === "expense" && !t.isRecurring);
    const totalSharedSpent = sharedExpenses.reduce((sum, t) => sum + t.amount, 0);
    
    const fairShare = totalSharedSpent / ebeveynler.length;

    // Her ebeveynin yaptığı toplam ödemeyi bul
    return ebeveynler.map(p => {
        const spent = sharedExpenses
            .filter(t => t.memberId === p.id)
            .reduce((sum, t) => sum + t.amount, 0);
        
        return {
            id: p.id,
            name: p.name,
            totalPaid: spent,
            balance: spent - fairShare // pozitif ise alacaklı, negatif ise borçlu
        };
    });
}

function renderBillSplitter() {
    const container = document.getElementById("splitterBalances");
    if (!container) return;

    container.innerHTML = "";
    
    const balances = getSharedSplitBalances();
    if (balances.length === 0) {
        container.innerHTML = `<p class="text-muted">En az 2 ebeveyn üyesi olmalıdır.</p>`;
        return;
    }

    balances.forEach(b => {
        const line = document.createElement("div");
        line.className = "split-balance-line";
        
        if (Math.abs(b.balance) < 0.1) {
            line.classList.add("zero");
            line.innerHTML = `<span>${b.name} (Eşit durumda)</span> <strong>0,00 ₺</strong>`;
        } else if (b.balance > 0) {
            line.classList.add("credit");
            line.innerHTML = `<span>${b.name} (Alacaklı)</span> <strong class="text-green">+${formatCurrency(b.balance)}</strong>`;
        } else {
            line.classList.add("debt");
            line.innerHTML = `<span>${b.name} (Borçlu)</span> <strong class="text-red">${formatCurrency(b.balance)}</strong>`;
        }
        
        container.appendChild(line);
    });
}

function settleSharedBalances() {
    const balances = getSharedSplitBalances();
    if (balances.length === 0) return;

    // Borçluları ve alacaklıları dengelemek için işlemleri sıfırlayalım
    // Gerçekçi bütçe için: Borçluların alacaklılara transfer yapması (bakiye katkılarını kaydırma)
    const debtors = balances.filter(b => b.balance < 0);
    const creditors = balances.filter(b => b.balance > 0);

    debtors.forEach(d => {
        const debtVal = Math.abs(d.balance);
        const debtorProfile = state.profiles.find(p => p.id === d.id);
        
        // Alacaklıların bakiyesine aktar
        creditors.forEach(c => {
            const creditorProfile = state.profiles.find(p => p.id === c.id);
            if (debtorProfile && creditorProfile) {
                debtorProfile.balanceContribution -= debtVal;
                creditorProfile.balanceContribution += debtVal;
            }
        });
    });

    // Bu mahsuplaşmayı bütçeye yansıtan temsili bir işlem ekle
    const settlementTrans = {
        id: "t_" + Date.now(),
        desc: "Ortak Gider Mahsuplaşması (Bakiyeler Sıfırlandı)",
        amount: 0,
        type: "income",
        category: "Diğer",
        date: new Date().toISOString().split('T')[0],
        memberId: state.profiles.find(p => p.role === "Ebeveyn").id,
        isRecurring: false
    };

    state.transactions.unshift(settlementTrans);
    saveState();
    updateUI();
    
    alert("Ortak bütçe gider mahsuplaşması tamamlandı! Üye bakiyeleri eşitlendi.");
}

// ==========================================================================
// KARAR SİMÜLASYONU (SANDBOX) & TAHMİN MOTORU
// ==========================================================================
function saveScenario() {
    const name = document.getElementById("scenName").value.trim();
    const type = document.getElementById("scenType").value;
    const amount = parseFloat(document.getElementById("scenAmount").value);
    const duration = parseInt(document.getElementById("scenDuration").value);
    const startMonth = parseInt(document.getElementById("scenStartMonth").value);

    const newScenario = {
        id: "s_" + Date.now(),
        name,
        type,
        amount,
        duration,
        startMonth,
        active: true
    };

    state.scenarios.push(newScenario);
    saveState();

    // Form temizleme
    document.getElementById("scenName").value = "";
    document.getElementById("scenAmount").value = "";
    document.getElementById("scenDuration").value = "12";
    document.getElementById("scenStartMonth").value = "0";

    closeModal("addScenarioModal");
    updateUI();
}

function deleteScenario(id) {
    const idx = state.scenarios.findIndex(s => s.id === id);
    if (idx !== -1) {
        state.scenarios.splice(idx, 1);
        saveState();
        updateUI();
    }
}

function toggleScenario(id) {
    const scen = state.scenarios.find(s => s.id === id);
    if (scen) {
        scen.active = !scen.active;
        saveState();
        updateUI();
    }
}

function renderScenarios() {
    const list = document.getElementById("sandboxScenariosList");
    if (!list) return;

    list.innerHTML = "";

    if (state.scenarios.length === 0) {
        list.innerHTML = `<p class="text-muted text-center py-2">Aktif ya da kayıtlı bir karar senaryosu bulunmuyor.</p>`;
        return;
    }

    state.scenarios.forEach(s => {
        const item = document.createElement("div");
        item.className = "scenario-item";
        
        let detailsText = "";
        if (s.type === "one_time_expense") {
            detailsText = `Tek Seferlik Peşinat: ${formatCurrency(s.amount)} (${s.startMonth}. Ayda)`;
        } else {
            detailsText = `${s.type === 'income' ? 'Düzenli Gelir' : 'Düzenli Gider'}: ${formatCurrency(s.amount)} (${s.duration} Ay Boyunca)`;
        }

        item.innerHTML = `
            <div class="scenario-details">
                <h5>${s.name}</h5>
                <span>${detailsText}</span>
            </div>
            <div class="row-flex">
                <input type="checkbox" id="chk_${s.id}" ${s.active ? 'checked' : ''} onclick="toggleScenario('${s.id}')">
                <button class="delete-row-btn" onclick="deleteScenario('${s.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        list.appendChild(item);
    });
}

// 12 Aylık Tahmin ve Projeksiyon Datalarını Oluşturma
function generateProjections() {
    const financials = calculateFinancials();
    const currentBalance = getFamilyBalance();

    const sliderInflation = parseFloat(document.getElementById("sliderInflation")?.value || 10) / 100;
    const sliderSavings = parseFloat(document.getElementById("sliderSavings")?.value || 5000);

    const baseProjection = [];
    const scenarioProjection = [];
    const months = [];

    let baseTempBalance = currentBalance;
    let scenTempBalance = currentBalance;

    const baseMonthlyNet = financials.monthlyIncome - financials.monthlyExpense;

    for (let m = 0; m <= 12; m++) {
        // Ay İsimleri Ekle
        const d = new Date();
        d.setMonth(d.getMonth() + m);
        months.push(d.toLocaleString('tr-TR', { month: 'short', year: 'numeric' }));

        if (m === 0) {
            baseProjection.push(baseTempBalance);
            scenarioProjection.push(scenTempBalance);
            continue;
        }

        // --- BAZ SENARYO HESAPLAMA ---
        // Enflasyon oranını aylık dağıtarak aylık giderleri yavaş yavaş artıralım
        const baseInflationAdjustedExpense = financials.monthlyExpense * (1 + (sliderInflation * (m / 12)));
        const baseNet = financials.monthlyIncome - baseInflationAdjustedExpense;
        baseTempBalance += baseNet;
        baseProjection.push(Math.round(baseTempBalance));

        // --- SİMÜLASYON SENARYOSU HESAPLAMA ---
        let scenNet = financials.monthlyIncome - baseInflationAdjustedExpense;
        
        // Aktif senaryo kararlarını bütçeye ekle
        state.scenarios.forEach(scen => {
            if (!scen.active) return;
            
            // Senaryo başlangıç ayından sonra mı?
            if (m >= scen.startMonth && m < scen.startMonth + scen.duration) {
                if (scen.type === "expense") {
                    scenNet -= scen.amount;
                } else if (scen.type === "income") {
                    scenNet += scen.amount;
                } else if (scen.type === "one_time_expense" && m === scen.startMonth) {
                    scenNet -= scen.amount;
                }
            }
        });

        scenTempBalance += scenNet;
        scenarioProjection.push(Math.round(scenTempBalance));
    }

    return { months, baseProjection, scenarioProjection };
}

// ==========================================================================
// AKILLI İSTEK LİSTESİ & SATIN ALMA ASİSTANI
// ==========================================================================
function saveGoal() {
    const title = document.getElementById("goalTitle").value.trim();
    const cost = parseFloat(document.getElementById("goalCost").value);
    const memberId = document.getElementById("goalMember").value;

    const newGoal = {
        id: "g_" + Date.now(),
        title,
        cost,
        memberId
    };

    state.goals.push(newGoal);
    
    // Oyunlaştırma puanı ekle
    awardPoints(memberId, 15, "Hedef Belirleme");
    setTimeout(triggerCoinDrop, 100);
    
    saveState();

    document.getElementById("goalTitle").value = "";
    document.getElementById("goalCost").value = "";

    closeModal("addGoalModal");
    updateUI();
}

function deleteGoal(id) {
    const idx = state.goals.findIndex(g => g.id === id);
    if (idx !== -1) {
        state.goals.splice(idx, 1);
        saveState();
        updateUI();
    }
}

function renderWishlistAndGoals() {
    const list = document.getElementById("dashboardGoalsList");
    const kidGoals = document.getElementById("kidGoalsContainer");
    if (!list) return;

    list.innerHTML = "";
    if (kidGoals) kidGoals.innerHTML = "";

    if (state.goals.length === 0) {
        list.innerHTML = `<p class="text-muted text-center py-2">Hedef listeniz boş.</p>`;
        if (kidGoals) kidGoals.innerHTML = `<p class="text-muted text-center py-2">Kumbaranı büyütecek birikim hedefin bulunmuyor.</p>`;
        return;
    }

    const financials = calculateFinancials();
    const monthlyNetSavings = Math.max(0, financials.monthlyIncome - financials.monthlyExpense);
    const currentBalance = getFamilyBalance();
    const activeProfile = getActiveProfile();

    state.goals.forEach(g => {
        const member = state.profiles.find(p => p.id === g.memberId);
        
        // İlerleme yüzdesi hesaplama
        let progress = 0;
        if (currentBalance >= g.cost) {
            progress = 100;
        } else if (currentBalance > 0) {
            progress = Math.round((currentBalance / g.cost) * 100);
        }

        // Satın alma vadesi tahmini
        let forecastText = "";
        if (currentBalance >= g.cost) {
            forecastText = "Satın Alınabilir! Bütçe yeterli.";
        } else if (monthlyNetSavings <= 0) {
            forecastText = "Birikim hızı yetersiz (Giderler geliri aşıyor).";
        } else {
            const monthsNeeded = Math.ceil((g.cost - currentBalance) / monthlyNetSavings);
            const targetDate = new Date();
            targetDate.setMonth(targetDate.getMonth() + monthsNeeded);
            forecastText = `Yaklaşık ${monthsNeeded} Ay Sonra (${targetDate.toLocaleString('tr-TR', { month: 'short', year: 'numeric' })})`;
        }

        const itemHTML = `
            <div class="goal-info">
                <span class="goal-name">${g.title}</span>
                <span class="goal-cost">${formatCurrency(g.cost)}</span>
            </div>
            <div class="goal-progress-bar">
                <div class="goal-progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="goal-forecast">
                <span>${forecastText}</span>
                <span class="goal-owner">${member ? member.name : ''}</span>
            </div>
            <div class="text-right margin-top parent-only">
                <button class="delete-row-btn" onclick="deleteGoal('${g.id}')">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;

        // Ana Dashboard'da göster
        const div = document.createElement("div");
        div.className = "goal-item";
        div.innerHTML = itemHTML;
        list.appendChild(div);

        // Çocuk Dünyası modunda çocuk hedeflerini göster
        if (kidGoals && member && member.role === "Çocuk") {
            const childDiv = document.createElement("div");
            childDiv.className = "goal-item";
            childDiv.innerHTML = itemHTML;
            kidGoals.appendChild(childDiv);
        }
    });
}

function renderWishlistAssistant() {
    const feedbackContainer = document.getElementById("wishlistAssistantFeedback");
    if (!feedbackContainer) return;

    feedbackContainer.innerHTML = "";

    if (state.goals.length === 0) {
        feedbackContainer.innerHTML = `<p class="text-muted">Hedef listenize istek eklediğinizde satın alma asistanı çalışacaktır.</p>`;
        return;
    }

    const financials = calculateFinancials();
    const monthlyNetSavings = Math.max(0, financials.monthlyIncome - financials.monthlyExpense);
    const currentBalance = getFamilyBalance();

    // Abonelik harcamaları toplamı
    const subscriptionSpent = state.transactions
        .filter(t => t.category === "Abonelik")
        .reduce((sum, t) => sum + t.amount, 0);

    state.goals.forEach(g => {
        const tip = document.createElement("div");
        tip.className = "assistant-tip";

        if (currentBalance >= g.cost) {
            tip.classList.add("success");
            tip.innerHTML = `<strong>${g.title} Analizi:</strong><br>Bütçeniz bu hedefi hemen satın almak için yeterli. Satın alma işlemi ortak bakiyeyi ${formatCurrency(g.cost)} azaltacaktır.`;
        } else if (monthlyNetSavings <= 0) {
            tip.classList.add("warning");
            tip.innerHTML = `<strong>${g.title} Analizi:</strong><br>Mevcut bütçenizde aylık birikim yapamıyorsunuz. Bu hedefi almak için öncelikle gider bütçenizi kısmalı veya gelir artışı sağlamalısınız.`;
        } else {
            const monthsNeeded = Math.ceil((g.cost - currentBalance) / monthlyNetSavings);
            
            // Akıllı optimizasyon önerisi: abonelikleri kısarsa ne olur?
            let extraTip = "";
            if (subscriptionSpent > 50) {
                const optimizedSavings = monthlyNetSavings + (subscriptionSpent * 0.5); // aboneliklerin yarısını kısıldığını simüle et
                const optimizedMonths = Math.ceil((g.cost - currentBalance) / optimizedSavings);
                const difference = monthsNeeded - optimizedMonths;

                if (difference > 0) {
                    extraTip = `<br><br><i class="fa-solid fa-lightbulb text-neon-cyan"></i> <strong>Akıllı Öneri:</strong> Eğlence ve abonelik bütçenizin yarısından tasarruf ederseniz (ayda +${formatCurrency(subscriptionSpent * 0.5)}), bu hedefe <strong>${difference} ay daha erken</strong> ulaşabilirsiniz!`;
                }
            }

            tip.innerHTML = `<strong>${g.title} Analizi:</strong><br>Mevcut aylık birikim hızınızla (${formatCurrency(monthlyNetSavings)}/Ay) bu hedefe <strong>${monthsNeeded} ay</strong> sonra ulaşabileceksiniz.${extraTip}`;
        }

        feedbackContainer.appendChild(tip);
    });
}

// ==========================================================================
// 5 BOYUTLU FİNANSAL SAĞLIK RADARI HESAPLAMA SİSTEMİ
// ==========================================================================
function getFinancialHealthMetrics() {
    const financials = calculateFinancials();
    const balance = getFamilyBalance();

    // 1. Tasarruf Hızı Oranı (Gelirin ne kadarı birikime gidiyor?)
    let savingsRate = 0;
    if (financials.monthlyIncome > 0) {
        savingsRate = ((financials.monthlyIncome - financials.monthlyExpense) / financials.monthlyIncome) * 100;
    }
    const scoreSavings = Math.max(0, Math.min(100, Math.round(savingsRate * 2))); // %50 tasarruf hızı = 100 puan

    // 2. Borç Yükü Oranı (Toplam borç / Yıllık gelir oranı)
    let debtRatio = 0;
    const annualIncome = financials.monthlyIncome * 12;
    if (annualIncome > 0) {
        debtRatio = financials.totalDebt / annualIncome;
    }
    const scoreDebt = Math.max(0, Math.min(100, Math.round(100 - (debtRatio * 100)))); // Borçsuz = 100 puan, Borç yıllık gelire eşitse = 0 puan

    // 3. Acil Durum Fonu Tamponu (Kaç aylık sabit gider kadar nakit var?)
    let emergencyBuffer = 0;
    if (financials.monthlyExpense > 0) {
        emergencyBuffer = balance / financials.monthlyExpense;
    }
    const scoreEmergency = Math.max(0, Math.min(100, Math.round((emergencyBuffer / 3) * 100))); // 3 ay ve üzeri = 100 puan

    // 4. Yatırım Alışkanlığı (Yatırım kategorisindeki gelir ve işlem yoğunluğu)
    const investmentCount = state.transactions.filter(t => t.category === "Yatırım Geliri").length;
    const scoreInvestment = Math.min(100, 20 + (investmentCount * 25)); // her yatırım işlemi 25 puan, max 100

    // 5. Bütçe Sadakati (Aylık bakiye gelişiminin pozitif olması)
    const scoreDiscipline = financials.monthlyIncome > financials.monthlyExpense ? 100 : 30;

    // Ortalama Finansal Sağlık Skoru
    const averageScore = Math.round((scoreSavings + scoreDebt + scoreEmergency + scoreInvestment + scoreDiscipline) / 5);

    return {
        scores: [scoreSavings, scoreDebt, scoreEmergency, scoreInvestment, scoreDiscipline],
        overallScore: averageScore
    };
}

// ==========================================================================
// ÇOCUK DÜNYASI (GAMIFICATION & CHORES)
// ==========================================================================
function saveTask() {
    const title = document.getElementById("taskTitle").value.trim();
    const reward = parseFloat(document.getElementById("taskReward").value);
    const assignedTo = document.getElementById("taskAssignedTo").value;

    const newTask = {
        id: "tk_" + Date.now(),
        title,
        reward,
        assignedTo,
        status: "pending" // ilk durumu yapılmadı
    };

    state.tasks.push(newTask);
    saveState();

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskReward").value = "";

    closeModal("addTaskModal");
    updateUI();
}

function completeTaskByKid(id) {
    const task = state.tasks.find(t => t.id === id);
    if (task) {
        task.status = "review"; // ebeveyn onayına gönder
        saveState();
        updateUI();
        alert("Harika! Görev tamamlandı olarak işaretlendi ve ebeveyn onayına gönderildi.");
    }
}

function approveTaskByParent(id) {
    const task = state.tasks.find(t => t.id === id);
    if (task && task.status === "review") {
        task.status = "completed";
        
        // Çocuğun kumbarasını güncelle (bakiye katkısını artır)
        const child = state.profiles.find(p => p.id === task.assignedTo);
        if (child) {
            child.balanceContribution += task.reward;
            
            // Oyunlaştırma puanı ekle (Çocuğa görev puanı, Ebeveyne onay puanı)
            awardPoints(child.id, 100, "Görev Tamamlama");
            awardPoints(state.activeProfileId, 25, "Görev Onaylama");
            
            // Kumbara coin animasyonunu tetikle
            setTimeout(triggerCoinDrop, 100);
        }

        // Aile bütçesinden "Çocuk Harçlığı" harcaması olarak düş
        const expTrans = {
            id: "t_" + Date.now(),
            desc: `Harçlık Ödemesi: ${child ? child.name : 'Çocuk'} - ${task.title}`,
            amount: task.reward,
            type: "expense",
            category: "Eğitim", // harçlıkları eğitim/diğer altında toplayalım
            date: new Date().toISOString().split('T')[0],
            memberId: state.profiles.find(p => p.role === "Ebeveyn").id,
            isRecurring: false
        };
        
        // Aile ebeveyn bakiyesini düşür
        const parent = state.profiles.find(p => p.role === "Ebeveyn");
        if (parent) parent.balanceContribution -= task.reward;

        state.transactions.unshift(expTrans);
        saveState();
        updateUI();
        
        alert("Görev onaylandı! Harçlık çocuğun kumbarasına yatırıldı ve ortak bütçeden düşüldü.");
    }
}

function renderKidZone() {
    const tbody = document.getElementById("kidTasksTableBody");
    const balanceLabel = document.getElementById("kidTotalBalance");
    if (!tbody) return;

    tbody.innerHTML = "";
    
    // Çocuk profillerini bul
    const activeProfile = getActiveProfile();
    const children = state.profiles.filter(p => p.role === "Çocuk");
    
    // Kendi kumbarasını göster
    if (balanceLabel) {
        if (activeProfile.role === "Çocuk") {
            balanceLabel.innerText = formatCurrency(activeProfile.balanceContribution);
        } else {
            // Ebeveyn çocukların toplam kumbarasını görür
            const totalKidBalance = children.reduce((sum, c) => sum + c.balanceContribution, 0);
            balanceLabel.innerText = formatCurrency(totalKidBalance);
        }
    }

    // Görev listesini listele
    const tasksToShow = activeProfile.role === "Çocuk"
        ? state.tasks.filter(t => t.assignedTo === activeProfile.id)
        : state.tasks;

    if (tasksToShow.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">Kayıtlı görev bulunmamaktadır.</td></tr>`;
        return;
    }

    tasksToShow.forEach(t => {
        const tr = document.createElement("tr");
        const assignedChild = state.profiles.find(p => p.id === t.assignedTo);

        let statusText = "";
        let statusClass = "";
        let actionBtn = "";

        if (t.status === "pending") {
            statusText = "Yapılmadı";
            statusClass = "pending";
            
            // Eğer çocuk giriş yaptıysa "Yapıldı Olarak İşaretle" butonu çıksın
            if (activeProfile.role === "Çocuk") {
                actionBtn = `<button class="btn btn-sm btn-primary" onclick="completeTaskByKid('${t.id}')"><i class="fa-solid fa-check"></i> Tamamladım</button>`;
            } else {
                actionBtn = `<span class="text-muted">Çocuktan Bildirim Bekleniyor</span>`;
            }
        } else if (t.status === "review") {
            statusText = "Onay Bekliyor";
            statusClass = "review";

            // Eğer ebeveyn giriş yaptıysa "Onayla" butonu çıksın
            if (activeProfile.role === "Ebeveyn") {
                actionBtn = `<button class="btn btn-sm btn-primary" style="background-color: var(--color-green);" onclick="approveTaskByParent('${t.id}')"><i class="fa-solid fa-circle-check"></i> Harçlığı Onayla</button>`;
            } else {
                actionBtn = `<span class="text-muted">Ebeveyn Onayı Bekleniyor</span>`;
            }
        } else {
            statusText = "Tamamlandı & Ödendi";
            statusClass = "completed";
            actionBtn = `<i class="fa-solid fa-clipboard-check text-green" style="font-size: 18px;"></i>`;
        }

        tr.innerHTML = `
            <td><strong>${t.title}</strong></td>
            <td class="text-green font-weight-bold">+${formatCurrency(t.reward)}</td>
            <td>${assignedChild ? assignedChild.name : 'Bilinmeyen'}</td>
            <td><span class="task-status-badge ${statusClass}">${statusText}</span></td>
            <td>${actionBtn}</td>
        `;
        tbody.appendChild(tr);
    });
}

// ==========================================================================
// YARDIMCI GÖRSEL VE FORMAT FONKSİYONLARI
// ==========================================================================
function formatCurrency(val) {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(val);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
}

// ==========================================================================
// GENEL KULLANICI ARABİRİMİ GÜNCELLEME (RE-RENDER CORE)
// ==========================================================================
function updateUI() {
    // Profil listelerini güncelle
    renderProfiles();
    
    // Anlık bakiye gösterimi
    const balance = getFamilyBalance();
    document.getElementById("familyTotalBalance").innerText = formatCurrency(balance);
    
    // Aylık Finansal Özet (Income/Expense/Debt)
    const financials = calculateFinancials();
    document.getElementById("statMonthlyIncome").innerText = formatCurrency(financials.monthlyIncome);
    document.getElementById("statMonthlyExpense").innerText = formatCurrency(financials.monthlyExpense);
    document.getElementById("statTotalDebt").innerText = formatCurrency(financials.totalDebt);

    // Demo verisi uyarı banner'ının gösterimi
    const demoDataAlert = document.getElementById("demoDataAlert");
    if (demoDataAlert) {
        const activeProfile = getActiveProfile();
        if (state.transactions.length === 0 && activeProfile && activeProfile.role === "Ebeveyn") {
            demoDataAlert.style.display = "flex";
        } else {
            demoDataAlert.style.display = "none";
        }
    }

    // Sekme bazlı render'lar
    renderRecentTransactions();
    renderTransactions();
    renderDebts();
    renderBillSplitter();
    renderScenarios();
    renderWishlistAndGoals();
    renderKidZone();

    // 5 Yeni Premium Özelliğin Arayüz Render'ları
    renderLeaderboard();
    generateAIInsights();
    renderPaymentCalendar();
    updateSavingsJar();

    // Grafikleri yeniden çiz
    renderDashboardCharts();
}

// Global olarak çağrılabilmesi için buton onclick handler'larını pencereye bağlayalım
window.deleteTransaction = deleteTransaction;
window.deleteDebt = deleteDebt;
window.deleteGoal = deleteGoal;
window.deleteScenario = deleteScenario;
window.toggleScenario = toggleScenario;
window.completeTaskByKid = completeTaskByKid;
window.approveTaskByParent = approveTaskByParent;
window.removeSetupProfile = removeSetupProfile;

// ==========================================================================
// 5 PREMIUM ÖZELLİK YARDIMCI VE YÖNETİM METOTLARI
// ==========================================================================

// --- 1. Kategori Limitleri ---
function renderManageLimitsForm() {
    const fieldsContainer = document.getElementById("limitsFormFields");
    if (!fieldsContainer) return;
    
    fieldsContainer.innerHTML = "";
    
    const categories = ["Market", "Fatura", "Kira", "Ulaşım", "Abonelik", "Eğitim", "Sağlık", "Giyim", "Diğer"];
    
    categories.forEach(cat => {
        const currentLimit = state.categoryLimits ? (state.categoryLimits[cat] || 0) : 0;
        
        const group = document.createElement("div");
        group.className = "form-group";
        group.innerHTML = `
            <label for="limit_${cat}" style="font-size: 12px; font-weight: 600; color: var(--text-secondary);">${cat} Aylık Limiti (₺)</label>
            <input type="number" id="limit_${cat}" min="0" value="${currentLimit}" placeholder="Sınır yok" style="padding: 10px 14px;">
        `;
        fieldsContainer.appendChild(group);
    });
}

function saveCategoryLimits() {
    if (!state.categoryLimits) state.categoryLimits = {};
    
    const categories = ["Market", "Fatura", "Kira", "Ulaşım", "Abonelik", "Eğitim", "Sağlık", "Giyim", "Diğer"];
    
    categories.forEach(cat => {
        const input = document.getElementById(`limit_${cat}`);
        if (input) {
            state.categoryLimits[cat] = parseFloat(input.value) || 0;
        }
    });
    
    saveState();
    closeModal("manageLimitsModal");
    updateUI();
    
    alert("Kategori limitleri başarıyla güncellendi!");
}

// --- 2. Tasarruf Ligi (Puan & Rozet) ---
function awardPoints(profileId, amount, reason) {
    const profile = state.profiles.find(p => p.id === profileId);
    if (profile) {
        if (profile.points === undefined) profile.points = 0;
        profile.points += amount;
        saveState();
        checkAndUnlockBadges(profileId);
    }
}

function checkAndUnlockBadges(profileId) {
    const profile = state.profiles.find(p => p.id === profileId);
    if (!profile) return;
    if (!profile.badges) profile.badges = [];

    // Rozet 1: Görev Canavarı (En az 3 görev tamamlama)
    if (profile.role === "Çocuk") {
        const completedTasksCount = state.tasks.filter(t => t.assignedTo === profileId && t.status === "completed").length;
        if (completedTasksCount >= 3 && !profile.badges.includes("Görev Canavarı")) {
            profile.badges.push("Görev Canavarı");
            alert(`🎉 ${profile.name} "Görev Canavarı" rozetini kazandı!`);
        }
    }

    // Rozet 2: Bütçe Koruyucusu (Harcamaları limitin %80'inin altında tutma)
    if (profile.role === "Ebeveyn") {
        const spentCategories = [...new Set(state.transactions.filter(t => t.type === "expense" && t.memberId === profileId).map(t => t.category))];
        let withinLimit = true;
        
        if (spentCategories.length > 0) {
            spentCategories.forEach(cat => {
                const totalSpent = state.transactions
                    .filter(t => t.type === "expense" && t.category === cat && t.memberId === profileId)
                    .reduce((sum, t) => sum + t.amount, 0);
                const limit = state.categoryLimits ? (state.categoryLimits[cat] || 0) : 0;
                if (limit > 0 && totalSpent > limit * 0.8) {
                    withinLimit = false;
                }
            });
            
            if (withinLimit && !profile.badges.includes("Bütçe Koruyucusu")) {
                profile.badges.push("Bütçe Koruyucusu");
                alert(`🎉 ${profile.name} "Bütçe Koruyucusu" rozetini kazandı!`);
            }
        }
    }

    // Rozet 3: Birikim Ustası / Kumbara Ortağı
    const currentBalance = getFamilyBalance();
    if (profile.role === "Çocuk" && profile.balanceContribution >= 500 && !profile.badges.includes("Birikim Ustası")) {
        profile.badges.push("Birikim Ustası");
        alert(`🎉 ${profile.name} "Birikim Ustası" rozetini kazandı!`);
    } else if (profile.role === "Ebeveyn" && currentBalance >= 20000 && !profile.badges.includes("Kumbara Ortağı")) {
        profile.badges.push("Kumbara Ortağı");
        alert(`🎉 ${profile.name} "Kumbara Ortağı" rozetini kazandı!`);
    }

    saveState();
}

function renderLeaderboard() {
    const container = document.getElementById("familyLeaderboardList");
    if (!container) return;
    
    container.innerHTML = "";
    
    const sorted = [...state.profiles].map(p => ({
        ...p,
        points: p.points || 0,
        badges: p.badges || []
    })).sort((a, b) => b.points - a.points);
    
    if (sorted.length === 0) {
        container.innerHTML = `<p class="text-muted text-center py-2" style="font-size: 13px;">Henüz üye eklenmemiş.</p>`;
        return;
    }
    
    sorted.forEach((p, idx) => {
        const item = document.createElement("div");
        item.className = `leaderboard-item ${idx === 0 ? 'rank-1' : ''}`;
        
        const badgeHTML = p.badges.map(b => `<span class="mini-badge-icon"><i class="fa-solid fa-medal"></i> ${b}</span>`).join("");
        
        item.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span class="leaderboard-rank">#${idx + 1}</span>
                <div class="active-profile-avatar" style="width: 32px; height: 32px; font-size: 13px; margin-right: 4px;">
                    <i class="fa-solid ${p.avatar}"></i>
                </div>
                <div>
                    <h5 style="margin: 0; font-size: 13px; font-weight: 600;">${p.name} <small class="text-muted">(${p.role})</small></h5>
                    <div class="leaderboard-badges-inline">
                        ${badgeHTML || '<span class="text-muted" style="font-size: 9px;">Rozet yok</span>'}
                    </div>
                </div>
            </div>
            <span class="leaderboard-points">${p.points} Puan</span>
        `;
        container.appendChild(item);
    });
}

// --- 3. İnteraktif Neon Kumbara (Savings Jar) ---
function updateSavingsJar() {
    const jarWidget = document.getElementById("savingsJarWidget");
    const jarWater = document.getElementById("jarWater");
    const jarPercent = document.getElementById("jarPercent");
    const jarGoalName = document.getElementById("jarActiveGoalName");
    
    const kidJarWidget = document.getElementById("kidSavingsJarWidget");
    const kidJarWater = document.getElementById("kidJarWater");
    const kidJarPercent = document.getElementById("kidJarPercent");
    
    const currentBalance = getFamilyBalance();
    
    if (state.goals && state.goals.length > 0) {
        if (jarWidget) jarWidget.style.display = "flex";
        
        const shortestGoal = state.goals[0];
        if (jarGoalName) jarGoalName.innerText = shortestGoal.title;
        
        let percent = 0;
        if (currentBalance >= shortestGoal.cost) {
            percent = 100;
        } else if (currentBalance > 0) {
            percent = Math.round((currentBalance / shortestGoal.cost) * 100);
        }
        
        if (jarPercent) jarPercent.innerText = `${percent}%`;
        if (jarWater) jarWater.style.height = `${percent}%`;
    } else {
        if (jarWidget) jarWidget.style.display = "none";
    }
    
    const activeProfile = getActiveProfile();
    if (activeProfile && activeProfile.role === "Çocuk") {
        if (kidJarWidget) kidJarWidget.style.display = "flex";
        
        const childGoals = state.goals.filter(g => g.memberId === activeProfile.id);
        let percent = 0;
        
        if (childGoals.length > 0) {
            const targetGoal = childGoals[0];
            const childBalance = activeProfile.balanceContribution;
            
            if (childBalance >= targetGoal.cost) {
                percent = 100;
            } else if (childBalance > 0) {
                percent = Math.round((childBalance / targetGoal.cost) * 100);
            }
        } else {
            const targetBalance = 5000;
            const childBalance = activeProfile.balanceContribution;
            percent = Math.min(100, Math.round((childBalance / targetBalance) * 100));
        }
        
        if (kidJarPercent) kidJarPercent.innerText = `${percent}%`;
        if (kidJarWater) kidJarWater.style.height = `${percent}%`;
    } else {
        if (kidJarWidget) kidJarWidget.style.display = "none";
    }
}

function triggerCoinDrop() {
    const coinContainer = document.getElementById("coinContainer");
    if (!coinContainer) return;
    
    const jarWidget = document.getElementById("savingsJarWidget");
    if (!jarWidget || jarWidget.style.display === "none") return;
    
    const coin = document.createElement("div");
    coin.className = "dropping-coin";
    
    const randomOffset = Math.floor(Math.random() * 20) - 10;
    coin.style.left = `calc(50% + ${randomOffset}px)`;
    
    coinContainer.appendChild(coin);
    
    setTimeout(() => {
        coin.remove();
    }, 800);
}

// --- 4. Yapay Zeka Finansal Tavsiyeler (AI Insights) ---
function generateAIInsights() {
    const container = document.getElementById("aiInsightsContainer");
    if (!container) return;
    
    container.innerHTML = "";
    
    const activeProfile = getActiveProfile();
    const wrapper = document.querySelector(".ai-insights-wrapper");
    
    if (!activeProfile || activeProfile.role !== "Ebeveyn") {
        if (wrapper) wrapper.style.display = "none";
        return;
    }
    
    if (wrapper) wrapper.style.display = "block";
    
    const financials = calculateFinancials();
    const balance = getFamilyBalance();
    const insights = [];
    
    // Kategori limitleri kontrolü
    const spentCategories = {};
    state.transactions.filter(t => t.type === "expense").forEach(t => {
        spentCategories[t.category] = (spentCategories[t.category] || 0) + t.amount;
    });
    
    Object.keys(spentCategories).forEach(cat => {
        const spent = spentCategories[cat];
        const limit = state.categoryLimits ? (state.categoryLimits[cat] || 0) : 0;
        if (limit > 0 && spent >= limit) {
            insights.push({
                title: `${cat} Bütçesi Aşıldı!`,
                text: `Bu ay ${cat} için belirlediğiniz ${formatCurrency(limit)} bütçeyi aştınız (Harcama: ${formatCurrency(spent)}). Bu alandaki harcamaları acilen kısmanız gerekmektedir.`,
                icon: "fa-triangle-exclamation"
            });
        } else if (limit > 0 && spent >= limit * 0.8) {
            insights.push({
                title: `${cat} Bütçesi Sınırda!`,
                text: `Bu ay ${cat} bütçenizin %80'ine ulaştınız. Harcama: ${formatCurrency(spent)} / Limit: ${formatCurrency(limit)}. Ekstra alışverişleri erteleyin.`,
                icon: "fa-circle-exclamation"
            });
        }
    });
    
    // Tasarruf analiz uyarısı
    const monthlyNet = financials.monthlyIncome - financials.monthlyExpense;
    if (financials.monthlyIncome > 0) {
        const savingsRate = (monthlyNet / financials.monthlyIncome) * 100;
        if (savingsRate <= 0) {
            insights.push({
                title: "Birikim Uyarısı!",
                text: "Bu ay harcamalarınız gelirlerinizi aştı. Gelecek bütçelerinizde acil durum fonu oluşturmak için aylık en az %10 tasarruf etmeye çalışın.",
                icon: "fa-scale-unbalanced"
            });
        } else if (savingsRate < 20) {
            insights.push({
                title: "Tasarruf Hızlandırılabilir",
                text: `Mevcut tasarruf oranınız %${Math.round(savingsRate)}. Bunu %20 ve üzerine çıkarmak, birikim hedeflerinize ulaşmanızı önemli ölçüde hızlandıracaktır.`,
                icon: "fa-gauge"
            });
        } else {
            insights.push({
                title: "Harika Tasarruf Oranı!",
                text: `Gelirinizin %${Math.round(savingsRate)} kadarını biriktiriyorsunuz. Finansal sağlık durumunuz oldukça iyi gidiyor! Tebrikler.`,
                icon: "fa-square-check"
            });
        }
    }
    
    // Abonelik analizleri
    const subscriptionSpent = state.transactions
        .filter(t => t.category === "Abonelik" && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
        
    const activeGoals = state.goals;
    if (activeGoals.length > 0 && subscriptionSpent > 150 && monthlyNet > 0) {
        const shortestGoal = activeGoals[0];
        const optimizedSavings = monthlyNet + (subscriptionSpent * 0.5);
        const normalMonths = Math.ceil(shortestGoal.cost / monthlyNet);
        const optimizedMonths = Math.ceil(shortestGoal.cost / optimizedSavings);
        const diff = normalMonths - optimizedMonths;
        
        if (diff > 0) {
            insights.push({
                title: `Abonelikleri Kısarak Hızlı Hedef`,
                text: `Abonelik harcamalarınızın (${formatCurrency(subscriptionSpent)}) yarısından tasarruf etmek, "${shortestGoal.title}" hedefinize ${diff} ay daha erken ulaşmanızı sağlayabilir.`,
                icon: "fa-bolt"
            });
        }
    }
    
    if (insights.length === 0) {
        insights.push({
            title: "Bütçe Hazırlığı",
            text: "Uygulamaya gelir ve giderlerinizi ekledikçe size özel yapay zeka finansal tavsiyeleri burada anlık listelenecektir.",
            icon: "fa-circle-info"
        });
        insights.push({
            title: "Acil Durum Fonu",
            text: "Beklenmedik masraflara karşı ortak bakiyenizde en az 3 aylık sabit gideriniz kadar acil durum birikimi tutmanızı öneririz.",
            icon: "fa-shield-heart"
        });
        insights.push({
            title: "Önce Kendine Öde",
            text: "Maaşınız yattığı anda harcamaya başlamadan önce %10'luk kısmını birikim hedeflerinize veya kumbaranıza aktarın.",
            icon: "fa-piggy-bank"
        });
    }
    
    insights.slice(0, 3).forEach(ins => {
        const card = document.createElement("div");
        card.className = "ai-insight-card";
        card.innerHTML = `
            <i class="fa-solid ${ins.icon} ai-insight-icon"></i>
            <div class="ai-insight-content">
                <h5>${ins.title}</h5>
                <p>${ins.text}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- 5. Fatura & Abonelik Ödeme Takvimi ---
function renderPaymentCalendar() {
    const grid = document.getElementById("calendarDaysGrid");
    const label = document.getElementById("calendarCurrentMonth");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    if (label) {
        label.innerText = now.toLocaleString('tr-TR', { month: 'long', year: 'numeric' });
    }
    
    const firstDay = new Date(year, month, 1);
    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let i = 0; i < startDayOfWeek; i++) {
        const empty = document.createElement("div");
        empty.className = "calendar-day empty";
        grid.appendChild(empty);
    }
    
    const recurringExpenses = state.transactions.filter(t => t.isRecurring && t.type === "expense");
    const recurringIncomes = state.transactions.filter(t => t.isRecurring && t.type === "income");
    
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("div");
        cell.className = "calendar-day";
        
        if (day === now.getDate()) {
            cell.classList.add("today");
        }
        
        cell.innerHTML = `<span class="calendar-day-num">${day}</span>`;
        
        const dayExpenses = recurringExpenses.filter(t => {
            const tDay = new Date(t.date).getDate();
            return tDay === day;
        });
        
        const dayIncomes = recurringIncomes.filter(t => {
            const tDay = new Date(t.date).getDate();
            return tDay === day;
        });
        
        if (dayExpenses.length > 0 || dayIncomes.length > 0) {
            cell.classList.add("has-event");
            
            const dotsContainer = document.createElement("div");
            dotsContainer.className = "calendar-event-dots";
            
            let tooltipHTML = `<div class="day-tooltip">`;
            
            dayIncomes.forEach(inc => {
                const dot = document.createElement("div");
                dot.className = "calendar-dot income";
                dotsContainer.appendChild(dot);
                
                tooltipHTML += `
                    <div class="tooltip-item">
                        <span class="text-green" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 90px;">${inc.desc}</span>
                        <strong>+${formatCurrency(inc.amount)}</strong>
                    </div>
                `;
            });
            
            dayExpenses.forEach(exp => {
                const dot = document.createElement("div");
                dot.className = "calendar-dot";
                dotsContainer.appendChild(dot);
                
                tooltipHTML += `
                    <div class="tooltip-item">
                        <span class="text-red" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 90px;">${exp.desc}</span>
                        <strong>-${formatCurrency(exp.amount)}</strong>
                    </div>
                `;
            });
            
            tooltipHTML += `</div>`;
            cell.appendChild(dotsContainer);
            cell.innerHTML += tooltipHTML;
        }
        
        grid.appendChild(cell);
    }
}
