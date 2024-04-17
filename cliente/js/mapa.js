export default class mapa extends Phaser.Scene {
  constructor () {
    super('mapa')
  }

  preload () {
    this.load.audio('mapa', './assets/mapa.mp3')
    this.load.audio('coruja', './assets/coruja.mp3')

    this.load.tilemapTiledJSON('mapa', './assets/mapa/mapa.json')

    this.load.image('blocos', './assets/mapa/blocos.png')
    this.load.image('grama', './assets/mapa/grama.png')
    this.load.image('itens', './assets/mapa/itens.png')
    this.load.image('paredes', './assets/mapa/paredes.png')
    this.load.image('pedras', './assets/mapa/pedras.png')
    this.load.image('personagem', './assets/mapa/personagem.png')
    this.load.image('plantas', './assets/mapa/plantas.png')
    this.load.image('sombras-plantas', './assets/mapa/sombras-plantas.png')
    this.load.image('sombras', './assets/mapa/sombras.png')

    this.load.spritesheet('coruja-cinza', './assets/coruja-cinza.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('coruja-branca', './assets/coruja-branca.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('nuvem', './assets/nuvem.png', { frameWidth: 64, frameHeight: 64 })

    this.load.spritesheet('cima', './assets/cima.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('baixo', './assets/baixo.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('esquerda', './assets/esquerda.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('direita', './assets/direita.png', { frameWidth: 64, frameHeight: 64 })
  }

  create () {
    this.input.addPointer(3)

    this.sound.add('mapa', { loop: true }).play()
    this.corujaPio = this.sound.add('coruja')

    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    this.tilesetBlocos = this.tilemapMapa.addTilesetImage('blocos')
    this.tilesetGrama = this.tilemapMapa.addTilesetImage('grama')
    this.tilesetItens = this.tilemapMapa.addTilesetImage('itens')
    this.tilesetParedes = this.tilemapMapa.addTilesetImage('paredes')
    this.tilesetPedras = this.tilemapMapa.addTilesetImage('pedras')
    this.tilesetPersonagem = this.tilemapMapa.addTilesetImage('personagem')
    this.tilesetPlantas = this.tilemapMapa.addTilesetImage('plantas')
    this.tilesetSombrasPlantas = this.tilemapMapa.addTilesetImage('sombras-plantas')
    this.tilesetSombras = this.tilemapMapa.addTilesetImage('sombras')

    this.layerTerreno = this.tilemapMapa.createLayer('terreno', [this.tilesetGrama])
    this.layerSombras = this.tilemapMapa.createLayer('sombras', [this.tilesetSombrasPlantas, this.tilesetSombras])
    this.layerPlantas = this.tilemapMapa.createLayer('plantas', [this.tilesetPlantas])
    this.layerItens = this.tilemapMapa.createLayer('itens', [this.tilesetItens])
    this.layerParedes = this.tilemapMapa.createLayer('paredes', [this.tilesetBlocos, this.tilesetParedes])

    if (globalThis.game.jogadores.primeiro === globalThis.game.socket.id) {
      globalThis.game.remoteConnection = new RTCPeerConnection(globalThis.game.iceServers)
      globalThis.game.dadosJogo = globalThis.game.remoteConnection.createDataChannel('dadosJogo', { negotiated: true, id: 0 })

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
      globalThis.game.dadosJogo = globalThis.game.localConnection.createDataChannel('dadosJogo', { negotiated: true, id: 0 })

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

      // Criar a lista de nuvens no mapa
      // para propagar depois via DataChannel
      this.nuvens = []
      for (let i = 0; i < 100; i++) {
        const nuvem = this.physics.add.sprite(
          Phaser.Math.Between(0, globalThis.game.config.width),
          Phaser.Math.Between(0, globalThis.game.config.height),
          'nuvem', 0
        )
        nuvem.overlap = this.physics.add.overlap(this.personagemLocal, nuvem, this.coletarNuvem, null, this)
        this.nuvens.push(nuvem)
      }
    } else {
      console.log('Usuário não é o primeiro ou o segundo jogador. Não é possível iniciar a partida. ')
    }

    this.layerParedes.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.personagemLocal, this.layerParedes)

    this.anims.create({
      key: 'personagem-parado-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 0,
        end: 1
      }),
      frameRate: 1,
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
      key: 'personagem-parado-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 6,
        end: 7
      }),
      frameRate: 1,
      repeat: -1
    })

    this.anims.create({
      key: 'personagem-voando-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, {
        start: 8,
        end: 11
      }),
      frameRate: 10,
      repeat: -1
    })

    this.cima = this.add.sprite(100, 250, 'cima', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        this.cima.setFrame(1)
        this.personagemLocal.setVelocityY(-100)
        this.personagemLocal.anims.play('personagem-voando-' + this.personagemLocal.lado)
      })
      .on('pointerout', () => {
        this.cima.setFrame(0)
        this.personagemLocal.setVelocityY(0)
        if (this.personagemLocal.body.velocity.x === 0) {
          this.personagemLocal.anims.play('personagem-parado-' + this.personagemLocal.lado)
        }
      })

    this.baixo = this.add.sprite(100, 350, 'baixo', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        this.baixo.setFrame(1)
        this.personagemLocal.setVelocityY(100)
        this.personagemLocal.anims.play('personagem-voando-' + this.personagemLocal.lado)
      })
      .on('pointerout', () => {
        this.baixo.setFrame(0)
        this.personagemLocal.setVelocityY(0)
        if (this.personagemLocal.body.velocity.x === 0) {
          this.personagemLocal.anims.play('personagem-parado-' + this.personagemLocal.lado)
        }
      })

    this.esquerda = this.add.sprite(600, 350, 'esquerda', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        this.esquerda.setFrame(1)
        this.personagemLocal.setVelocityX(-100)
        this.personagemLocal.lado = 'esquerda'
        this.personagemLocal.anims.play('personagem-voando-' + this.personagemLocal.lado)
      })
      .on('pointerout', () => {
        this.esquerda.setFrame(0)
        this.personagemLocal.setVelocityX(0)
        if (this.personagemLocal.body.velocity.y === 0) {
          this.personagemLocal.anims.play('personagem-parado-' + this.personagemLocal.lado)
        }
      })

    this.direita = this.add.sprite(700, 350, 'direita', 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerover', () => {
        this.direita.setFrame(1)
        this.personagemLocal.setVelocityX(100)
        this.personagemLocal.lado = 'direita'
        this.personagemLocal.anims.play('personagem-voando-' + this.personagemLocal.lado)
      })
      .on('pointerout', () => {
        this.direita.setFrame(0)
        this.personagemLocal.setVelocityX(0)
        if (this.personagemLocal.body.velocity.y === 0) {
          this.personagemLocal.anims.play('personagem-parado-' + this.personagemLocal.lado)
        }
      })

    this.cameras.main.startFollow(this.personagemLocal)
    this.personagemLocal.lado = 'esquerda'
    this.personagemLocal.anims.play('personagem-parado-' + this.personagemLocal.lado)

    this.anims.create({
      key: 'nuvem',
      frames: this.anims.generateFrameNumbers('nuvem', { start: 0, end: 7 }),
      frameRate: 8
    })

    globalThis.game.dadosJogo.onopen = () => {
      console.log('Conexão de dados aberta!')
    }

    globalThis.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data)

      if (dados.personagem) {
        this.personagemRemoto.x = dados.personagem.x
        this.personagemRemoto.y = dados.personagem.y
        this.personagemRemoto.setFrame(dados.personagem.frame)
      }

      if (dados.nuvens) {
        console.log(dados.nuvens)
      }
    }
  }

  update () {
    try {
      if (globalThis.game.dadosJogo.readyState === 'open') {
        if (this.personagemLocal) {
          globalThis.game.dadosJogo.send(JSON.stringify({
            personagem: {
              x: this.personagemLocal.x,
              y: this.personagemLocal.y,
              frame: this.personagemLocal.frame.name
            }
          }))
        }

        // Precisa de outra variável de cena
        // como máquina de estado
        // para enviar somente uma vez
        if (this.nuvens) {
          // enviar via datachannel
          //     globalThis.game.dadosJogo.send(
          // JSON.stringify({ nuvens: this.nuvens.map(nuvem => nuvem.visible) }))
          //     )
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  coletarNuvem (personagem, nuvem) {
    this.corujaPio.play()
    nuvem.overlap.destroy()
    nuvem.anims.play('nuvem')

    // try {
    //   if (globalThis.game.dadosJogo.readyState === 'open') {
    //       // Enviar somente a nuvem que foi coletada
    //       // ao invés de todas as nuvens visíveis
    //   }
    // } catch (error) {
    //   console.error(error)
    // }

    nuvem.once('animationcomplete', () => {
      nuvem.disableBody(true, true)
    })
  }
}
