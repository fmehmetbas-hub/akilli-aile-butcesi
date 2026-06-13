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
    },
    portfolio: {
        usd: 1200,
        eur: 800,
        gold: 25,
        btc: 0.015,
        history: [82000, 85000, 89000, 87500, 93000, 94600]
    },
    trackedAssets: { usd: true, eur: true, gold: true, btc: true },
    shoppingCart: [],
    savingsHistory: [
        { month: "Oca 2026", safe: 25000, portfolio: 12000, kids: 200, total: 37200, netChange: 5000 },
        { month: "Şub 2026", safe: 28000, portfolio: 14000, kids: 220, total: 42220, netChange: 5020 },
        { month: "Mar 2026", safe: 32000, portfolio: 13500, kids: 240, total: 45740, netChange: 3520 },
        { month: "Nis 2026", safe: 38000, portfolio: 17000, kids: 210, total: 55210, netChange: 9470 },
        { month: "May 2026", safe: 36000, portfolio: 15500, kids: 230, total: 51730, netChange: -3480 },
        { month: "Haz 2026", safe: 50000, portfolio: 48600, kids: 250, total: 98850, netChange: 47120 }
    ]
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
    demoAlertDismissed: false,
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
    },
    portfolio: {
        usd: 0,
        eur: 0,
        gold: 0,
        btc: 0,
        history: []
    },
    trackedAssets: { usd: true, eur: true, gold: true, btc: true },
    shoppingCart: [],
    savingsHistory: []
};

// Global Uygulama Durum Değişkenleri
let state = null;
let selectedProfileForPinId = null;
let enteredPin = "";

// Global Yatırım Kurları
let exchangeRates = { usd: 32.50, eur: 35.20, gold: 2450.00, btc: 2150000.00 };
let lastRates = { usd: 32.50, eur: 35.20, gold: 2450.00, btc: 2150000.00 };

// İnteraktif Tur Adımları
const tourSteps = [
    { target: ".sidebar-nav", title: "Menü ve Gezinme", text: "Buradan Bütçe Paneli, Gelir/Gider geçmişi, Borç Stratejileri ve Karar Simülatörü sayfaları arasında geçiş yapabilirsiniz.", position: "right" },
    { target: ".header-summary-card", title: "Ortak Bakiye", text: "Ailenizin ortak bütçesindeki toplam parayı buradan anlık takip edebilirsiniz.", position: "bottom" },
    { target: ".profile-widget", title: "Profil Değiştirici", text: "Eşiniz veya çocuklarınızın hesapları arasında şık ve güvenli PIN kodlarıyla buradan geçiş yapabilirsiniz.", position: "right" },
    { target: "#demoDataAlert", title: "Demo Veri Yükle", text: "Sisteminiz şu an tamamen temiz. Uygulamanın tüm özelliklerini doldurulmuş grafiklerle görmek için bu butona basarak demo verilerini hemen yükleyebilirsiniz!", position: "bottom" }
];
let currentTourStep = 0;

// ==========================================================================
// UYGULAMA BAŞLANGICI VE LOAD İŞLEMLERİ (SUPABASE BULUT ENTEGRASYONU)
// ==========================================================================
const SUPABASE_URL = "https://gacxkjgcaptmqpikqpqv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhY3hramdjYXB0bXFwaWtxcHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMjAyNDksImV4cCI6MjA5Njg5NjI0OX0.V-ibRcg8a8g9h4ubWNEDpDte6ycZnZw2-nwsJPJUa2w";

let supabaseClient = null;
if (typeof supabase !== 'undefined' && SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY") {
    try {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Supabase client initialized successfully.");
    } catch (e) {
        console.warn("Supabase initialization failed, running in Local-Only Fallback mode:", e);
    }
} else {
    console.log("Supabase configuration not found or placeholder values active. Running in Local-Only Fallback mode.");
}

async function syncStateWithCloud() {
    if (!supabaseClient) return false;
    try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (user) {
            const { data, error } = await supabaseClient
                .from('family_budgets')
                .select('state_data')
                .eq('user_id', user.id)
                .single();
            
            if (error && error.code !== 'PGRST116') {
                console.error("Supabase fetch error:", error);
                return false;
            }
            
            if (data && data.state_data) {
                state = data.state_data;
                localStorage.setItem("smart_budget_state", JSON.stringify(state));
                console.log("State synced from Supabase cloud.");
                return true;
            }
        }
    } catch (e) {
        console.warn("Supabase fetch failed, running locally:", e);
    }
    return false;
}

function ensureStateDefaults() {
    if (!state.portfolio) {
        state.portfolio = { usd: 0, eur: 0, gold: 0, btc: 0, history: [] };
    }
    if (!state.shoppingCart) {
        state.shoppingCart = [];
    }
    if (!state.trackedAssets) {
        state.trackedAssets = { usd: true, eur: true, gold: true, btc: true };
    }
    if (!state.savingsHistory) {
        state.savingsHistory = [];
    }
}

// DOM Yüklendiğinde veya Sayfa Zaten Yüklendiyse Uygulamayı Başlat
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initApp());
} else {
    initApp();
}

async function initApp() {
    const storedState = localStorage.getItem("smart_budget_state");
    if (storedState) {
        try {
            state = JSON.parse(storedState);
            ensureStateDefaults();
        } catch (e) {
            console.error("State parse hatası, varsayılan yükleniyor...", e);
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    } else {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState();
    }

    if (supabaseClient) {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            const synced = await syncStateWithCloud();
            if (synced) {
                updateUI();
            }
        }
    }

    // Tarih inputunu bugün yap
    const dateInput = document.getElementById("transDate");
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Event Dinleyicilerini Bağla
    bindEvents();

    // Hoş geldiniz ekranı & Giriş akışını kontrol et
    await checkWelcomeFlow();
}

async function checkWelcomeFlow() {
    const overlay = document.getElementById("welcomeOverlay");
    
    let isLoggedIn = false;
    if (supabaseClient) {
        const { data: { session } } = await supabaseClient.auth.getSession();
        isLoggedIn = !!session;
    } else {
        isLoggedIn = !!state.account;
    }
    
    if (!isLoggedIn) {
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

async function saveState() {
    localStorage.setItem("smart_budget_state", JSON.stringify(state));
    
    if (supabaseClient) {
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (user) {
                const { error } = await supabaseClient
                    .from('family_budgets')
                    .upsert({ 
                        user_id: user.id, 
                        state_data: state,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });
                
                if (error) {
                    console.error("Supabase upsert error:", error);
                } else {
                    console.log("Supabase state saved successfully.");
                }
            }
        } catch (e) {
            console.warn("Could not save to Supabase cloud:", e);
        }
    }
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

    document.getElementById("registerForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPass").value;
        
        if (supabaseClient) {
            showToast("Kayıt olunuyor...", "info");
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password
            });
            
            if (error) {
                showToast("Kayıt hatası: " + error.message, "error");
                return;
            }
            
            showToast("Hesap başarıyla oluşturuldu! Giriş yapılıyor...", "success");
            
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
            state.account = { email, password };
            await saveState();
        } else {
            state = JSON.parse(JSON.stringify(DEFAULT_STATE));
            state.account = { email, password };
            saveState();
            showToast("Hesap yerel bellekte oluşturuldu (Çevrimdışı mod).", "success");
        }
        
        document.getElementById("regEmail").value = "";
        document.getElementById("regPass").value = "";
        
        await checkWelcomeFlow();
    });

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("logEmail").value.trim();
        const password = document.getElementById("logPass").value;
        
        if (supabaseClient) {
            showToast("Giriş yapılıyor...", "info");
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password
            });
            
            if (error) {
                showToast("Giriş başarısız: " + error.message, "error");
                return;
            }
            
            showToast("Giriş başarılı! Verileriniz eşitleniyor...", "success");
            await syncStateWithCloud();
        } else {
            if (state.account && state.account.email === email && state.account.password === password) {
                showToast("Giriş başarılı (Çevrimdışı mod).", "success");
            } else {
                showToast("E-posta veya şifre hatalı! Lütfen tekrar deneyiniz.", "error");
                return;
            }
        }
        
        document.getElementById("logEmail").value = "";
        document.getElementById("logPass").value = "";
        
        await checkWelcomeFlow();
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
    
    const closeDemoBtn = document.getElementById("closeDemoAlertBtn");
    if (closeDemoBtn) {
        closeDemoBtn.addEventListener("click", () => {
            state.demoAlertDismissed = true;
            saveState();
            const alertDiv = document.getElementById("demoDataAlert");
            if (alertDiv) alertDiv.style.display = "none";
            showToast("Demo veri yükleme uyarısı gizlendi.", "info");
        });
    }

    // === SİSTEMİ SIFIRLAMA / ÇIKIŞ YAPMA DINLEYICISI ===
    const resetBtn = document.getElementById("systemResetBtn");
    if (resetBtn) {
        resetBtn.addEventListener("click", async () => {
            if (confirm("Çıkış yapmak ve tüm yerel verilerinizi sıfırlamak istediğinize emin misiniz?")) {
                localStorage.removeItem("smart_budget_state");
                if (supabaseClient) {
                    try {
                        await supabaseClient.auth.signOut();
                        showToast("Oturum kapatıldı.", "info");
                    } catch (e) {
                        console.warn("Supabase signout failed:", e);
                    }
                }
                location.reload();
            }
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

    // === YATIRIM VE PORTFÖY EVENT DİNLEYİCİLERİ ===
    const simulateRatesBtn = document.getElementById("simulateRatesBtn");
    if (simulateRatesBtn) {
        simulateRatesBtn.addEventListener("click", () => {
            simulateMarketRates();
        });
    }

    const refreshRatesBtn = document.getElementById("refreshRatesBtn");
    if (refreshRatesBtn) {
        refreshRatesBtn.addEventListener("click", () => {
            fetchRealTimeRates().then(() => {
                renderInvestments();
                showToast("Gerçek zamanlı piyasa kurları güncellendi.", "success");
            }).catch(err => {
                console.error("Real-time kurlar çekilemedi:", err);
                showToast("Canlı kurlar çekilirken hata oluştu!", "error");
            });
        });
    }

    const assetTradeForm = document.getElementById("assetTradeForm");
    if (assetTradeForm) {
        assetTradeForm.addEventListener("submit", (e) => {
            e.preventDefault();
            tradeAsset(e);
        });
    }

    const tradeAmountInput = document.getElementById("tradeAmount");
    const tradeAssetSelect = document.getElementById("tradeAsset");
    const tradeTypeSelect = document.getElementById("tradeType");
    const tradeEstTotal = document.getElementById("tradeEstTotal");

    function updateEstTotal() {
        if (!tradeAmountInput || !tradeAssetSelect || !tradeEstTotal) return;
        const amount = parseFloat(tradeAmountInput.value) || 0;
        const asset = tradeAssetSelect.value;
        if (!asset) {
            tradeEstTotal.innerText = "0,00 ₺";
            return;
        }
        const rate = exchangeRates[asset] || 0;
        const total = amount * rate;
        
        const type = tradeTypeSelect ? tradeTypeSelect.value : "buy";
        if (type === "add_direct" || type === "remove_direct") {
            tradeEstTotal.innerHTML = `${formatCurrency(total)} <span style="font-size: 9px; color: var(--text-muted);">(Kasa Etkilenmez)</span>`;
        } else {
            tradeEstTotal.innerText = formatCurrency(total);
        }
    }

    if (tradeAmountInput) {
        tradeAmountInput.addEventListener("input", updateEstTotal);
    }
    if (tradeAssetSelect) {
        tradeAssetSelect.addEventListener("change", updateEstTotal);
    }
    if (tradeTypeSelect) {
        tradeTypeSelect.addEventListener("change", updateEstTotal);
    }

    // === AKILLI ALIŞVERİŞ SEPETİ DİNLEYİCİLERİ ===
    const cartAddForm = document.getElementById("cartAddForm");
    if (cartAddForm) {
        cartAddForm.addEventListener("submit", (e) => {
            e.preventDefault();
            addToCart(e);
        });
    }

    const clearCartBtn = document.getElementById("clearCartBtn");
    if (clearCartBtn) {
        clearCartBtn.addEventListener("click", () => {
            clearCart();
        });
    }

    const buyCartBtn = document.getElementById("buyCartBtn");
    if (buyCartBtn) {
        buyCartBtn.addEventListener("click", () => {
            buyCart();
        });
    }

    // === YATIRIM SEÇİM LİSTESİ FİLTRE DİNLEYİCİSİ ===
    const trackers = ["trackUsd", "trackEur", "trackGold", "trackBtc"];
    trackers.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("change", () => {
                const key = id.replace("track", "").toLowerCase(); // usd, eur, gold, btc
                if (!state.trackedAssets) state.trackedAssets = { usd: true, eur: true, gold: true, btc: true };
                state.trackedAssets[key] = el.checked;
                saveState();
                renderInvestments();
                showToast("Takip listesi güncellendi.", "info");
            });
        }
    });
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
function adjustDemoDates(demoState) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    
    if (demoState.transactions) {
        demoState.transactions.forEach(t => {
            if (t.date) {
                const parts = t.date.split("-");
                if (parts.length === 3) {
                    t.date = `${currentYear}-${currentMonth}-${parts[2]}`;
                }
            }
        });
    }
    
    if (demoState.savingsHistory) {
        const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
        for (let i = 0; i < demoState.savingsHistory.length; i++) {
            const d = new Date();
            d.setMonth(now.getMonth() - (demoState.savingsHistory.length - 1 - i));
            const mLabel = monthNames[d.getMonth()];
            const yLabel = d.getFullYear();
            demoState.savingsHistory[i].month = `${mLabel} ${yLabel}`;
        }
    }
}

function loadDemoData() {
    const confirmLoad = confirm("Uygulamayı dolu verilerle hızlıca test etmek için demo verilerini yüklemek istiyor musunuz?");
    if (confirmLoad) {
        const currentAccount = state.account;
        const demoState = JSON.parse(JSON.stringify(DEMO_DATA_STATE));
        adjustDemoDates(demoState);
        state = demoState;
        state.account = currentAccount;
        state.onboardingCompleted = true;
        saveState();
        updateUI();
        
        const tooltip = document.getElementById("onboardingTooltip");
        if (tooltip) tooltip.style.display = "none";
        
        showToast("Demo verileri başarıyla yüklendi!", "success");
    }
}

// ==========================================================================
// SEKME YÖNETİMİ
// ==========================================================================
function switchTab(tabName) {
    const activeProfile = getActiveProfile();
    if (activeProfile && activeProfile.role === "Çocuk" && (tabName === "investments" || tabName === "savings")) {
        showToast("Bu panele sadece ebeveynler erişebilir!", "warning");
        switchTab("dashboard");
        
        // Menüdeki active class'ı güncelle
        document.querySelectorAll(".nav-item").forEach(i => {
            if (i.getAttribute("data-tab") === "dashboard") {
                i.classList.add("active");
            } else {
                i.classList.remove("active");
            }
        });
        return;
    }

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
        investments: { title: "Yatırım & Varlık Portföyü", subtitle: "Altın, Döviz ve sanal varlıklarınızı anlık simülasyonlarla takip edin." },
        savings: { title: "Toplam Birikim Analizi", subtitle: "Tüm aile birikimlerinizi ve aylık gelişim trendini takip edin." },
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
        renderShoppingCart();
    } else if (tabName === "investments") {
        renderInvestments();
        fetchRealTimeRates().then(() => {
            renderInvestments();
            showToast("Gerçek zamanlı piyasa kurları güncellendi.", "success");
        }).catch(err => {
            console.error("Gerçek zamanlı kurlar alınamadı:", err);
        });
    } else if (tabName === "savings") {
        renderSavingsPage();
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
    if (!activeProfile) return 0;
    
    if (activeProfile.role === "Çocuk") {
        // Çocuk sadece kendi kumbarasını görür
        return activeProfile.balanceContribution || 0;
    }
    
    // Ebeveyn ortak bütçeyi (tüm ebeveynlerin bakiye katkısını) görür. Çocuk bakiyesi hariç.
    return state.profiles
        .filter(p => p.role === "Ebeveyn")
        .reduce((sum, p) => sum + (p.balanceContribution || 0), 0);
}

function calculateFinancials() {
    // Aylık gelir ve giderleri hesapla
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    state.transactions.forEach(t => {
        if (!t.date) return;
        const dateParts = t.date.split("-");
        if (dateParts.length >= 2) {
            const tYear = parseInt(dateParts[0], 10);
            const tMonth = parseInt(dateParts[1], 10) - 1; // 0-11
            
            if (tMonth === currentMonth && tYear === currentYear) {
                if (t.type === "income") {
                    monthlyIncome += t.amount;
                } else if (t.type === "expense") {
                    monthlyExpense += t.amount;
                }
            }
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

    if (!desc) {
        showToast("Lütfen bir açıklama giriniz!", "error");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        showToast("Lütfen geçerli ve sıfırdan büyük bir tutar giriniz!", "error");
        return;
    }
    if (!date) {
        showToast("Lütfen geçerli bir tarih seçiniz!", "error");
        return;
    }
    if (!memberId) {
        showToast("Lütfen işlemi yapan üyeyi seçiniz!", "error");
        return;
    }

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
                showToast(`⚠️ DİKKAT: "${category}" bütçe limiti aşıldı! Limit: ${formatCurrency(limit)}, Toplam harcama: ${formatCurrency(totalSpent)}`, "error");
            } else if (totalSpent >= limit * 0.8) {
                showToast(`⚠️ UYARI: "${category}" bütçesi sınırda! Toplam harcama bütçenin %80'ine ulaştı. (${formatCurrency(totalSpent)} / ${formatCurrency(limit)})`, "warning");
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
        
        let amountClass = 'text-red';
        let amountSign = '-';
        if (t.type === 'income') {
            amountClass = 'text-green';
            amountSign = '+';
        } else if (t.type === 'direct_add') {
            amountClass = 'text-neon-cyan';
            amountSign = '+';
        } else if (t.type === 'direct_remove') {
            amountClass = 'text-neon-orange';
            amountSign = '-';
        }
        
        tr.innerHTML = `
            <td>${formatDate(t.date)}</td>
            <td><i class="fa-solid ${member ? member.avatar : 'fa-user'}"></i> ${member ? member.name : 'Silinmiş Üye'}</td>
            <td><span class="category-badge-text">${t.category}</span></td>
            <td>${t.desc} ${t.isRecurring ? '<i class="fa-solid fa-arrows-spin text-muted" title="Sabit Harcama"></i>' : ''}</td>
            <td class="${amountClass} font-weight-bold">
                ${amountSign}${formatCurrency(t.amount)}
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
        
        let iconClass = 'fa-circle-minus expense';
        let amountSign = '-';
        if (t.type === 'income') {
            iconClass = 'fa-circle-plus income';
            amountSign = '+';
        } else if (t.type === 'direct_add') {
            iconClass = 'fa-circle-plus direct_add';
            amountSign = '+';
        } else if (t.type === 'direct_remove') {
            iconClass = 'fa-circle-minus direct_remove';
            amountSign = '-';
        }

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
                ${amountSign}${formatCurrency(t.amount)}
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

    if (!title || !creditor) {
        showToast("Lütfen borç başlığı ve alacaklı alanlarını doldurunuz!", "error");
        return;
    }
    if (isNaN(totalAmount) || totalAmount <= 0) {
        showToast("Lütfen geçerli ve sıfırdan büyük bir borç tutarı giriniz!", "error");
        return;
    }
    if (isNaN(minPayment) || minPayment < 0) {
        showToast("Lütfen geçerli bir taksit/minimum ödeme tutarı giriniz!", "error");
        return;
    }

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
        
        // Bu ay borçlar için ayrılan bütçe = netMonthlySavings
        let monthlyPool = netMonthlySavings;
        
        // 1. ADIM: Tüm aktif borçlara faiz işlet
        for (let i = 0; i < simDebts.length; i++) {
            let debt = simDebts[i];
            if (debt.currentTotal <= 0) continue;
            
            if (debt.interestRate > 0) {
                const monthlyInterest = debt.currentTotal * ((debt.interestRate / 100) / 12);
                debt.currentTotal += monthlyInterest;
            }
        }
        
        // 2. ADIM: Tüm aktif borçların asgari ödemelerini havuzdan karşılayarak öde
        for (let i = 0; i < simDebts.length; i++) {
            let debt = simDebts[i];
            if (debt.currentTotal <= 0) continue;
            
            // Asgari ödeme tutarı (borç kalanından büyük olamaz)
            let minToPay = Math.min(debt.currentTotal, debt.minPayment);
            
            // Havuzda asgariyi karşılayacak kadar para var mı?
            let paidAmount = Math.min(minToPay, monthlyPool);
            debt.currentTotal -= paidAmount;
            monthlyPool -= paidAmount;
        }
        
        // 3. ADIM: Havuzda kalan ekstra parayı seçilen stratejiye göre 1. aktif borca yatır (Booster)
        if (monthlyPool > 0) {
            for (let i = 0; i < simDebts.length; i++) {
                let debt = simDebts[i];
                if (debt.currentTotal <= 0) continue;
                
                let extraPaid = Math.min(debt.currentTotal, monthlyPool);
                debt.currentTotal -= extraPaid;
                monthlyPool -= extraPaid;
                
                if (monthlyPool <= 0) break; // Havuz bitti
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

    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();

    // Maaş/recurring hariç bu ayki ortak giderlerin toplamını bulalım
    const sharedExpenses = state.transactions.filter(t => {
        if (t.type !== "expense" || t.isRecurring) return false;
        if (!t.date) return false;
        const dateParts = t.date.split("-");
        if (dateParts.length < 2) return false;
        const tYear = parseInt(dateParts[0], 10);
        const tMonth = parseInt(dateParts[1], 10) - 1; // 0-11
        return tMonth === currentMonth && tYear === currentYear;
    });
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

    // Açgözlü (Greedy) Mahsuplaşma Algoritması:
    // Borçluların borçlarını alacaklılara birebir (fazladan veya eksik olmadan) aktarmasını sağlar.
    const localDebtors = debtors.map(d => ({ id: d.id, amount: Math.abs(d.balance) }));
    const localCreditors = creditors.map(c => ({ id: c.id, amount: c.balance }));

    let dIdx = 0, cIdx = 0;
    while (dIdx < localDebtors.length && cIdx < localCreditors.length) {
        const debtor = localDebtors[dIdx];
        const creditor = localCreditors[cIdx];
        const settleAmount = Math.min(debtor.amount, creditor.amount);

        const debtorProfile = state.profiles.find(p => p.id === debtor.id);
        const creditorProfile = state.profiles.find(p => p.id === creditor.id);

        if (debtorProfile && creditorProfile) {
            debtorProfile.balanceContribution -= settleAmount;
            creditorProfile.balanceContribution += settleAmount;
        }

        debtor.amount -= settleAmount;
        creditor.amount -= settleAmount;

        if (debtor.amount < 0.01) dIdx++;
        if (creditor.amount < 0.01) cIdx++;
    }

    // Bu mahsuplaşmayı bütçeye yansıtan temsili bir işlem ekle
    const settlementTrans = {
        id: "t_" + Date.now(),
        desc: "Ortak Gider Mahsuplaşması (Bakiyeler Sıfırlandı)",
        amount: 0,
        type: "income",
        category: "Diğer",
        date: new Date().toISOString().split('T')[0],
        memberId: state.activeProfileId || state.profiles.find(p => p.role === "Ebeveyn").id,
        isRecurring: false
    };

    state.transactions.unshift(settlementTrans);
    saveState();
    updateUI();
    
    showToast("Ortak bütçe gider mahsuplaşması tamamlandı! Üye bakiyeleri eşitlendi.", "success");
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

    if (!name) {
        showToast("Lütfen senaryo adı giriniz!", "error");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        showToast("Lütfen geçerli ve sıfırdan büyük bir senaryo tutarı giriniz!", "error");
        return;
    }

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

    if (!title) {
        showToast("Lütfen bir hedef başlığı giriniz!", "error");
        return;
    }
    if (isNaN(cost) || cost <= 0) {
        showToast("Lütfen geçerli ve sıfırdan büyük bir hedef tutarı giriniz!", "error");
        return;
    }

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
        
        // Hedef sahibinin rolüne göre ilgili bakiyeyi belirle (Çocuk için kendi kumbarası, Ebeveyn için aile bütçesi)
        const targetBalance = (member && member.role === "Çocuk") 
            ? (member.balanceContribution || 0) 
            : state.profiles.filter(p => p.role === "Ebeveyn").reduce((sum, p) => sum + (p.balanceContribution || 0), 0);

        // İlerleme yüzdesi hesaplama
        let progress = 0;
        if (targetBalance >= g.cost) {
            progress = 100;
        } else if (targetBalance > 0) {
            progress = Math.round((targetBalance / g.cost) * 100);
        }

        // Satın alma vadesi tahmini
        let forecastText = "";
        if (targetBalance >= g.cost) {
            forecastText = "Satın Alınabilir! Bütçe yeterli.";
        } else if (monthlyNetSavings <= 0) {
            forecastText = "Birikim hızı yetersiz (Giderler geliri aşıyor).";
        } else {
            const monthsNeeded = Math.ceil((g.cost - targetBalance) / monthlyNetSavings);
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

    // Portföy değerini hesapla
    const usdVal = (state.portfolio?.usd || 0) * (exchangeRates.usd || 0);
    const eurVal = (state.portfolio?.eur || 0) * (exchangeRates.eur || 0);
    const goldVal = (state.portfolio?.gold || 0) * (exchangeRates.gold || 0);
    const btcVal = (state.portfolio?.btc || 0) * (exchangeRates.btc || 0);
    const portfolioVal = usdVal + eurVal + goldVal + btcVal;
    
    // Toplam Likit Aile Serveti (Kasa + Portföy)
    const totalLiquidWealth = balance + portfolioVal;

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

    // 3. Acil Durum Fonu Tamponu (Kaç aylık sabit gider kadar likit varlık var?)
    let emergencyBuffer = 0;
    if (financials.monthlyExpense > 0) {
        emergencyBuffer = totalLiquidWealth / financials.monthlyExpense;
    }
    const scoreEmergency = Math.max(0, Math.min(100, Math.round((emergencyBuffer / 3) * 100))); // 3 ay ve üzeri = 100 puan

    // 4. Yatırım Alışkanlığı (Yatırım kategorisindeki işlemler ve portföy hareketleri)
    const investmentCount = state.transactions.filter(t => t.category === "Yatırım Geliri" || t.isTrade).length;
    const scoreInvestment = Math.min(100, 20 + (investmentCount * 25)); // her yatırım işlemi 25 puan, max 100

    // 5. Bütçe Sadakati (Aylık bakiye gelişiminin pozitif olması)
    const scoreDiscipline = financials.monthlyIncome >= financials.monthlyExpense ? 100 : 30;

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

    if (!title) {
        showToast("Lütfen görev açıklaması giriniz!", "error");
        return;
    }
    if (isNaN(reward) || reward <= 0) {
        showToast("Lütfen geçerli ve sıfırdan büyük bir görev ödülü giriniz!", "error");
        return;
    }

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
        showToast("Harika! Görev tamamlandı olarak işaretlendi ve ebeveyn onayına gönderildi.", "success");
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
            memberId: state.activeProfileId || state.profiles.find(p => p.role === "Ebeveyn").id,
            isRecurring: false
        };
        
        // Aile ebeveyn bakiyesini düşür
        const parent = state.profiles.find(p => p.id === state.activeProfileId) || state.profiles.find(p => p.role === "Ebeveyn");
        if (parent) parent.balanceContribution -= task.reward;

        state.transactions.unshift(expTrans);
        saveState();
        updateUI();
        
        showToast("Görev onaylandı! Harçlık çocuğun kumbarasına yatırıldı.", "success");
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
        if (!state.demoAlertDismissed && state.transactions.length === 0 && activeProfile && activeProfile.role === "Ebeveyn") {
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
    
    // Birikim geçmişi verilerini güncelle
    updateSavingsHistoryRecord();

    // Grafikleri yeniden çiz
    renderDashboardCharts();
    
    // Eğer şu an birikim sekmesindeysek, birikim sayfasını yenile
    const savingsPanel = document.getElementById("savingsPanel");
    if (savingsPanel && savingsPanel.classList.contains("active")) {
        renderSavingsPage();
    }

    // Eğer şu an karar simülatörü sekmesindeysek, simülatör grafiklerini yenile
    const sandboxPanel = document.getElementById("sandboxPanel");
    if (sandboxPanel && sandboxPanel.classList.contains("active")) {
        if (window.updateSandboxCharts) {
            window.updateSandboxCharts();
        }
    }
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
    
    showToast("Kategori limitleri başarıyla güncellendi!", "success");
}

// --- 2. Tasarruf Ligi (Puan & Rozet) ---
function awardPoints(profileId, amount, reason) {
    const profile = state.profiles.find(p => p.id === profileId);
    if (profile) {
        if (profile.points === undefined) profile.points = 0;
        profile.points += amount;
        saveState();
        showToast(`+${amount} Puan: ${profile.name} (${reason})`, "success");
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
            showToast(`🎉 ${profile.name} "Görev Canavarı" rozetini kazandı!`, "success");
        }
    }

    // Rozet 2: Bütçe Koruyucusu (Harcamaları limitin %80'inin altında tutma)
    if (profile.role === "Ebeveyn") {
        const now = new Date();
        const currentMonth = now.getMonth(); // 0-11
        const currentYear = now.getFullYear();

        const limits = state.categoryLimits || {};
        const limitedCategories = Object.keys(limits).filter(cat => limits[cat] > 0);
        
        if (limitedCategories.length > 0) {
            let withinLimit = true;
            
            limitedCategories.forEach(cat => {
                const limit = limits[cat];
                // Cari ay içerisindeki aile geneli toplam kategori harcaması
                const totalSpent = state.transactions
                    .filter(t => {
                        if (t.type !== "expense" || t.category !== cat) return false;
                        if (!t.date) return false;
                        const dateParts = t.date.split("-");
                        if (dateParts.length < 2) return false;
                        const tYear = parseInt(dateParts[0], 10);
                        const tMonth = parseInt(dateParts[1], 10) - 1; // 0-11
                        return tMonth === currentMonth && tYear === currentYear;
                    })
                    .reduce((sum, t) => sum + t.amount, 0);
                
                if (totalSpent > limit * 0.8) {
                    withinLimit = false;
                }
            });
            
            if (withinLimit && !profile.badges.includes("Bütçe Koruyucusu")) {
                profile.badges.push("Bütçe Koruyucusu");
                showToast(`🎉 ${profile.name} "Bütçe Koruyucusu" rozetini kazandı!`, "success");
            }
        }
    }

    // Rozet 3: Birikim Ustası / Kumbara Ortağı
    const currentBalance = getFamilyBalance();
    if (profile.role === "Çocuk" && profile.balanceContribution >= 500 && !profile.badges.includes("Birikim Ustası")) {
        profile.badges.push("Birikim Ustası");
        showToast(`🎉 ${profile.name} "Birikim Ustası" rozetini kazandı!`, "success");
    } else if (profile.role === "Ebeveyn" && currentBalance >= 20000 && !profile.badges.includes("Kumbara Ortağı")) {
        profile.badges.push("Kumbara Ortağı");
        showToast(`🎉 ${profile.name} "Kumbara Ortağı" rozetini kazandı!`, "success");
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
    
    // Ses çal
    playCoinSound();
    
    const coin = document.createElement("div");
    coin.className = "dropping-coin";
    
    const randomOffset = Math.floor(Math.random() * 20) - 10;
    coin.style.left = `calc(50% + ${randomOffset}px)`;
    
    coinContainer.appendChild(coin);
    
    // Parçacıkları tetikle (coin dibe ulaşınca)
    setTimeout(triggerCoinParticles, 650);
    
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

// ==========================================================================
// YENİ GÖRSEL VE İLERİ FİNANSAL YARDIMCI FONKSİYONLARI (TOAST, SES, YATIRIM, SEPET)
// ==========================================================================

// --- 1. Neon Toast Bildirim Sistemi ---
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;
    
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let icon = "fa-circle-info";
    let title = "BİLGİ";
    
    if (type === "success") {
        icon = "fa-circle-check";
        title = "BAŞARILI";
    } else if (type === "warning") {
        icon = "fa-triangle-exclamation";
        title = "UYARI";
    } else if (type === "error") {
        icon = "fa-circle-xmark";
        title = "HATA";
    }
    
    toast.innerHTML = `
        <i class="fa-solid ${icon} toast-icon"></i>
        <div class="toast-content">
            <h5>${title}</h5>
            <p>${message}</p>
        </div>
    `;
    
    container.appendChild(toast);
    
    // 4 saniye sonra kapat
    setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}
window.showToast = showToast;

// --- 2. Kumbara Synth Ses & Parçacık Patlaması ---
function playCoinSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = "sine";
        const now = audioCtx.currentTime;
        
        // Klasik retro altın para sesi (ikili ton)
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5
        osc.frequency.setValueAtTime(1174.66, now + 0.16); // D6
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        
        osc.start(now);
        osc.stop(now + 0.5);
    } catch (e) {
        console.log("Ses sentezleyici başlatılamadı:", e);
    }
}

function triggerCoinParticles() {
    const jar = document.querySelector("#savingsJarWidget .jar-glass");
    if (!jar || document.getElementById("savingsJarWidget").style.display === "none") return;
    
    // 12 adet altın parçacık patlat
    for (let i = 0; i < 12; i++) {
        const p = document.createElement("div");
        p.className = "jar-particle";
        
        // Kavanozun taban-orta bölgesinden başlatalım
        p.style.bottom = "15px";
        p.style.left = "calc(50% - 3px)";
        
        // Yukarı doğru yarım daire açıları
        const angle = Math.random() * Math.PI - Math.PI; // -180 ile 0 derece arası
        const dist = Math.random() * 45 + 15;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 10;
        
        p.style.setProperty("--dx", `${dx}px`);
        p.style.setProperty("--dy", `${dy}px`);
        
        jar.appendChild(p);
        
        // Animasyon bitince temizle
        setTimeout(() => p.remove(), 600);
    }
}

// --- 3. Yatırım & Varlık Portföy Yönetimi ---
let portfolioChartInstance = null;

function renderInvestments() {
    if (!state.portfolio) {
        state.portfolio = { usd: 0, eur: 0, gold: 0, btc: 0, history: [] };
    }
    if (!state.trackedAssets) {
        state.trackedAssets = { usd: true, eur: true, gold: true, btc: true };
    }
    
    // Checkbox durumlarını güncelle
    document.getElementById("trackUsd").checked = state.trackedAssets.usd;
    document.getElementById("trackEur").checked = state.trackedAssets.eur;
    document.getElementById("trackGold").checked = state.trackedAssets.gold;
    document.getElementById("trackBtc").checked = state.trackedAssets.btc;
    
    // Varlık kartlarını göster veya gizle
    document.getElementById("cardUsd").style.display = state.trackedAssets.usd ? "block" : "none";
    document.getElementById("cardEur").style.display = state.trackedAssets.eur ? "block" : "none";
    document.getElementById("cardGold").style.display = state.trackedAssets.gold ? "block" : "none";
    document.getElementById("cardBtc").style.display = state.trackedAssets.btc ? "block" : "none";
    
    // Form asset select seçeneklerini sadece takip edilenlere göre güncelle
    const tradeAssetSelect = document.getElementById("tradeAsset");
    if (tradeAssetSelect) {
        tradeAssetSelect.innerHTML = "";
        const labels = { usd: "Dolar ($)", eur: "Euro (€)", gold: "Altın (Gram)", btc: "Bitcoin (BTC)" };
        let count = 0;
        Object.keys(state.trackedAssets).forEach(key => {
            if (state.trackedAssets[key]) {
                const opt = document.createElement("option");
                opt.value = key;
                opt.innerText = labels[key];
                tradeAssetSelect.appendChild(opt);
                count++;
            }
        });
        if (count === 0) {
            const opt = document.createElement("option");
            opt.value = "";
            opt.innerText = "Önce bir varlık seçin";
            tradeAssetSelect.appendChild(opt);
        }
    }
    
    // Değerleri HTML'e yaz
    const pUsd = state.portfolio.usd || 0;
    const pEur = state.portfolio.eur || 0;
    const pGold = state.portfolio.gold || 0;
    const pBtc = state.portfolio.btc || 0;

    document.getElementById("portfolioUsd").innerText = `$${pUsd.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById("portfolioEur").innerText = `€${pEur.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    document.getElementById("portfolioGold").innerText = `${pGold.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} gr`;
    document.getElementById("portfolioBtc").innerText = `${pBtc.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 6 })} BTC`;
    
    const usdTl = pUsd * exchangeRates.usd;
    const eurTl = pEur * exchangeRates.eur;
    const goldTl = pGold * exchangeRates.gold;
    const btcTl = pBtc * exchangeRates.btc;
    
    document.getElementById("portfolioUsdTl").innerText = formatCurrency(usdTl);
    document.getElementById("portfolioEurTl").innerText = formatCurrency(eurTl);
    document.getElementById("portfolioGoldTl").innerText = formatCurrency(goldTl);
    document.getElementById("portfolioBtcTl").innerText = formatCurrency(btcTl);
    
    document.getElementById("rateUsd").innerText = exchangeRates.usd.toFixed(2);
    document.getElementById("rateEur").innerText = exchangeRates.eur.toFixed(2);
    document.getElementById("rateGold").innerText = exchangeRates.gold.toFixed(2);
    document.getElementById("rateBtc").innerText = exchangeRates.btc.toLocaleString('tr-TR');
    
    // Kurlar trend göstergelerini güncelle
    updateTrendDisplay("usdTrend", exchangeRates.usd, lastRates.usd);
    updateTrendDisplay("eurTrend", exchangeRates.eur, lastRates.eur);
    updateTrendDisplay("goldTrend", exchangeRates.gold, lastRates.gold);
    updateTrendDisplay("btcTrend", exchangeRates.btc, lastRates.btc);
    
    // Formdaki Tahmini Tutarı güncelle
    const amountInput = document.getElementById("tradeAmount");
    if (amountInput) amountInput.value = "";
    const estTotalLabel = document.getElementById("tradeEstTotal");
    if (estTotalLabel) estTotalLabel.innerText = "0,00 ₺";
    
    // Çizgi grafiğini çiz
    renderPortfolioChart();
    
    // Alım Satım Geçmişini çiz
    renderTradeHistory();
}

function updateTrendDisplay(elementId, current, last) {
    const el = document.getElementById(elementId);
    if (!el) return;
    
    const diff = current - last;
    const pct = last > 0 ? (diff / last) * 100 : 0;
    
    if (diff > 0) {
        el.className = "rate-trend";
        el.innerHTML = `<i class="fa-solid fa-caret-up"></i> +${pct.toFixed(1)}%`;
    } else if (diff < 0) {
        el.className = "rate-trend negative";
        el.innerHTML = `<i class="fa-solid fa-caret-down"></i> ${pct.toFixed(1)}%`;
    } else {
        el.className = "rate-trend";
        el.style.background = "rgba(255,255,255,0.03)";
        el.style.color = "var(--text-secondary)";
        el.innerHTML = `<i class="fa-solid fa-minus"></i> 0.0%`;
    }
}

function simulateMarketRates() {
    // Son kurları yedekle
    lastRates = { ...exchangeRates };
    
    // Kurları dalgalandır (+-%1.5)
    exchangeRates.usd *= (1 + (Math.random() * 0.03 - 0.015));
    exchangeRates.eur *= (1 + (Math.random() * 0.03 - 0.015));
    exchangeRates.gold *= (1 + (Math.random() * 0.03 - 0.015));
    exchangeRates.btc *= (1 + (Math.random() * 0.05 - 0.025)); // BTC daha volatil
    
    // Portföyün yeni değerini hesaplayıp tarihçeye kaydet
    const totalValue = 
        ((state.portfolio.usd || 0) * exchangeRates.usd) +
        ((state.portfolio.eur || 0) * exchangeRates.eur) +
        ((state.portfolio.gold || 0) * exchangeRates.gold) +
        ((state.portfolio.btc || 0) * exchangeRates.btc);
        
    if (!state.portfolio.history) state.portfolio.history = [];
    state.portfolio.history.push(Math.round(totalValue));
    
    // Max 10 tarih kaydı tutalım
    if (state.portfolio.history.length > 10) {
        state.portfolio.history.shift();
    }
    
    saveState();
    renderInvestments();
    
    showToast("Piyasa kurları simüle edildi ve portföy değeriniz güncellendi!", "success");
    setTimeout(triggerCoinDrop, 100);
}

function tradeAsset(e) {
    const tradeType = document.getElementById("tradeType").value;
    const asset = document.getElementById("tradeAsset").value;
    const amount = parseFloat(document.getElementById("tradeAmount").value) || 0;
    
    if (amount <= 0) {
        showToast("Lütfen geçerli bir miktar girin!", "error");
        return;
    }
    
    const rate = exchangeRates[asset];
    const totalCost = amount * rate;
    const currentBalance = getFamilyBalance();
    const member = state.profiles.find(p => p.id === state.activeProfileId);
    
    if (tradeType === "buy") {
        if (currentBalance < totalCost) {
            showToast("Yetersiz ortak bakiye! Bu alım için ortak bakiye yetersiz.", "error");
            return;
        }
        
        // Varlığı ekle
        state.portfolio[asset] = (state.portfolio[asset] || 0) + amount;
        
        // Ortak bakiye düş
        if (member) {
            member.balanceContribution -= totalCost;
        }
        
        // Ortak bakiyeden düş (Harcama olarak kaydet)
        const trans = {
            id: "t_" + Date.now(),
            desc: `${asset.toUpperCase()} Alımı (${amount} Birim)`,
            amount: totalCost,
            type: "expense",
            category: "Yatırım Geliri",
            date: new Date().toISOString().split('T')[0],
            memberId: state.activeProfileId,
            isRecurring: false,
            isTrade: true,
            tradeType: "buy",
            asset: asset,
            assetAmount: amount,
            rate: rate
        };
        state.transactions.unshift(trans);
        showToast(`${amount} ${asset.toUpperCase()} başarıyla satın alındı!`, "success");
    } else if (tradeType === "sell") {
        // Satış işlemi
        if ((state.portfolio[asset] || 0) < amount) {
            showToast(`Yetersiz varlık miktarı! Portföyünüzde yeterli ${asset.toUpperCase()} bulunmuyor.`, "error");
            return;
        }
        
        // Varlığı düş
        state.portfolio[asset] -= amount;
        
        // Ortak bakiye ekle
        if (member) {
            member.balanceContribution += totalCost;
        }
        
        // Ortak bakiyeye ekle (Gelir olarak kaydet)
        const trans = {
            id: "t_" + Date.now(),
            desc: `${asset.toUpperCase()} Satışı (${amount} Birim)`,
            amount: totalCost,
            type: "income",
            category: "Yatırım Geliri",
            date: new Date().toISOString().split('T')[0],
            memberId: state.activeProfileId,
            isRecurring: false,
            isTrade: true,
            tradeType: "sell",
            asset: asset,
            assetAmount: amount,
            rate: rate
        };
        state.transactions.unshift(trans);
        showToast(`${amount} ${asset.toUpperCase()} başarıyla nakite çevrildi!`, "success");
    } else if (tradeType === "add_direct") {
        // Doğrudan Varlık Ekle (Kasa Etkilenmez)
        state.portfolio[asset] = (state.portfolio[asset] || 0) + amount;
        
        const trans = {
            id: "t_" + Date.now(),
            desc: `${asset.toUpperCase()} Doğrudan Girişi (${amount} Birim)`,
            amount: totalCost,
            type: "direct_add",
            category: "Yatırım Geliri",
            date: new Date().toISOString().split('T')[0],
            memberId: state.activeProfileId,
            isRecurring: false,
            isTrade: true,
            tradeType: "add_direct",
            asset: asset,
            assetAmount: amount,
            rate: rate
        };
        state.transactions.unshift(trans);
        showToast(`${amount} ${asset.toUpperCase()} portföye doğrudan eklendi!`, "success");
    } else if (tradeType === "remove_direct") {
        // Doğrudan Varlık Çıkar (Kasa Etkilenmez)
        if ((state.portfolio[asset] || 0) < amount) {
            showToast(`Yetersiz varlık miktarı! Portföyünüzde yeterli ${asset.toUpperCase()} bulunmuyor.`, "error");
            return;
        }
        
        state.portfolio[asset] -= amount;
        
        const trans = {
            id: "t_" + Date.now(),
            desc: `${asset.toUpperCase()} Doğrudan Çıkışı (${amount} Birim)`,
            amount: totalCost,
            type: "direct_remove",
            category: "Yatırım Geliri",
            date: new Date().toISOString().split('T')[0],
            memberId: state.activeProfileId,
            isRecurring: false,
            isTrade: true,
            tradeType: "remove_direct",
            asset: asset,
            assetAmount: amount,
            rate: rate
        };
        state.transactions.unshift(trans);
        showToast(`${amount} ${asset.toUpperCase()} portföyden doğrudan çıkarıldı!`, "success");
    }
    
    // Toplam portföy değerini güncelle ve geçmişe ekle
    const totalValue = 
        ((state.portfolio.usd || 0) * exchangeRates.usd) +
        ((state.portfolio.eur || 0) * exchangeRates.eur) +
        ((state.portfolio.gold || 0) * exchangeRates.gold) +
        ((state.portfolio.btc || 0) * exchangeRates.btc);
    
    if (!state.portfolio.history) state.portfolio.history = [];
    state.portfolio.history.push(Math.round(totalValue));
    if (state.portfolio.history.length > 10) state.portfolio.history.shift();
    
    saveState();
    updateUI();
    renderInvestments();
    setTimeout(triggerCoinDrop, 100);
}

function renderPortfolioChart() {
    const ctx = document.getElementById("portfolioHistoryChart");
    if (!ctx) return;
    
    if (portfolioChartInstance) {
        portfolioChartInstance.destroy();
    }
    
    const historyData = state.portfolio && state.portfolio.history && state.portfolio.history.length > 0
        ? state.portfolio.history 
        : [50000, 52000, 51000, 55000, 54000, 58000];
        
    const labels = historyData.map((_, idx) => `${idx + 1}. Dalga`);
    
    portfolioChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Portföy Değeri (₺)',
                data: historyData,
                borderColor: '#00f2fe',
                borderWidth: 2,
                pointBackgroundColor: '#00f2fe',
                pointBorderColor: 'rgba(255, 255, 255, 0.8)',
                pointRadius: 4,
                backgroundColor: 'rgba(0, 242, 254, 0.05)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.03)' },
                    ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 10 } }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.03)' },
                    ticks: { 
                        color: 'rgba(255, 255, 255, 0.5)', 
                        font: { size: 10 },
                        callback: function(value) { return value.toLocaleString('tr-TR') + ' ₺'; }
                    }
                }
            }
        }
    });
}

// --- 4. Akıllı Alışveriş Sepeti & Hedef Gecikme Simülasyonu ---
function renderShoppingCart() {
    if (!state.shoppingCart) state.shoppingCart = [];
    
    const list = document.getElementById("cartItemsList");
    const totalLabel = document.getElementById("cartTotalSum");
    const buyBtn = document.getElementById("buyCartBtn");
    
    if (!list) return;
    
    list.innerHTML = "";
    
    let totalSum = 0;
    
    if (state.shoppingCart.length === 0) {
        list.innerHTML = `<tr><td colspan="3" class="text-center text-muted">Sepetiniz boş.</td></tr>`;
        if (totalLabel) totalLabel.innerText = "0,00 ₺";
        if (buyBtn) buyBtn.disabled = true;
        document.getElementById("cartDelayWarning").style.display = "none";
        return;
    }
    
    state.shoppingCart.forEach((item, idx) => {
        totalSum += item.price;
        
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong style="color: white;">${item.name}</strong></td>
            <td class="text-right text-neon-cyan">${formatCurrency(item.price)}</td>
            <td class="text-center">
                <button class="btn btn-sm btn-outline text-red" onclick="removeFromCart(${idx})" style="padding: 2px 6px; font-size: 10px;" type="button"><i class="fa-solid fa-xmark"></i></button>
            </td>
        `;
        list.appendChild(row);
    });
    
    if (totalLabel) totalLabel.innerText = formatCurrency(totalSum);
    if (buyBtn) buyBtn.disabled = false;
    
    // Gecikme süresi simülasyonunu çalıştır
    simulateGoalDelay(totalSum);
}

function addToCart(e) {
    const nameInput = document.getElementById("cartItemName");
    const priceInput = document.getElementById("cartItemPrice");
    
    if (!nameInput || !priceInput) return;
    
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value) || 0;
    
    if (name === "" || price <= 0) {
        showToast("Lütfen geçerli ürün adı ve fiyatı girin!", "error");
        return;
    }
    
    if (!state.shoppingCart) state.shoppingCart = [];
    
    state.shoppingCart.push({ name, price });
    
    nameInput.value = "";
    priceInput.value = "";
    
    saveState();
    renderShoppingCart();
    showToast(`${name} sepete eklendi.`, "info");
}

function removeFromCart(idx) {
    if (!state.shoppingCart) return;
    
    const item = state.shoppingCart[idx];
    state.shoppingCart.splice(idx, 1);
    
    saveState();
    renderShoppingCart();
    if (item) showToast(`${item.name} sepetten çıkarıldı.`, "info");
}

function clearCart() {
    state.shoppingCart = [];
    saveState();
    renderShoppingCart();
    showToast("Sepet temizlendi.", "info");
}

function buyCart() {
    if (!state.shoppingCart || state.shoppingCart.length === 0) return;
    
    let totalSum = 0;
    state.shoppingCart.forEach(item => totalSum += item.price);
    
    const currentBalance = getFamilyBalance();
    if (currentBalance < totalSum) {
        showToast("Yetersiz bakiye! Bu sepeti satın almak için bütçeniz yeterli değil.", "error");
        return;
    }
    
    const confirmBuy = confirm(`Toplam tutarı ${formatCurrency(totalSum)} olan sepeti satın alıp bütçeye gider olarak işlemek istiyor musunuz?`);
    if (!confirmBuy) return;
    
    // Gider işlemi oluştur
    const trans = {
        id: "t_" + Date.now(),
        desc: `Alışveriş Sepeti Alımı (${state.shoppingCart.map(i => i.name).join(', ')})`,
        amount: totalSum,
        type: "expense",
        category: "Diğer",
        date: new Date().toISOString().split('T')[0],
        memberId: state.activeProfileId,
        isRecurring: false
    };
    
    state.transactions.unshift(trans);
    
    // Sepeti temizle
    state.shoppingCart = [];
    
    saveState();
    updateUI();
    renderShoppingCart();
    
    showToast("Sepet satın alındı ve gider olarak bütçeye işlendi!", "success");
    setTimeout(triggerCoinDrop, 100);
}

function simulateGoalDelay(totalSum) {
    const warningBox = document.getElementById("cartDelayWarning");
    if (!warningBox) return;
    
    if (state.goals.length === 0) {
        warningBox.style.display = "none";
        return;
    }
    
    const activeGoal = state.goals[0]; // En yakın hedef
    const financials = calculateFinancials();
    const monthlyNetSavings = Math.max(0, financials.monthlyIncome - financials.monthlyExpense);
    const currentBalance = getFamilyBalance();
    
    if (currentBalance >= activeGoal.cost) {
        // Hedef zaten alınabiliyor
        const balanceAfter = currentBalance - totalSum;
        if (balanceAfter < activeGoal.cost) {
            const delayMonths = monthlyNetSavings > 0 ? Math.ceil((activeGoal.cost - balanceAfter) / monthlyNetSavings) : "∞";
            warningBox.style.display = "block";
            warningBox.innerHTML = `
                <i class="fa-solid fa-triangle-exclamation text-red" style="font-size: 14px; margin-right: 6px;"></i>
                <strong>DİKKAT:</strong> Şu an hazırda alabileceğiniz <strong>"${activeGoal.title}"</strong> hedefini, bu sepet alımından sonra bakiye yetersiz kalacağı için hemen alamayacaksınız! Biriktirmek için yaklaşık <strong>${delayMonths} ay</strong> daha beklemeniz gerekecektir.
            `;
        } else {
            warningBox.style.display = "block";
            warningBox.innerHTML = `
                <i class="fa-solid fa-circle-check text-green" style="font-size: 14px; margin-right: 6px;"></i>
                <strong>GÜVENLİ:</strong> Bu sepeti alsanız dahi ortak bakiyeniz en yakın hedefiniz olan <strong>"${activeGoal.title}"</strong> (${formatCurrency(activeGoal.cost)}) için yeterli kalacaktır.
            `;
        }
    } else {
        // Hedefe henüz para biriktiriliyor
        if (monthlyNetSavings <= 0) {
            warningBox.style.display = "block";
            warningBox.innerHTML = `
                <i class="fa-solid fa-circle-info text-neon-cyan" style="font-size: 14px; margin-right: 6px;"></i>
                <strong>BİLGİ:</strong> Bütçenizde aylık net tasarruf bulunmamaktadır. Sepeti alsanız da almasanız da hedeflerinize ulaşmak için öncelikle gider kısıtlaması yapmalısınız.
            `;
        } else {
            const normalMonths = Math.ceil((activeGoal.cost - currentBalance) / monthlyNetSavings);
            const balanceAfter = currentBalance - totalSum;
            const delayedMonths = Math.ceil((activeGoal.cost - balanceAfter) / monthlyNetSavings);
            const diff = delayedMonths - normalMonths;
            
            if (diff > 0) {
                warningBox.style.display = "block";
                warningBox.innerHTML = `
                    <i class="fa-solid fa-hourglass-half text-red" style="font-size: 14px; margin-right: 6px;"></i>
                    <strong>HEDEF GECİKMESİ:</strong> Bu sepeti satın almanız, en yakın birikim hedefiniz olan <strong>"${activeGoal.title}"</strong> hedefine ulaşmanızı tam <strong>${diff} ay</strong> geciktirecektir! (Ulaşım süresi: ${normalMonths} aydan ${delayedMonths} aya çıkacak).
                `;
            } else {
                warningBox.style.display = "none";
            }
        }
    }
}

// Global scope helpers for onclick callbacks inside table dynamic render
window.removeFromCart = removeFromCart;

// --- 5. Gerçek Zamanlı Kurlar ve Alım-Satım Geçmişi & Şablonlar ---
async function fetchRealTimeRates() {
    console.log("Gerçek zamanlı kurlar çekiliyor...");
    
    // Trend hesaplamaları için mevcut kurları yedekle
    lastRates = { ...exchangeRates };
    
    let usdTry = exchangeRates.usd;
    let eurTry = exchangeRates.eur;
    let btcTry = exchangeRates.btc;
    let goldTry = exchangeRates.gold;
    
    try {
        // 1. Döviz kurlarını çek (USD ve EUR)
        const erResponse = await fetch("https://open.er-api.com/v6/latest/USD");
        if (erResponse.ok) {
            const erData = await erResponse.json();
            if (erData.rates && erData.rates.TRY) {
                usdTry = parseFloat(erData.rates.TRY);
                if (erData.rates.EUR) {
                    eurTry = usdTry / parseFloat(erData.rates.EUR);
                }
            }
        }
    } catch (e) {
        console.error("Döviz kurları çekilemedi, varsayılan/mevcut kurlar kullanılıyor:", e);
    }
    
    try {
        // 2. Bitcoin kurunu çek
        const btcResponse = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCTRY");
        if (btcResponse.ok) {
            const btcData = await btcResponse.json();
            btcTry = parseFloat(btcData.price);
        } else {
            // BTCTRY başarısız olursa BTCUSDT * USDTRY dene
            const btcUsdtResponse = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
            if (btcUsdtResponse.ok) {
                const btcUsdtData = await btcUsdtResponse.json();
                btcTry = parseFloat(btcUsdtData.price) * usdTry;
            }
        }
    } catch (e) {
        console.error("BTC kuru çekilemedi, varsayılan/mevcut kur kullanılıyor:", e);
    }
    
    try {
        // 3. Altın kurunu PAXGUSDT (Binance) ve USDTRY üzerinden gr altın olarak hesapla (1 troy ons = 31.1034768 gr)
        const paxgResponse = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=PAXGUSDT");
        if (paxgResponse.ok) {
            const paxgData = await paxgResponse.json();
            const paxgUsdt = parseFloat(paxgData.price);
            goldTry = (paxgUsdt * usdTry) / 31.1034768;
        }
    } catch (e) {
        console.error("Altın kuru çekilemedi, varsayılan/mevcut kur kullanılıyor:", e);
    }
    
    // Global kurları güncelle
    exchangeRates.usd = usdTry;
    exchangeRates.eur = eurTry;
    exchangeRates.btc = btcTry;
    exchangeRates.gold = goldTry;
    
    console.log("Gerçek zamanlı kurlar güncellendi:", exchangeRates);
}

function renderTradeHistory() {
    const list = document.getElementById("tradeHistoryList");
    if (!list) return;
    
    list.innerHTML = "";
    
    if (!state.transactions) state.transactions = [];
    
    // Sadece alım satım işlemlerini filtrele
    const trades = state.transactions.filter(t => t.isTrade);
    
    // Sadece kullanıcının takip etmeyi seçtiği yatırımları filtrele
    const filteredTrades = trades.filter(t => {
        const isTracked = state.trackedAssets && state.trackedAssets[t.asset];
        return isTracked === true;
    });
    
    if (filteredTrades.length === 0) {
        list.innerHTML = `<tr><td colspan="6" class="text-center text-muted" style="padding: 20px 0;">Henüz takip edilen varlıklar için alım-satım işlemi bulunmuyor.</td></tr>`;
        return;
    }
    
    // Son 15 işlemi listele
    filteredTrades.slice(0, 15).forEach(t => {
        const row = document.createElement("tr");
        const typeLabel = t.tradeType === "buy" 
            ? `<span style="background: rgba(16, 185, 129, 0.1); color: var(--color-green); border: 1px solid rgba(16, 185, 129, 0.2); font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Alış</span>`
            : t.tradeType === "sell"
            ? `<span style="background: rgba(239, 68, 68, 0.1); color: var(--color-red); border: 1px solid rgba(239, 68, 68, 0.2); font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Satış</span>`
            : t.tradeType === "add_direct"
            ? `<span style="background: rgba(0, 242, 254, 0.1); color: var(--color-cyan); border: 1px solid rgba(0, 242, 254, 0.2); font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Doğrudan Ekleme</span>`
            : `<span style="background: rgba(245, 158, 11, 0.1); color: var(--color-orange); border: 1px solid rgba(245, 158, 11, 0.2); font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold;">Doğrudan Çıkarma</span>`;
            
        const assetLabels = { usd: "Dolar ($)", eur: "Euro (€)", gold: "Altın (gr)", btc: "Bitcoin" };
        const assetLabel = assetLabels[t.asset] || t.asset.toUpperCase();
        
        row.innerHTML = `
            <td>${formatDate(t.date)}</td>
            <td>${typeLabel}</td>
            <td><strong>${assetLabel}</strong></td>
            <td class="text-right">${t.assetAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</td>
            <td class="text-right">${t.rate.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</td>
            <td class="text-right text-neon-cyan" style="font-weight: bold;">${formatCurrency(t.amount)}</td>
        `;
        list.appendChild(row);
    });
}

function addPresetScenario(type) {
    if (!state.scenarios) state.scenarios = [];
    
    let newScenario = null;
    const now = Date.now();
    
    if (type === 'maas_zammi') {
        newScenario = {
            id: "s_" + now,
            name: "Maaş Zammı (+15K)",
            type: "income",
            amount: 15000,
            duration: 12,
            startMonth: 1,
            active: true
        };
    } else if (type === 'kira_artisi') {
        newScenario = {
            id: "s_" + now,
            name: "Kira Artışı Zammı",
            type: "expense",
            amount: 3000,
            duration: 12,
            startMonth: 1,
            active: true
        };
    } else if (type === 'araba_kredisi') {
        newScenario = {
            id: "s_" + now,
            name: "Araba Kredisi Taksidi",
            type: "expense",
            amount: 8000,
            duration: 12,
            startMonth: 1,
            active: true
        };
    } else if (type === 'tatil_masrafi') {
        newScenario = {
            id: "s_" + now,
            name: "Yaz Tatili Peşinatı",
            type: "one_time_expense",
            amount: 20000,
            duration: 1,
            startMonth: 2,
            active: true
        };
    }
    
    if (newScenario) {
        state.scenarios.push(newScenario);
        saveState();
        updateUI();
        showToast(`"${newScenario.name}" senaryosu başarıyla simülasyona eklendi!`, "success");
    }
}

// Global scope helpers
window.fetchRealTimeRates = fetchRealTimeRates;
window.renderTradeHistory = renderTradeHistory;
window.addPresetScenario = addPresetScenario;

// --- 6. Toplam Birikim Analiz Sayfası ve Hesaplama Metotları ---
function updateSavingsHistoryRecord() {
    if (!state.savingsHistory) state.savingsHistory = [];
    
    const currentMonthLabel = new Date().toLocaleString('tr-TR', { month: 'short', year: 'numeric' });
    
    // Mevcut değerleri hesapla
    const safeBalance = getFamilyBalance();
    
    const usdVal = (state.portfolio?.usd || 0) * exchangeRates.usd;
    const eurVal = (state.portfolio?.eur || 0) * exchangeRates.eur;
    const goldVal = (state.portfolio?.gold || 0) * exchangeRates.gold;
    const btcVal = (state.portfolio?.btc || 0) * exchangeRates.btc;
    const portfolioVal = usdVal + eurVal + goldVal + btcVal;
    
    const kidsBalance = state.profiles
        .filter(p => p.role === "Çocuk")
        .reduce((sum, c) => sum + (c.balanceContribution || 0), 0);
        
    const total = safeBalance + portfolioVal + kidsBalance;
    
    // Mevcut ayın kaydını bul veya oluştur
    let record = state.savingsHistory.find(r => r.month === currentMonthLabel);
    if (!record) {
        // Yeni ay kaydı ekle
        const lastTotal = state.savingsHistory.length > 0 ? state.savingsHistory[state.savingsHistory.length - 1].total : total;
        const netChange = total - lastTotal;
        
        record = {
            month: currentMonthLabel,
            safe: safeBalance,
            portfolio: portfolioVal,
            kids: kidsBalance,
            total: total,
            netChange: netChange
        };
        state.savingsHistory.push(record);
    } else {
        // Mevcut kaydı güncelle
        record.safe = safeBalance;
        record.portfolio = portfolioVal;
        record.kids = kidsBalance;
        record.total = total;
        
        const idx = state.savingsHistory.indexOf(record);
        const prevTotal = idx > 0 ? state.savingsHistory[idx - 1].total : (state.savingsHistory[idx].total - record.netChange);
        record.netChange = total - prevTotal;
    }
    
    // Max 12 ay verisi tutalım
    if (state.savingsHistory.length > 12) {
        state.savingsHistory.shift();
    }
    
    saveState();
}

function renderSavingsPage() {
    if (!state.savingsHistory) state.savingsHistory = [];
    
    // Güncel değerleri hesapla
    const safeBalance = getFamilyBalance();
    
    const usdVal = (state.portfolio?.usd || 0) * exchangeRates.usd;
    const eurVal = (state.portfolio?.eur || 0) * exchangeRates.eur;
    const goldVal = (state.portfolio?.gold || 0) * exchangeRates.gold;
    const btcVal = (state.portfolio?.btc || 0) * exchangeRates.btc;
    const portfolioVal = usdVal + eurVal + goldVal + btcVal;
    
    const children = state.profiles.filter(p => p.role === "Çocuk");
    const kidsBalance = children.reduce((sum, c) => sum + (c.balanceContribution || 0), 0);
    
    const totalAccumulated = safeBalance + portfolioVal + kidsBalance;
    
    // DOM Kartlarını güncelle
    const totalAccEl = document.getElementById("savingsTotalAccumulated");
    const safeEl = document.getElementById("savingsSafeCash");
    const portEl = document.getElementById("savingsPortfolioVal");
    const kidsEl = document.getElementById("savingsKidsCash");
    
    if (totalAccEl) totalAccEl.innerText = formatCurrency(totalAccumulated);
    if (safeEl) safeEl.innerText = formatCurrency(safeBalance);
    if (portEl) portEl.innerText = formatCurrency(portfolioVal);
    if (kidsEl) kidsEl.innerText = formatCurrency(kidsBalance);
    
    // Detay Tablosunu Güncelle
    const list = document.getElementById("savingsDetailsList");
    if (list) {
        list.innerHTML = "";
        
        const items = [
            { name: "Ortak Kasa Nakit (TL)", qty: "Nakit", val: safeBalance },
            { name: "Dolar Varlıkları ($)", qty: `$${(state.portfolio?.usd || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, val: usdVal },
            { name: "Euro Varlıkları (€)", qty: `€${(state.portfolio?.eur || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`, val: eurVal },
            { name: "Altın Birikimi (gr)", qty: `${(state.portfolio?.gold || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} gr`, val: goldVal },
            { name: "Bitcoin Birikimi (BTC)", qty: `${(state.portfolio?.btc || 0).toLocaleString('tr-TR', { minimumFractionDigits: 6 })} BTC`, val: btcVal }
        ];
        
        children.forEach(c => {
            items.push({
                name: `${c.name} Kumbarası`,
                qty: "Birikim",
                val: c.balanceContribution || 0
            });
        });
        
        items.forEach(item => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><strong>${item.name}</strong></td>
                <td class="text-right text-muted" style="font-size: 10px;">${item.qty}</td>
                <td class="text-right text-neon-cyan" style="font-weight: bold;">${formatCurrency(item.val)}</td>
            `;
            list.appendChild(row);
        });
    }
    
    // Grafik çizimini tetikle
    if (window.renderSavingsHistoryChart) {
        window.renderSavingsHistoryChart();
    }
}

window.renderSavingsPage = renderSavingsPage;
window.updateSavingsHistoryRecord = updateSavingsHistoryRecord;
