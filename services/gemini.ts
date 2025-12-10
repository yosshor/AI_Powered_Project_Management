import { GoogleGenAI, Type } from "@google/genai";
import { Project, Task, TaskStatus } from "../types";

const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_INSTRUCTION = `
אתה עוזר ניהול פרויקטים חכם וחביב.
תפקידך לעזור למשתמש לנהל את המשימות שלו, להציע רעיונות לפירוק פרויקטים, ולענות על שאלות לגבי סטטוס הפרויקט.
התשובות שלך צריכות להיות קצרות, ענייניות, ובשפה העברית.
`;

export const generateProjectTasks = async (projectName: string, description: string): Promise<string[]> => {
  if (!ai) throw new Error("API Key missing");

  const prompt = `
  עבור פרויקט בשם: "${projectName}"
  תיאור: "${description}"
  
  אנא צור רשימה של 3 עד 5 משימות קונקרטיות לביצוע מיידי.
  החזר רק את רשימת המשימות בפורמט JSON פשוט (מערך של מחרוזות).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const jsonText = response.text || "[]";
    return JSON.parse(jsonText) as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const chatWithProject = async (
  history: {role: string, parts: {text: string}[]}[],
  currentMessage: string,
  project: Project,
  tasks: Task[]
): Promise<string> => {
  if (!ai) throw new Error("API Key missing");

  // Prepare context about the project
  const projectContext = `
  הקשר נוכחי:
  פרויקט פעיל: ${project.name}
  תיאור הפרויקט: ${project.description}
  
  רשימת משימות נוכחית:
  ${tasks.map(t => `- ${t.title} (${t.status === TaskStatus.DONE ? 'בוצע' : t.status === TaskStatus.IN_PROGRESS ? 'בביצוע' : 'לביצוע'})`).join('\n')}
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + "\n" + projectContext,
      },
      history: history
    });

    const result = await chat.sendMessage({ message: currentMessage });
    return result.text || "מצטער, לא הצלחתי לעבד את התשובה.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "אירעה שגיאה בתקשורת עם ה-AI.";
  }
};
