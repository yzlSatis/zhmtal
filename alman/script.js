function translateAudio() {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'tr-TR'; 

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log('Transcript:', transcript);
        fetchTranslation(transcript, 'tr', 'de');
    };

    recognition.start();
}

function fetchTranslation(transcript, sourceLang, targetLang) {
    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(transcript)}`)
    .then(response => response.json())
    .then(data => {
        const translatedText = data[0][0][0];
        console.log('Translated Text:', translatedText);
        const audio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(translatedText)}&tl=${targetLang}&total=1&idx=0&textlen=${translatedText.length}`);
        audio.play();
        if (sourceLang === 'tr') {
            startRecognition('de');
        } else { 
            startRecognition('tr-TR');
        }
    })
    .catch(error => {
        console.error('Error fetching translation:', error);
    });
}

function startRecognition(language) {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = language;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log('Transcript:', transcript);
        fetchTranslation(transcript, language === 'de' ? 'de' : 'tr', language === 'de' ? 'tr' : 'de');
    };

    recognition.start();
}
