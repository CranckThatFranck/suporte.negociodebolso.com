import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

type MessageHandler = (payload: unknown) => void

export function createSupportSocket(url: string, topic: string, onMessage: MessageHandler): Client {
  const client = new Client({
    webSocketFactory: () => new SockJS(url),
    reconnectDelay: 5000,
  })

  client.onConnect = () => {
    client.subscribe(topic, (message) => {
      onMessage(message.body)
    })
  }

  return client
}
