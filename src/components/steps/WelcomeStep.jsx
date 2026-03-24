import React from "react";
import { motion } from "framer-motion";
import { Wand2, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WelcomeStep({ onNext }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-8"
      >
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold gradient-text">
            שלום וברוכים הבאים!
          </h2>
          <p className="text-lg text-cet-text-secondary max-w-2xl mx-auto">
            אני כאן כדי לעזור לכם להפוך רעיון לאפליקציה מגניבה, צעד אחר צעד.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 text-center">
          {/* Card 1: Our Goal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full bg-white/50">
              <CardHeader>
                <div className="mx-auto bg-orange-100 rounded-full p-3 w-fit">
                  <Target className="w-8 h-8 text-orange-600"/>
                </div>
                <CardTitle className="pt-2 text-xl font-bold text-cet-dark-blue">המטרה שלנו</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cet-text-secondary">
                  להדריך אתכם בתהליך קצר ומהנה של מספר שלבים פשוטים, 
                  שבסופו יהיה לכם פרומפט מדויק לבניית הפתרון שלכם.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2: Vibe Coding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full bg-white/50">
              <CardHeader>
                <div className="mx-auto bg-sky-100 rounded-full p-3 w-fit">
                  <Wand2 className="w-8 h-8 text-sky-600"/>
                </div>
                <CardTitle className="pt-2 text-xl font-bold text-cet-dark-blue">מה זה Vibe Coding?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-cet-text-secondary">
                  זה כלי חדש שיוצר אפליקציות במהירות על בסיס תיאור טקסט פשוט, בלי צורך לכתוב קוד. 
                  אתם מסבירים מה אתם רוצים, וזה הופך לאפליקציה פועלת! 🚀
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <motion.div 
          className="flex justify-center pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onNext}
            size="lg"
            variant="outline"
            className="bg-white border-2 border-cet-secondary-blue text-cet-secondary-blue hover:bg-cet-light-blue hover:text-cet-primary-blue hover:border-cet-primary-blue text-lg font-bold"
          >
            <Users className="w-5 h-5 ml-2" />
            בואו נתחיל!
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}