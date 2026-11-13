'use strict';
// MAPO word lists transcribed from mapoware/mapo-alphabet analysis.ipynb.
// Original code and research: Copyright (c) 2026 mapo, MIT License.
const alphabets = {
  mapo: 'Added Barker Clauses Defer Emerald Front Gained Hand Isabel Jute Kilo Lovely Magenta Neighbor Owens Pointed Quality Relieved Sputum Tunisia Unpaid Valvular Weezer Xray Yes Zoom'.split(' '),
  nato: 'Alfa Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu'.split(' '),
  worst: 'Aegis Bdellium Czar Djibouti Eunuch Fillet Gnostic Heir Ignoble Jaeger Knowable Library Mnemonic Nought Oedema Ptolemaic Qatar Rights Surfing Tchotchke Upon Views Wien Xenon Yves Zhang'.split(' ')
};
const descriptions = {
  mapo: 'Best-recognized words from the original notebook’s saved training run. Experimental, not a standardized spelling alphabet.',
  nato: 'The international NATO spelling alphabet. A familiar choice for spelling names and codes aloud.',
  worst: 'The most-confusing words from the original notebook’s saved run. An experiment in how easily letters can be misheard.'
};
const $ = id => document.getElementById(id);
let output = '';
let speaking = false;
const speechAvailable = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
function stopSpeech() {
  if (speechAvailable) window.speechSynthesis.cancel();
  speaking = false; $('speak').textContent = '▶ Listen';
}
function render() {
  stopSpeech();
  const text = $('text').value;
  const alphabet = alphabets[$('alphabet').value];
  const groups = text.trim().split(/\s+/).filter(Boolean);
  $('result').replaceChildren();
  output = groups.map(group => Array.from(group).map(char => /^[a-z]$/i.test(char) ? alphabet[char.toUpperCase().charCodeAt(0) - 65] : char).join(' ')).join(' / ');
  for (const group of groups) {
    const wrapper = document.createElement('div'); wrapper.className = 'word-group';
    for (const char of group) {
      const token = document.createElement('span'); token.className = 'token';
      const small = document.createElement('small'); small.textContent = char.toUpperCase();
      const word = document.createElement('b'); word.textContent = /^[a-z]$/i.test(char) ? alphabet[char.toUpperCase().charCodeAt(0) - 65] : char;
      token.append(small, word); wrapper.append(token);
    }
    $('result').append(wrapper);
  }
  if (!groups.length) { const empty = document.createElement('span'); empty.className = 'empty'; empty.textContent = 'Your phonetic spelling will appear here.'; $('result').append(empty); }
  $('count').textContent = `${text.length.toLocaleString('en-US')} / 2,000`;
  const letters = (text.match(/[a-z]/gi) || []).length;
  $('letter-count').textContent = `${letters} letter${letters === 1 ? '' : 's'}`;
  $('copy').disabled = $('download').disabled = !output;
  $('speak').disabled = !output || !speechAvailable;
  $('speak').title = speechAvailable ? 'Read the phonetic output aloud' : 'Speech is unavailable in this browser';
  $('alphabet-note').textContent = descriptions[$('alphabet').value];
  $('reference-label').textContent = $('alphabet').selectedOptions[0].textContent;
  $('alphabet-grid').replaceChildren();
  alphabet.forEach((word, i) => { const card = document.createElement('div'); card.className = 'letter-card'; const letter = document.createElement('strong'); letter.textContent = String.fromCharCode(65 + i); const name = document.createElement('span'); name.textContent = word; card.append(letter, name); $('alphabet-grid').append(card); });
  $('status').textContent = '';
}
$('text').addEventListener('input', render);
$('alphabet').addEventListener('change', render);
$('clear').addEventListener('click', () => { $('text').value = ''; render(); $('text').focus(); });
const examples = ['Mapo alphabet', 'Flight AB-204', 'Hello world', 'Meet at 9!']; let exampleIndex = 0;
$('example').addEventListener('click', () => { $('text').value = examples[exampleIndex++ % examples.length]; render(); });
$('copy').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(output); $('status').textContent = 'Output copied to clipboard.'; }
  catch { $('status').textContent = 'Clipboard unavailable. Use Download to save your output.'; }
});
$('download').addEventListener('click', () => {
  const blob = new Blob([`${$('text').value}\n\n${output}\n\n${$('alphabet').selectedOptions[0].textContent}\nOriginal code and research: mapo / mapoware — https://github.com/mapoware/mapo-alphabet\n`], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'mapo-spelling.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); $('status').textContent = 'Output downloaded.';
});
$('speak').addEventListener('click', () => {
  if (speaking) { stopSpeech(); return; }
  const utterance = new SpeechSynthesisUtterance(output.replaceAll(' / ', '. ')); utterance.lang = 'en-US'; utterance.rate = 0.8;
  utterance.onend = () => { speaking = false; $('speak').textContent = '▶ Listen'; };
  utterance.onerror = () => { speaking = false; $('speak').textContent = '▶ Listen'; $('status').textContent = 'Speech could not play. Try another browser or copy the output.'; };
  speaking = true; $('speak').textContent = '■ Stop'; window.speechSynthesis.speak(utterance);
});
window.addEventListener('pagehide', stopSpeech);
render();
