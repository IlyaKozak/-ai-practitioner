# RSSchool "AWS AI Practitioner" course task

**Course**: https://rs.school/courses/aws-ai

**Task requirements**: https://github.com/rolling-scopes-school/tasks/blob/feat/ai-practitioner-course/ai-practitioner/task1.md

**Test Data**: https://github.com/artsmia/collection

**Technical Stack**:

- Fastify/Node.js web framework
- ChromaDB Vector DB with Embedding model `Xenova/all-MiniLM-L6-v2`
- `deepseek/deepseek-v3-0324` LLM via Hugging Face API

**Diagram**:
<img src="https://github.com/IlyaKozak/-ai-practitioner/blob/main/ai.drawio.png">

---

**Usage**:

1. Update `.env.example` with your environment settings

2. Run ChromaDB `docker compose up`

3. Run development mode: `npm run dev`

4. Run build `npm run build` & start app `npm start`

---

### Part 1: Data Preparation and Vectorization

- [x] Documents from MIA art collection loaded to ChromaDB splitted in chunks with overlapping (parameters are defined in const.ts)
- [x] Embedding model `Xenova/all-MiniLM-L6-v2`

### Part 2: LLM Integration

- [x] LLM `deepseek/deepseek-v3-0324` connected via Hugging Face API (provider novita)
- [x] Prompt template is defined in const.ts
- [x] RAG Pipeline can be queried via Web Interface `/` / API call `/query` / Swagger-UI `/api`
- [x] Answer is returned with sources from the MIA art collection dataset
- [x] Logging is turned on for all processing stages

### Part 3: API and Interface

- [x] API with an endpoint for questions created with Fastify on Node.js `/query`
- [x] Input data is validated
- [x] Swagger documentation is added `/api`
- [x] Basic web interface created as simple one page app where answers and information sources are displayed

---

**Test questions:**

- "Show me American paintings from the 19th century"
- "Find artworks with floral motifs or nature themes"
- "What can you tell me about Japanese ceramics in the collection?"
- "Find portraits by female artists"
- "Show me artworks related to religious themes"
