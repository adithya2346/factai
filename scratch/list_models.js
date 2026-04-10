const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyB-6MpDl5ISxBNtanTUBmBIYOMRVlu4ilg");

async function run() {
  try {
    const models = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY || "AIzaSyB-6MpDl5ISxBNtanTUBmBIYOMRVlu4ilg"}`);
    const json = await models.json();
    console.log(json.models.map(m => m.name).join('\n'));
  } catch (e) {
    console.error(e);
  }
}

run();
