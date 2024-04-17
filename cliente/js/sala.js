export default class sala extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  preload () {
    this.load.audio('iniciar', './assets/iniciar.mp3')

    this.load.image('fundo', './assets/fundo.png')
  }

  create () {
    this.iniciar = this.sound.add('iniciar')

    this.add.image(400, 225, 'fundo')

    this.mensagem = this.add.text(100, 50, 'Sala 1')
      .setInteractive()
      .on('pointerdown', () => {
        this.iniciar.play()
        globalThis.game.sala = 1
        globalThis.game.socket.emit('entrar-na-sala', globalThis.game.sala)
      })

    globalThis.game.socket.on('jogadores', (jogadores) => {
      console.log(jogadores)

      if (jogadores.segundo) {
        this.mensagem.setText('Conectando...')
        globalThis.game.jogadores = jogadores
        globalThis.game.scene.stop('sala')
        globalThis.game.scene.start('mapa')
      } else if (jogadores.primeiro) {
        this.mensagem.setText('Aguardando segundo jogador...')
      }
    })
  }

  update () {
  }
}
