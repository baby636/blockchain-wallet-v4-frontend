import * as AT from './actionTypes'
import { assoc, assocPath } from 'ramda'

const INITIAL_STATE = {}

const cache = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.ANNOUNCEMENT_DISMISSED: {
      const { id } = payload
      return assocPath(['announcements', id, 'dismissed'], true, state)
    }
    case AT.ANNOUNCEMENT_TOGGLED: {
      const { id, collapsed } = payload
      return assocPath(['announcements', id, 'collapsed'], collapsed, state)
    }
    case AT.GUID_ENTERED: {
      const { guid } = payload
      return assoc('lastGuid', guid, state)
    }
    case AT.CHANNEL_PRIV_KEY_CREATED: {
      const { privKey } = payload
      return assoc('channelPrivKey', privKey, state)
    }
    case AT.CHANNEL_CHANNEL_ID_CREATED: {
      const { channelId } = payload
      return assoc('channelChannelId', channelId, state)
    }
    case AT.CHANNEL_PHONE_CONNECTED: {
      const { phonePubkey } = payload
      return assoc('channelPhonePubkey', phonePubkey, state)
    }
    case AT.DISCONNECT_CHANNEL_PHONE: {
      return assoc('channelPhonePubkey', undefined, state)
    }
    default:
      return state
  }
}

export default cache
