import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatMessage from "../chat/ChatMessage";

export default function ActivityIdeaStep({ onNext, familyInfo, isLoading, defaultValue = "" }) {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onNext(inputValue.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Lightbulb className="w-8 h-8 text-orange-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-blue-800">
          כיוון לפתרון 💡
        </h2>
      </div>
      
      <ChatMessage
        message={`ניתוח מצוין! עכשיו, בהתבסס על האתגר שהגדרתם, מה הכיוון שלכם לפתרון?`}
        isBot={true}
        delay={0}
      />
      
      <div className="bg-white p-6 rounded-lg border space-y-4">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="תנו כיוון לפתרון שחשבתם עליו. למשל: אפליקציה שתציג אתגר קריאה יומי, מערכת לניהול משימות כיתתיות..."
          className="w-full h-24 resize-y"
        />
        
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            size="lg"
            variant="outline"
            className="bg-white border-2 border-cet-secondary-blue text-cet-secondary-blue hover:bg-cet-light-blue hover:text-cet-primary-blue hover:border-cet-primary-blue text-lg font-bold"
          >
            <Send className="w-5 h-5 ml-2" />
            המשיכו לשלב הבא
          </Button>
        </div>
      </div>
    </motion.div>
  );
}