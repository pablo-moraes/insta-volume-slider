// ==UserScript==
// @name         Instagram Volume Control Fixed
// @match        https://www.instagram.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  // Verifica se o usuário está acessando do reels e retorna um boolean
  const isReelsPage = () => window.location.href.includes("/reels");

  const DEFAULT_STYLE = { transition: "height .1s ease" };
  const REELS_SLIDER_CSS = {
    height: "200px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "start",
    padding: ".5rem",
  };

  const TIMELINE_SLIDER_CSS = {
    height: "200px",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    maxWidth: "28px",
  };

  // Esta função formata a hora retornada para que fique no formato minutos:segundos e sempre possua 2 dígitos.
  // const formatTime = (timeInSeconds) => {
  //   const minutes = String(Math.floor(timeInSeconds / 60)).padStart(2, "0");
  //   const seconds = String(Math.floor(timeInSeconds % 60)).padStart(2, "0");
  //   return `${String(minutes).padStart(2, "0")}:${seconds}`;
  // };

  // Adiciona um input do tipo range como controle de volume de videos
  const addVolumeSlider = function (video, btn) {
    const volumeSlider = document.createElement("input");
    volumeSlider.type = "range";
    volumeSlider.min = "0";
    volumeSlider.max = "100";

    const reels = isReelsPage();
    Object.assign(volumeSlider.style, {
      width: "150px",
      position: "absolute",
      transform: `rotate(-90deg) ${reels ? "translateY(-5%)" : ""}`,
      top: reels ? "50%" : "40%",
      right: reels ? "auto" : "-100%",
      zIndex: "9999",
    });

    const setUnmuted = () => {
      video.muted = false;
      btn.click();
    };

    volumeSlider.addEventListener("input", (e) => {
      // Seta e calcula um volume para o video com base no step de entrada
      const volumeValue = e.target.value / 100;
      video.volume = volumeValue;

      // Salva volume selecionado no localStorage
      localStorage.setItem("volumebar_value", volumeValue);

      // Sempre que o evento for disparado verifica se o vídeo está mutado e o desmuta
      if (video.muted) setUnmuted();
    });

    volumeSlider.addEventListener(
      "wheel",
      (event) => {
        // Limita o scroll para o elemento em hover prevenindo o scroll padrão
        event.preventDefault();

        // Define a direção de rolagem e o step em que o input se encontra
        const step = Number(volumeSlider.step) || 1;        
        const direction = event.deltaY < 0 ? step : -step;

        // Verifica a posição do slider e atualiza o input com o novo valor.
        const newValue = Number(volumeSlider.value) + direction;
        volumeSlider.value = newValue;

        if (video.muted) setUnmuted();
      },
      { passive: false },
    );

    // Evita do click no input propagar para o elemento pai
    volumeSlider.addEventListener("click", (e) => e.stopPropagation());

    return volumeSlider;
  };

  const addVolumeBar = (video) => {
    // Seleciona o botão de mute/unmute que está sendo usado como elemento pai para o range de volume.
    const audioButton = video.nextElementSibling.querySelector(
      ".html-div [type='button'] > div, .html-div > [role='button']",
    );

    // Aplica estilização padrão que será necessária para o input se comportar adequadamente
    Object.assign(audioButton.style, DEFAULT_STYLE);

    // Aplica o volume salvo no localStorage, se não, é aplicado o valor padrão.
    const applyVolume = () => {
      const stored = localStorage.getItem("volumebar_value");
      const volume = stored !== null ? Number(stored) : 1;

      video.volume = volume;
    };

    video.addEventListener("play", () => {
      applyVolume();
    });

    // Exibe o input range quando o usuário passa o mouse por cima do botão de mute/unmute
    audioButton.addEventListener("mouseover", function (event) {
      Object.assign(
        audioButton.style,
        isReelsPage() ? REELS_SLIDER_CSS : TIMELINE_SLIDER_CSS,
      );

      const inputExists = audioButton.querySelector('input[type="range"]');

      // Verifica se o input já existe para evitar duplicidade
      if (!inputExists) {
        const volumeSlider = addVolumeSlider(video, audioButton);
        // Atualiza o input range com o volume atual do player de video.
        volumeSlider.value = video.volume * 100;
        audioButton.append(volumeSlider);
      }
    });

    // Remove as aplicações de estilo e remove o input de volume assim que o usuário retira o mouse de cima dele
    audioButton.addEventListener("mouseleave", function () {
      const hoverStyles = isReelsPage()
        ? REELS_SLIDER_CSS
        : TIMELINE_SLIDER_CSS;

      Object.keys(hoverStyles).forEach((prop) => (audioButton.style[prop] = ""));

      const input = audioButton.querySelector('input[type="range"]');
      if (input) input.remove();
    });

    audioButton.addEventListener("click", function (event) {
      // Sempre que detectar um evento de clique dentro do botão e ele vier do input, ele retorna antes de fazer qualquer coisa.
      if (event.target.matches("input[type='range']")) return;
    });
  };

  const setupVideos = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      /*
        Verifica se o video já tem o atributo processed e  se não tiver o adiciona para 
        conseguir controlar a adição da barra de volume aos players de video carregados
      */
      if (!video.dataset.processed) {
        video.dataset.processed = true;
        addVolumeBar(video);
      }
    });
  };

  // Instancia um observer para chamar setupVideos sempre que houver mudanças no DOM da página
  const observer = new MutationObserver(setupVideos);

  // Seta o observer para verificar mudanças em todas os elementos filhos do body
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Chama a setupVideos sempre que o conteúdo da árvore DOM for carregado
  document.addEventListener("DOMContentLoaded", setupVideos);
})();
