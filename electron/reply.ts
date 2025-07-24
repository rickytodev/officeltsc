export default function reply(
  event: Electron.IpcMainEvent,
  id: string,
  value: any,
) {
  event.reply(`reply-${id}`, value);
}
