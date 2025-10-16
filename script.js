// Mermaid.js başlatma
mermaid.initialize({ 
    startOnLoad: true,
    theme: 'default',
    flowchart: {
        useMaxWidth: true,
        htmlLabels: true
    }
});

// IP ve Subnet hesaplayıcı
function calculateSubnet() {
    const ip = document.getElementById('ipInput').value;
    const subnet = document.getElementById('subnetInput').value;
    const result = document.getElementById('subnetResult');
    
    if (!ip || !subnet) {
        result.textContent = 'Lütfen IP adresi ve subnet mask girin.';
        return;
    }

    try {
        const ipParts = ip.split('.').map(Number);
        let cidr = 24; // varsayılan
        
        if (subnet.startsWith('/')) {
            cidr = parseInt(subnet.substring(1));
        } else {
            const subnetParts = subnet.split('.').map(Number);
            cidr = subnetParts.reduce((acc, part) => acc + part.toString(2).split('1').length - 1, 0);
        }

        const hostBits = 32 - cidr;
        const hostCount = Math.pow(2, hostBits) - 2;
        const networkAddress = calculateNetworkAddress(ipParts, cidr);
        const broadcastAddress = calculateBroadcastAddress(ipParts, cidr);

        result.textContent = `IP Adresi: ${ip}
Subnet Mask: ${subnet}
CIDR: /${cidr}
Network Address: ${networkAddress}
Broadcast Address: ${broadcastAddress}
Kullanılabilir Host Sayısı: ${hostCount}
Host Aralığı: ${incrementIP(networkAddress)} - ${decrementIP(broadcastAddress)}`;
    } catch (error) {
        result.textContent = 'Hata: Geçersiz IP adresi veya subnet mask.';
    }
}

function calculateNetworkAddress(ip, cidr) {
    const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const network = (ipToNumber(ip) & mask) >>> 0;
    return numberToIP(network);
}

function calculateBroadcastAddress(ip, cidr) {
    const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
    const network = (ipToNumber(ip) & mask) >>> 0;
    const broadcast = network | (~mask >>> 0);
    return numberToIP(broadcast);
}

function ipToNumber(ip) {
    return (ip[0] << 24) + (ip[1] << 16) + (ip[2] << 8) + ip[3];
}

function numberToIP(num) {
    return [(num >>> 24) & 0xFF, (num >>> 16) & 0xFF, (num >>> 8) & 0xFF, num & 0xFF].join('.');
}

function incrementIP(ip) {
    const parts = ip.split('.').map(Number);
    parts[3]++;
    return parts.join('.');
}

function decrementIP(ip) {
    const parts = ip.split('.').map(Number);
    parts[3]--;
    return parts.join('.');
}

// Port kontrol aracı
function checkPort() {
    const host = document.getElementById('hostInput').value;
    const port = document.getElementById('portInput').value;
    const result = document.getElementById('portResult');
    
    if (!host || !port) {
        result.textContent = 'Lütfen host ve port bilgilerini girin.';
        return;
    }

    result.textContent = 'Port kontrolü başlatılıyor...';
    
    // Simüle edilmiş port kontrolü (gerçek uygulamada WebSocket veya API kullanılabilir)
    setTimeout(() => {
        const isOpen = Math.random() > 0.5; // Simüle edilmiş sonuç
        result.textContent = `Host: ${host}
Port: ${port}
Durum: ${isOpen ? '✅ Açık' : '❌ Kapalı'}
Protokol: TCP
Zaman: ${new Date().toLocaleTimeString()}

Not: Bu simüle edilmiş bir testtir. Gerçek port kontrolü için PowerShell veya telnet kullanın.`;
    }, 1000);
}

// DNS sorgulama aracı
function queryDNS() {
    const domain = document.getElementById('dnsInput').value;
    const type = document.getElementById('dnsType').value;
    const result = document.getElementById('dnsResult');
    
    if (!domain) {
        result.textContent = 'Lütfen domain adını girin.';
        return;
    }

    result.textContent = 'DNS sorgusu yapılıyor...';
    
    // Simüle edilmiş DNS sorgusu
    setTimeout(() => {
        const mockResults = {
            'A': `A Record: ${domain}
IP Adresi: 142.250.191.14
TTL: 300
DNS Sunucusu: 8.8.8.8`,
            'AAAA': `AAAA Record: ${domain}
IPv6 Adresi: 2404:6800:4005:80e::200e
TTL: 300
DNS Sunucusu: 8.8.8.8`,
            'CNAME': `CNAME Record: ${domain}
Canonical Name: www.${domain}
TTL: 300
DNS Sunucusu: 8.8.8.8`,
            'MX': `MX Record: ${domain}
Mail Exchange: aspmx.l.google.com (Priority: 10)
Mail Exchange: alt1.aspmx.l.google.com (Priority: 20)
TTL: 300
DNS Sunucusu: 8.8.8.8`,
            'NS': `NS Record: ${domain}
Name Server: ns1.google.com
Name Server: ns2.google.com
TTL: 300
DNS Sunucusu: 8.8.8.8`,
            'TXT': `TXT Record: ${domain}
Text: "v=spf1 include:_spf.google.com ~all"
Text: "google-site-verification=abc123"
TTL: 300
DNS Sunucusu: 8.8.8.8`
        };
        
        result.textContent = mockResults[type] || 'Bilinmeyen kayıt türü.';
    }, 1500);
}

// Ping test aracı
function pingHost() {
    const host = document.getElementById('pingInput').value;
    const count = document.getElementById('pingCount').value || 4;
    const result = document.getElementById('pingResult');
    
    if (!host) {
        result.textContent = 'Lütfen hedef host adını girin.';
        return;
    }

    result.textContent = `Ping ${host} (${count} paket)...\n\n`;
    
    // Simüle edilmiş ping sonuçları
    let output = '';
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const time = Math.floor(Math.random() * 50) + 10;
            const success = Math.random() > 0.1; // %90 başarı oranı
            
            if (success) {
                output += `Ping ${i + 1}: ${time}ms - ✅ Başarılı\n`;
            } else {
                output += `Ping ${i + 1}: Zaman aşımı - ❌ Başarısız\n`;
            }
            
            result.textContent = `Ping ${host} (${count} paket)...\n\n${output}`;
            
            if (i === count - 1) {
                const avgTime = Math.floor(Math.random() * 30) + 15;
                const packetLoss = Math.floor(Math.random() * 5);
                output += `\nİstatistikler:
Gönderilen: ${count} paket
Alınan: ${count - packetLoss} paket
Kayıp: ${packetLoss} paket (%${Math.round(packetLoss/count*100)})
Ortalama süre: ${avgTime}ms`;
                result.textContent = `Ping ${host} (${count} paket)...\n\n${output}`;
            }
        }, i * 500);
    }
}

// MAC adres üretici
function generateMAC() {
    const result = document.getElementById('macResult');
    const mac = generateRandomMAC();
    result.textContent = `Rastgele MAC Adresi:
${mac}

Format: XX:XX:XX:XX:XX:XX
OUI: ${mac.substring(0, 8)}
NIC: ${mac.substring(9)}`;
}

function generateRandomMAC() {
    const hex = '0123456789ABCDEF';
    let mac = '';
    for (let i = 0; i < 6; i++) {
        if (i > 0) mac += ':';
        mac += hex[Math.floor(Math.random() * 16)];
        mac += hex[Math.floor(Math.random() * 16)];
    }
    return mac;
}

function generateOUI() {
    const result = document.getElementById('macResult');
    const ouiList = [
        '00:50:56 - VMware',
        '00:0C:29 - VMware',
        '00:15:5D - Microsoft Hyper-V',
        '08:00:27 - VirtualBox',
        '00:1B:21 - Intel',
        '00:1F:5B - Apple',
        '00:26:BB - Apple',
        '00:25:00 - Apple',
        '00:16:CB - Apple',
        '00:17:F2 - Apple'
    ];
    
    result.textContent = 'Yaygın OUI (Organizationally Unique Identifier) Listesi:\n\n' + 
        ouiList.join('\n') + '\n\nOUI, MAC adresinin ilk 3 byte\'ını oluşturur ve üreticiyi belirtir.';
}

// Ağ hızı testi
function testSpeed() {
    const result = document.getElementById('speedResult');
    result.textContent = 'Ağ hızı testi başlatılıyor...\n\n';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            const downloadSpeed = (Math.random() * 50 + 10).toFixed(1);
            const uploadSpeed = (Math.random() * 20 + 5).toFixed(1);
            const ping = Math.floor(Math.random() * 20 + 5);
            
            result.textContent = `Ağ hızı testi tamamlandı!

📥 İndirme Hızı: ${downloadSpeed} Mbps
📤 Yükleme Hızı: ${uploadSpeed} Mbps
📡 Ping: ${ping} ms
🌐 Sunucu: İstanbul, Türkiye

Not: Bu simüle edilmiş bir testtir. Gerçek hız testi için speedtest.net kullanın.`;
        } else {
            result.textContent = `Ağ hızı testi başlatılıyor...\n\nİlerleme: %${Math.floor(progress)}`;
        }
    }, 200);
}

// Dark Mode fonksiyonları
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    // Toggle buton ikonunu güncelle
    const darkModeBtn = document.querySelector('[onclick="toggleDarkMode()"]');
    if (darkModeBtn) {
        darkModeBtn.textContent = isDark ? '☀️' : '🌙';
    }
}

// Arama fonksiyonları
function toggleSearch() {
    const searchContainer = document.getElementById('searchContainer');
    const isHidden = searchContainer.classList.contains('hidden') || searchContainer.style.display === 'none';
    
    if (isHidden) {
        searchContainer.classList.remove('hidden');
        searchContainer.style.display = 'block';
        document.getElementById('searchInput').focus();
    } else {
        searchContainer.classList.add('hidden');
        searchContainer.style.display = 'none';
    }
}

// Sayfada herhangi bir yere tıklanınca arama kutusunu ve menüyü kapat
document.addEventListener('click', function(event) {
    const searchContainer = document.getElementById('searchContainer');
    const sidebar = document.getElementById('sidebar');
    const searchToggles = document.querySelectorAll('[onclick="toggleSearch()"]');
    const sidebarToggles = document.querySelectorAll('[onclick="toggleSidebar()"]');
    
    // Arama butonlarından biri mi kontrol et
    let isSearchToggle = false;
    searchToggles.forEach(toggle => {
        if (toggle.contains(event.target)) {
            isSearchToggle = true;
        }
    });
    
    // Menü butonlarından biri mi kontrol et
    let isSidebarToggle = false;
    sidebarToggles.forEach(toggle => {
        if (toggle.contains(event.target)) {
            isSidebarToggle = true;
        }
    });
    
    // Arama kutusunu kapat
    if (!searchContainer.contains(event.target) && !isSearchToggle) {
        if (!searchContainer.classList.contains('hidden') && searchContainer.style.display !== 'none') {
            searchContainer.classList.add('hidden');
            searchContainer.style.display = 'none';
        }
    }
    
    // Menüyü kapat
    if (!sidebar.contains(event.target) && !isSidebarToggle) {
        if (!sidebar.classList.contains('hidden')) {
            sidebar.classList.add('hidden');
        }
    }
});

// ESC tuşu ile arama kutusunu ve menüyü kapat
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const searchContainer = document.getElementById('searchContainer');
        const sidebar = document.getElementById('sidebar');
        
        // Önce arama kutusunu kapat
        if (!searchContainer.classList.contains('hidden') && searchContainer.style.display !== 'none') {
            searchContainer.classList.add('hidden');
            searchContainer.style.display = 'none';
        }
        // Sonra menüyü kapat
        else if (!sidebar.classList.contains('hidden')) {
            sidebar.classList.add('hidden');
        }
    }
});

// Klavye navigasyonu
document.addEventListener('keydown', function(event) {
    // Ctrl + K ile arama kutusunu açma
    if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        const searchContainer = document.getElementById('searchContainer');
        const searchInput = document.getElementById('searchInput');
        if (searchContainer && searchInput) {
            searchContainer.classList.remove('hidden');
            searchContainer.style.display = 'block';
            searchInput.focus();
        }
    }
    
    // Ctrl + M ile sidebar'ı açma/kapama
    if (event.ctrlKey && event.key === 'm') {
        event.preventDefault();
        toggleSidebar();
    }
    
    // Ctrl + D ile dark mode toggle
    if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        toggleDarkMode();
    }
    
    // Alt + 1-9 ile bölümlere gitme
    if (event.altKey && event.key >= '1' && event.key <= '9') {
        event.preventDefault();
        const sectionNumber = parseInt(event.key);
        const sections = [
            'ag-temelleri', 'windows-server', 'active-directory', 'file-server',
            'powershell', 'guvenlik', 'siber-guvenlik', 'fortigate', 'helpdesk'
        ];
        if (sections[sectionNumber - 1]) {
            scrollToSection(sections[sectionNumber - 1]);
        }
    }
    
    // Home tuşu ile başa gitme
    if (event.key === 'Home') {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // End tuşu ile sona gitme
    if (event.key === 'End') {
        event.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});

// Back to Top Button Functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/Hide Back to Top Button based on scroll position
window.addEventListener('scroll', function() {
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }
});

// Progress Bar Functionality
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressFill.style.width = scrollPercent + '%';
        progressText.textContent = Math.round(scrollPercent) + '%';
    }
}

// Update progress bar on scroll
window.addEventListener('scroll', updateProgressBar);

// Update progress bar on page load
window.addEventListener('load', updateProgressBar);

// Sticky Header Functionality
function updateStickyHeader() {
    const stickyHeader = document.getElementById('stickyHeader');
    if (stickyHeader) {
        if (window.pageYOffset > 100) {
            stickyHeader.classList.add('show');
        } else {
            stickyHeader.classList.remove('show');
        }
    }
}

// Update sticky header on scroll
window.addEventListener('scroll', updateStickyHeader);

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput || !searchResults) {
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.length < 2) {
        searchResults.innerHTML = '';
        return;
    }

    // Kelime bazlı arama - daha spesifik elementler
    const allElements = document.querySelectorAll('h2, h3, h4, p, li, .code-block pre, .scenario p, .step p');
    const results = [];
    
    allElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            // En yakın bölüm başlığını bul
            const section = element.closest('.section');
            if (section) {
                const sectionTitle = section.querySelector('h2')?.textContent || 'Bölüm';
                const sectionId = section.getAttribute('id');
                
                // Alt başlığı bul
                const subTitle = element.tagName === 'H3' ? element.textContent : 
                               element.tagName === 'H4' ? element.textContent :
                               element.closest('h3')?.textContent || 
                               element.closest('h4')?.textContent || '';
                
                // Eşleşen metni vurgula
                const highlightedText = highlightSearchTerm(element.textContent, searchTerm);
                
                // Zaten eklenmiş mi kontrol et
                const existingResult = results.find(r => r.sectionId === sectionId && r.subTitle === subTitle);
                if (!existingResult) {
                    results.push({
                        sectionTitle,
                        sectionId,
                        subTitle,
                        text: highlightedText,
                        element: element,
                        searchTerm: searchTerm
                    });
                }
            }
        }
    });

    // Sonuçları göster
    if (results.length > 0) {
        searchResults.innerHTML = results.map((result, index) => 
            `<div class="search-result" onclick="scrollToSearchResult(${index})">
                <div class="search-result-header">
                    <strong>${result.sectionTitle}</strong>
                    ${result.subTitle ? `<span class="search-subtitle">${result.subTitle}</span>` : ''}
                </div>
                <div class="search-result-content">${result.text.substring(0, 150)}...</div>
            </div>`
        ).join('');
        
        // Sonuçları global değişkende sakla
        window.searchResults = results;
    } else {
        searchResults.innerHTML = '<div class="search-result">Sonuç bulunamadı</div>';
    }
}

function highlightSearchTerm(text, searchTerm) {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function scrollToSearchResult(resultIndex) {
    if (window.searchResults && window.searchResults[resultIndex]) {
        const result = window.searchResults[resultIndex];
        const element = result.element;
        
        if (!element) {
            return;
        }
        
        // Önce bölüme git
        scrollToSection(result.sectionId);
        
        // Sonra tam elementi bul ve ona git
        setTimeout(() => {
            if (element && element.scrollIntoView) {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                });
                
                // Sadece küçük bir vurgulama yap
                const originalBg = element.style.backgroundColor;
                const originalBorder = element.style.border;
                
                element.style.backgroundColor = '#fff3cd';
                element.style.border = '2px solid #ffc107';
                element.style.borderRadius = '4px';
                element.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    if (element) {
                        element.style.backgroundColor = originalBg;
                        element.style.border = originalBorder;
                    }
                }, 3000);
            }
        }, 500);
    }
}

// Quiz fonksiyonları
let quizAnswers = {};

function selectAnswer(element, answer) {
    const question = element.closest('.quiz-question');
    const questionId = question.getAttribute('id');
    
    // Önceki seçimi temizle
    question.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Yeni seçimi işaretle
    element.classList.add('selected');
    quizAnswers[questionId] = answer;
}

function checkAnswers() {
    const correctAnswers = {
        'quiz1': 'B', // 192.168.1.100
        'quiz2': 'A', // 255.255.255.0
        'quiz3': 'A'  // Domain Name System
    };

    let correct = 0;
    let total = Object.keys(correctAnswers).length;

    // Cevapları kontrol et
    Object.keys(correctAnswers).forEach(questionId => {
        const question = document.getElementById(questionId);
        const userAnswer = quizAnswers[questionId];
        const correctAnswer = correctAnswers[questionId];
        
        if (userAnswer === correctAnswer) {
            correct++;
        }

        // Seçenekleri renklendir
        question.querySelectorAll('.quiz-option').forEach(option => {
            const optionText = option.textContent.trim();
            const optionLetter = optionText.charAt(0);
            
            if (optionLetter === correctAnswer) {
                option.classList.add('correct');
            } else if (optionLetter === userAnswer && userAnswer !== correctAnswer) {
                option.classList.add('incorrect');
            }
        });
    });

    // Skoru göster
    const scoreElement = document.getElementById('quizScore');
    const percentage = Math.round((correct / total) * 100);
    
    let scoreClass = 'poor';
    let scoreText = '';
    
    if (percentage >= 80) {
        scoreClass = 'good';
        scoreText = `🎉 Mükemmel! ${correct}/${total} doğru (${percentage}%)`;
    } else if (percentage >= 60) {
        scoreClass = 'average';
        scoreText = `👍 İyi! ${correct}/${total} doğru (${percentage}%)`;
    } else {
        scoreClass = 'poor';
        scoreText = `📚 Daha çok çalışmalısın! ${correct}/${total} doğru (${percentage}%)`;
    }

    scoreElement.className = `quiz-score ${scoreClass}`;
    scoreElement.textContent = scoreText;
    scoreElement.style.display = 'block';
}

function resetQuiz() {
    // Tüm seçimleri temizle
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });
    
    // Skoru gizle
    document.getElementById('quizScore').style.display = 'none';
    
    // Cevapları temizle
    quizAnswers = {};
}

function toggleAnswers(buttonId) {
    const button = document.getElementById(buttonId);
    const answersId = buttonId.replace('btn', 'answers');
    const answers = document.getElementById(answersId);
    
    if (answers.classList.contains('show')) {
        answers.classList.remove('show');
        button.textContent = 'Cevapları Göster';
    } else {
        answers.classList.add('show');
        button.textContent = 'Cevapları Gizle';
    }
}

// Lab fonksiyonları
function executeADCommand() {
    const command = document.getElementById('adCommand').value.trim();
    const result = document.getElementById('adResult');
    
    if (command.toLowerCase().includes('new-aduser') && 
        command.toLowerCase().includes('ahmet yılmaz') && 
        command.toLowerCase().includes('ayilmaz')) {
        result.innerHTML = '<div class="success-message">✅ Başarılı! Kullanıcı başarıyla oluşturuldu.<br/>Kullanıcı adı: ayilmaz<br/>Tam ad: Ahmet Yılmaz</div>';
    } else if (command.toLowerCase().includes('new-aduser')) {
        result.innerHTML = '<div class="error-message">❌ Hata: Komut doğru ama parametreler eksik. -Name ve -SamAccountName parametrelerini kullandığınızdan emin olun.</div>';
    } else {
        result.innerHTML = '<div class="error-message">❌ Hata: Yanlış komut. New-ADUser cmdlet\'ini kullanın.</div>';
    }
}

function testNetworkConfig() {
    const ip = document.getElementById('ipAddress').value.trim();
    const subnet = document.getElementById('subnetMask').value.trim();
    const gateway = document.getElementById('gateway').value.trim();
    const result = document.getElementById('networkResult');
    
    if (ip === '192.168.1.100' && subnet === '255.255.255.0' && gateway === '192.168.1.1') {
        result.innerHTML = '<div class="success-message">✅ Başarılı! Ağ yapılandırması doğru.<br/>IP: 192.168.1.100<br/>Subnet: 255.255.255.0<br/>Gateway: 192.168.1.1<br/><br/>Bilgisayar artık ağa bağlanabilir!</div>';
    } else {
        let errors = [];
        if (ip !== '192.168.1.100') errors.push('IP adresi yanlış');
        if (subnet !== '255.255.255.0') errors.push('Subnet mask yanlış');
        if (gateway !== '192.168.1.1') errors.push('Gateway yanlış');
        
        result.innerHTML = '<div class="error-message">❌ Hata: ' + errors.join(', ') + '<br/>Lütfen doğru değerleri girin.</div>';
    }
}

function runPowerShellScript() {
    const script = document.getElementById('powershellScript').value;
    const output = document.getElementById('powershellOutput');
    
    // Basit script analizi
    if (script.includes('Import-Csv') && script.includes('foreach') && script.includes('New-ADUser')) {
        output.textContent = `PowerShell ISE - Script Çıktısı
=====================================

Kullanıcı oluşturuldu: Ahmet Yılmaz
Kullanıcı oluşturuldu: Mehmet Demir
Kullanıcı oluşturuldu: Ayşe Kaya
Kullanıcı oluşturuldu: Fatma Öz
Kullanıcı oluşturuldu: Ali Veli

Tüm kullanıcılar başarıyla oluşturuldu!

PS C:\>`;
    } else {
        output.textContent = `PowerShell ISE - Script Çıktısı
=====================================

Hata: Script eksik veya hatalı
Lütfen Import-Csv, foreach ve New-ADUser komutlarını kullandığınızdan emin olun.

PS C:\>`;
    }
}

function testFirewallPolicy() {
    const source = document.getElementById('sourceSelect').value;
    const dest = document.getElementById('destSelect').value;
    const service = document.getElementById('serviceSelect').value;
    const action = document.getElementById('actionSelect').value;
    const nat = document.getElementById('natCheckbox').checked;
    const result = document.getElementById('firewallResult');
    
    if (source === 'internet' && dest === 'web-server' && service === 'HTTP_HTTPS' && action === 'allow' && nat) {
        result.innerHTML = '<div class="success-message">✅ Başarılı! Firewall policy doğru yapılandırıldı.<br/>Internet → Web Server (HTTP/HTTPS) - ALLOW<br/>NAT: Aktif<br/><br/>Web sunucusu artık dışarıdan erişilebilir!</div>';
    } else {
        let errors = [];
        if (source !== 'internet') errors.push('Source internet olmalı');
        if (dest !== 'web-server') errors.push('Destination web-server olmalı');
        if (service !== 'HTTP_HTTPS') errors.push('Service HTTP_HTTPS olmalı');
        if (action !== 'allow') errors.push('Action ALLOW olmalı');
        if (!nat) errors.push('NAT aktif olmalı');
        
        result.innerHTML = '<div class="error-message">❌ Hata: ' + errors.join(', ') + '<br/>Lütfen doğru ayarları seçin.</div>';
    }
}

function executeDNSCommand() {
    const command = document.getElementById('dnsCommand').value.trim();
    const result = document.getElementById('dnsResult');
    
    if (command.toLowerCase().includes('add-dnsserverresourcerecorda') && 
        command.toLowerCase().includes('webserver') && 
        command.toLowerCase().includes('contoso.local') && 
        command.toLowerCase().includes('192.168.1.10')) {
        result.innerHTML = '<div class="success-message">✅ Başarılı! DNS A kaydı oluşturuldu.<br/>Host: webserver.contoso.local<br/>IP: 192.168.1.10<br/><br/>DNS çözümlemesi artık çalışacak!</div>';
    } else if (command.toLowerCase().includes('add-dnsserverresourcerecorda')) {
        result.innerHTML = '<div class="error-message">❌ Hata: Komut doğru ama parametreler eksik. -Name, -ZoneName ve -IPv4Address parametrelerini kullandığınızdan emin olun.</div>';
    } else {
        result.innerHTML = '<div class="error-message">❌ Hata: Yanlış komut. Add-DnsServerResourceRecordA cmdlet\'ini kullanın.</div>';
    }
}

// Sidebar fonksiyonları
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
}

// Menüyü kapatma fonksiyonu
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar.classList.contains('hidden')) {
        sidebar.classList.add('hidden');
    }
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Aktif menü öğesini güncelle
        updateActiveMenuItem(sectionId);
        
        // Sidebar'ı kapat (tüm cihazlarda)
        setTimeout(() => {
            document.getElementById('sidebar').classList.add('hidden');
        }, 300);
    }
}

function updateActiveMenuItem(activeId) {
    // Tüm menü öğelerinden active class'ını kaldır
    const menuItems = document.querySelectorAll('.sidebar-menu a');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Aktif menü öğesine active class'ını ekle
    const activeItem = document.querySelector(`a[onclick="scrollToSection('${activeId}')"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Scroll olayını dinle ve aktif menü öğesini güncelle
function handleScroll() {
    const sections = document.querySelectorAll('.section[id]');
    const scrollPos = window.scrollY + 100; // Offset for better UX
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            updateActiveMenuItem(sectionId);
        }
    });
}

// SPA Navigation Functions
function showHome() {
    // Ana sayfayı göster
    document.getElementById('hero-section').style.display = 'block';
    
    // Tüm bölüm içeriklerini gizle
    const sectionContents = document.querySelectorAll('.section-content');
    sectionContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Breadcrumb'ı gizle
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        breadcrumb.style.display = 'none';
    }
    
    // URL'yi güncelle
    window.history.pushState({}, '', '#');
}

function showSection(sectionId) {
    // Ana sayfayı gizle
    document.getElementById('hero-section').style.display = 'none';
    
    // Tüm bölüm içeriklerini gizle
    const sectionContents = document.querySelectorAll('.section-content');
    sectionContents.forEach(content => {
        content.style.display = 'none';
    });
    
    // Seçilen bölümü göster
    const targetSection = document.getElementById(sectionId + '-content');
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Breadcrumb'ı göster ve güncelle
    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) {
        breadcrumb.style.display = 'flex';
        const breadcrumbTitle = document.getElementById('breadcrumb-title');
        if (breadcrumbTitle) {
            const sectionTitle = document.querySelector(`#${sectionId} h2`)?.textContent || sectionId;
            breadcrumbTitle.textContent = sectionTitle;
        }
    }
    
    // URL'yi güncelle
    window.history.pushState({}, '', '#' + sectionId);
}

// Sayfa yüklendiğinde animasyonları başlat
document.addEventListener('DOMContentLoaded', function() {
    // Dark mode kontrolü
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        const darkModeBtn = document.querySelector('[onclick="toggleDarkMode()"]');
        if (darkModeBtn) {
            darkModeBtn.textContent = '☀️';
        }
    }

    // Fade-in animasyonları
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Slide-in animasyonları
    const slideElements = document.querySelectorAll('.slide-in');
    slideElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, index * 150);
    });

    // Scroll event listener ekle
    window.addEventListener('scroll', handleScroll);
    
    // İlk yüklemede aktif menü öğesini belirle
    handleScroll();
    
    // URL hash'ine göre sayfa yükle
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    } else {
        showHome();
    }
});

// Browser back/forward button handling
window.addEventListener('popstate', function(event) {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    } else {
        showHome();
    }
});
