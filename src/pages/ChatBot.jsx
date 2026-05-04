import React, { useState, useEffect } from "react";
import { ChatSession } from "@/entities/ChatSession";
import { User } from "@/entities/User";
import { AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Undo2, RefreshCw, Loader2, ChevronRight, Shield } from "lucide-react";

import WelcomeStep from "../components/steps/WelcomeStep";
import FamilyInfoStep from "../components/steps/FamilyInfoStep";
import ProblemDefinitionStep from "../components/steps/ProblemDefinitionStep";
import ActivityIdeaStep from "../components/steps/ActivityIdeaStep";
import SolutionRefinementStep from "../components/steps/SolutionRefinementStep";
import ActivityDescriptionStep from "../components/steps/ActivityDescriptionStep";
import PromptStep from "../components/steps/PromptStep";
import FinalStep from "../components/steps/FinalStep";

// Step order: skip internal step 4 (PedagogicalFramework)
const STEP_ORDER = [1, 2, 3, 5, 6, 7, 8, 9];
const MAIN_STEPS = [1, 2, 3, 5, 6, 7]; // "מאתגר לפיתרון"

const getNextStep = (step) => {
  const idx = STEP_ORDER.indexOf(step);
  return idx < STEP_ORDER.length - 1 ? STEP_ORDER[idx + 1] : step;
};

const getPrevStep = (step) => {
  const idx = STEP_ORDER.indexOf(step);
  return idx > 0 ? STEP_ORDER[idx - 1] : step;
};

export default function ChatBot() {
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const adminSessionId = urlParams.get('sessionId');
    const adminMode = urlParams.get('adminMode') === 'true';

    if (adminMode && adminSessionId) {
      setIsAdminMode(true);
      loadSessionById(adminSessionId);
    } else {
      initializeUserAndSession();
    }
  }, []);

  const initializeUserAndSession = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      await loadOrCreateSessionForUser(user.email);
    } catch (error) {
      setCurrentUser({ full_name: "אורח/ת", email: "anonymous" });
      await loadOrCreateSessionForAnonymous();
    }
    setIsLoading(false);
  };

  const createNewSession = async (userEmail) => {
    const newSessionData = {
      step: 1,
      family_name: "", family_location: "", family_info: "",
      educational_challenge: "", target_audience: "",
      pain_point_users: "", problem_causes: "", problem_symptoms: "",
      assumptions: "", pedagogical_framework: "",
      activity_idea: "", ai_suggestion: "", agreed_solution: "",
      activity_description: "", final_prompt: "",
      is_complete: false, user_email: userEmail
    };
    const created = await ChatSession.create(newSessionData);
    setSessionData(created);
    setCurrentStep(1);
    setSessionId(created.id);
    if (userEmail === 'anonymous') {
      localStorage.setItem('chatSessionId', created.id);
    }
    return created;
  };

  const loadOrCreateSessionForUser = async (userEmail) => {
    const sessions = await ChatSession.filter(
      { user_email: userEmail, is_complete: false },
      "-created_date", 1
    );
    if (sessions.length > 0) {
      const session = sessions[0];
      setSessionData(session);
      const step = session.step === 4 ? 5 : session.step;
      setCurrentStep(step);
      setSessionId(session.id);
    } else {
      await createNewSession(userEmail);
    }
  };

  const loadOrCreateSessionForAnonymous = async () => {
    const storedSessionId = localStorage.getItem('chatSessionId');
    if (storedSessionId) {
      try {
        const session = await ChatSession.get(storedSessionId);
        if (session && !session.is_complete) {
          setSessionData(session);
          const step = session.step === 4 ? 5 : session.step;
          setCurrentStep(step);
          setSessionId(session.id);
          return;
        }
      } catch (e) {
        console.warn("Could not load session from localStorage");
      }
    }
    await createNewSession('anonymous');
  };

  const createPageUrl = (path) => `/${path}`;

  const loadSessionById = async (id) => {
    setIsLoading(true);
    try {
      const session = await ChatSession.get(id);
      if (session) {
        setSessionData(session);
        const step = session.step === 4 ? 5 : session.step;
        setCurrentStep(step);
        setSessionId(session.id);
        try {
          const user = await User.me();
          setCurrentUser(user);
        } catch (e) {
          setCurrentUser({ full_name: "משתמשת אנונימית", email: "anonymous" });
        }
      } else {
        alert('סשן לא נמצא!');
        window.location.href = createPageUrl('Admin');
      }
    } catch (e) {
      alert('שגיאה בטעינת הסשן');
      window.location.href = createPageUrl('Admin');
    }
    setIsLoading(false);
  };

  const updateSession = async (updates) => {
    if (!sessionId || !sessionData) return;
    const updatedData = { ...sessionData, ...updates };
    await ChatSession.update(sessionId, updatedData);
    setSessionData(updatedData);
  };

  const handleStepComplete = async (stepData, nextStep) => {
    setIsLoading(true);
    const updates = { step: nextStep, ...stepData };
    if (nextStep > 9) updates.is_complete = true;
    await updateSession(updates);
    setCurrentStep(nextStep);
    setIsLoading(false);
  };

  const handleGoBack = async () => {
    if (currentStep > 1 && !isLoading) {
      setIsLoading(true);
      const prevStep = getPrevStep(currentStep);
      await updateSession({ step: prevStep });
      setCurrentStep(prevStep);
      setIsLoading(false);
    }
  };

  const handleGoForward = async () => {
    if (!isLoading && sessionData && checkCanGoForward()) {
      const nextStep = getNextStep(currentStep);
      if (nextStep !== currentStep) {
        setIsLoading(true);
        await updateSession({ step: nextStep });
        setCurrentStep(nextStep);
        setIsLoading(false);
      }
    }
  };

  const checkCanGoForward = () => {
    if (isAdminMode || !sessionData) return true;
    switch (currentStep) {
      case 1: return true;
      case 2: return !!(sessionData.family_name?.trim() && sessionData.family_location?.trim() && sessionData.family_info?.trim());
      case 3: return !!(sessionData.educational_challenge?.trim() && sessionData.target_audience?.trim() &&
                        sessionData.pain_point_users?.trim() && sessionData.problem_causes?.trim() &&
                        sessionData.problem_symptoms?.trim() && sessionData.assumptions?.trim());
      case 5: return !!sessionData.activity_idea?.trim();
      case 6: return !!sessionData.agreed_solution?.trim();
      case 7: return !!sessionData.activity_description?.trim();
      case 8: return !!sessionData.final_prompt?.trim();
      default: return false;
    }
  };

  const handleReset = async () => {
    if (isLoading) return;
    if (window.confirm("האם אתם בטוחים שברצונכם להתחיל מחדש? כל המידע שלכם יימחק.")) {
      setIsLoading(true);
      if (sessionId && currentUser?.email === 'anonymous') {
        localStorage.removeItem('chatSessionId');
      }
      setSessionId(null);
      setSessionData(null);
      await initializeUserAndSession();
    }
  };

  const renderCurrentStep = () => {
    if (isLoading || !sessionData) {
      return (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={() => handleStepComplete({}, 2)} />;

      case 2:
        return (
          <FamilyInfoStep
            onNext={(familyData) => handleStepComplete(familyData, 3)}
            isLoading={isLoading}
            defaultValue={sessionData.family_info}
            defaultFamilyName={sessionData.family_name}
            defaultLocation={sessionData.family_location}
          />
        );

      case 3:
        return (
          <ProblemDefinitionStep
            onNext={(problemData) => handleStepComplete(problemData, 5)}
            isLoading={isLoading}
            defaultValues={{
              educational_challenge: sessionData.educational_challenge,
              target_audience: sessionData.target_audience,
              pain_point_users: sessionData.pain_point_users,
              problem_causes: sessionData.problem_causes,
              problem_symptoms: sessionData.problem_symptoms,
              assumptions: sessionData.assumptions,
            }}
          />
        );

      case 5:
        return (
          <ActivityIdeaStep
            onNext={(activityIdea) => handleStepComplete({ activity_idea: activityIdea }, 6)}
            familyInfo={`אתגר: ${sessionData.educational_challenge}`}
            isLoading={isLoading}
            defaultValue={sessionData.activity_idea}
          />
        );

      case 6:
        return (
          <SolutionRefinementStep
            sessionData={sessionData}
            onNext={(solutionData) => handleStepComplete(solutionData, 7)}
          />
        );

      case 7:
        return (
          <ActivityDescriptionStep
            onNext={(description) => handleStepComplete({ activity_description: description }, 8)}
            activityIdea={sessionData.activity_idea}
            isLoading={isLoading}
            defaultValue={sessionData.activity_description}
          />
        );

      case 8:
        return (
          <PromptStep
            onNext={(prompt) => handleStepComplete({ final_prompt: prompt }, 9)}
            familyInfo={`${sessionData.family_name} מ${sessionData.family_location} - ${sessionData.family_info}`}
            activityIdea={sessionData.agreed_solution}
            activityDescription={sessionData.activity_description}
            isLoading={isLoading}
            defaultValue={sessionData.final_prompt}
          />
        );

      case 9:
      default:
        return <FinalStep sessionData={sessionData} />;
    }
  };

  const isMainSection = MAIN_STEPS.includes(currentStep);
  const isPromptSection = currentStep === 8;
  const isFinalSection = currentStep === 9;

  return (
    <div className="min-h-screen bg-sky-50" dir="rtl">
      {isAdminMode && (
        <div className="bg-amber-300 text-amber-900 p-2 text-center text-sm flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" />
          מצב אדמין - ניתן לדלג בין השלבים בחופשיות.
          <a href={createPageUrl('Admin')} className="underline font-semibold">חזרה לפאנל</a>
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 min-h-[600px]">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex gap-2 items-center">
                {currentStep > 1 && (
                  <Button variant="outline" size="sm" onClick={handleGoBack} disabled={isLoading} className="flex items-center gap-2">
                    <Undo2 className="w-4 h-4" />
                    <span>חזרו</span>
                  </Button>
                )}
                {currentStep < 9 && sessionData && checkCanGoForward() && (
                  <Button variant="outline" size="sm" onClick={handleGoForward} disabled={isLoading} className="flex items-center gap-2">
                    <ChevronRight className="w-4 h-4" />
                    <span>הבא</span>
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleReset} disabled={isLoading}
                  className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700">
                  <RefreshCw className="w-4 h-4" />
                  <span>התחילו מחדש</span>
                </Button>
              </div>

              <div className="flex flex-col gap-3 items-end">
                {isMainSection && (
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-semibold text-gray-700">מאתגר לפיתרון</span>
                    <div className="flex gap-2">
                      {MAIN_STEPS.map((step, idx) => (
                        <div key={step} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                          MAIN_STEPS.indexOf(currentStep) > idx ? "bg-green-500 text-white"
                            : step === currentStep ? "bg-orange-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}>
                          {idx + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isPromptSection && (
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-semibold text-gray-700">פרומפט סופי</span>
                    <div className="w-16 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-orange-500 text-white">7</div>
                  </div>
                )}

                {isFinalSection && (
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs font-semibold text-gray-700">מוכנים לשיגור</span>
                    <div className="w-16 h-8 rounded-full flex items-center justify-center text-sm font-semibold bg-green-500 text-white">8</div>
                  </div>
                )}
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