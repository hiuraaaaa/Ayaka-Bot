import Y from "fs";
import r from "javascript-obfuscator";
let V = async (A, {
  conn: U,
  text: k
}) => {
  let z = A.quoted ? A.quoted : A;
  let T = (z.msg || z).mimetype || "";
  if (!/javascript/.test(T)) {
    return A.reply("⚠️ Dengan reply/kirim file yang berformat *.js*");
  }
  const g = k || "encbyubed";
  const o = await z.download();
  const M = z.fakeObj?.message?.documentMessage?.fileName || "plugin.js";
  await A.reply("⏳ Memproses encrypt type *hard* file: *" + M + "*...");
  try {
    const s = r.obfuscate(o.toString(), {
      target: "node",
      preset: "high",
      compact: true,
      minify: true,
      flatten: true,
      identifierNamesGenerator: "mangled-shuffled",
      renameVariables: true,
      renameGlobals: true,
      stringEncoding: 0.01,
      stringSplitting: 0.1,
      stringConcealing: true,
      stringCompression: true,
      duplicateLiteralsRemoval: true,
      shuffle: {
        hash: false,
        true: false
      },
      controlFlowFlattening: false,
      opaquePredicates: false,
      deadCode: false,
      dispatcher: false,
      rgf: false,
      calculator: false,
      hexadecimalNumbers: false,
      movedDeclarations: true,
      objectExtraction: true,
      globalConcealing: true
    });
    const H = "./tmp/enchard-" + M;
    Y.writeFileSync(H, s.getObfuscatedCode());
    await U.sendMessage(A.chat, {
      document: Y.readFileSync(H),
      mimetype: "application/javascript",
      fileName: M,
      caption: `✅ Berhasil encrypt type *hard* file: *" + M + "*\n ikuti ${global.namebot} Channel https://whatsapp.com/channel/0029Vb63N4dL7UVaVlVnnu39`
    }, {
      quoted: A
    });
    Y.unlinkSync(H);
  } catch (b) {
    console.error(b);
    A.reply("❌ Terjadi kesalahan:\n" + b);
  }
};
V.help = ["enchard <reply/kirim file.js>"];
V.tags = ["tools"];
V.command = /^enchard$/i;
V.register = true;
V.limit = true;
V.owner = true;
export default V;