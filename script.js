document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // НАСТРОЙКИ TELEGRAM
    const TG_TOKEN = "8628503946:AAGP3-J37PR8nYfbsZ6BEMEkpJeShYlgmBc"; // <--- ВСТАВЬ СВОЙ ТОКЕН
    const TG_CHAT_ID = "1823354608"; // <--- ТВОЙ CHAT ID
    // ==========================================

    // ==========================================
    // ПЕРСОНАЛИЗАЦИЯ (Автоматически понимает русские буквы)
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
    // ==========================================

    function sendTelegramMessage(text) {
        if (TG_TOKEN === "ТВОЙ_ТОКЕН_ОТ_BOTFATHER") return;
        const url = `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`;
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TG_CHAT_ID,
                text: text,
                parse_mode: 'HTML'
            })
        }).catch(err => console.log('Ошибка:', err));
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
    
    // Аудио
    const audioTest = document.getElementById('audio-test');
    const audioLove = document.getElementById('audio-love');
    const audioVoice = document.getElementById('audio-voice');

    const startTime = Date.now();
    sendTelegramMessage(`🔔 <b>Она открыла ссылку!</b> (Имя: ${herName})`);

    // ========== 1. ЧАСТИЦЫ НА CANVAS ==========
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let isLoveMode = false; 

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height;
        }
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
                this.opacity = Math.random() * 0.4 + 0.2;
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

    // ========== 2. ПАРАЛЛАКС (ТОЛЬКО ПК) ==========
    const isDesktop = window.matchMedia("(pointer: fine)").matches;
    if (isDesktop) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            card.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
        });
        document.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0) rotateX(0)';
        });
    }

    // ========== 3. ЗВУКИ ==========
    let audioCtx;
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    
    function playClickSound() {
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    }

    function playTransitionSound() {
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
            setTimeout(() => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
                osc.connect(gain); gain.connect(audioCtx.destination);
                osc.start(); osc.stop(audioCtx.currentTime + 0.8);
            }, i * 100);
        });
    }

    // ========== 4. ТЕКСТ ==========
    function typeText(element, text, speed = 40) {
        element.textContent = '';
        element.classList.add('typing');
        let i = 0;
        return new Promise(resolve => {
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    element.classList.remove('typing');
                    resolve();
                }
            }
            type();
        });
    }

    // ========== 5. ЛОГИКА ТЕСТА ==========
    const testQuestions = [
        {
            question: `${herName}, как ты думаешь, что нас объединяет?`, 
            answers: ["Любовь к приключениям", "Общее чувство юмора", "Мы просто классные"]
        },
        {
            question: "Твой идеальный вечер?",
            answers: ["Уютный фильм дома", "Прогулка под звездами", "Вкусный ужин вдвоем"]
        },
        {
            question: "Что для тебя самое важное в человеке?",
            answers: ["Искренность", "Забота", "Умение поддержать"]
        }
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
        
        await typeText(qText, qData.question, 30);

        qData.answers.forEach((answer, index) => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = answer;
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                btn.style.transition = 'all 0.4s ease';
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, index * 150);

            btn.addEventListener('click', () => {
                playClickSound();
                testAnswers.push(`В${currentQuestion + 1}: ${answer}`);
                
                // Если это последний вопрос — запускаем голос прямо сейчас!
                if (currentQuestion === testQuestions.length - 1) {
                    if (audioTest) audioTest.volume = 0.1; // Приглушаем музыку теста
                    if (audioVoice) {
                        audioVoice.volume = 1.0;
                        audioVoice.play().catch(e => console.log('Ошибка звука:', e));
                    }
                }

                currentQuestion++;
                btn.style.background = 'rgba(255,255,255,0.5)';
                setTimeout(loadQuestion, 200);
            });
            answersDiv.appendChild(btn);
        });
    }

    loadQuestion();

    // ========== 6. РОМАНТИЧНЫЙ РЕЖИМ ==========
    async function startLoveMode() {
        bgCool.style.opacity = 0;
        bgWarm.style.opacity = 1;
        card.classList.add('love-mode');
        isLoveMode = true;
        particles.forEach(p => p.reset()); 
        for (let i = 0; i < 20; i++) particles.push(new Particle());

        playTransitionSound();
        screenTest.classList.remove('active');
        
        setTimeout(async () => {
            screenLove.classList.add('active');
            setTimeout(() => { mainIcon.style.fontSize = '80px'; }, 100);
            document.title = "Ты будешь моей девушкой? 💕";

            // Голос здесь больше не запускаем — он уже играет с момента клика

            await typeText(document.getElementById('question'), `${herName}, ты будешь моей девушкой?`, 50);
            
            const buttonsDiv = document.getElementById('buttons');
            buttonsDiv.style.opacity = '1';
        }, 400);
    }

    // ========== 7. КНОПКИ ==========
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const message = document.getElementById('message');
    const musicToggle = document.getElementById('music-toggle');

    const noTexts = ["Нет", "Ты уверена?", "Подумай ещё!", "Не спеши...", "Может, всё-таки да?", "Я буду скучать 🥺", "Последний шанс!"];
    let noCount = 0;

    noBtn.addEventListener('click', () => {
        playClickSound();
        noCount++;
        if (noCount < noTexts.length) {
            noBtn.textContent = noTexts[noCount];
            const currentScale = 1 - (noCount * 0.1);
            noBtn.style.transform = `scale(${currentScale})`;
            const yesSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
            yesBtn.style.fontSize = (yesSize + 3) + 'px';
            yesBtn.style.padding = `${16 + noCount * 2}px ${40 + noCount * 4}px`;
        } else {
            noBtn.style.display = 'none';
            message.textContent = "Кнопка «Нет» сдалась 😄";
        }
    });

    yesBtn.addEventListener('click', () => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(timeSpent / 60);
        const seconds = timeSpent % 60;
        const timeString = minutes > 0 ? `${minutes} мин. ${seconds} сек.` : `${seconds} сек.`;

        const finalMessage = `💖 <b>ОНА НАЖАЛА «ДА»!</b> 💖\n\n` +
                             `👩 <b>Имя:</b> ${herName}\n` +
                             `⏱ <b>Время до клика:</b> ${timeString}\n\n` +
                             `📝 <b>Её ответы:</b>\n${testAnswers.join('\n')}`;
        sendTelegramMessage(finalMessage);

        playTransitionSound();
        if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

        document.getElementById('question').textContent = "Я знал, что ты скажешь «Да»! 💖";
        message.textContent = "Ты сделала меня самым счастливым человеком на свете.";
        document.getElementById('buttons').style.display = 'none';

        // Включаем романтичную музыку
        if (audioVoice) audioVoice.pause(); 
        if (audioTest) audioTest.pause();
        if (audioLove) {
            audioLove.volume = 0.4;
            audioLove.play().then(() => {
                musicToggle.classList.add('visible');
                musicToggle.textContent = '🔊';
            }).catch(() => console.log('Музыка не загружена'));
        }

        launchConfetti();
    });

    // ========== 8. КОНФЕТТИ ==========
    function launchConfetti() {
        const colors = ['#ff4d6d', '#ff9a3c', '#a18cd1', '#fecfef', '#ffffff', '#ffd93d'];
        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                const c = document.createElement('div');
                c.classList.add('confetti');
                c.style.left = Math.random() * 100 + 'vw';
                c.style.top = '-20px';
                c.style.background = colors[Math.floor(Math.random() * colors.length)];
                c.style.width = (Math.random() * 8 + 6) + 'px';
                c.style.height = (Math.random() * 14 + 8) + 'px';
                c.style.transform = `rotate(${Math.random() * 360}deg)`;
                document.body.appendChild(c);

                const duration = Math.random() * 2 + 2.5;
                c.animate([
                    { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                    { transform: `translateY(110vh) rotate(${Math.random() * 720}deg)`, opacity: 0.9 }
                ], {
                    duration: duration * 1000,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)'
                });

                setTimeout(() => c.remove(), duration * 1000);
            }, i * 20);
        }
    }

    // ========== 9. МУЗЫКА ==========
    musicToggle.addEventListener('click', () => {
        if (audioLove.paused) {
            audioLove.play();
            musicToggle.textContent = '🔊';
        } else {
            audioLove.pause();
            musicToggle.textContent = '🔇';
        }
    });
});
