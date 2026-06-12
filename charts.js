/* ==========================================================================
   Akıllı Aile Bütçesi - Grafik Çizim Modülü (Visual Chart Engine)
   ========================================================================== */

// Chart Global Referansları (Re-render esnasında bellek sızıntısını önlemek için)
let projectionChartInstance = null;
let healthRadarChartInstance = null;
let sandboxCompareChartInstance = null;

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
