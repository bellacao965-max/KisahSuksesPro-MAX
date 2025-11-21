const HF_API_URL = "https://api-inference.huggingface.co/models/google/gemma-2-2b-it";
let HF_API_KEY = (typeof HF_API_KEY !== 'undefined') ? HF_API_KEY : "hf_REPLACE_WITH_YOUR_TOKEN";

// Quotes
const QUOTES = [
  "Sukses bukan kunci kebahagiaan — kebahagiaan adalah kunci sukses.",
  "Kerja keras hari ini, cerita sukses esok hari.",
  "Jangan takut gagal; takutlah jika tidak pernah mencoba.",
  "Mulailah dari yang kecil, konsistenlah, dan lihat perubahan.",
  "Fokus pada progres, bukan hasil instan."
];

document.addEventListener('DOMContentLoaded', function(){ 
  const chatBox = document.getElementById('chatBox');
  const sendBtn = document.getElementById('sendBtn');
  const userInput = document.getElementById('userInput');
  const quoteBtn = document.getElementById('quoteBtn');
  const quoteBox = document.getElementById('quoteBox');
  const ttsToggle = document.getElementById('ttsToggle');

  // Quotes
  quoteBtn.addEventListener('click', function(){ quoteBox.textContent = QUOTES[Math.floor(Math.random()*QUOTES.length)]; });

  // Chat send
  sendBtn.addEventListener('click', async function(){
    var msg = userInput.value.trim();
    if(!msg) return;
    appendMsg('You', msg);
    userInput.value = '';
    appendMsg('AI','...');

    var reply = await aiGenerate(msg);
    // replace last AI bubble
    var ais = chatBox.querySelectorAll('.ai');
    ais[ais.length-1].textContent = reply;
    if(ttsToggle.checked) speak(reply);
  });

  // TTS using Web Speech API (works on most browsers; label "Google" depends on browser voice)
  function speak(text){
    try{
      var s = new SpeechSynthesisUtterance(text);
      var voices = speechSynthesis.getVoices();
      var gvoice = voices.find(function(v){ return /Google/i.test(v.name); });
      if(gvoice) s.voice = gvoice;
      speechSynthesis.speak(s);
    }catch(e){
      console.warn('TTS unavailable', e);
    }
  }

  // Chat helper
  function appendMsg(role, text){
    var d = document.createElement('div');
    d.className = 'bubble ' + (role==='You'?'user':'ai');
    d.textContent = text;
    chatBox.appendChild(d);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // AI function
  async function aiGenerate(prompt){
    try{
      var res = await fetch(HF_API_URL, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + HF_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: prompt, options:{wait_for_model:true} })
      });
      var j = await res.json();
      if(j.error) return 'AI busy or error: ' + (j.error.message || j.error);
      return j[0] && j[0].generated_text ? j[0].generated_text : 'No reply';
    }catch(e){
      return 'AI connection error';
    }
  }

  // YouTube player
  var YT_LIST = ["bHQqvYy5KYo", "L_jWHffIx5E", "kXYiU_JCYtU", "3JZ_D3ELwOQ", "fLexgOxsZu0", "9bZkp7q19f0", "hTWKbfoikeg", "RgKAFK5djSk", "60ItHLz5WEA", "uelHwf8o7_U", "09R8_2nJtjg", "Zi_XLOBDo_Y", "YykjpeuMNEk", "SlPhMPnQ58k", "CevxZvSJLk8", "JGwWNGJdvx8", "k85mRPqvMbE", "uelHwf8o7_U", "2Vv-BfVoq4g", "3AtDnEC4zak"];
  var currentIndex = 0;
  var ytPlayer = null;
  window.onYouTubeIframeAPIReady = function(){
    ytPlayer = new YT.Player('playerContainer', {
      height: '220',
      width: '100%',
      videoId: YT_LIST[currentIndex],
      playerVars: { 'playsinline': 1, 'rel': 0 },
      events: { 'onReady': function(){ document.getElementById('ytTitle').textContent = 'Video ID: ' + YT_LIST[currentIndex]; } }
    });
  };

  function loadYT(i){
    if(!ytPlayer) return;
    currentIndex = (i + YT_LIST.length) % YT_LIST.length;
    ytPlayer.loadVideoById(YT_LIST[currentIndex]);
    document.getElementById('ytTitle').textContent = 'Video ID: ' + YT_LIST[currentIndex];
  }

  document.getElementById('nextVid').addEventListener('click', function(){ loadYT(currentIndex+1); });
  document.getElementById('prevVid').addEventListener('click', function(){ loadYT(currentIndex-1); });
  document.getElementById('randomSmall').addEventListener('click', function(){ loadYT(Math.floor(Math.random()*YT_LIST.length)); });
  document.getElementById('playPause').addEventListener('click', function(){
    if(!ytPlayer) return;
    var s = ytPlayer.getPlayerState();
    if(s===YT.PlayerState.PLAYING) ytPlayer.pauseVideo(); else ytPlayer.playVideo();
  });

  // Games
  document.querySelectorAll('.gbtn').forEach(function(b){ b.addEventListener('click', function(){ document.getElementById('gameFrame').src = b.getAttribute('data-src'); }); });
});
