import { GoogleGenAI, Type } from "@google/genai";
import { Product } from '../types';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini to interpret a natural language command for product management (Persian supported).
 */
export const processProductCommand = async (
  command: string, 
  currentProducts: Product[]
): Promise<{ 
  message: string; 
  operations: Array<{ productId: string, updates: Partial<Product> }> 
}> => {

  // Lightweight context to avoid token limits
  const productContext = JSON.stringify(currentProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: p.stock,
    categories: p.categories,
    tags: p.tags
  })));

  const systemInstruction = `
    You are an intelligent Persian e-commerce database assistant. 
    You have access to a list of products in JSON format.
    The user will give you a natural language command in Persian (Farsi).
    
    Capabilities:
    1. Update price, stock, name, description.
    2. Update 'categories' (array of strings). e.g., "Change category to X and Y".
    3. Update 'tags' (array of strings). e.g., "Add tags based on trends".
    
    Your goal is to:
    1. Identify matched products.
    2. Determine updates.
    3. Return JSON with a Persian confirmation message and operations.

    For category updates: Ensure 'categories' is always an array of strings.
    For tag updates: Ensure 'tags' is an array of strings.

    Current Products Context:
    ${productContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: command,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING, description: "Confirmation in Persian." },
            operations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productId: { type: Type.STRING },
                  updates: {
                    type: Type.OBJECT,
                    properties: {
                      price: { type: Type.NUMBER, nullable: true },
                      stock: { type: Type.NUMBER, nullable: true },
                      name: { type: Type.STRING, nullable: true },
                      description: { type: Type.STRING, nullable: true },
                      isActive: { type: Type.BOOLEAN, nullable: true },
                      categories: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
                      tags: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true }
                    }
                  }
                },
                required: ["productId", "updates"]
              }
            }
          },
          required: ["message", "operations"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result;

  } catch (error) {
    console.error("Gemini Agent Error:", error);
    return {
      message: "متاسفانه در پردازش درخواست شما مشکلی پیش آمد.",
      operations: []
    };
  }
};

/**
 * Generates SEO content for a new product based on basic info.
 */
export const generateProductSEO = async (name: string, category: string, price: number): Promise<{
  description: string;
  shortDescription: string;
  tags: string[];
  categories: string[];
}> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Create Persian (Farsi) SEO content for product:
      Name: ${name}
      Base Category: ${category}
      Price: ${price}

      Output JSON:
      - description: HTML format, ~150 words.
      - shortDescription: One liner.
      - tags: 5-7 Persian tags.
      - categories: Suggest 2-3 hierarchical categories (e.g., ["Digital", "Mobile", "Accessories"]).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            shortDescription: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            categories: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error(e);
    return {
      description: "توضیحات محصول...",
      shortDescription: "محصول جدید",
      tags: [],
      categories: [category]
    };
  }
};

/**
 * Generates SEO optimized blog content.
 */
export const generateSEOContent = async (topic: string): Promise<{ title: string; content: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a high-quality, SEO-optimized blog post in Persian (Farsi) about: "${topic}". 
      Format: JSON with 'title' and 'content' (Markdown).
      Length: ~400 words.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error(e);
    return { title: "خطا", content: "تولید محتوا با مشکل مواجه شد." };
  }
};

/**
 * Regenerates only the title for an article based on the topic.
 */
export const regenerateArticleTitle = async (topic: string, currentTitle: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Propose a new, catchy SEO title in Persian for an article about "${topic}". 
      Different from: "${currentTitle}".
      Return JSON with 'title'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING }
          }
        }
      }
    });
    const res = JSON.parse(response.text || "{}");
    return res.title || currentTitle;
  } catch (e) {
    return currentTitle;
  }
};