
// Este código é usado para registrar um service worker.
// register() não é chamado por padrão.

// Isso permite que o app carregue mais rapidamente em visitas subsequentes em produção e dá
// capacidades offline. No entanto, também significa que os desenvolvedores (e usuários)
// só verão atualizações implantadas em visitas subsequentes a uma página, após todas as
// abas abertas da página terem sido fechadas, já que recursos em cache são
// atualizados em segundo plano.

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onWaiting?: (waiting: ServiceWorker) => void;
};

// Verifica se estamos no localhost
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] é o endereço IPv6 localhost.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 são considerados localhost para IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config?: Config): void {
  if ('serviceWorker' in navigator) {
    // O construtor de URL está disponível em todos os navegadores que suportam SW.
    const publicUrl = new URL(import.meta.env.BASE_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Nosso service worker não funcionará se BASE_URL estiver em uma origem diferente
      // de onde nossa página é servida. Isso pode acontecer se uma CDN for usada para
      // servir assets; ver https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${import.meta.env.BASE_URL}service-worker.js`;

      if (isLocalhost) {
        // Isso está rodando em localhost. Vamos verificar se um service worker ainda existe ou não.
        checkValidServiceWorker(swUrl, config);

        // Adicione alguns logs adicionais ao localhost, orientando os desenvolvedores para a
        // documentação do service worker/PWA.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'Este aplicativo está sendo servido primeiro pelo cache para mais rápido ' +
              'carregamento offline. Veja https://cra.link/PWA para mais informações.'
          );
          
          // Se configurado com callback de sucesso, execute-o
          if (config && config.onSuccess) {
            navigator.serviceWorker.ready.then((registration) => {
              config.onSuccess?.(registration);
            });
          }
        });
      } else {
        // Não é localhost. Apenas registre o service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config): void {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      // Verifica anualmente se há atualizações do service worker
      const checkInterval = 12 * 60 * 60 * 1000; // 12 horas em milissegundos
      setInterval(() => {
        registration.update().catch(error => {
          console.error('Erro ao verificar atualizações do service worker:', error);
        });
      }, checkInterval);
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Neste ponto, o conteúdo pré-armazenado em cache atualizado foi buscado,
              // mas o service worker anterior ainda servirá o conteúdo mais antigo
              // até que todas as abas do cliente sejam fechadas.
              console.log(
                'Novo conteúdo está disponível e será usado quando todas ' +
                  'as abas desta página forem fechadas.'
              );

              // Execute o callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
              
              // Se houver um worker esperando e um callback onWaiting, execute-o
              if (registration.waiting && config && config.onWaiting) {
                config.onWaiting(registration.waiting);
              }
            } else {
              // Neste ponto, tudo foi pré-armazenado em cache.
              // É o momento perfeito para exibir uma mensagem
              // "O conteúdo está em cache para uso offline."
              console.log('Conteúdo é armazenado em cache para uso offline.');

              // Execute o callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Erro durante o registro do service worker:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config): void {
  // Verifica se o service worker pode ser encontrado. Se não puder, recarregue a página.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      // Garante que o service worker existe e que realmente estamos obtendo um arquivo JS.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // Nenhum service worker encontrado. Provavelmente um aplicativo diferente. Recarregue a página.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker encontrado. Prossiga normalmente.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Nenhuma conexão de internet encontrada. App está rodando em modo offline.');
    });
}

// Função para atualizar explicitamente o service worker ativo
export function updateServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    return navigator.serviceWorker.ready
      .then(registration => {
        return registration.update();
      })
      .then(() => {
        console.log('Service worker atualizado');
        return Promise.resolve();
      })
      .catch(error => {
        console.error('Erro ao atualizar o service worker:', error);
        return Promise.reject(error);
      });
  }
  return Promise.reject(new Error('Service worker não suportado'));
}

// Função para desinstalar o service worker
export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
