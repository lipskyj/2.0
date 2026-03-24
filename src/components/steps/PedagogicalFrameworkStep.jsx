import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import ChatMessage from "../chat/ChatMessage";

export default function PedagogicalFrameworkStep({ sessionData, onNext }) {
    const [isLoading, setIsLoading] = useState(false);
    const [frameworkText, setFrameworkText] = useState(sessionData.pedagogical_framework || "");
    const [isEditing, setIsEditing] = useState(!sessionData.pedagogical_framework);

    useEffect(() => {
        if (!frameworkText) {
            generateFramework();
        }
    }, []);

    const generateFramework = async () => {
        setIsLoading(true);
        const prompt = `
            You are an expert in educational pedagogy. Analyze the following educational challenge and propose a concise pedagogical framework or core principle to guide the solution.

            Educational Challenge:
            - Challenge: ${sessionData.educational_challenge}
            - Target Audience: ${sessionData.target_audience}
            - Pain Point: ${sessionData.pain_point_users}
            - Causes: ${sessionData.problem_causes}
            - Symptoms: ${sessionData.problem_symptoms}

            Example:
            - Input Challenge: "6th graders (age 12) struggle with reading comprehension because content is irrelevant and uniform."
            - Output Framework: "The pedagogical framework should focus on increasing engagement and motivation through student choice and content personalization. This aligns with principles of differentiated instruction and self-determination theory."

            Now, based on the provided challenge, generate the framework in Hebrew.
        `;

        try {
            const response = await base44.integrations.Core.InvokeLLM({ prompt });
            setFrameworkText(response);
            setIsEditing(true); // Allow editing right away
        } catch (error) {
            console.error("Error generating pedagogical framework:", error);
            setFrameworkText("שגיאה ביצירת הצעה. אנא נסחו את המסגרת הפדגוגית בעצמכם.");
            setIsEditing(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        onNext({ pedagogical_framework: frameworkText });
    };

    if (isLoading) {
        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    <span className="mr-3">מגבש עקרונות פדגוגיים...</span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <ChatMessage message="יופי! עכשיו, בואו נגדיר את המסגרת הפדגוגית שתנחה את הפתרון. הצעתי כאן עיקרון מרכזי, אתם יכולים לחדד ולאשר אותו." isBot={true} />

            <div className="space-y-4 bg-white p-6 rounded-lg border">
                <label className="font-semibold text-cet-text-primary flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-cet-primary-blue" />
                    המסגרת הפדגוגית המוצעת
                </label>
                <Textarea
                    value={frameworkText}
                    onChange={(e) => setFrameworkText(e.target.value)}
                    className="w-full h-40 resize-y bg-sky-50"
                    placeholder="מתאר את המסגרת הפדגוגית..."
                />
            </div>
            
            <div className="flex justify-center">
                <Button 
                    onClick={handleNext} 
                    disabled={!frameworkText.trim()} 
                    size="lg" 
                    variant="outline" 
                    className="bg-white border-2 border-cet-secondary-blue text-cet-secondary-blue hover:bg-cet-light-blue hover:text-cet-primary-blue hover:border-cet-primary-blue text-lg font-bold"
                >
                    <Send className="w-5 h-5 ml-2" />
                    אישור והמשך
                </Button>
            </div>
        </motion.div>
    );
}