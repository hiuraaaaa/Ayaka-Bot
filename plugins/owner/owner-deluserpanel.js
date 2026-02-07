import fetch from "node-fetch";
import crypto from "crypto";
import { sizeFormatter } from "human-readable";

const format = sizeFormatter();
let handler = async (
  m,
  { conn, args, text, usedPrefix, command, isROwner },
) => {
  let usr = args[0];
  if (!usr) return m.reply("ID nya mana?");
  let f = await fetch(domain + "/api/application/users/" + usr, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + global.apikey
    },
  });
  //let res = await f.json()
  let res = f.ok
    ? {
        errors: null,
      }
    : await f.json();
  if (res.errors) return m.reply("*USER NOT FOUND*");
  m.reply("*SUCCESSFULLY DELETE THE USER*");
};

handler.command = ["delusr"];
handler.tags = ["panel"];
handler.owner = true;

export default handler;