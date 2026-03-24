import React from "react";
import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";

export default function ChatMessage({ message, isBot = true, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className={`flex items-start gap-3 mb-4 ${isBot ? "" : "flex-row-reverse"}`}
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isBot 
          ? "bg-sky-200" 
          : "bg-gray-200"
      }`}>
        {isBot ? <Bot className="w-5 h-5 text-sky-700" /> : <User className="w-5 h-5 text-gray-700" />}
      </div>
      
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
        isBot 
          ? "bg-sky-100 text-cet-text-primary rounded-tl-none" 
          : "bg-white text-cet-text-primary border border-gray-200 rounded-tr-none"
      }`}>
        <div className="text-base leading-relaxed whitespace-pre-wrap">
          {message}
        </div>
      </div>
    </motion.div>
  );
}