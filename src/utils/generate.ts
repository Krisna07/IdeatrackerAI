import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("Missing Gemini API key - please add it to .env file");
}
const genAI = new GoogleGenerativeAI(API_KEY);

interface ResponseItem {
  [key: string]: string;
}

interface FormattedItem {
  [key: string]: string;
}

export default async function generate(
  prompt: string,
  responseObject?: FormattedItem
) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = await response.text();
  if (!text) {
    throw new Error("No response from Gemini AI");
  }
  const cleanedResponse = text.replace(/```json|```/g, "").trim();
  const responseArray = JSON.parse(cleanedResponse);
  //add a logic to check if the responseArray is an array of objects
  if (
    !Array.isArray(responseArray) ||
    !responseArray.every((item) => typeof item === "object" && item !== null)
  ) {
    return [responseArray];
  }
  const formattedResponse =
    responseArray &&
    responseArray.map((item: ResponseItem): FormattedItem => {
      const formattedItem: FormattedItem = { ...responseObject };
      for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
          formattedItem[key as keyof FormattedItem] =
            item[key as keyof ResponseItem].trim();
        }
      }

      return formattedItem;
    });
  return formattedResponse;
}
