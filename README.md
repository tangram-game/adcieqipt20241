# ADC/IEQ/IPT 2024.1

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Projeto de Administração de Redes de Computadores (ADC), Instalação de Equipamentos de Redes (IEQ) e Telefonia IP (IPT), semestre 2024.1. Será usado um [modelo de jogo](jogo-modelo.md) para o desenvolvimento ao longo do semestre.

## Configuração do ambiente

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
| [Erika e Yago](https://github.com/erikayago) | [jogo](https://github.com/erikayago/jogo) |
| [Gustavo e Vitória]() | [jogo](https://github.com/tangram-game/jogo) |
| [Leandro e Nikolas](https://github.com/nlentertainment) | [jogo](https://github.com/nlentertainment/jogo) |
