const askBtn = document.getElementById("askBtn");
const voiceBtn = document.getElementById("voiceBtn");
const clearBtn = document.getElementById("clearBtn");
const questionInput = document.getElementById("question");
const chatBox = document.getElementById("chatBox");

const API_URL = "https://voice-bot-9lxd.onrender.com/chat";
const CLEAR_URL = "http://127.0.0.1:8000/clear";

let recognition = null;
let typingSpeed = 18;

// ----------------------------
// Events
// ----------------------------

askBtn.addEventListener("click", askQuestion);

questionInput.addEventListener("keypress", function(e){

    if(e.key==="Enter"){
        askQuestion();
    }

});

voiceBtn.addEventListener("click", startVoiceRecognition);

clearBtn.addEventListener("click", clearConversation);

// ----------------------------
// Ask Question
// ----------------------------

async function askQuestion(){

    speechSynthesis.cancel();

    const question = questionInput.value.trim();

    if(question===""){

        alert("Please enter a question.");

        return;

    }

    addUserMessage(question);

    questionInput.value="";

    askBtn.disabled=true;

    voiceBtn.disabled=true;

    showLoading();

    try{

        const response = await fetch(
            `${API_URL}?question=${encodeURIComponent(question)}`
        );

        if(!response.ok){

            throw new Error("Server Error");

        }

        const data = await response.json();

        removeLoading();

        await typeBotMessage(data.answer);

        speak(data.answer);

    }

    catch(error){

        removeLoading();

        addBotMessage("Unable to connect to backend.");

        console.log(error);

    }

    askBtn.disabled=false;

    voiceBtn.disabled=false;

}

// ----------------------------
// Clear Conversation
// ----------------------------

async function clearConversation(){

    speechSynthesis.cancel();

    try{

        await fetch(CLEAR_URL,{
            method:"POST"
        });

    }

    catch(e){

        console.log(e);

    }

    chatBox.innerHTML=`

    <div class="bot-message">

        <div class="message-header">

            👩 Akhila Priya

        </div>

        <div class="message-text">

            Hello!

            I'm Akhila Priya's AI Interview Assistant.

            Ask me anything about my education,

            AI projects,

            hobbies,

            technical skills,

            or interview preparation.

        </div>

    </div>

    `;

}

// ----------------------------
// User Message
// ----------------------------

function addUserMessage(text){

    const div=document.createElement("div");

    div.className="user-message";

    div.innerHTML=`

        <div class="message-header">

            👤 Interviewer

        </div>

        <div class="message-text">

            ${text}

        </div>

    `;

    chatBox.appendChild(div);

    scrollBottom();

}

// ----------------------------
// Bot Message
// ----------------------------

function addBotMessage(text){

    const div=document.createElement("div");

    div.className="bot-message";

    div.innerHTML=`

        <div class="message-header">

            👩 Akhila Priya

        </div>

        <div class="message-text">

            ${text}

        </div>

    `;

    chatBox.appendChild(div);

    scrollBottom();

}

// ----------------------------
// Typing Animation
// ----------------------------

async function typeBotMessage(text){

    const div=document.createElement("div");

    div.className="bot-message";

    div.innerHTML=`

        <div class="message-header">

            👩 Akhila Priya

        </div>

        <div class="message-text"></div>

    `;

    chatBox.appendChild(div);

    const area=div.querySelector(".message-text");

    for(let i=0;i<text.length;i++){

        area.innerHTML+=text.charAt(i);

        scrollBottom();

        await new Promise(resolve=>setTimeout(resolve,typingSpeed));

    }

}

// ----------------------------
// Loading Animation
// ----------------------------

function showLoading(){

    const div=document.createElement("div");

    div.className="bot-message";

    div.id="loading";

    div.innerHTML=`

        <div class="message-header">

            🤖 Thinking...

        </div>

        <div class="loading">

            <span></span>

            <span></span>

            <span></span>

        </div>

    `;

    chatBox.appendChild(div);

    scrollBottom();

}

function removeLoading(){

    const loading=document.getElementById("loading");

    if(loading){

        loading.remove();

    }

}

// ----------------------------
// Auto Scroll
// ----------------------------

function scrollBottom(){

    chatBox.scrollTop=chatBox.scrollHeight;

}

// ----------------------------
// Voice Recognition
// ----------------------------

function startVoiceRecognition(){

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        alert("Speech Recognition is not supported in this browser.");

        return;

    }

    speechSynthesis.cancel();

    recognition = new SpeechRecognition();

    recognition.lang="en-US";

    recognition.interimResults=false;

    recognition.maxAlternatives=1;

    recognition.start();

    voiceBtn.innerHTML="🎤 Listening...";

    recognition.onresult=function(event){

        const transcript=event.results[0][0].transcript;

        questionInput.value=transcript;

        voiceBtn.innerHTML="🎙️ Start Speaking";

        askQuestion();

    };

    recognition.onerror=function(){

        voiceBtn.innerHTML="🎙️ Start Speaking";

    };

    recognition.onend=function(){

        voiceBtn.innerHTML="🎙️ Start Speaking";

    };

}

// ----------------------------
// Text To Speech
// ----------------------------

function speak(text){

    speechSynthesis.cancel();

    const speech=new SpeechSynthesisUtterance(text);

    speech.lang="en-US";

    speech.rate=1;

    speech.pitch=1;

    speech.volume=1;

    const voices=speechSynthesis.getVoices();

    if(voices.length>0){

        const femaleVoice=voices.find(v=>

            v.lang.startsWith("en") &&

            (
                v.name.toLowerCase().includes("female") ||
                v.name.toLowerCase().includes("zira") ||
                v.name.toLowerCase().includes("aria") ||
                v.name.toLowerCase().includes("samantha")
            )

        );

        if(femaleVoice){

            speech.voice=femaleVoice;

        }

        else{

            speech.voice=voices.find(v=>v.lang.startsWith("en")) || voices[0];

        }

    }

    speech.onstart=function(){

        console.log("Speaking...");

    };

    speech.onend=function(){

        console.log("Finished.");

        speechSynthesis.cancel();

    };

    speechSynthesis.speak(speech);

}

// ----------------------------
// Stop Speaking
// ----------------------------

function stopSpeaking(){

    speechSynthesis.cancel();

}

// ----------------------------
// Stop Recognition
// ----------------------------

function stopRecognition(){

    if(recognition){

        recognition.stop();

    }

}

// ----------------------------
// Load Voices
// ----------------------------

window.speechSynthesis.onvoiceschanged=function(){

    speechSynthesis.getVoices();

};

console.log("AI Interview Assistant Loaded Successfully.");
