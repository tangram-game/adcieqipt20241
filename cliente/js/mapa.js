export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    this.load.image('fundo', './assets/fundo.png')

    this.load.spritesheet('coruja-branca', './assets/coruja-branca.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('coruja-cinza', './assets/coruja-cinza.png', { frameWidth: 64, frameHeight: 64 })

    this.load.audio('coruja-som', './assets/coruja.mp3')
    this.load.audio('trilha', './assets/mapa.mp3')
  }

  create () {
    this.corujaSom = this.sound.add('coruja-som')
    this.trilha = this.sound.add('trilha', { loop: true }).play()

    this.add.image(400, 225, 'fundo')

    if (globalThis.game.jogadores.primeiro === globalThis.game.socket.id) {
      globalThis.game.remoteConnection = new RTCPeerConnection(globalThis.game.iceServers)
      globalThis.game.dadosJogo = globalThis.game.remoteConnection.createDataChannel('chat', { negotiated: true, id: 0 })

      globalThis.game.remoteConnection.onicecandidate = function ({ candidate }) {
        candidate && globalThis.game.socket.emit('candidate', globalThis.game.sala, candidate)
      }

      globalThis.game.remoteConnection.ontrack = function ({ streams: [midia] }) {
        globalThis.game.audio.srcObject = midia
      }

      if (globalThis.game.midias) {
        globalThis.game.midias.getTracks()
          .forEach((track) => globalThis.game.remoteConnection.addTrack(track, globalThis.game.midias))
      }

      globalThis.game.socket.on('offer', (description) => {
        globalThis.game.remoteConnection.setRemoteDescription(description)
          .then(() => globalThis.game.remoteConnection.createAnswer())
          .then((answer) => globalThis.game.remoteConnection.setLocalDescription(answer))
          .then(() => globalThis.game.socket.emit('answer', globalThis.game.sala, globalThis.game.remoteConnection.localDescription))
      })

      globalThis.game.socket.on('candidate', (candidate) => {
        globalThis.game.remoteConnection.addIceCandidate(candidate)
      })

      this.personagemLocal = this.physics.add.sprite(400, 225, 'coruja-branca')
      this.personagemRemoto = this.physics.add.sprite(400, 225, 'coruja-cinza')
    } else if (globalThis.game.jogadores.segundo === globalThis.game.socket.id) {
      globalThis.game.localConnection = new RTCPeerConnection(globalThis.game.iceServers)
      globalThis.game.dadosJogo = globalThis.game.localConnection.createDataChannel('chat', { negotiated: true, id: 0 })

      globalThis.game.localConnection.onicecandidate = function ({ candidate }) {
        candidate && globalThis.game.socket.emit('candidate', globalThis.game.sala, candidate)
      }

      globalThis.game.localConnection.ontrack = function ({ streams: [stream] }) {
        globalThis.game.audio.srcObject = stream
      }

      if (globalThis.game.midias) {
        globalThis.game.midias.getTracks()
          .forEach((track) => globalThis.game.localConnection.addTrack(track, globalThis.game.midias))
      }

      globalThis.game.localConnection.createOffer()
        .then((offer) => globalThis.game.localConnection.setLocalDescription(offer))
        .then(() => globalThis.game.socket.emit('offer', globalThis.game.sala, globalThis.game.localConnection.localDescription))

      globalThis.game.socket.on('answer', (description) => {
        globalThis.game.localConnection.setRemoteDescription(description)
      })

      globalThis.game.socket.on('candidate', (candidate) => {
        globalThis.game.localConnection.addIceCandidate(candidate)
      })

      this.personagemLocal = this.physics.add.sprite(400, 225, 'coruja-cinza')
      this.personagemRemoto = this.physics.add.sprite(400, 225, 'coruja-branca')
    } else {
      console.log('Usuário não é o primeiro ou o segundo jogador. Não é possível iniciar a partida. ')
    }

    this.anims.create({
      key: 'personagem-parado',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 0,
        end: 1
      }),
      frameRate: 2,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-voando-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 2,
        end: 5
      }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-voando-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 6,
        end: 9
      }),
      frameRate: 10,
      repeat: -1
    })

    this.personagemLocal
      .setInteractive()
      .on('pointerdown', () => {
        this.corujaSom.play()
        this.personagemLocal.setVelocityX(10)
        this.personagemLocal.play('personagem-voando-direita')
      })

    globalThis.game.dadosJogo.onopen = () => {
      console.log('Conexão de dados aberta!')
    }

    globalThis.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data)
      if (dados.x) this.personagemRemoto.x = dados.x
      if (dados.y) this.personagemRemoto.y = dados.y
      if (dados.frame) this.personagemRemoto.setFrame(dados.frame)
    }
  }

  update () {
    try {
      if (globalThis.game.dadosJogo.readyState === 'open' && this.personagemLocal) {
        globalThis.game.dadosJogo.send(JSON.stringify({ x: this.personagemLocal.x, y: this.personagemLocal.y, frame: this.personagemLocal.frame.name }))
      }
    } catch (error) {
      // console.error(error)
    }
  }
}
