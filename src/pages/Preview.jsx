
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Undo2, ChevronRight, ArrowLeft, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import WelcomeStep from "../components/steps/WelcomeStep";
import FamilyInfoStep from "../components/steps/FamilyInfoStep";
import ProblemDefinitionStep from "../components/steps/ProblemDefinitionStep";
import PedagogicalFrameworkStep from "../components/steps/PedagogicalFrameworkStep";
import ActivityIdeaStep from "../components/steps/ActivityIdeaStep";
import SolutionRefinementStep from "../components/steps/SolutionRefinementStep";
import ActivityDescriptionStep from "../components/steps/ActivityDescriptionStep";
import PromptStep from "../components/steps/PromptStep";
import FinalStep from "../components/steps/FinalStep";
import ChatExport from "../components/chat/ChatExport";

export default function Preview() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showExport, setShowExport] = useState(false);

  const mockData = {
    family_name: "דנה כהן",
    family_location: "בית ספר 'עתיד', תל אביב", 
    family_info: "מורה למדעים בחטיבת ביניים, ותק של 8 שנים.",
    educational_challenge: "קושי של תלמידים בכיתה ז' להבין מושגים מופשטים בכימיה, כמו מבנה האטום.",
    target_audience: "תלמידי כיתה ז'",
    pain_point_users: "התלמידים חשים תסכול וחוסר עניין, והמורה מתקשה להמחיש את החומר.",
    problem_causes: "הנושא מופשט וקשה להמחשה ויזואלית בכלים הקיימים.",
    problem_symptoms: "ציונים נמוכים במבחנים, חוסר השתתפות בשיעור.",
    assumptions: "אם תהיה דרך להמחיש את מבנה האטום באופן אינטראקטיבי, ההבנה והעניין יגברו.",
    pedagogical_framework: "המסגרת הפדגוגית תתמקד בלמידה חווייתית ואינטראקטיבית (Experiential Learning) המאפשרת לתלמידים 'לשחק' עם מודלים, ובכך להפוך מושג מופשט לקונקרטי.",
    activity_idea: "סימולציה אינטראקטיבית לבניית אטומים.",
    agreed_solution: "אפליקציה המאפשרת לתלמידים לבנות אטומים של יסודות שונים על ידי גרירת פרוטונים, נויטרונים ואלקטרונים, ולקבל משוב מיידי על היציבות והמטען של האטום שיצרו.",
    activity_description: `איך זה עובד?: התלמיד בוחר יסוד מהטבלה המחזורית וצריך 'לבנות' אותו. הוא גורר חלקיקים לאזורים הנכונים באטום.
קהל יעד ומשתמשים: תלמיד יחיד מול האפליקציה, לתרגול אישי.
מבנה האפליקציה (מסכים): 1. מסך פתיחה 2. בחירת יסוד 3. מסך בניית האטום 4. מסך סיכום ומשוב.
פיצ'רים מגניבים (גיימיפיקציה): אנימציה של האלקטרונים חגים סביב הגרעין, צליל הצלחה בבנייה נכונה, נקודות ודירוג.
כפתורים ופעולות מרכזיות: 'בדיקה', 'התחל מחדש', 'רמז'.
עיצוב ואווירה (Vibe): עיצוב 'מדעי' ונקי, עם צבעים ברורים לכל חלקיק.
הערות נוספות: חשוב שהמשוב יהיה מיידי וברור.`,
    final_prompt: `### 📝 שם האפליקציה וקונספט
שם: "מעבדת האטומים"
קונספט: סימולטור אינטראקטיבי לבניית אטומים, המיועד להוראת מושגי יסוד בכימיה.

### 🎯 מטרת האפליקציה
לאפשר לתלמידים ללמוד ולהתנסות במבנה האטום בצורה חווייתית וויזואלית, ולהפוך מושגים מופשטים לקונקרטיים.

### ✨ תכונות ופיצ'רים מרכזיים
- מסך פתיחה עם כפתור "התחל ניסוי".
- בחירת יסוד מהטבלה המחזורית.
- ממשק גרירה ושחרור (Drag and Drop) של פרוטונים, נויטרונים ואלקטרונים.
- משוב ויזואלי ומילולי מיידי על כל פעולה.
- מסך סיכום עם מידע על האטום שנבנה.

### 🎨 עיצוב וחווית משתמש
- עיצוב נקי ומדעי, בצבעי כחול, לבן ואפור.
- פונט ברור וקריא (Assistant).
- ממשק מלא בעברית עם תמיכת RTL.

### ⚙️ דרישות טכניות
- אפליקציה חד-עמודית (SPA).
- ניהול מצב בתוך הסשן ללא צורך בשמירת נתונים.
- רספונסיביות למובייל ודסקטופ.`
  };

  const mockUser = {
    full_name: "משתמש דמיוני",
    email: "demo@example.com"
  };

  const handleStepChange = (step) => {
    setCurrentStep(step);
  };

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleShowExport = () => {
    setShowExport(true);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={handleNext} />;
      
      case 2:
        return (
          <FamilyInfoStep
            onNext={handleNext}
            isLoading={false}
            defaultValue={mockData.family_info}
            defaultFamilyName={mockData.family_name}
            defaultLocation={mockData.family_location}
          />
        );
      
      case 3:
        return (
          <ProblemDefinitionStep
            onNext={handleNext}
            isLoading={false}
            defaultValues={{
              educational_challenge: mockData.educational_challenge,
              target_audience: mockData.target_audience,
              pain_point_users: mockData.pain_point_users,
              problem_causes: mockData.problem_causes,
              problem_symptoms: mockData.problem_symptoms,
              assumptions: mockData.assumptions
            }}
          />
        );

      case 4:
        return (
          <PedagogicalFrameworkStep
            sessionData={mockData}
            onNext={handleNext}
          />
        );

      case 5:
        return (
          <ActivityIdeaStep
            onNext={handleNext}
            familyInfo={mockData.educational_challenge}
            isLoading={false}
            defaultValue={mockData.activity_idea}
          />
        );
      
      case 6:
        return (
          <SolutionRefinementStep
            sessionData={mockData}
            onNext={handleNext}
          />
        );

      case 7:
        return (
          <ActivityDescriptionStep
            onNext={handleNext}
            activityIdea={mockData.agreed_solution}
            isLoading={false}
            defaultValue={mockData.activity_description}
          />
        );
      
      case 8:
        return (
          <PromptStep
            onNext={handleNext}
            familyInfo={`${mockData.family_name} מ${mockData.family_location}`}
            activityIdea={mockData.agreed_solution}
            activityDescription={mockData.activity_description}
            isLoading={false}
            defaultValue={mockData.final_prompt}
          />
        );
      
      case 9:
      default:
        return (
          <FinalStep
            sessionData={mockData}
          />
        );
    }
  };

  if (showExport) {
    return (
      <ChatExport 
        sessionData={mockData}
        onBack={() => setShowExport(false)}
        currentUser={mockUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50">
      <div className="bg-blue-200 text-blue-800 p-2 text-center text-sm flex items-center justify-center gap-2" dir="rtl">
        <Eye className="w-4 h-4" />
        מצב תצוגה מקדימה - נתונים דמיוניים לבדיקת העיצוב והחוויה
        <Link to={createPageUrl('Admin')} className="underline font-semibold">
          <ArrowLeft className="w-4 h-4 inline ml-1" />
          חזרה לפאנל ניהול
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 min-h-[600px]">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <Undo2 className="w-4 h-4" />
                  <span>חזור</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentStep === 9}
                  className="flex items-center gap-2"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>הבא</span>
                </Button>
              </div>

              <div className="flex flex-col gap-3 items-end">
                {/* מאתגר לפיתרון - רק שלבים 1-7 */}
                {currentStep <= 7 && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-semibold text-gray-600">מאתגר לפיתרון</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                        <button
                          key={step}
                          onClick={() => handleStepChange(step)}
                          className={`w-7 h-7 rounded-full text-xs font-medium transition-all duration-300 ${
                            step === currentStep
                              ? "bg-orange-500 text-white"
                              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          }`}
                        >
                          {step}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* פרומפט סופי - רק שלב 8 */}
                {currentStep === 8 && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-semibold text-gray-600">פרומפט סופי</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStepChange(8)}
                        className="w-16 h-7 rounded-full text-xs font-medium bg-orange-500 text-white transition-all duration-300"
                      >
                        8
                      </button>
                    </div>
                  </div>
                )}

                {/* מוכנים לשיגור - רק שלב 9 */}
                {currentStep === 9 && (
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs font-semibold text-gray-600">מוכנים לשיגור</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleStepChange(9)}
                        className="w-16 h-7 rounded-full text-xs font-medium bg-green-500 text-white transition-all duration-300"
                      >
                        9
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-sm text-gray-500">
                {currentStep === 1 && "שלב 1: פתיחה"}
                {currentStep === 2 && "שלב 2: היכרות"}
                {currentStep === 3 && "שלב 3: הגדרת הבעיה"}
                {currentStep === 4 && "שלב 4: מסגרת פדגוגית"}
                {currentStep === 5 && "שלב 5: כיוון לפתרון"}
                {currentStep === 6 && "שלב 6: ניסוח הפתרון"}
                {currentStep === 7 && "שלב 7: אפיון הפתרון"}
                {currentStep === 8 && "שלב 8: יצירת פרומפט"}
                {currentStep === 9 && "שלב 9: סיכום"}
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              <div key={currentStep}>
                {renderCurrentStep()}
              </div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
