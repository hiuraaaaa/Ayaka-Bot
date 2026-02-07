let handler = async (m, { text, args, command }) => {
  let [title, ...options] = text.trim().split('\n');
  if (!title || options.length < 2 || options.length > 100) 
    throw `Format salah.\n\nContoh: .${command} Enaknya ngapain?\nTidur\nMakan`;
 
  let chosenOption = options[Math.floor(Math.random() * options.length)];

  m.reply(`Pertanyaan: *${title.trim()}*\nJawaban: ${chosenOption.trim()}`);
};

handler.help = ['spin'];
handler.tags = ['fun'];
handler.command = /^spin$/i;

export default handler;