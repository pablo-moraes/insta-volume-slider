/**
 * Eu preciso aprender a documentar as coisas melhor
 */

const videos = document.querySelectorAll("video");


// Esta função formata a hora retornada para que fique no formato minutos:segundos e sempre possua 2 dígitos.
const formatTime = (timeInSeconds) => {
  const minutes = String(Math.floor(timeInSeconds / 60)).padStart(2, "0");
  const seconds = String(Math.floor(timeInSeconds % 60)).padStart(2, "0");
  return `${String(minutes).padStart(2, "0")}:${seconds}`;
};

const addVolumeBar = (video) => {
  
  // Essa query encontra tanto o botão de volume da página de reels quanto o da timeline
  const btnAudio = video.nextElementSibling.querySelector(".html-div [type='button'], .html-div > [role='button']");
  console.log(btnAudio)

  // Quando um usuário passar o mouse sobre o botão deve exibir o botão de volume
  btnAudio.addEventListener("mouseenter", function (event) {
    event.stopPropagation();
    console.log(`Saporra tem ${formatTime(video.duration)}`);    
  });
};

videos.forEach(addVolumeBar);

/**
 * TODO:
 * - No botão em si eu mudo o tamanho e o border-radius quando houver o evento de hover.
 * - Dentro no botão eu adiciono o input range e seto o seguinte estilo: transform: rotate(-90deg) translateX(50%);position:absolute;bottom:0;accent-color:#fff;
 * - No ícone eu aplico esse estilo: position:absolute;top:0;transform:translateY(50%);
 * - Ambas as aplicações de estilo devem ser implementadas para se adaptarem em ambos as rotas, tanto timeline quanto reels.
 * - A barra de volume fica escondida e o tamanho do botão se mantém, ele só aparece quando eu passar o mouse por cima dele.
 * - Devo garantir que 
 */
