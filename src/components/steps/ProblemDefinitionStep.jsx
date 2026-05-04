import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit3, UserCheck, AlertTriangle, Search, CheckSquare, Users } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import ChatMessage from "../chat/ChatMessage";

const FormSection = ({ icon, title, description, value, onChange, placeholder }) => (
    <div className="space-y-2">
        <label className="font-semibold text-cet-text-primary flex items-center gap-2">
            {icon}
            {title}
        </label>
        {description && <p className="text-sm text-cet-text-secondary">{description}</p>}
        <Textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-24 resize-y"
        />
    </div>
);

export default function ProblemDefinitionStep({ onNext, isLoading, defaultValues = {} }) {
    const [formData, setFormData] = useState({
        educational_challenge: defaultValues.educational_challenge || "",
        target_audience: defaultValues.target_audience || "", // New field
        pain_point_users: defaultValues.pain_point_users || "",
        problem_causes: defaultValues.problem_causes || "",
        problem_symptoms: defaultValues.problem_symptoms || "",
        assumptions: defaultValues.assumptions || ""
    });

    useEffect(() => {
        setFormData({
            educational_challenge: defaultValues.educational_challenge || "",
            target_audience: defaultValues.target_audience || "", // New field
            pain_point_users: defaultValues.pain_point_users || "",
            problem_causes: defaultValues.problem_causes || "",
            problem_symptoms: defaultValues.problem_symptoms || "",
            assumptions: defaultValues.assumptions || ""
        });
    }, [defaultValues]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onNext(formData);
    };

    const isFormComplete = () => {
        return Object.values(formData).every(value => value.trim() !== "");
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <ChatMessage message="שלב מצוין! עכשיו בואו נגדיר יחד את האתגר החינוכי. ככל שתהיו מדויקים יותר, הפתרון יהיה טוב יותר." isBot={true} />

            <div className="space-y-6 bg-white p-6 rounded-lg border">
                <FormSection
                    icon={<Edit3 className="w-5 h-5 text-cet-primary-blue" />}
                    title="א. אתגר חינוכי / אתגר שמעסיק אתכם"
                    description="תארו קושי/אתגר/כאב מעולם ההוראה והלמידה (גם אם אינו חינוכי במובן הצר - כל אתגר שמעסיק אתכם כמחנכים)."
                    value={formData.educational_challenge}
                    onChange={(e) => handleInputChange('educational_challenge', e.target.value)}
                    placeholder="למשל: קושי של תלמידים להתמיד בקריאת ספרים לאורך זמן."
                />
                 <FormSection
                    icon={<Users className="w-5 h-5 text-cet-primary-blue" />}
                    title="ב. קהל יעד"
                    description="למי הפתרון מיועד?"
                    value={formData.target_audience}
                    onChange={(e) => handleInputChange('target_audience', e.target.value)}
                    placeholder="למשל: תלמידי כיתות ג'-ד', מורים למדעים בחטיבה, הורים לילדים בגן."
                />
                <FormSection
                    icon={<UserCheck className="w-5 h-5 text-cet-primary-blue" />}
                    title="ג. למי זה כואב?"
                    description="מי האנשים הספציפיים שחווים את הכאב? (המורה, התלמיד, ההורה)"
                    value={formData.pain_point_users}
                    onChange={(e) => handleInputChange('pain_point_users', e.target.value)}
                    placeholder="למשל: התלמידים מרגישים מתוסכלים, והמורים מתקשים לעקוב אחר ההתקדמות."
                />
                <FormSection
                    icon={<AlertTriangle className="w-5 h-5 text-cet-primary-blue" />}
                    title="ד. הגורמים לבעיה"
                    description="מהם הגורמים המרכזיים לבעיה? (זה קורה כי...)"
                    value={formData.problem_causes}
                    onChange={(e) => handleInputChange('problem_causes', e.target.value)}
                    placeholder="למשל: חוסר עניין, הסחות דעת ממסכים, קושי במעקב אישי."
                />
                <FormSection
                    icon={<Search className="w-5 h-5 text-cet-primary-blue" />}
                    title="ה. סימפטומים"
                    description="כיצד הבעיה באה לידי ביטוי? איך זה נראה בשטח?"
                    value={formData.problem_symptoms}
                    onChange={(e) => handleInputChange('problem_symptoms', e.target.value)}
                    placeholder="למשל: תלמידים לא מסיימים לקרוא ספרים, יש ירידה בציונים במקצועות רלוונטיים."
                />
                <FormSection
                    icon={<CheckSquare className="w-5 h-5 text-cet-primary-blue" />}
                    title="ו. הנחות יסוד"
                    description="מה צריך להתקיים כדי שהבעיה תיפתר? נסחו משפט שמתחיל ב'אם...'."
                    value={formData.assumptions}
                    onChange={(e) => handleInputChange('assumptions', e.target.value)}
                    placeholder="למשל: אם תהיה דרך להמחיש את מבנה האטום באופן אינטראקטיבי, ההבנה והעניין יגברו."
                />
            </div>

            <div className="flex justify-center pt-4">
                <Button onClick={handleSubmit} disabled={!isFormComplete() || isLoading} size="lg" variant="outline" className="bg-white border-2 border-cet-secondary-blue text-cet-secondary-blue hover:bg-cet-light-blue hover:text-cet-primary-blue hover:border-cet-primary-blue text-lg font-bold">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : <Send className="w-5 h-5 ml-2" />}
                    שמירה והמשך
                </Button>
            </div>
        </motion.div>
    );
}