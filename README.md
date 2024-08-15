## Hidden Forest

![PHOTO-2024-08-11-21-49-24](https://github.com/user-attachments/assets/a91d273f-5a0c-4014-ab42-f02deb3a1051)

## Premissa do Jogo

Dois amigos de infância Merlyn e Donald caminhavam em uma floresta a fim de coletar frutas e flores diferentes. Eles só não esperavam por uma feiticeira que se sentiu intimidada pela presença dos mesmos. 
Os dois foram transformados em corujas e separados na floresta, cada um em um polo diferente. A velha feiticeira deu até às 6h da manhã do dia seguinte para se encontrarem, caso contrário, serão corujas para toda a eternidade.  

## Referências do jogo
Filmes:
Ghost in the Shell;
Paprika;
Matrix;
Cubo.

Na literatura:
Jorge Luis Borges: A Bilbioteca de Babel;
Philip K. Dick: Ubik;
William Gibson: Neuromancer.

## Jogo Ideal

O jogo ideal seria uma jornada pelo reencontro dos personagens, a tempo para que não virem eternas corujas. 

Donald, 18 anos, é alguém centrado, objetivo e focado. Merlyn, 18 anos, é sentimental, muito cuidadosa e inteligente. A feiticeira é na verdade uma antiga colega de classe, que tinha muita inveja da amizade dos dois. O jogo terá essa descoberta ao final, atravessando a floresta. 
Terão que enfrentar diversos desafios e labirintos, que irão despertar seus maiores medos. 
Quando finalmente conseguem chegar ao final do labirinto de árvores e se reencontram, a feiticeira frustrada, os transforma novamente em humanos para que possam retornar à civilização. 

## Regras

A cada intervalo de tempo, o mapa muda: as camadas do labirinto se alternam na tela, alterando as áreas de colisão. O labirinto, na prática, está vivo. E pulsando. Há apenas um único inimigo: o próprio jogador (e seus medos).

## Objetivo

Para conseguirem terminar o jogo, basta chegar ao final do labirinto de árvores: o centro onde os amigos se encontrarão e, juntos, se transformarão novamente em humanos pela feiticeira, cumprindo sua promessa. 

## Formas de receitas
Como formas de receita, estão previstos:

Compra de créditos para estender o relógio;
Personalização de personagens e mapas.



## Configuração do ambiente

Proxy reverso NGINX:

```
location / {
	proxy_pass http://localhost:3000/;
	proxy_http_version 1.1;
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection "Upgrade";
	proxy_set_header Host $host;
}
```

Servidor do jogo via `systemd`:

```ini
[Unit]
Description=<Descritivo>
Documentation=<URL do repositório>
After=network.target

[Service]
Environment=PORT=3000
Type=simple
WorkingDirectory=<diretório local do repositório>
ExecStart=<caminho do npm> start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
