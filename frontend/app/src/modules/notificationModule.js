export const NOTIFICATION= 'methodFit/notifications/NOTIFICATION';

export const notifications = (messages, containerName, name) => {
  return {
    type: NOTIFICATION,
    messages,
    containerName,
    name
  };
};