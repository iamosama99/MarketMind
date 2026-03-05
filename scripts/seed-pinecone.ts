// ============================================
// MarketMind — Pinecone Seeding Script
// Run: npx tsx scripts/seed-pinecone.ts
// ============================================

import { Pinecone } from "@pinecone-database/pinecone";

// ── Configuration ──
const INDEX_NAME = "marketmind-research";
const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;

// ── Inline knowledge base (avoid path alias issues in scripts) ──
interface ResearchDocument {
    id: string;
    title: string;
    content: string;
    source: string;
    sector: string;
    market: "US" | "IN" | "GLOBAL";
    date: string;
    documentType: "report" | "analysis" | "whitepaper" | "note";
}

async function getEmbedding(text: string): Promise<number[]> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OPENAI_API_KEY is required");

    const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: EMBEDDING_MODEL,
            input: text.slice(0, 8000),
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Embedding API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
}

function chunkDocument(doc: ResearchDocument, chunkSize = 1500): Array<{ text: string; metadata: Record<string, string> }> {
    const chunks: Array<{ text: string; metadata: Record<string, string> }> = [];
    const words = doc.content.split(/\s+/);
    let currentChunk: string[] = [];
    let currentLength = 0;

    for (const word of words) {
        if (currentLength + word.length > chunkSize && currentChunk.length > 0) {
            chunks.push({
                text: `${doc.title}\n\n${currentChunk.join(" ")}`,
                metadata: {
                    title: doc.title,
                    source: doc.source,
                    sector: doc.sector,
                    market: doc.market,
                    date: doc.date,
                    documentType: doc.documentType,
                    documentId: doc.id,
                    content: currentChunk.join(" "),
                },
            });
            currentChunk = [];
            currentLength = 0;
        }
        currentChunk.push(word);
        currentLength += word.length + 1;
    }

    // Final chunk
    if (currentChunk.length > 0) {
        chunks.push({
            text: `${doc.title}\n\n${currentChunk.join(" ")}`,
            metadata: {
                title: doc.title,
                source: doc.source,
                sector: doc.sector,
                market: doc.market,
                date: doc.date,
                documentType: doc.documentType,
                documentId: doc.id,
                content: currentChunk.join(" "),
            },
        });
    }

    return chunks;
}

async function main() {
    console.log("🚀 MarketMind — Pinecone Seeding Script\n");

    // Check environment
    const pineconeKey = process.env.PINECONE_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!pineconeKey) {
        console.error("❌ PINECONE_API_KEY is required. Set it in your .env.local file.");
        process.exit(1);
    }
    if (!openaiKey) {
        console.error("❌ OPENAI_API_KEY is required for generating embeddings.");
        process.exit(1);
    }

    // Import knowledge base dynamically (avoiding TS path alias issues)
    // We need to use a relative import or inline the data
    console.log("📚 Loading knowledge base...");

    // Dynamically import the knowledge base
    const knowledgeBasePath = new URL("../src/lib/knowledge-base.ts", import.meta.url).pathname;
    console.log(`   Loading from: ${knowledgeBasePath}`);

    // Use dynamic import with tsx support
    const { getResearchDocuments } = await import(knowledgeBasePath);
    const documents: ResearchDocument[] = getResearchDocuments();
    console.log(`   Found ${documents.length} research documents`);

    // Connect to Pinecone
    console.log("\n🔗 Connecting to Pinecone...");
    const pc = new Pinecone({ apiKey: pineconeKey });

    // Check if index exists, create if not
    const indexList = await pc.listIndexes();
    const indexExists = indexList.indexes?.some((idx) => idx.name === INDEX_NAME);

    if (!indexExists) {
        console.log(`   Creating index '${INDEX_NAME}'...`);
        await pc.createIndex({
            name: INDEX_NAME,
            dimension: EMBEDDING_DIMENSIONS,
            metric: "cosine",
            spec: {
                serverless: {
                    cloud: "aws",
                    region: "us-east-1",
                },
            },
        });
        console.log("   ⏳ Waiting for index to be ready...");
        await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30s for index creation
    } else {
        console.log(`   Index '${INDEX_NAME}' already exists`);
    }

    const index = pc.index(INDEX_NAME);

    // Chunk documents
    console.log("\n✂️  Chunking documents...");
    const allChunks = documents.flatMap((doc) => chunkDocument(doc));
    console.log(`   Created ${allChunks.length} chunks from ${documents.length} documents`);

    // Generate embeddings and upsert
    console.log("\n🧮 Generating embeddings and upserting...");
    const batchSize = 10;

    for (let i = 0; i < allChunks.length; i += batchSize) {
        const batch = allChunks.slice(i, i + batchSize);
        const vectors = [];

        for (let j = 0; j < batch.length; j++) {
            const chunk = batch[j];
            try {
                const embedding = await getEmbedding(chunk.text);
                vectors.push({
                    id: `chunk-${i + j}`,
                    values: embedding,
                    metadata: chunk.metadata,
                });
                process.stdout.write(`   ✓ Embedded chunk ${i + j + 1}/${allChunks.length}\r`);
            } catch (error) {
                console.error(`\n   ✗ Failed to embed chunk ${i + j + 1}:`, error);
            }
        }

        if (vectors.length > 0) {
            await index.upsert({ records: vectors });
        }

        // Rate limit safety
        if (i + batchSize < allChunks.length) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    console.log(`\n\n✅ Successfully seeded ${allChunks.length} vectors into '${INDEX_NAME}'`);
    console.log("   You can now use research queries in MarketMind!\n");
}

main().catch((error) => {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
});
