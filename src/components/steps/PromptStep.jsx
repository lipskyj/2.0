
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Edit, Loader2, Sparkles } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";
import ChatMessage from "../chat/ChatMessage";
import { Button } from "@/components/ui/button";

export default function PromptStep({ onNext, familyInfo, activityIdea, activityDescription, isLoading, defaultValue = "" }) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState(defaultValue || "");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setFinalPrompt(defaultValue);
      setShowPrompt(true);
    }
  }, [defaultValue]);

  const generatePrompt = async () => {
    setIsGenerating(true);

    const metaPrompt = `
      You are an expert prompt engineer for an AI application builder.
      Your task is to generate a detailed, clear, and comprehensive prompt in HEBREW to build a web application for employees at an educational technology organization.

      Here is the information provided by the employees:
      1. **Group Details:** ${familyInfo}
      2. **Solution Idea:** ${activityIdea}
      3. **Solution Description:** ${activityDescription}

      Based on this information, create a single, cohesive prompt. The prompt MUST be in Hebrew with markdown headers and follow this structure EXACTLY:

      ### 💡 הרעיון המרכזי ותיאור הפתרון
      - Start with a clear title for the solution idea: "${activityIdea}".
      - Follow with the full, detailed description you were given: "${activityDescription}". This is the most important part.

      ### 📝 שם האפליקציה וקונספט
      - Suggest a professional name.
      - Create a clear concept statement based on the description above.

      ### 🎯 מטרת האפליקציה
      - State the main goal for the employees.

      ### ✨ תכונות ופיצ'רים מרכזיים
      - List specific, actionable features from the description.
      - Suggest features that enhance productivity or collaboration.
      - Emphasize single-device usage with no complex user registration.

      ### 🎨 עיצוב וחווית משתמש (UX/UI)
      - Specify a design theme aligned with the CET brand: "clean, professional, and modern, with a color palette of blues (primary: #0073C4, secondary: #00A9E0) and a light background (#EBF5FA)".
      - Request clear, accessible buttons and readable fonts (like 'Assistant' or 'Heebo').
      - Emphasize that the entire interface must be in Hebrew and support Right-to-Left (RTL) layout.
      - The design must be responsive (mobile and desktop).

      ### ⚙️ דרישות טכניות נוספות
      - The app should be a single-page application.
      - Data should be managed within the user's session.

      Your final output must be ONLY the generated prompt in Hebrew. Do not add any extra text.
    `;

    try {
      const generatedPrompt = await InvokeLLM({ prompt: metaPrompt });
      setFinalPrompt(generatedPrompt);
      setShowPrompt(true);
    } catch (error) {
      console.error("Failed to generate prompt:", error);
      setFinalPrompt("שגיאה ביצירת הפרומפט. אנא נסו שוב.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalPrompt);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <h2 className="text-2xl font-bold text-center gradient-text">הפרומפט הסופי 🚀</h2>
      
      {!showPrompt && !isEditing && (
        <div className="space-y-4 text-center">
          <ChatMessage message="מעולה! השלב האחרון הוא יצירת ה'פרומפט' - סט ההוראות המדויק שיבנה את האפליקציה שלכם." isBot={true} />
          <Button onClick={generatePrompt} disabled={isGenerating} size="lg" variant="outline" className="bg-white border-2 border-cet-secondary-blue text-cet-secondary-blue hover:bg-cet-light-blue hover:text-cet-primary-blue hover:border-cet-primary-blue text-lg font-bold">
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : <Sparkles className="w-5 h-5 ml-2" />}
            {isGenerating ? "יוצר פרומפט..." : "צרו את הפרומפט"}
          </Button>
        </div>
      )}
      
      {showPrompt && !isEditing && (
        <div className="space-y-4">
          <ChatMessage message="הנה הפרומפט שנוצר. אתם יכולים להשתמש בו כמו שהוא, או לערוך אותו כדי לדייק אותו יותר." isBot={true}/>
          <div className="bg-gray-50 rounded-xl p-4 border max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{finalPrompt}</pre>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => onNext(finalPrompt)} size="lg" variant="outline" className="flex-1 bg-white border-2 border-cet-secondary-blue text-cet-secondary-blue hover:bg-cet-light-blue hover:text-cet-primary-blue hover:border-cet-primary-blue text-lg font-bold">
              <CheckCircle className="w-5 h-5 ml-2" />
              אשרו והמשיכו לשלב הסיום
            </Button>
            <Button onClick={() => setIsEditing(true)} size="lg" variant="outline" className="flex-1 border-cet-secondary-blue text-cet-secondary-blue">
              <Edit className="w-5 h-5 ml-2" />
              עריכת הפרומפט
            </Button>
          </div>
        </div>
      )}
      
      {isEditing && (
        <div className="space-y-4">
          <textarea
            value={finalPrompt}
            onChange={(e) => setFinalPrompt(e.target.value)}
            className="w-full h-96 resize-y border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-cet-primary-blue"
          />
          <div className="flex gap-3">
            <Button onClick={() => setIsEditing(false)} size="lg" variant="outline" className="bg-white border-2 border-cet-secondary-blue text-cet-secondary-blue hover:bg-cet-light-blue hover:text-cet-primary-blue hover:border-cet-primary-blue text-lg font-bold"><CheckCircle className="w-5 h-5 ml-2" />שמירת שינויים</Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
