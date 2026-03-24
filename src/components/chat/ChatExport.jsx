
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, ArrowRight, Download, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function ChatExport({ sessionData, onBack }) {
  const [copied, setCopied] = useState(false);

  const generateExportText = () => {
    if (!sessionData) return "לא נמצא מידע להצגה.";
    
    const creationDate = sessionData.created_date 
      ? format(new Date(sessionData.created_date), "dd/MM/yyyy HH:mm")
      : "לא זמין";
      
    const userEmail = sessionData.user_email || "משתמש אנונימי";

    return `
מאתגר לפיתרון חינוכי - סיכום תהליך
תאריך הפקה: ${format(new Date(), "dd/MM/yyyy HH:mm")}
תאריך יצירה: ${creationDate}
משתמש: ${userEmail}

===========================================

🏢 פרטי יוצר/ת:
שם: ${sessionData.family_name || "לא הוזן"}
בית ספר / ארגון: ${sessionData.family_location || "לא הוזן"}
רקע חינוכי: ${sessionData.family_info || "לא הוזן"}

===========================================

### הגדרת הבעיה ###

🎯 האתגר החינוכי:
${sessionData.educational_challenge || "לא הוזן"}

👥 קהל היעד:
${sessionData.target_audience || "לא הוזן"}

🤔 למי זה כואב?
${sessionData.pain_point_users || "לא הוזן"}

🔍 הגורמים לבעיה:
${sessionData.problem_causes || "לא הוזן"}

📉 סימפטומים (איך זה נראה בשטח):
${sessionData.problem_symptoms || "לא הוזן"}

💡 הנחות יסוד:
${sessionData.assumptions || "לא הוזן"}

===========================================

### המסגרת הפדגוגית ###
${sessionData.pedagogical_framework || "לא הוזן"}

===========================================

### הפתרון המוצע ###

🧭 כיוון ראשוני לפתרון:
${sessionData.activity_idea || "לא הוזן"}

✅ הפתרון המוסכם (לאחר הצעות שיפור):
${sessionData.agreed_solution || "לא הוזן"}

📋 אפיון הפתרון:
${sessionData.activity_description || "לא הוזן"}

===========================================

🚀 הפרומפט הסופי ליצירת האפליקציה:
${sessionData.final_prompt || "לא נוצר פרומפט"}

===========================================
בהצלחה!
    `.trim();
  };

  const handleCopy = () => {
    const exportText = generateExportText();
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const exportText = generateExportText();
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fileName = sessionData?.family_name ? `פתרון_${sessionData.family_name}` : 'פתרון_חינוכי';
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${format(new Date(), "yyyy-MM-dd")}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-3xl"
        >
          <Card className="shadow-2xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-cet-dark-blue">
                  📄 ייצוא סיכום התהליך
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={onBack}>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-4 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">סיכום התהליך:</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleCopy} disabled={copied}>
                      {copied ? <CheckCircle className="w-4 h-4 ml-2" /> : <Copy className="w-4 h-4 ml-2" />}
                      {copied ? "הועתק" : "העתק"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleDownload}>
                      <Download className="w-4 h-4 ml-2" />
                      הורדה
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border max-h-80 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                    {generateExportText()}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
    </div>
  );
}
