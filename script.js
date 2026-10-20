document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // НАСТРОЙКИ TELEGRAM
    const TG_TOKEN = "8628503946:AAGP3-J37PR8nYfbsZ6BEMEkpJeShYlgmBc"; // <--- ВСТАВЬ СВОЙ ТОКЕН
    const TG_CHAT_ID = "1823354608"; // <--- ТВОЙ CHAT ID
    // ==========================================

    const urlParams = new URLSearchParams(window.location.search);
    let rawName = urlParams.get('name');
    let herName = "красотка"; 
    if (rawName) {
        try { herName = decodeURIComponent(rawName); } catch (e) { herName = rawName; }
    }

    // ОТПРАВКА ЧЕРЕЗ ПРОКСИ (Обход блокировки МТС)
    function sendTelegramMessage(text) {
        if (TG_TOKEN === "ТВОЙ_ТОКЕН_ОТ_BOTFATHER") return;
        
        // Используем бесплатный прокси-сервер для обхода блокировок
        const proxyUrl = 'https://corsproxy.io/?';
        const tgUrl = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage?chat_id=${TG_CHAT_ID}&text=${encodeURIComponent(text)}&parse_mode=HTML`;
        
        fetch(proxyUrl + encodeURIComponent(tgUrl))
            .catch(err => console.log('Ошибка отправки:', err));
    }

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
    const playVoiceBtn = document.getElementById('play-voice-btn');

    const startTime = Date.now();
    sendTelegramMessage(`🔔 <b>Она открыла ссылку!</b> (Имя: ${herName})`);

    if (unlockBtn) {
        unlockBtn.addEventListener('click', () => {
            unlockBtn.style.display = 'none';
        });
    }

    // ========== ЧАСТИЦЫ ==========
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let isLoveMode = false; 

    function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); this.y = Math.random() * canvas.height; }
        reset() {
            this.x = Math.random() * canvas.width; this.y = -40;
            this.speedY = Math.random() * 1.2 + 0.4; this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.3; this.rotation = Math.random() * 360;
            this.rotSpeed = (Math.random() - 0.5) * 1.5;
            if (isLoveMode) {
                this.emoji = ['❤️', '💖', '💕', '💗', '💓'][Math.floor(Math.random() * 5)];
                this.size = Math.random() * 18 + 12;
            } else {
                this.emoji = '❄️'; this.size = Math.random() * 14 + 8; this.opacity = Math.random() * 0.4 + 0.2;
            }
        }
        update() {
            this.y += this.speedY; this.x += this.speedX; this.rotation += this.rotSpeed;
            if (!isLoveMode) this.x += Math.sin(this.y / 30) * 0.5;
            if (this.y > canvas.height + 50) this.reset();
        }
        draw() {
            ctx.save(); ctx.globalAlpha = this.opacity; ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180); ctx.font = `${this.size}px serif`;
            ctx.textAlign = 'center'; ctx.fillText(this.emoji, 0, 0); ctx.restore();
        }
    }

    for (let i = 0; i < 35; i++) particles.push(new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // ========== ТЕКСТ ==========
    function typeText(element, text, speed = 40) {
        element.textContent = ''; let i = 0;
        return new Promise(resolve => {
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i); i++; setTimeout(type, speed);
                } else { resolve(); }
            }
            type();
        });
    }

    // ========== ТЕСТ ==========
    const testQuestions = [
        { question: `${herName}, как ты думаешь, что нас объединяет?`, answers: ["Любовь к приключениям", "Общее чувство юмора", "Мы просто классные"] },
        { question: "Твой идеальный вечер?", answers: ["Уютный фильм дома", "Прогулка под звездами", "Вкусный ужин вдвоем"] },
        { question: "Что для тебя самое важное в человеке?", answers: ["Искренность", "Забота", "Умение поддержать"] }
    ];

    let currentQuestion = 0;
    let testAnswers = [];

    async function loadQuestion() {
        if (currentQuestion >= testQuestions.length) { startLoveMode(); return; }

        progressBar.style.width = `${(currentQuestion / testQuestions.length) * 100}%`;
        qCounter.textContent = `Вопрос ${currentQuestion + 1} из ${testQuestions.length}`;
        
        const qData = testQuestions[currentQuestion];
        answersDiv.innerHTML = ''; 
        await typeText(qText, qData.question, 30);

        qData.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn'; btn.textContent = answer;
            btn.style.opacity = '0'; btn.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                btn.style.transition = 'all 0.4s ease';
                btn.style.opacity = '1'; btn.style.transform = 'translateY(0)';
            }, index * 150);

            btn.addEventListener('click', () => {
                testAnswers.push(`<b>Вопрос:</b> ${qData.question}\n<b>Ответ:</b> ${answer}`);
                currentQuestion++;
                btn.style.background = 'rgba(255,255,255,0.5)';
                setTimeout(loadQuestion, 200);
            });
            answersDiv.appendChild(btn);
        });
    }

    loadQuestion();

    // ========== ПРИЗНАНИЕ ==========
    async function startLoveMode() {
        bgCool.style.opacity = 0; bgWarm.style.opacity = 1;
        card.classList.add('love-mode'); isLoveMode = true;
        particles.forEach(p => p.reset()); 
        for (let i = 0; i < 20; i++) particles.push(new Particle());

        screenTest.classList.remove('active');
        
        setTimeout(async () => {
            screenLove.classList.add('active');
            setTimeout(() => { mainIcon.style.fontSize = '80px'; }, 100);
            document.title = "Ты будешь моей девушкой? 💕";

            if (playVoiceBtn) {
                playVoiceBtn.style.display = 'block';
                playVoiceBtn.addEventListener('click', () => {
                    if (audioVoice) {
                        audioVoice.volume = 1.0;
                        audioVoice.play();
                        playVoiceBtn.style.display = 'none'; 
                    }
                });
            }

            await typeText(document.getElementById('question'), `${herName}, ты будешь моей девушкой?`, 50);
            document.getElementById('buttons').style.opacity = '1';
        }, 400);
    }

    // ========== КНОПКИ ==========
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const message = document.getElementById('message');
    const musicToggle = document.getElementById('music-toggle');

    const noTexts = ["Нет", "Ты уверена?", "Подумай ещё!", "Не спеши...", "Может, всё-таки да?", "Я буду скучать 🥺", "Последний шанс!"];
    let noCount = 0;

    noBtn.addEventListener('click', () => {
        noCount++;
        if (noCount < noTexts.length) {
            noBtn.textContent = noTexts[noCount];
            noBtn.style.transform = `scale(${1 - (noCount * 0.1)})`;
        } else {
            noBtn.style.display = 'none';
            message.textContent = "Кнопка «Нет» сдалась 😄";
        }
    });

    yesBtn.addEventListener('click', () => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        const finalMessage = `💖 <b>ОНА НАЖАЛА «ДА»!</b> 💖\n\n👩 <b>Имя:</b> ${herName}\n\n📝 <b>Ответы:</b>\n\n${testAnswers.join('\n\n')}`;
        sendTelegramMessage(finalMessage);

        document.getElementById('question').textContent = "Я знал, что ты скажешь «Да»! 💖";
        message.textContent = "Ты сделала меня самым счастливым человеком на свете.";
        document.getElementById('buttons').style.display = 'none';
        if (playVoiceBtn) playVoiceBtn.style.display = 'none';

        if (audioVoice) audioVoice.pause(); 
        if (audioVoiceYes) {
            audioVoiceYes.volume = 1.0;
            audioVoiceYes.play();
        }
    });

    musicToggle.addEventListener('click', () => {
        if (audioLove.paused) { audioLove.play(); musicToggle.textContent = '🔊'; }
        else { audioLove.pause(); musicToggle.textContent = '🔇'; }
    });
});
