import QDrant from "../clients/qdrant";
import OpenAI from "../clients/openai";

async function searchData() {
  const question = "Why does the Duchess want pepper?";
  const { data: embededQuery } = await OpenAI.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
  });
  const resp = await QDrant.search("bryan_johnson_data", {
    vector: embededQuery[0].embedding,
    limit: 5,
  });
  console.log("SCORE: ", resp[0].score);
  const context = resp.map((chunk: any) => chunk.payload.text).join("\n\n");
  const PROMPT_TEMPLATE = `Answer the question based only on the following context:
    ${context}
    ---
    Answer the question based on the above context: ${question}`;
  const completion = await OpenAI.chat.completions.create({
    messages: [{ role: "assistant", content: PROMPT_TEMPLATE }],
    model: "gpt-4o",
  });
  const response = completion.choices[0].message.content;
  console.log(response);
  return resp;
}

searchData()
  .then(() => {
    console.log("Search complete");
  })
  .catch((error) => {
    console.error(error);
  });
