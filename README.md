# ADC/IEQ/IPT 2024.1

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Projeto de Administração de Redes de Computadores (ADC), Instalação de Equipamentos de Redes (IEQ) e Telefonia IP (IPT), semestre 2024.1. Será usado um [modelo de jogo](jogo-modelo.md) para o desenvolvimento ao longo do semestre.

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

## Equipes

| Equipe | Jogo |
|-|-|
| [Bernardo, Filipe e Vitor Ademir](https://github.com/VFB-Corporation) | [Jogo](https://github.com/VFB-Corporation/JOGO) |
| [Mariana e Vitor Hugo](https://github.com/mvplay-s) | [Pilatus](https://github.com/mvplay-s/Pilatus) |
| [Náthally e Guilherme](https://github.com/vimdoalegrete) | [jogo](https://github.com/vimdoalegrete/jogo) | 
| [Davi e Gabriel](https://github.com/huntersofancientbeasts)|[Hunters of Ancient Beasts](https://github.com/huntersofancientbeasts/jogo) |
| [Erika e Yago](https://github.com/erikayago) | [jogo](https://github.com/erikayago/-jogo-feria-ye) |
| [Gustavo e Vitória]() | [jogo](https://github.com/tangram-game/adcieqipt20241) |
| [Leandro e Nikolas](https://github.com/nlentertainment) | [jogo](https://github.com/nlentertainment/jogo) |
