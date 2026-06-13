/* ==========================================================================
   Akıllı Aile Bütçesi - Grafik Çizim Modülü (Visual Chart Engine)
   ========================================================================== */

// Chart Global Referansları (Re-render esnasında bellek sızıntısını önlemek için)
let projectionChartInstance = null;
let healthRadarChartInstance = null;
let sandboxCompareChartInstance = null;
let savingsChartInstance = null;

// Ortak Grafik Tasarım Sınırları (Chart.js için özelleştirilmiş stil ayarları)
const CHART_DEFAULTS = {
    textColor: '#9ca3af',
    gridColor: 'rgba(255, 255, 255, 0.05)',
    fontFamily: "'Outfit', sans-serif"
};

// ==========================================================================
// ANA PANEL (DASHBOARD) GRAFİKLERİ
// ==========================================================================
function renderDashboardCharts() {
    renderProjectionChart();
    renderHealthRadarChart();
}

// 1. 12 Aylık Nakit Akışı Bütçe Projeksiyon Çizgi Grafiği
function renderProjectionChart() {
    const canvas = document.getElementById("projectionChart");
    if (!canvas) return;

    // app.js'deki projeksiyon üreteci fonksiyonunu çağır
    const data = generateProjections();

    if (projectionChartInstance) {
        projectionChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    
    // Gradient efektleri oluşturalım (Premium görünüm)
    const baseGradient = ctx.createLinearGradient(0, 0, 0, 300);
    baseGradient.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
    baseGradient.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

    const scenGradient = ctx.createLinearGradient(0, 0, 0, 300);
    scenGradient.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
    scenGradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');

    projectionChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.months,
            datasets: [
                {
                    label: 'Mevcut Gidişat',
                    data: data.baseProjection,
                    borderColor: '#00f2fe',
                    borderWidth: 3,
                    backgroundColor: baseGradient,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3,
                    pointHoverRadius: 6
                },
                {
                    label: 'Simülasyon Senaryosu',
                    data: data.scenarioProjection,
                    borderColor: '#8b5cf6',
                    borderWidth: 3,
                    backgroundColor: scenGradient,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: CHART_DEFAULTS.textColor,
                        font: { family: CHART_DEFAULTS.fontFamily, size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: '#0b111e',
                    titleColor: '#f3f4f6',
                    bodyColor: '#f3f4f6',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: CHART_DEFAULTS.gridColor },
                    ticks: { color: CHART_DEFAULTS.textColor, font: { family: CHART_DEFAULTS.fontFamily } }
                },
                y: {
                    grid: { color: CHART_DEFAULTS.gridColor },
                    ticks: { color: CHART_DEFAULTS.textColor, font: { family: CHART_DEFAULTS.fontFamily } }
                }
            }
        }
    });
}

// 2. 5 Boyutlu Finansal Sağlık Radarı Grafiği
function renderHealthRadarChart() {
    const canvas = document.getElementById("healthRadarChart");
    if (!canvas) return;

    // app.js'den sağlık verilerini hesapla
    const healthData = getFinancialHealthMetrics();
    
    // Sağlık skor etiketini güncelle
    document.getElementById("healthScoreValue").innerText = `${healthData.overallScore} / 100`;

    if (healthRadarChartInstance) {
        healthRadarChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');

    healthRadarChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [
                'Tasarruf Oranı',
                'Borç Kontrolü',
                'Acil Durum Tamponu',
                'Yatırım Disiplini',
                'Bütçe Sadakati'
            ],
            datasets: [{
                label: 'Puanınız',
                data: healthData.scores,
                fill: true,
                backgroundColor: 'rgba(0, 242, 254, 0.25)',
                borderColor: '#00f2fe',
                borderWidth: 2,
                pointBackgroundColor: '#00f2fe',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#00f2fe'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // zaten tek veri grubu var
                },
                tooltip: {
                    backgroundColor: '#0b111e',
                    titleColor: '#f3f4f6',
                    bodyColor: '#f3f4f6',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 8
                }
            },
            scales: {
                r: {
                    angleLines: { color: CHART_DEFAULTS.gridColor },
                    grid: { color: CHART_DEFAULTS.gridColor },
                    pointLabels: {
                        color: CHART_DEFAULTS.textColor,
                        font: { family: CHART_DEFAULTS.fontFamily, size: 10 }
                    },
                    ticks: {
                        display: false, // sayısal ekseni gizle, temiz dursun
                        backdropColor: 'transparent'
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

// ==========================================================================
// KARAR SİMÜLASYONU (SANDBOX) GRAFİKLERİ
// ==========================================================================
function updateSandboxCharts() {
    const canvas = document.getElementById("sandboxCompareChart");
    if (!canvas) return;

    const data = generateProjections();

    if (sandboxCompareChartInstance) {
        sandboxCompareChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    
    const baseGradient = ctx.createLinearGradient(0, 0, 0, 350);
    baseGradient.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
    baseGradient.addColorStop(1, 'rgba(0, 242, 254, 0.0)');

    const scenGradient = ctx.createLinearGradient(0, 0, 0, 350);
    scenGradient.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
    scenGradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');

    sandboxCompareChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.months,
            datasets: [
                {
                    label: 'Mevcut Gidişat',
                    data: data.baseProjection,
                    borderColor: '#00f2fe',
                    borderWidth: 3,
                    backgroundColor: baseGradient,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3,
                    pointHoverRadius: 6
                },
                {
                    label: 'Simülasyon Senaryosu',
                    data: data.scenarioProjection,
                    borderColor: '#8b5cf6',
                    borderWidth: 3,
                    backgroundColor: scenGradient,
                    fill: true,
                    tension: 0.35,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: CHART_DEFAULTS.textColor,
                        font: { family: CHART_DEFAULTS.fontFamily, size: 12 }
                    }
                },
                tooltip: {
                    backgroundColor: '#0b111e',
                    titleColor: '#f3f4f6',
                    bodyColor: '#f3f4f6',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: CHART_DEFAULTS.gridColor },
                    ticks: { color: CHART_DEFAULTS.textColor, font: { family: CHART_DEFAULTS.fontFamily } }
                },
                y: {
                    grid: { color: CHART_DEFAULTS.gridColor },
                    ticks: { color: CHART_DEFAULTS.textColor, font: { family: CHART_DEFAULTS.fontFamily } }
                }
            }
        }
    });
}

// Global olarak çağrılabilmesi için pencereye bağlayalım
window.renderDashboardCharts = renderDashboardCharts;
window.updateSandboxCharts = updateSandboxCharts;

// --- 3. TOPLAM BİRİKİM VE NET KÂR/ZARAR DUAL-AXIS GRAFİĞİ ---
function renderSavingsHistoryChart() {
    const canvas = document.getElementById("savingsHistoryChart");
    if (!canvas) return;
    
    if (savingsChartInstance) {
        savingsChartInstance.destroy();
    }
    
    // Geçmiş verileri al (boşsa şık bir varsayılan çizim yap)
    const history = state.savingsHistory && state.savingsHistory.length > 0
        ? state.savingsHistory
        : [
            { month: "Oca 2026", safe: 25000, portfolio: 12000, kids: 200, total: 37200, netChange: 5000 },
            { month: "Şub 2026", safe: 28000, portfolio: 14000, kids: 220, total: 42220, netChange: 5020 },
            { month: "Mar 2026", safe: 32000, portfolio: 13500, kids: 240, total: 45740, netChange: 3520 },
            { month: "Nis 2026", safe: 38000, portfolio: 17000, kids: 210, total: 55210, netChange: 9470 },
            { month: "May 2026", safe: 36000, portfolio: 15500, kids: 230, total: 51730, netChange: -3480 },
            { month: "Haz 2026", safe: 50000, portfolio: 48600, kids: 250, total: 98850, netChange: 47120 }
          ];
          
    const labels = history.map(r => r.month);
    const totals = history.map(r => r.total);
    const netChanges = history.map(r => r.netChange);
    
    const ctx = canvas.getContext('2d');
    
    savingsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    type: 'line',
                    label: 'Toplam Birikim (₺)',
                    data: totals,
                    borderColor: '#00f2fe',
                    borderWidth: 3,
                    pointBackgroundColor: '#00f2fe',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.35,
                    fill: false,
                    yAxisID: 'yCumulative'
                },
                {
                    type: 'bar',
                    label: 'Aylık Net Değişim / Kâr-Zarar (₺)',
                    data: netChanges,
                    backgroundColor: netChanges.map(val => val >= 0 ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'),
                    borderColor: netChanges.map(val => val >= 0 ? '#10b981' : '#ef4444'),
                    borderWidth: 1.5,
                    yAxisID: 'yMonthly'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: CHART_DEFAULTS.textColor,
                        font: { family: CHART_DEFAULTS.fontFamily, size: 11 }
                    }
                },
                tooltip: {
                    backgroundColor: '#0b111e',
                    titleColor: '#f3f4f6',
                    bodyColor: '#f3f4f6',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: CHART_DEFAULTS.gridColor },
                    ticks: { color: CHART_DEFAULTS.textColor, font: { family: CHART_DEFAULTS.fontFamily, size: 10 } }
                },
                yCumulative: {
                    position: 'left',
                    grid: { color: CHART_DEFAULTS.gridColor },
                    ticks: { 
                        color: '#00f2fe', 
                        font: { family: CHART_DEFAULTS.fontFamily, size: 10 },
                        callback: function(value) { return value.toLocaleString('tr-TR') + ' ₺'; }
                    },
                    title: {
                        display: true,
                        text: 'Toplam Birikim',
                        color: '#00f2fe',
                        font: { family: CHART_DEFAULTS.fontFamily, size: 10, weight: 'bold' }
                    }
                },
                yMonthly: {
                    position: 'right',
                    grid: { drawOnChartArea: false },
                    ticks: { 
                        color: '#10b981', 
                        font: { family: CHART_DEFAULTS.fontFamily, size: 10 },
                        callback: function(value) { return value.toLocaleString('tr-TR') + ' ₺'; }
                    },
                    title: {
                        display: true,
                        text: 'Aylık Net Değişim',
                        color: '#10b981',
                        font: { family: CHART_DEFAULTS.fontFamily, size: 10, weight: 'bold' }
                    }
                }
            }
        }
    });
}
window.renderSavingsHistoryChart = renderSavingsHistoryChart;
