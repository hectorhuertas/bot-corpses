import { get } from 'config';
import Slack from './slacker'

export default {
  userRegistration,
  modelCreation,
  commentCreation
}

function userRegistration(payload): Promise<any>{
  return postMessage(payload, assembleUserRegistrationMessage)
}
// function modelCreation(payload: Dataset | Request): Promise<any>{
function modelCreation(payload): Promise<any>{
  if (payload.user_id) {
    return postMessage(payload, assembleModelCreationMessage)
  }
}
// function commentCreation(payload: Action<ActionPropComment>): Promise<any>{
function commentCreation(payload): Promise<any>{
  if (payload.user_id) {
    return postMessage(payload, assembleCommentCreationMessage)
  }
}

function assembleModelCreationMessage(payload): string {
  return `A new ${link(payload.modelType, payload.modelId)} was created!`;
}

function assembleCommentCreationMessage(payload): string {
  return `A ${link(payload.actionable_model, payload.actionable_id)} received a new comment!`;
}

function assembleUserRegistrationMessage(payload): string {
  const username = payload.firstname || payload.username;
  const userLink = link('user', payload.id, username || 'user')
  if (username) {
    return `Awesome! The user ${userLink} just registered!`
  }
  else {
    return `Awesome! A new ${userLink} just registered!`
  }
}

interface SlackMessage {
  token: string;
  channel: string;
  text: string;
  username: string;
}

export const _assembleMessage =
  (token: string, channel: string, username: string) =>
    (text: string): SlackMessage => {
      return {
        token,
        channel,
        text,
        username
      }
    }

export const _link =
  (baseUrl: string) =>
    (modelType: string, modelId: string, text:string = modelType): string => {
      const model = modelType == 'user' ? modelType : modelType + 's';
      return `<${baseUrl}/${model}/${modelId}|${text}>`
    }

const _postMessage =
  (messagePoster: (SlackMessage) => Promise<any>, assembler: (string) => SlackMessage) =>
    (payload: any, toMsg: (payload: any)=> string): Promise<any> => {
      const msg: string = toMsg(payload);
      const s: SlackMessage = assembler(msg);
      return messagePoster(s).then(console.log).catch(console.error)
    }

const assembleSlackPayload: (string) => SlackMessage = _assembleMessage(
  get<string>('slack.token'),
  get<string>('slack.channel'),
  get<string>('slack.bot_name')
)

const link = _link(get<string>('discover_url'));
const postMessage = _postMessage(Slack.postMessage, assembleSlackPayload)
