import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, Edit, X } from "lucide-react";
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
        if (!sessionData.agreed_solution) {
            generateDetailedSuggestion();
        }
    }, []);

    const generateDetailedSuggestion = async () => {
        setIsLoading(true);
        const prompt = `
            בהתבסס על האתגר וכיוון הפתרון הבאים, אנא צור הגדרת בעיה והצעת פתרון מפורטת ומקצועית בעברית:

            - האתגר: ${sessionData.educational_challenge}
            - קהל היעד: ${sessionData.target_audience}
            - למי כואב: ${sessionData.pain_point_users}
            - גורמי הבעיה: ${sessionData.problem_causes}
            - סימפטומים: ${sessionData.problem_symptoms}
            - הנחות יסוד: ${sessionData.assumptions}
            - כיוון הפתרון: ${sessionData.activity_idea}

            ארגן את התשובה כך:
            ### הגדרת הבעיה
            [ניסוח ברור ומקצועי של הבעיה]

            ### הצעת פתרון טכנולוגי
            [תיאור הפתרון המוצע עם דגש על היתכנות ויעילות]

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
            setFinalText("שגיאה ביצירת הצעה מפורטת.");
            setShowDetailedForm(true);
        } finally {
            setIsLoading(false);
        }
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

    return null;
}