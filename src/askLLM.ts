import fetch from 'node-fetch';

export async function askLLM(question: string, docsToLLM: string) {
  const response = await fetch(process.env.HF_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.HF_TOKEN!}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider: process.env.HF_PROVIDER!,
      model: process.env.HF_MODEL!,
      messages: [
        {
          role: 'system',
          content: process.env.PROMPT! + docsToLLM,
        },
        {
          role: 'user',
          content: question,
        },
      ],
    }),
  });
  const responseJSON = await response.json();

  return responseJSON.choices[0].message;
}
