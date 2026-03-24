
import React, { useState, useEffect } from "react";
import { ChatSession } from "@/entities/ChatSession";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Users,
  MapPin,
  Eye,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  User as UserIcon,
  Edit,
  Play,
  Monitor,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";

export default function Admin() {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSession, setSelectedSession] = useState(null);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    filterSessions();
  }, [sessions, searchTerm, statusFilter]);

  const checkAdminAccess = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      if (user.role !== 'admin') {
        alert('אין לך הרשאות אדמין');
        window.location.href = createPageUrl('ChatBot');
        return;
      }
      loadSessions();
    } catch (error) {
      alert('נדרשת התחברות כמנהלת. אנא התחברי תחילה.');
      await User.login();
    }
  };

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const allSessions = await ChatSession.list('-created_date', 100);
      setSessions(allSessions);
    } catch (error) {
      console.error("Error loading sessions:", error);
    }
    setIsLoading(false);
  };

  const filterSessions = () => {
    let filtered = sessions;

    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.family_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.family_location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.activity_idea?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(session =>
        statusFilter === "complete" ? session.is_complete : !session.is_complete
      );
    }

    setFilteredSessions(filtered);
  };

  const exportSessionData = (session) => {
    const exportText = `
מאתגר לפיתרון חינוכי - סיכום תהליך
תאריך הפקה: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: he })}
תאריך יצירה: ${format(new Date(session.created_date), "dd/MM/yyyy HH:mm", { locale: he })}
משתמש: ${session.user_email}

===========================================

🏢 פרטי יוצר/ת:
שם: ${session.family_name || "לא הוזן"}
בית ספר / ארגון: ${session.family_location || "לא הוזן"}
רקע חינוכי: ${session.family_info || "לא הוזן"}

===========================================

### הגדרת הבעיה ###

🎯 האתגר החינוכי:
${session.educational_challenge || "לא הוזן"}

👥 קהל היעד:
${session.target_audience || "לא הוזן"}

🤔 למי זה כואב?
${session.pain_point_users || "לא הוזן"}

🔍 הגורמים לבעיה:
${session.problem_causes || "לא הוזן"}

📉 סימפטומים (איך זה נראה בשטח):
${session.problem_symptoms || "לא הוזן"}

💡 הנחות יסוד:
${session.assumptions || "לא הוזן"}

===========================================

### המסגרת הפדגוגית ###
${session.pedagogical_framework || "לא הוזן"}

===========================================

### הפתרון המוצע ###

🧭 כיוון ראשוני לפתרון:
${session.activity_idea || "לא הוזן"}

✅ הפתרון המוסכם (לאחר הצעות שיפור):
${session.agreed_solution || "לא הוזן"}

📋 אפיון הפתרון:
${session.activity_description || "לא הוזן"}

===========================================

🚀 הפרומפט הסופי ליצירת האפליקציה:
${session.final_prompt || "לא נוצר פרומפט"}

===========================================
שלב אחרון: ${session.step}/9 | סטטוס: ${session.is_complete ? "הושלם" : "בתהליך"} | מזהה סשן: ${session.id}
    `.trim();

    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `פתרון_${session.family_name}_${format(new Date(session.created_date), "yyyy-MM-dd")}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-blue-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-blue-800 mb-2 flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-orange-600" />
                <Sparkles className="w-6 h-6 text-blue-600" />
                פאנל ניהול - מאתגר לפיתרון חינוכי
              </h1>
              <p className="text-blue-600">
                ברוכים הבאים {currentUser?.full_name} | סה"כ פתרונות: {sessions.length}
              </p>
              <p className="text-sm text-orange-700 font-medium mt-1">
                מערכת ליצירת פתרונות טכנולוגיים לאנשי חינוך 🏢
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadSessions} variant="outline">
                רענן נתונים
              </Button>
              <Link to={createPageUrl('Preview')}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Monitor className="w-4 h-4"/>
                  תצוגה מקדימה
                </Button>
              </Link>
              <Link to={createPageUrl('ChatBot')}>
                <Button variant="outline" className="flex items-center gap-2">
                  <Play className="w-4 h-4"/>
                  חזרה לבוט
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex gap-4 items-center flex-wrap">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="חיפוש לפי שם קבוצה, בית ספר או פתרון..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="complete">הושלמו</option>
                <option value="incomplete">בתהליך</option>
              </select>
            </div>

            <Badge variant="outline" className="mr-auto">
              מציג: {filteredSessions.length} מתוך {sessions.length}
            </Badge>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {session.family_name || "קבוצה ללא שם"}
                  </CardTitle>
                  <Badge variant={session.is_complete ? "default" : "secondary"}>
                    {session.is_complete ? (
                      <>
                        <CheckCircle className="w-3 h-3 ml-1" />
                        הושלם
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 ml-1" />
                        בתהליך
                      </>
                    )}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  {format(new Date(session.created_date), "dd/MM/yyyy HH:mm", { locale: he })}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {session.family_location && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{session.family_location}</span>
                  </div>
                )}

                {session.family_info && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="truncate">{session.family_info}</span>
                  </div>
                )}

                {session.activity_idea && (
                  <div className="text-sm">
                    <span className="font-medium">פתרון: </span>
                    <span className="truncate block">{session.activity_idea}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="w-4 h-4 text-gray-500" />
                  <span className="truncate">{session.user_email}</span>
                </div>

                <div className="text-sm text-gray-500">
                  שלב: {session.step}/9
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedSession(session)}
                    className="flex-1"
                  >
                    <Eye className="w-3 h-3 ml-1" />
                    צפה
                  </Button>
                  <Link
                    to={createPageUrl(`ChatBot?sessionId=${session.id}&adminMode=true`)}
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                  >
                    <Edit className="w-3 h-3 ml-1" />
                    ערוך
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => exportSessionData(session)}
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">לא נמצאו פתרונות מתאימים</p>
          </div>
        )}

        {/* Session Detail Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    פרטי פתרון - {selectedSession.family_name}
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSession(null)}
                  >
                    סגור
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">פרטי היוצר/ת</h3>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                        <p><strong>שם:</strong> {selectedSession.family_name || "לא הוזן"}</p>
                        <p><strong>בית ספר / ארגון:</strong> {selectedSession.family_location || "לא הוזן"}</p>
                        <p><strong>רקע חינוכי:</strong> {selectedSession.family_info || "לא הוזן"}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">הגדרת הבעיה</h3>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm max-h-48 overflow-y-auto space-y-2">
                        <p><strong>האתגר החינוכי:</strong> {selectedSession.educational_challenge || "לא הוזן"}</p>
                        <p><strong>קהל היעד:</strong> {selectedSession.target_audience || "לא הוזן"}</p>
                        <p><strong>למי זה כואב:</strong> {selectedSession.pain_point_users || "לא הוזן"}</p>
                        <p><strong>גורמים לבעיה:</strong> {selectedSession.problem_causes || "לא הוזן"}</p>
                        <p><strong>סימפטומים:</strong> {selectedSession.problem_symptoms || "לא הוזן"}</p>
                        <p><strong>הנחות יסוד:</strong> {selectedSession.assumptions || "לא הוזן"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                     <div>
                      <h3 className="font-semibold mb-2">המסגרת הפדגוגית</h3>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm max-h-32 overflow-y-auto">
                        {selectedSession.pedagogical_framework || "לא הוזן"}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">הפתרון המוצע</h3>
                      <div className="bg-gray-50 rounded-lg p-3 text-sm max-h-32 overflow-y-auto space-y-2">
                        <p><strong>כיוון ראשוני:</strong> {selectedSession.activity_idea || "לא הוזן"}</p>
                        <p><strong>הפתרון המוסכם:</strong> {selectedSession.agreed_solution || "לא הוזן"}</p>
                        <p><strong>אפיון הפתרון:</strong> {selectedSession.activity_description || "לא הוזן"}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">פרטים טכניים</h3>
                      <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
                        <p><strong>מזהה:</strong> {selectedSession.id}</p>
                        <p><strong>משתמש:</strong> {selectedSession.user_email}</p>
                        <p><strong>שלב:</strong> {selectedSession.step}/9</p>
                        <p><strong>תאריך:</strong> {format(new Date(selectedSession.created_date), "dd/MM/yyyy HH:mm", { locale: he })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedSession.final_prompt && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">הפרומפט הסופי</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportSessionData(selectedSession)}
                      >
                        <Download className="w-3 h-3 ml-1" />
                        יצא
                      </Button>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm max-h-64 overflow-y-auto whitespace-pre-wrap">
                      {selectedSession.final_prompt}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
