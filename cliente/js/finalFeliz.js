import Phaser from 'phaser'
import axios from 'axios'

export default class finalFeliz extends Phaser.Scene {
  constructor () {
    super('finalFeliz')
  }

  preload () { }

  create () {
    // Adiciona o texto de parabéns e a possibilidade de reiniciar o jogo
    this.mensagem = this.add.text(100, 50, 'Parabéns! Você conseguiu!', {
      fontSize: '32px',
      fill: '#fff',
      fontFamily: 'Courier New'
    })
      .setInteractive()
      .on('pointerdown', () => {
        window.location.reload()
      })

    // Inicializa o Google Sign-In
    globalThis.google.accounts.id.initialize({
      client_id: '608488110439-e52klas5mi0dh3gd3me08198oru3epg5.apps.googleusercontent.com',
      callback: (res) => {
        if (res.error) {
          console.error(res.error)
        } else {
          axios.post('https://feira-de-jogos.dev.br/api/v2/credit', {
            product: 8, // id do jogo cadastrado no banco de dados da Feira de Jogos
            value: 100 // crédito em tijolinhos
          }, {
            headers: {
              Authorization: `Bearer ${res.credential}`
            }
          })
            .then(function (response) {
              globalThis.game.scene.getScene('finalFeliz').mensagem.setText('Parabéns! Você conseguiu! Seus tijolinhos foram creditados!')
            })
            .catch(function (error) {
              globalThis.game.scene.getScene('finalFeliz').mensagem.setText('Erro ao creditar tijolinhos:', error)
            })
        }
      }
    })

    // Exibe o prompt de login
    globalThis.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        google.accounts.id.prompt()
      }
    })
  }

  update () { }
}
