import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Loader2, Sparkles, CheckCircle, Rocket } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";

export default function PromptStep({ onSave, activityIdea, activityDescription, defaultValue = "" }) {
  const [finalPrompt, setFinalPrompt] = useState(defaultValue || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (defaultValue) setFinalPrompt(defaultValue);
  }, [defaultValue]);

  const generatePrompt = async () => {
    setIsGenerating(true);
    const metaPrompt = `
      You are an expert prompt engineer for an AI application builder.
      Generate a detailed Hebrew prompt to build a web application based on:
      1. Solution Idea: ${activityIdea}
      2. Solution Description: ${activityDescription}

      Create a cohesive prompt in Hebrew with markdown headers:

      ### 💡 הרעיון המרכזי ותיאור הפתרון
      - Title: "${activityIdea}"
      - Full description: "${activityDescription}"

      ### 📝 שם האפליקציה וקונספט
      - Suggest a professional name and concept.

      ### 🎯 מטרת האפליקציה
      - Main goal.

      ### ✨ תכונות ופיצ'רים מרכזיים
      - Specific actionable features from the description.
      - Single-device usage, no registration required.

      ### 🎨 עיצוב וחווית משתמש
      - Clean, modern design. Blues (#0073C4, #00A9E0), light background.
      - Hebrew font (Assistant/Heebo), full RTL support, responsive.

      ### ⚙️ דרישות טכניות
      - Single-page app, session-based data only.

      Output ONLY the Hebrew prompt, no extra text.
    `;
    const generated = await InvokeLLM({ prompt: metaPrompt });
    setFinalPrompt(generated);
    setIsGenerating(false);
    await onSave(generated);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(finalPrompt);
    setCopied(true);
    setShowSuccess(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold gradient-text">הפרומפט הסופי ✨</h2>
      </div>

      {!finalPrompt && !isGenerating && (
        <div className="text-center space-y-6 py-8">
          <p className="text-xl font-semibold text-gray-700">רוצים לקבל פרומפט לבניית האפליקציה?</p>
          <Button
            onClick={generatePrompt}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-10 py-6 rounded-xl shadow-lg"
          >
            <Sparkles className="w-5 h-5 ml-2" />
            כן! צרו את הפרומפט
          </Button>
        </div>
      )}

      {isGenerating && (
        <div className="text-center py-16 space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="text-gray-600 font-medium">יוצר פרומפט מותאם אישית...</p>
        </div>
      )}

      {finalPrompt && !isGenerating && (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 border max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{finalPrompt}</pre>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={copyToClipboard}
              size="lg"
              className={`text-lg font-bold px-10 py-5 rounded-xl transition-all ${copied ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700"} text-white shadow-lg`}
            >
              {copied ? <CheckCircle className="w-5 h-5 ml-2" /> : <Copy className="w-5 h-5 ml-2" />}
              {copied ? "הועתק!" : "העתיקו את הפרומפט"}
            </Button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSuccess(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Rocket className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-extrabold text-gray-800 mb-3">מוכנים לשיגור! 🚀</h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                הפרומפט מוכן ומועתק! עכשיו הדביקו אותו ב-
                <span className="font-bold text-blue-600"> base44.com </span>
                ותתחילו לבנות את האפליקציה שלכם.
              </p>
              <Button
                onClick={() => setShowSuccess(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl w-full"
              >
                סגרו
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}