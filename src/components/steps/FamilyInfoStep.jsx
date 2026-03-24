
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, MapPin, User as UserIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import ChatMessage from "../chat/ChatMessage";

export default function FamilyInfoStep({ onNext, isLoading, defaultValue = "", defaultFamilyName = "", defaultLocation = "" }) {
  const [formData, setFormData] = useState({
    familyName: defaultFamilyName || "",
    location: defaultLocation || "",
    familyInfo: defaultValue || ""
  });

  useEffect(() => {
    setFormData({
      familyName: defaultFamilyName || "",
      location: defaultLocation || "",
      familyInfo: defaultValue || ""
    });
  }, [defaultValue, defaultFamilyName, defaultLocation]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    onNext({
      family_name: formData.familyName,
      family_location: formData.location,
      family_info: formData.familyInfo
    });
  };

  const isFormComplete = () => {
    return formData.familyName.trim() && 
           formData.location.trim() && 
           formData.familyInfo.trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <ChatMessage
        message="נהדר! בואו נתחיל בהיכרות קצרה. זו עבודה אישית, אז ספרו לי קצת על עצמכם."
        isBot={true}
        delay={0}
      />
      
      <div className="space-y-6 bg-white p-6 rounded-lg border">
        <div className="space-y-1">
            <label className="font-semibold text-cet-text-primary flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-cet-primary-blue" />
                שם
            </label>
            <Input
                value={formData.familyName}
                onChange={(e) => handleInputChange('familyName', e.target.value)}
                placeholder="שם מלא"
            />
        </div>

        <div className="space-y-1">
            <label className="font-semibold text-cet-text-primary flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cet-primary-blue" />
                בית ספר / ארגון
            </label>
            <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="למשל: בית ספר השלום, מטח..."
            />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-cet-text-primary flex items-center gap-2">
            <Users className="w-5 h-5 text-cet-primary-blue" />
            רקע חינוכי
          </label>
          <p className="text-sm text-cet-text-secondary">מי אתם? כמה אנשים? מה התפקידים שלכם?</p>
          <Textarea
            value={formData.familyInfo}
            onChange={(e) => handleInputChange('familyInfo', e.target.value)}
            placeholder="למשל: 3 מורות למתמטיקה בחטיבת ביניים, עם ותק של 5-10 שנים..."
            className="h-24"
          />
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSubmit}
          disabled={!isFormComplete() || isLoading}
          size="lg"
          variant="outline"
          className="bg-white border-2 border-cet-secondary-blue text-cet-secondary-blue hover:bg-cet-light-blue hover:text-cet-primary-blue hover:border-cet-primary-blue text-lg font-bold"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin ml-2" />
          ) : (
            <Send className="w-5 h-5 ml-2" />
          )}
          שמירה והמשך
        </Button>
      </div>
    </motion.div>
  );
}
