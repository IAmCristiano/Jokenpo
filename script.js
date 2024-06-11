const container = document.getElementById('container');
const contadorElemento = document.getElementById('contador');
const reiniciarBtn = document.getElementById('reiniciar-btn');

const numEmojis = 60;
const velocidade = 5;
const tamanhoEmoji = 30;

const emojis = [];

const contador = {
  pedra: 20,
  papel: 20,
  tesoura: 20
};

function criarEmoji(tipo) {
  const emoji = document.createElement('div');
  emoji.classList.add('emoji');
  emoji.textContent = tipo === 'pedra' ? '🗿' : tipo === 'papel' ? '📄' : '✂️';
  emoji.dataset.tipo = tipo;

  const x = Math.random() * (container.offsetWidth - tamanhoEmoji);
  const y = Math.random() * (container.offsetHeight - tamanhoEmoji);
  emoji.style.left = `${x}px`;
  emoji.style.top = `${y}px`;

  emoji.dataset.dx = (Math.random() - 0.5) * velocidade;
  emoji.dataset.dy = (Math.random() - 0.5) * velocidade;

  container.appendChild(emoji);
  emojis.push(emoji);
}

function atualizarContador() {
  contadorElemento.textContent = `Pedra: ${contador.pedra}, Papel: ${contador.papel}, Tesoura: ${contador.tesoura}`;
}

function verificarColisao(emoji1, emoji2) {
  const rect1 = emoji1.getBoundingClientRect();
  const rect2 = emoji2.getBoundingClientRect();

  return (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
}

function aplicarRegras(emoji1, emoji2) {
  const tipo1 = emoji1.dataset.tipo;
  const tipo2 = emoji2.dataset.tipo;

  if (tipo1 === tipo2) return;

  if (
    (tipo1 === 'pedra' && tipo2 === 'tesoura') ||
    (tipo1 === 'tesoura' && tipo2 === 'papel') ||
    (tipo1 === 'papel' && tipo2 === 'pedra')
  ) {
    emoji2.textContent = emoji1.textContent;
    emoji2.dataset.tipo = tipo1;
    contador[tipo2]--;
    contador[tipo1]++;
  }
}

function processarColisoes(emoji) {
  for (let j = 0; j < emojis.length; j++) {
    const outroEmoji = emojis[j];
    if (emoji !== outroEmoji && verificarColisao(emoji, outroEmoji)) {
      aplicarRegras(emoji, outroEmoji);
    }
  }
}

function animar() {
  for (let i = 0; i < emojis.length; i++) {
    const emoji = emojis[i];

    let x = parseFloat(emoji.style.left);
    let y = parseFloat(emoji.style.top);

    x += parseFloat(emoji.dataset.dx);
    y += parseFloat(emoji.dataset.dy);

    if (x <= 0 || x >= container.offsetWidth - tamanhoEmoji) {
      emoji.dataset.dx *= -1;
    }
    if (y <= 0 || y >= container.offsetHeight - tamanhoEmoji) {
      emoji.dataset.dy *= -1;
    }

    emoji.style.left = `${x}px`;
    emoji.style.top = `${y}px`;

    processarColisoes(emoji);
  }

  atualizarContador();

  requestAnimationFrame(animar);
}

function reiniciarJogo() {
  // Reinicia o contador
  contador.pedra = 20;
  contador.papel = 20;
  contador.tesoura = 20;

  // Remove todos os emojis existentes
  emojis.forEach(emoji => emoji.remove());
  emojis.length = 0; // Limpa o array de emojis

  // Cria novos emojis
  for (let i = 0; i < numEmojis / 3; i++) {
    criarEmoji('pedra');
    criarEmoji('papel');
    criarEmoji('tesoura');
  }

  atualizarContador();
}

reiniciarBtn.addEventListener('click', reiniciarJogo);

for (let i = 0; i < numEmojis / 3; i++) {
  criarEmoji('pedra');
  criarEmoji('papel');
  criarEmoji('tesoura');
}

atualizarContador();
animar();