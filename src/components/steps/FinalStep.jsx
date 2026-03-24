import React, { useState } from "react";
import { motion } from "framer-motion";
import { Rocket, ExternalLink, CheckCircle, Copy, Download, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatExport from "../chat/ChatExport";

export default function FinalStep({ sessionData }) {
  const [copied, setCopied] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Add safety check for sessionData
  if (!sessionData) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="text-center">
          <p className="text-gray-500">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sessionData.final_prompt || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (showExportModal) {
    return (
      <ChatExport 
        sessionData={sessionData}
        onBack={() => setShowExportModal(false)}
      />
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 text-center">
      <div className="space-y-3">
        <Rocket className="w-12 h-12 text-cet-primary-blue mx-auto" />
        <h2 className="text-3xl font-extrabold gradient-text">מוכנים לשיגור!</h2>
        <p className="text-lg text-cet-text-secondary max-w-2xl mx-auto">
          הפרומפט שלכם מוכן! השתמשו בו כדי ליצור את הגרסה הראשונה של האפליקציה שלכם.
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 border shadow-sm max-w-3xl mx-auto text-right">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-cet-dark-blue">הפרומפט שלכם:</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={copyToClipboard}
            className={copied ? "text-green-600 border-green-600" : ""}
          >
            {copied ? <CheckCircle className="w-4 h-4 ml-2" /> : <Copy className="w-4 h-4 ml-2" />}
            {copied ? "הועתק!" : "העתקה"}
          </Button>
        </div>
        <div className="max-h-40 overflow-y-auto text-sm text-gray-700 bg-gray-50 rounded p-3 whitespace-pre-wrap">
          {sessionData.final_prompt || "הפרומפט עדיין לא נוצר"}
        </div>
      </div>

      <div className="bg-sky-50 rounded-lg p-6 text-right space-y-4 max-w-3xl mx-auto">
         <div className="flex items-start gap-3">
            <Wand2 className="w-6 h-5 text-sky-700 flex-shrink-0" />
            <div >
                <h4 className="font-bold text-cet-dark-blue">מה עושים עכשיו?</h4>
                <p className="text-cet-text-secondary">האפליקציה הראשונית היא רק נקודת ההתחלה. אחרי שהיא נוצרת, מתחיל שלב חשוב ומהנה של בדיקה ושיפורים. שחקו עם האפליקציה כצוות, ראו מה עובד ומה פחות, וחשבו על רעיונות נוספים. תוכלו לחזור ולשנות את הפרומפט כדי להוסיף יכולות, לשנות עיצובים ולשכלל את הפתרון שלכם.</p>
            </div>
         </div>
         <div className="flex items-start gap-3">
            <ExternalLink className="w-6 h-5 text-sky-700 flex-shrink-0" />
            <div>
                 <h4 className="font-bold text-cet-dark-blue">הדבקת הפרומפט</h4>
                 <p className="text-cet-text-secondary">כעת אתם יכולים להעתיק את הפרומפט ולהדביק אותו בכלי הפיתוח שלכם.</p>
            </div>
         </div>
      </div>

      <div className="pt-4">
        <Button onClick={() => setShowExportModal(true)} variant="outline" className="bg-white border-2 border-cet-secondary-blue text-cet-secondary-blue hover:bg-cet-light-blue hover:text-cet-primary-blue hover:border-cet-primary-blue">
            <Download className="w-4 h-4 ml-2" />
            ייצאו את סיכום התהליך למסמך
        </Button>
      </div>
    </motion.div>
  );
}