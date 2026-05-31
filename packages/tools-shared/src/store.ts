import type { AsrConf } from './conf/asr.js'
import type { MusicConf } from './conf/music.js'
import type { RelayConf } from './conf/relay.js'

export const schema = {
  music: {
    type: 'object',
    default: {
      path: '',
    },
    properties: {
      path: {
        type: 'string',
      },
    },
    required: ['path'],
    additionalProperties: false,
  },
  asr: {
    type: 'object',
    default: {
      key: '',
    },
    properties: {
      key: {
        type: 'string',
      },
    },
    required: ['key'],
    additionalProperties: false,
  },
  relay: {
    type: 'array',
    default: [
      {
        name: 'qwen',
        url: 'https://chat.qwen.ai',
        send: `
          ;(() => {
            const input = document.querySelector('.message-input-textarea')
            if (input) {
              const text = {{TEXT_JSON}};
              Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(input, text)
              input.dispatchEvent(new Event('input', {bubbles: true}))
            }
            setTimeout(() => {
              const send = document.querySelector('.send-button')
              if (send) {
                send.click()
              }
            }, 50)
          })()
        `,
      },
      {
        name: 'deepseek',
        url: 'https://chat.deepseek.com',
        send: `
          ;(() => {
            const input = document.querySelector('._27c9245')
            if (input) {
              const text = {{TEXT_JSON}};
              Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(input, text)
              input.dispatchEvent(new Event('input', {bubbles: true}))
            }
            setTimeout(() => {
              const send = document.querySelector('._52c986b')
              if (send) {
                  send.click()
              }
            }, 50)
          })()
        `,
      },
      {
        name: 'chatgpt',
        url: 'https://chatgpt.com',
        send: `
          ;(() => {
            const input = document.querySelector('#prompt-textarea')
            if (input) {
              const text = {{TEXT_JSON}};
              const p = document.createElement('p');
              p.textContent = text;
              input.innerHTML = '';
              input.appendChild(p);
            }
            setTimeout(() => {
              const send = document.querySelector('#composer-submit-button')
              if (send) {
                  send.click()
              }
            }, 50)
          })()
        `,
      },
    ],
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        url: {
          type: 'string',
        },
        send: {
          type: 'string',
        },
      },
      required: ['name', 'url', 'send'],
      additionalProperties: false,
    },
  },
} satisfies Record<keyof StoreSchema, unknown>

export interface StoreSchema {
  asr: AsrConf
  music: MusicConf
  relay: RelayConf[]
}
