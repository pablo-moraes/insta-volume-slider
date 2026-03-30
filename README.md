# Instagram Custom Bar

Por enquanto trata-se apenas de um script pra adicionar uma barra de volume nos vídeos do Instagram, pois é muito ruim navegar do jeito que está agora. *(Eu sei que existem extensões pra isso, mas eu queria fazer eu mesmo)*

Bom, inicialmente eu pensei em colocar esse script na extensão [TamperMonkey](https://www.tampermonkey.net/).
Como ainda tô desenvolvendo eu vou pesquisar como posso organizar isso.

## Instalação
1. Abra a sua extensão Tampermonkey e clique em `Adicionar novo script`
2. Copie e cole o código do arquivo [`main.js`](main.js) e salve.

## ChatGPT e afins
O script que eu fiz inicialmente não estava rodando no Tampermonkey, então joguei ele em umas 4 IAs diferentes pra me mostrar o que eu estava fazendo de errado, foi aí que ele me sugeriu adicionar esse atributo processed nos videos e um listener para chamar a função ao carregar o DOM. (Antes estava fazendo direto e não estava indo)

```js
  const setupVideos = () => {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {

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
```
