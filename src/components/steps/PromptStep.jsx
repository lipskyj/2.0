import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Loader2, CheckCircle, Rocket } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";
import { Button } from "@/components/ui/button";

export default function PromptStep({ onSave, activityIdea, activityDescription, defaultValue = "" }) {
  const [finalPrompt, setFinalPrompt] = useState(defaultValue || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setFinalPrompt(defaultValue);
    } else if (activityDescription) {
      generatePrompt();
    }
  }, []);

  const generatePrompt = async () => {
    setIsGenerating(true);
    const metaPrompt = `
You are a senior product manager writing a mini-PRD for an AI-powered no-code app builder.
Based on the following product brief, write a clear, inspiring mini-PRD in HEBREW that helps a developer or AI tool envision and build the product.

The document should be practical, visual, and human — NOT a business document. Focus on the user experience and product behavior.

--- PRODUCT BRIEF ---
Solution Idea: ${activityIdea}
Description:
${activityDescription}
--- END BRIEF ---

Write the mini-PRD in Hebrew with this EXACT structure:

## 🚀 [שם האפליקציה] – מסמך מוצר (Mini PRD)

### 🎯 חזון המוצר
[One compelling sentence that describes what this app is and why it matters. Think: "elevator pitch".]

### 👤 המשתמש המרכזי
[Who uses this? What are they trying to achieve? What frustrates them today?]

### 📱 תיאור חוויית המשתמש
[Walk through the app experience step by step, as if you're watching someone use it. Describe screens, actions, and how it feels.]

### 🗂️ מסכים ופונקציונליות
[List each screen/view with a short description of what happens there. Use bullet points.]

### ✨ פיצ'רים מרכזיים
[The 4-6 key features that make this product work. Keep it concrete.]

### 🎨 עיצוב ואווירה
[Visual style, color mood, tone of voice. Help the builder picture it.]

### ⚙️ דרישות טכניות
- אפליקציית דף יחיד (SPA)
- עברית מלאה ותמיכה ב-RTL
- רספונסיבי (מובייל ודסקטופ)
- ללא הרשמה / התחברות
- נתונים מנוהלים בתוך הסשן
[Add any additional technical notes from the brief.]

Output ONLY the Hebrew mini-PRD. No extra commentary.
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
              <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                הפרומפט מוכן ומועתק! עכשיו הדביקו אותו בכלי הוייבקוד שמתאים לכם:
              </p>
              <div className="flex flex-col gap-2 text-right mb-6">
                <a href="https://base44.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors">
                  <span>🔷</span> Base44
                </a>
                <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold transition-colors">
                  <span>💗</span> Lovable
                </a>
                <a href="https://bolt.new" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-semibold transition-colors">
                  <span>⚡</span> Bolt.new
                </a>
                <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold transition-colors">
                  <span>🤍</span> v0 by Vercel
                </a>
              </div>
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