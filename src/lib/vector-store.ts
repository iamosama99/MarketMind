// ============================================
// MarketMind — Vector Store Abstraction
// Pinecone primary with in-memory fallback
// ============================================

import { Pinecone } from "@pinecone-database/pinecone";
import { getResearchDocuments, type ResearchDocument } from "./knowledge-base";

export interface DocumentChunk {
    content: string;
    title: string;
    source: string;
    sector: string;
    market: string;
    score: number;
    documentType: string;
}

const INDEX_NAME = "marketmind-research";
const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;

// ── OpenAI Embedding ──
async function getEmbedding(text: string): Promise<number[]> {
    const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: EMBEDDING_MODEL,
            input: text.slice(0, 8000), // Token limit safety
        }),
    });

    if (!response.ok) {
        throw new Error(`Embedding API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
}

// ── Pinecone Vector Store ──
class PineconeVectorStore {
    private client: Pinecone;

    constructor() {
        this.client = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        });
    }

    async search(
        query: string,
        topK: number = 5,
        filter?: Record<string, string>
    ): Promise<DocumentChunk[]> {
        const queryEmbedding = await getEmbedding(query);
        const index = this.client.index(INDEX_NAME);

        const results = await index.query({
            vector: queryEmbedding,
            topK,
            includeMetadata: true,
            filter: filter || undefined,
        });

        return (results.matches || []).map((match) => ({
            content: (match.metadata?.content as string) || "",
            title: (match.metadata?.title as string) || "",
            source: (match.metadata?.source as string) || "",
            sector: (match.metadata?.sector as string) || "",
            market: (match.metadata?.market as string) || "",
            score: match.score || 0,
            documentType: (match.metadata?.documentType as string) || "",
        }));
    }
}

// ── In-Memory Fallback (cosine similarity) ──
class InMemoryVectorStore {
    private documents: ResearchDocument[] = [];
    private embeddings: Map<string, number[]> = new Map();
    private initialized = false;

    async initialize(): Promise<void> {
        if (this.initialized) return;

        this.documents = getResearchDocuments();

        // Generate embeddings for all documents
        console.log("[VectorStore] Generating embeddings for in-memory store...");
        for (const doc of this.documents) {
            try {
                const text = `${doc.title}\n${doc.content}`;
                const embedding = await getEmbedding(text);
                this.embeddings.set(doc.id, embedding);
            } catch (error) {
                console.error(`[VectorStore] Failed to embed ${doc.id}:`, error);
            }
        }
        console.log(
            `[VectorStore] Initialized with ${this.embeddings.size} document embeddings`
        );
        this.initialized = true;
    }

    async search(
        query: string,
        topK: number = 5,
        filter?: Record<string, string>
    ): Promise<DocumentChunk[]> {
        await this.initialize();

        const queryEmbedding = await getEmbedding(query);

        // Filter documents
        let filteredDocs = this.documents;
        if (filter) {
            filteredDocs = this.documents.filter((doc) => {
                return Object.entries(filter).every(([key, value]) => {
                    const docValue = doc[key as keyof ResearchDocument];
                    return docValue === value;
                });
            });
        }

        // Calculate cosine similarity
        const scored = filteredDocs
            .map((doc) => {
                const docEmbedding = this.embeddings.get(doc.id);
                if (!docEmbedding) return null;

                const score = cosineSimilarity(queryEmbedding, docEmbedding);
                return {
                    content: doc.content,
                    title: doc.title,
                    source: doc.source,
                    sector: doc.sector,
                    market: doc.market,
                    score,
                    documentType: doc.documentType,
                };
            })
            .filter(Boolean) as DocumentChunk[];

        // Sort by similarity and return top-k
        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, topK);
    }
}

function cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ── Keyword Fallback (no OpenAI needed) ──
class KeywordFallbackStore {
    private documents: ResearchDocument[] = [];

    constructor() {
        this.documents = getResearchDocuments();
    }

    async search(
        query: string,
        topK: number = 5,
        filter?: Record<string, string>
    ): Promise<DocumentChunk[]> {
        let filteredDocs = this.documents;
        if (filter) {
            filteredDocs = this.documents.filter((doc) => {
                return Object.entries(filter).every(([key, value]) => {
                    const docValue = doc[key as keyof ResearchDocument];
                    return docValue === value;
                });
            });
        }

        const queryTerms = query.toLowerCase().split(/\s+/);

        const scored = filteredDocs.map((doc) => {
            const text = `${doc.title} ${doc.content}`.toLowerCase();
            const matchCount = queryTerms.filter((term) =>
                text.includes(term)
            ).length;
            const score = matchCount / queryTerms.length;

            return {
                content: doc.content,
                title: doc.title,
                source: doc.source,
                sector: doc.sector,
                market: doc.market,
                score,
                documentType: doc.documentType,
            };
        });

        scored.sort((a, b) => b.score - a.score);
        return scored.slice(0, topK).filter((d) => d.score > 0.2);
    }
}

// ── Factory ──
export type VectorStore = {
    search: (
        query: string,
        topK?: number,
        filter?: Record<string, string>
    ) => Promise<DocumentChunk[]>;
};

let store: VectorStore | null = null;
let inMemoryStoreInstance: InMemoryVectorStore | null = null;

export function getVectorStore(): VectorStore {
    if (store) return store;

    if (process.env.PINECONE_API_KEY) {
        console.log("[VectorStore] Using Pinecone");
        store = new PineconeVectorStore();
    } else if (process.env.OPENAI_API_KEY) {
        console.log("[VectorStore] Using in-memory vector store (OpenAI embeddings)");
        inMemoryStoreInstance = new InMemoryVectorStore();
        store = inMemoryStoreInstance;
    } else {
        console.log("[VectorStore] Using keyword fallback (no API keys)");
        store = new KeywordFallbackStore();
    }

    return store;
}
