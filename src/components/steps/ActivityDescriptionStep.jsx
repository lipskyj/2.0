
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Users, Zap, AlertCircle, Play, Palette, MousePointer, BookOpen } from "lucide-react";
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

export default function ActivityDescriptionStep({ onNext, activityIdea, isLoading, defaultValue = "" }) {
  const [formData, setFormData] = useState({
    // generalDescription field removed as per outline
    gameRules: "",
    roles: "",
    gameSteps: "",
    gameElements: "",
    importantButtons: "",
    designStyle: "",
    additionalInstructions: ""
  });

  // isCheckingContent, suggestion, hasSuggested, validationMessage states removed

  useEffect(() => {
    if (defaultValue) {
        // Updated parsing logic to reflect removed generalDescription field
        // and to ensure we're looking for a structured defaultValue string
        if (defaultValue.includes("איך זה עובד?:")) { // Check for a known structured field
            const sections = defaultValue.split("\n\n");
            const data = {};
            sections.forEach(section => {
                // generalDescription parsing removed
                if (section.includes("איך זה עובד?:")) data.gameRules = section.replace(/.*?:/, "").trim();
                else if (section.includes("קהל יעד ומשתמשים:")) data.roles = section.replace(/.*?:/, "").trim();
                else if (section.includes("מבנה האפליקציה (מסכים):")) data.gameSteps = section.replace(/.*?:/, "").trim();
                else if (section.includes("פיצ'רים מגניבים (גיימיפיקציה):")) data.gameElements = section.replace(/.*?:/, "").trim();
                else if (section.includes("כפתורים ופעולות מרכזיות:")) data.importantButtons = section.replace(/.*?:/, "").trim();
                else if (section.includes("עיצוב ואווירה (Vibe):")) data.designStyle = section.replace(/.*?:/, "").trim();
                else if (section.includes("הערות נוספות:")) data.additionalInstructions = section.replace(/.*?:/, "").trim();
            });
            setFormData(prev => ({ ...prev, ...data }));
        }
        // Removed the else block that assigned defaultValue to generalDescription
    }
  }, [defaultValue]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const buildFullDescription = () => {
    // generalDescription line removed
    return `איך זה עובד?: ${formData.gameRules || 'לא צוין'}
קהל יעד ומשתמשים: ${formData.roles || 'לא צוין'}
מבנה האפליקציה (מסכים): ${formData.gameSteps || 'לא צוין'}
פיצ'רים מגניבים (גיימיפיקציה): ${formData.gameElements || 'לא צוין'}
כפתורים ופעולות מרכזיות: ${formData.importantButtons || 'לא צוין'}
עיצוב ואווירה (Vibe): ${formData.designStyle || 'לא צוין'}
הערות נוספות: ${formData.additionalInstructions || 'לא צוין'}`;
  };

  const handleSubmit = async () => {
    // Simplified handleSubmit to remove LLM validation
    const fullDescription = buildFullDescription();
    onNext(fullDescription);
  };

  const isFormComplete = () => {
    // Removed generalDescription from completeness check
    return formData.gameRules.trim() && formData.roles.trim() && formData.gameSteps.trim();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <ChatMessage message={`פתרון מעולה! "${activityIdea}" נשמע מבטיח. עכשיו בואו נפרט אותו כדי שנוכל לבנות את האפליקציה.`} isBot={true} />

      <div className="bg-sky-50 rounded-lg p-4 text-sm flex items-start gap-3">
        <AlertCircle className="w-8 h-5 text-sky-600 flex-shrink-0" />
        <span>האפליקציה תפעל על מכשיר אחד - פשוט וקל לשימוש, בלי הרשמות או הגדרות מסובכות.</span>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-lg border">
        {/* FormSection for generalDescription removed */}
        
        <FormSection 
          icon={<Zap className="w-5 h-5 text-cet-primary-blue" />} 
          title="1. איך זה יעבוד?" 
          description="איך המשתמשים יתקשרו עם האפליקציה? מה הם יכולים לעשות?" 
          value={formData.gameRules} 
          onChange={(e) => handleInputChange('gameRules', e.target.value)} 
          placeholder="למשל: לוחצים על כפתור, עונים על שאלות, מוסיפים פריטים לרשימה..." 
        />
        
        <FormSection 
          icon={<Users className="w-5 h-5 text-cet-primary-blue" />} 
          title="2. למי זה מיועד?" 
          description="מי ישתמש בזה? אחד או כמה משתמשים יחד?" 
          value={formData.roles} 
          onChange={(e) => handleInputChange('roles', e.target.value)} 
          placeholder="למשל: לכל המשפחה יחד, לחברים בהפסקה, לשימוש אישי..." 
        />
        
        <FormSection 
          icon={<Play className="w-5 h-5 text-cet-primary-blue" />} 
          title="3. מבנה האפליקציה" 
          description="אילו מסכים יהיו? איך עוברים מדף לדף?" 
          value={formData.gameSteps} 
          onChange={(e) => handleInputChange('gameSteps', e.target.value)} 
          placeholder="למשל: 1. מסך פתיחה 2. בחירת רמה 3. המשחק עצמו 4. תוצאות..." 
        />
        
        <FormSection 
          icon={<Target className="w-5 h-5 text-cet-primary-blue" />} 
          title="4. מה יעשה את זה מעניין?" 
          description="איזה פיצ'רים מיוחדים? אנימציות? צלילים? ניקוד?" 
          value={formData.gameElements} 
          onChange={(e) => handleInputChange('gameElements', e.target.value)} 
          placeholder="למשל: נקודות על הישגים, צבעים יפים, הודעות עידוד..." 
        />
        
        <FormSection 
          icon={<MousePointer className="w-5 h-5 text-cet-primary-blue" />} 
          title="5. כפתורים חשובים" 
          description="אילו כפתורים מרכזיים צריכים להיות?" 
          value={formData.importantButtons} 
          onChange={(e) => handleInputChange('importantButtons', e.target.value)} 
          placeholder="למשל: התחל משחק, הבא, חזור הביתה, שתף..." 
        />
        
        <FormSection 
          icon={<Palette className="w-5 h-5 text-cet-primary-blue" />} 
          title="6. איך זה ייראה?" 
          description="איזה אווירה אתם רוצים? צבעים? סגנון?" 
          value={formData.designStyle} 
          onChange={(e) => handleInputChange('designStyle', e.target.value)} 
          placeholder="למשל: צבעוני וחמוד, פשוט ונקי, אלגנטי ומקצועי..." 
        />
        
        <FormSection 
          icon={<BookOpen className="w-5 h-5 text-cet-primary-blue" />} 
          title="7. משהו נוסף?" 
          description="יש עוד דבר שחשוב לכם?" 
          value={formData.additionalInstructions} 
          onChange={(e) => handleInputChange('additionalInstructions', e.target.value)} 
          placeholder="למשל: שיהיה קל לשימוש, מהיר לטעינה..." 
        />
      </div>
      
      {/* Validation message display logic removed */}

      <div className="flex justify-center pt-4">
        <Button onClick={handleSubmit} disabled={!isFormComplete() || isLoading} size="lg" variant="outline" className="bg-white border-2 border-cet-secondary-blue text-cet-secondary-blue hover:bg-cet-light-blue hover:text-cet-primary-blue hover:border-cet-primary-blue text-lg font-bold">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin ml-2" /> : <Send className="w-5 h-5 ml-2" />}
          יצירת פרומפט
        </Button>
      </div>
    </motion.div>
  );
}
