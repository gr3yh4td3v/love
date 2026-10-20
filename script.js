document.addEventListener('DOMContentLoaded', () => {
    // Окно отладки
    const debugBox = document.getElementById('debug-log');
    function logToScreen(msg) {
        if (debugBox) {
            debugBox.style.display = 'block';
            debugBox.innerHTML += `<div>> ${msg}</div>`;
        }
    }

    logToScreen("Скрипт запущен.");

    // ==========================================
    // НАСТРОЙКИ TELEGRAM
    const TG_TOKEN = "8628503946:AAGP3-J37PR8nYfbsZ6BEMEkpJeShYlgmBc"; // <--- ВСТАВЬ СВОЙ ТОКЕН
    const TG_CHAT_ID = "1823354608"; // <--- ТВОЙ CHAT ID
    // ==========================================

    const urlParams = new URLSearchParams(window.location.search);
    let rawName = urlParams.get('name');
    let herName = "красотка"; 
    
    if (rawName) {
        try {
            herName = decodeURIComponent(rawName); 
        } catch (e) {
            herName = rawName; 
        }
    }
    logToScreen(`Имя: ${herName}`);

    function sendTelegramMessage(text) {
        if (TG_TOKEN === "ТВОЙ_ТОКЕН_ОТ_BOTFATHER") {
            logToScreen("ОШИБКА: Токен не вставлен!");
            return;
        }
        const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
        logToScreen("Попытка отправки в ТГ...");
        
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TG_CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.ok) logToScreen("ТГ: Сообщение доставлено!");
            else logToScreen(`ТГ Ошибка: ${data.description}`);
        })
        .catch(err => {
            logToScreen(`Ошибка сети ТГ: ${err.message}`);
        });
    }

    // Элементы
    const screenTest = document.getElementById('screen-test');
    const screenLove = document.getElementById('screen-love');
    const qCounter = document.getElementById('q-counter');
    const qText = document.getElementById('q-text');
    const answersDiv = document.getElementById('answers');
    const progressBar = document.getElementById('progress');
    const card = document.getElementById('card');
    const mainIcon = document.getElementById('main-icon');
    const bgCool = document.getElementById('bg-cool');
    const bgWarm = document.getElementById('bg-warm');
    
    const audioTest = document.getElementById('audio-test');
    const audioLove = document.getElementById('audio-love');
    const audioVoice = document.getElementById('audio-voice');
    const audioVoiceYes = document.getElementById('audio-voice-yes'); 
    const unlockBtn = document.getElementById('audio-unlock');

    if (!screenTest || !screenLove) {
        logToScreen("ОШИБКА: Не найдены экраны HTML!");
        return;
    }

    const startTime = Date.now();
    sendTelegramMessage(`🔔 <b>Она открыла ссылку!</b> (Имя: ${herName})`);

    if (unlockBtn) {
        unlockBtn.addEventListener('click', () => {
            logToScreen("Кнопка старта нажата. Разблокировка звука...");
            if (audioVoice) { audioVoice.volume = 0; audioVoice.play().catch(()=>{}); audioVoice.pause(); }
            unlockBtn.style.display = 'none';
        });
    }

    // ========== ЧАСТИЦЫ И ПАРАЛЛАКС ==========
    const canvas = document.getElementById('particles');
    let particles = [];
    let isLoveMode = false; 
    if (canvas) {
        const ctx = canvas.getContext('2d');
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() { this.reset(); this.y = Math.random() * canvas.height; }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -40;
                this.speedY = Math.random() * 1.2 + 0.4;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.3;
                this.rotation = Math.random() * 360;
                this.rotSpeed = (Math.random() - 0.5) * 1.5;
                if (isLoveMode) {
                    this.emoji = ['❤️', '💖', '💕', '💗', '💓'][Math.floor(Math.random() * 5)];
                    this.size = Math.random() * 18 + 12;
                } else {
                    this.emoji = '❄️';
                    this.size = Math.random() * 14 + 8;
                }
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotSpeed;
                if (!isLoveMode) this.x += Math.sin(this.y / 30) * 0.5;
                if (this.y > canvas.height + 50) this.reset();
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.font = `${this.size}px serif`;
                ctx.textAlign = 'center';
                ctx.fillText(this.emoji, 0, 0);
                ctx.restore();
            }
        }
        for (let i = 0; i < 35; i++) particles.push(new Particle());
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ========== ЛОГИКА ТЕСТА ==========
    const testQuestions = [
        { question: `${herName}, как ты думаешь, что нас объединяет?`, answers: ["Любовь к приключениям", "Общее чувство юмора", "Мы просто классные"] },
        { question: "Твой идеальный вечер?", answers: ["Уютный фильм дома", "Прогулка под звездами", "Вкусный ужин вдвоем"] },
        { question: "Что для тебя самое важное в человеке?", answers: ["Искренность", "Забота", "Умение поддержать"] }
    ];

    let currentQuestion = 0;
    let testAnswers = [];

    async function loadQuestion() {
        if (currentQuestion >= testQuestions.length) {
            startLoveMode();
            return;
        }

        const progress = (currentQuestion / testQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
        qCounter.textContent = `Вопрос ${currentQuestion + 1} из ${testQuestions.length}`;
        
        const qData = testQuestions[currentQuestion];
        answersDiv.innerHTML = ''; 
        qText.textContent = qData.question; // Упростил для теста (без печатной машинки, чтобы не грузить телефон)

        qData.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = answer;
            btn.style.margin = "5px";
            
            btn.addEventListener('click', () => {
                testAnswers.push(`<b>Вопрос:</b> ${qData.question}\n<b>Ответ:</b> ${answer}`);
                logToScreen(`Выбран ответ: ${answer}`);

                if (currentQuestion === testQuestions.length - 1) {
                    if (audioVoice) {
                        audioVoice.volume = 1.0;
                        audioVoice.play().catch(e => logToScreen('Ошибка голоса 1: ' + e.message));
                    }
                }

                currentQuestion++;
                loadQuestion();
            });
            answersDiv.appendChild(btn);
        });
    }

    // ========== РОМАНТИЧНЫЙ РЕЖИМ ==========
    async function startLoveMode() {
        logToScreen("Переход на экран признания...");
        bgCool.style.opacity = 0;
        bgWarm.style.opacity = 1;
        card.classList.add('love-mode');
        isLoveMode = true;
        
        screenTest.classList.remove('active');
        screenLove.classList.add('active'); // Показываем сразу
        mainIcon.style.fontSize = '80px';
        document.getElementById('question').textContent = `${herName}, ты будешь моей девушкой?`;
    }

    // ========== КНОПКИ ==========
    const yesBtn = document.getElementById('yes-btn');
    if (yesBtn) {
        yesBtn.addEventListener('click', () => {
            logToScreen("Нажата кнопка ДА!");
            const finalMessage = `💖 <b>ОНА НАЖАЛА «ДА»!</b> 💖\n\n📝 <b>Ответы:</b>\n\n${testAnswers.join('\n\n')}`;
            sendTelegramMessage(finalMessage);
            
            if (audioVoiceYes) {
                audioVoiceYes.volume = 1.0;
                audioVoiceYes.play().catch(e => logToScreen('Ошибка голоса 2: ' + e.message));
            }
        });
    }

    logToScreen("Загрузка вопросов...");
    loadQuestion();
});
