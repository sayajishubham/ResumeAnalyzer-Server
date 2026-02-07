
const OpenAi = require("openai")

const openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY
})
const chat = async (userPrompt, systemPrompt = null, schema = null, temperature = null) => {
    const messages = []
    if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: userPrompt })

    const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        response_format: {
            type: "json_schema",
            json_schema: schema
        },
        temperature: temperature || 0
    })
    const raw = response.choices[0].message.content
    const parsed = JSON.parse(raw)
    return parsed

}
module.exports = chat;