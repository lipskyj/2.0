
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wand2, Loader2, Send, Edit, CheckSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import ChatMessage from "../chat/ChatMessage";

export default function SolutionRefinementStep({ sessionData, onNext }) {
    const [isLoading, setIsLoading] = useState(false);
    const [originalSuggestion, setOriginalSuggestion] = useState(sessionData.ai_suggestion || "");
    const [showDetailedForm, setShowDetailedForm] = useState(false);
    const [detailedSuggestion, setDetailedSuggestion] = useState("");
    const [finalText, setFinalText] = useState(sessionData.agreed_solution || "");

    useEffect(() => {
        if (!originalSuggestion) {
            generateInitialSuggestion();
        }
    }, []);

    const generateInitialSuggestion = async () => {
        setIsLoading(true);
        const prompt = `
            בהתבסס על הגדרת הבעיה החינוכית ומסגרת הפדגוגית הבאות, אנא צור סיכום קצר והצעות לשיפור בעברית:

            הגדרת הבעיה:
            - האתגר החינוכי: ${sessionData.educational_challenge}
            - קהל היעד: ${sessionData.target_audience}
            - למי כואב: ${sessionData.pain_point_users}
            - גורמי הבעיה: ${sessionData.problem_causes}
            - סימפטומים: ${sessionData.problem_symptoms}
            - הנחות יסוד: ${sessionData.assumptions}
            - כיוון הפתרון: ${sessionData.activity_idea}
            
            מסגרת פדגוגית:
            - ${sessionData.pedagogical_framework}

            ארגן את התשובה כך:
            ### סיכום הבעיה
            [סיכום קצר של הבעיה המוגדרת]

            ### הצעות לשיפור
            [2-3 הצעות קונקרטיות לשיפור הפתרון, תוך התחשבות במסגרת הפדגוגית]
        `;

        try {
            const response = await base44.integrations.Core.InvokeLLM({ prompt });
            setOriginalSuggestion(response);
        } catch (error) {
            console.error("Error generating AI suggestion:", error);
            setOriginalSuggestion("שגיאה ביצירת הצעה. תוכלו לנסח את הפתרון בעצמכם.");
        } finally {
            setIsLoading(false);
        }
    };

    const generateDetailedSuggestion = async () => {
        setIsLoading(true);
        const prompt = `
            בהתבסס על הגדרת הבעיה החינוכית ומסגרת פדגוגית הבאות, אנא צור הגדרת בעיה והצעת פתרון מפורטת ומקצועית בעברית:

            הגדרת הבעיה:
            - האתגר החינוכי: ${sessionData.educational_challenge}
            - קהל היעד: ${sessionData.target_audience}
            - למי כואב: ${sessionData.pain_point_users}
            - גורמי הבעיה: ${sessionData.problem_causes}
            - סימפטומים: ${sessionData.problem_symptoms}
            - הנחות יסוד: ${sessionData.assumptions}
            - כיוון הפתרון: ${sessionData.activity_idea}

            מסגרת פדגוגית:
            - ${sessionData.pedagogical_framework}

            ארגן את התשובה כך:
            ### הגדרת הבעיה החינוכית
            [ניסוח ברור ומקצועי של הבעיה, תוך שילוב המסגרת הפדגוגית]

            ### הצעת פתרון טכנולוגי
            [תיאור הפתרון המוצע עם דגש על היתכנות ויעילות, ובאופן התואם את העקרונות הפדגוגיים]

            ### יתרונות הפתרון
            [רשימת יתרונות מרכזיים]
        `;

        try {
            const response = await base44.integrations.Core.InvokeLLM({ prompt });
            setDetailedSuggestion(response);
            setFinalText(response);
            setShowDetailedForm(true);
        } catch (error) {
            console.error("Error generating detailed suggestion:", error);
            setDetailedSuggestion("שגיאה ביצירת הצעה מפורטת.");
            setFinalText("שגיאה ביצירת הצעה מפורטת.");
            setShowDetailedForm(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUseSimple = () => {
        // Extract only the summary part (before "הצעות לשיפור")
        const summaryOnly = originalSuggestion.split("### הצעות לשיפור")[0].trim();
        setFinalText(summaryOnly);
        handleNext(summaryOnly);
    };

    const handleNext = (text = finalText) => {
        onNext({
            ai_suggestion: originalSuggestion,
            agreed_solution: text
        });
    };

    if (isLoading) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    <span className="mr-3">מכין הצעה...</span>
                </div>
            </motion.div>
        );
    }

    if (showDetailedForm) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <ChatMessage message="הנה הגדרת בעיה והצעת פתרון מפורטת. אתם יכולים לערוך ולשנות לפי הצורך:" isBot={true} />
                
                <div className="space-y-4">
                    <label className="font-semibold text-cet-text-primary flex items-center gap-2">
                        <Edit className="w-5 h-5 text-cet-primary-blue" />
                        הגדרת בעיה והצעת פתרון (לעריכה)
                    </label>
                    <Textarea
                        value={finalText}
                        onChange={(e) => setFinalText(e.target.value)}
                        className="w-full h-64 resize-y bg-sky-50"
                    />
                </div>
                
                <div className="flex justify-center gap-3">
                    <Button 
                        onClick={() => handleNext()} 
                        disabled={!finalText.trim()} 
                        size="lg" 
                        variant="outline" 
                        className="bg-white border-2 border-cet-secondary-blue text-cet-secondary-blue hover:bg-cet-light-blue hover:text-cet-primary-blue hover:border-cet-primary-blue text-lg font-bold"
                    >
                        <Send className="w-5 h-5 ml-2" />
                        אישור והמשך לאפיון
                    </Button>
                    <Button 
                        onClick={() => setShowDetailedForm(false)} 
                        variant="outline"
                        size="lg"
                    >
                        <X className="w-5 h-5 ml-2" />
                        חזור
                    </Button>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <ChatMessage message="ניתוח מעולה של האתגר! הנה סיכום והצעות לשיפור:" isBot={true} />

            <div className="bg-sky-50 rounded-lg p-4 border">
                <h3 className="font-semibold text-cet-text-primary mb-3 flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-cet-primary-blue" />
                    ניסוח הבעיה והצעות לשיפור
                </h3>
                <div className="bg-white rounded-lg p-4 whitespace-pre-wrap text-sm">
                    {originalSuggestion || "טוען..."}
                </div>
            </div>

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-cet-text-primary mb-4 font-medium">
                    רוצים שאנסח הגדרת בעיה והצעה לפתרון משופרת ומפורטת יותר?
                </p>
                <div className="flex justify-center gap-3">
                    <Button 
                        onClick={generateDetailedSuggestion}
                        size="lg" 
                        variant="outline" 
                        className="bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 text-lg font-bold"
                    >
                        <CheckSquare className="w-5 h-5 ml-2" />
                        כן, צרו ניסוח מפורט
                    </Button>
                    <Button 
                        onClick={handleUseSimple}
                        size="lg" 
                        variant="outline"
                        className="bg-white border-2 border-cet-secondary-blue text-cet-secondary-blue hover:bg-cet-light-blue hover:text-cet-primary-blue hover:border-cet-primary-blue text-lg font-bold"
                    >
                        <Send className="w-5 h-5 ml-2" />
                        לא, נמשיך עם הסיכום הנוכחי
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
