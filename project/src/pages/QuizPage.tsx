import React, { useState, useEffect, useMemo } from "react";
import { questionBank } from "../utils/data/questions";

type Question = {
  question: string;
  options: string[];
  answer: string;
  difficulty: "all"|"easy" | "medium" | "hard";
};

type User = {
  username: string;
  password: string;
  fullname: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  institution: string;
};

type ScoreEntry = {
  username: string;
  fullname: string;
  category: string;
  difficulty: string;
  score: number;
  total: number;
  percentage: number;
  timeTaken: number;
  date: string;
};

const TIME_PER_QUESTION = 60;

const QuizPage: React.FC = () => {
  const [mode, setMode] = useState<
    | "register"
    | "login"
    | "forgotPassword"
    | "dashboard"
    | "quiz"
    | "result"
    | "review"
    | "leaderboard"
  >("register");

  const [form, setForm] = useState({
    username: "",
    password: "",
    fullname: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    institution: "",
  });

  const [fpStep, setFpStep] = useState<"email" | "reset">("email");
  const [fpEmail, setFpEmail] = useState("");
  const [fpUsername, setFpUsername] = useState("");
  const [fpNewPass, setFpNewPass] = useState("");
  const [fpConfirmPass, setFpConfirmPass] = useState("");
  const [fpError, setFpError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showFpPassword, setShowFpPassword] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [difficulty, setDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [numQuestions, setNumQuestions] = useState(50);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [animateQuestion, setAnimateQuestion] = useState(false);

  const getUsers = (): User[] => JSON.parse(localStorage.getItem("users") || "[]");
  const saveUser = (user: User) => {
    const users = getUsers();
    localStorage.setItem("users", JSON.stringify([...users, user]));
  };
  const updateUserPassword = (username: string, newPassword: string) => {
    const users = getUsers();
    const updated = users.map((u) =>
      u.username === username ? { ...u, password: newPassword } : u
    );
    localStorage.setItem("users", JSON.stringify(updated));
  };

  const getScores = (): ScoreEntry[] =>
    JSON.parse(localStorage.getItem("quizScores") || "[]");
  const saveScore = (entry: ScoreEntry) => {
    const all = getScores();
    all.push(entry);
    localStorage.setItem("quizScores", JSON.stringify(all));
    setScores(all);
  };

  useEffect(() => {
    setScores(getScores());
  }, []);

  const resetForm = () =>
    setForm({
      username: "",
      password: "",
      fullname: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      institution: "",
    });

  const handleSubmit = () => {
    const s = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
      0
    );
    const taken = totalTime - timeLeft;
    setScore(s);

    if (currentUser) {
      const entry: ScoreEntry = {
        username: currentUser.username,
        fullname: currentUser.fullname,
        category: selectedCategory,
        difficulty,
        score: s,
        total: questions.length,
        percentage: Math.round((s / questions.length) * 100),
        timeTaken: taken,
        date: new Date().toISOString(),
      };
      saveScore(entry);
    }
    setMode("result");
  };

  useEffect(() => {
    if (mode !== "quiz") return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const startQuiz = () => {
    if (!selectedCategory) {
      alert("Please select a category");
      return;
    }
    let q: Question[] = questionBank[selectedCategory] || [];
    if (difficulty !== "all") q = q.filter((x) => x.difficulty === difficulty);
    if (q.length === 0) {
      alert("No questions found!");
      return;
    }
    q = [...q].sort(() => Math.random() - 0.5).slice(0, numQuestions);
    const t = q.length * TIME_PER_QUESTION;
    setQuestions(q);
    setCurrent(0);
    setAnswers({});
    setTimeLeft(t);
    setTotalTime(t);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setShowFeedback(false);
    setMode("quiz");
  };

  const handleAnswer = (option: string) => {
    if (answers[current]) return;
    setAnswers((prev) => ({ ...prev, [current]: option }));
    setShowFeedback(true);
    const correct = option === questions[current].answer;
    if (correct) {
      setStreak((s) => {
        const ns = s + 1;
        setMaxStreak((m) => Math.max(m, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }
  };

  const goNext = () => {
    setAnimateQuestion(true);
    setTimeout(() => setAnimateQuestion(false), 300);
    setShowFeedback(false);
    if (current === questions.length - 1) handleSubmit();
    else setCurrent(current + 1);
  };

  const goPrev = () => {
    setAnimateQuestion(true);
    setTimeout(() => setAnimateQuestion(false), 300);
    setShowFeedback(false);
    if (current > 0) setCurrent(current - 1);
  };

  // ── DELETE SCORE ──────────────────────────────────────────────────────────
  const handleDeleteScore = (displayIndex: number) => {
    const allScores = getScores();
    // userScores reversed slice(-5) मधला index → original array मधला index शोधा
    const userOnly = allScores
      .map((s, globalIdx) => ({ ...s, globalIdx }))
      .filter((s) => s.username === currentUser?.username);

    const reversed = userOnly.slice(-5).reverse();
    const target = reversed[displayIndex];

    if (!target) return;

    const updated = allScores.filter((_, i) => i !== target.globalIdx);
    localStorage.setItem("quizScores", JSON.stringify(updated));
    setScores(updated);
  };

  // ── REGISTER ──────────────────────────────────────────────────────────────
  const handleRegister = () => {
    const { username, password, fullname, email, phone, dob, gender, institution } = form;
    if (!username.trim() || !password.trim() || !fullname.trim() || !email.trim()) {
      alert("Please fill all required fields (*)");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      alert("Enter a valid email address");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    const users = getUsers();
    if (users.some((u) => u.username === username.trim())) {
      alert("Username already exists. Try a different one.");
      return;
    }
    if (users.some((u) => u.email === email.trim())) {
      alert("Email already registered.");
      return;
    }
    saveUser({
      username: username.trim(),
      password,
      fullname: fullname.trim(),
      email: email.trim(),
      phone: phone.trim(),
      dob,
      gender,
      institution: institution.trim(),
    });
    alert("✅ Registered Successfully! Please login.");
    resetForm();
    setMode("login");
  };

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const handleLogin = () => {
    const users = getUsers();
    const username = form.username.trim();
    const password = form.password.trim();
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) {
      alert("Invalid username or password");
      return;
    }
    setCurrentUser(user);
    resetForm();
    setMode("dashboard");
  };

  // ── FORGOT PASSWORD ────────────────────────────────────────────────────────
  const handleForgotStep1 = () => {
    setFpError("");
    const users = getUsers();
    const user = users.find((u) => u.email === fpEmail.trim());
    if (!user) {
      setFpError("No account found with this email.");
      return;
    }
    setFpUsername(user.username);
    setFpStep("reset");
  };

  const handleResetPassword = () => {
    setFpError("");
    if (fpNewPass.length < 6) {
      setFpError("Password must be at least 6 characters.");
      return;
    }
    if (fpNewPass !== fpConfirmPass) {
      setFpError("Passwords do not match.");
      return;
    }
    updateUserPassword(fpUsername, fpNewPass);
    alert("✅ Password reset successfully! Please login.");
    setFpStep("email");
    setFpEmail("");
    setFpNewPass("");
    setFpConfirmPass("");
    setFpUsername("");
    setMode("login");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMode("login");
  };

  const userScores = useMemo(
    () =>
      currentUser ? scores.filter((s) => s.username === currentUser.username) : [],
    [scores, currentUser]
  );

  const userStats = useMemo(() => {
    if (userScores.length === 0)
      return { attempts: 0, avg: 0, best: 0, totalCorrect: 0 };
    const avg = Math.round(
      userScores.reduce((a, s) => a + s.percentage, 0) / userScores.length
    );
    const best = Math.max(...userScores.map((s) => s.percentage));
    const totalCorrect = userScores.reduce((a, s) => a + s.score, 0);
    return { attempts: userScores.length, avg, best, totalCorrect };
  }, [userScores]);

  const leaderboard = useMemo(() => {
    const map: Record<
      string,
      { fullname: string; total: number; attempts: number; best: number }
    > = {};
    scores.forEach((s) => {
      if (!map[s.username]) {
        map[s.username] = { fullname: s.fullname, total: 0, attempts: 0, best: 0 };
      }
      map[s.username].total += s.percentage;
      map[s.username].attempts += 1;
      map[s.username].best = Math.max(map[s.username].best, s.percentage);
    });
    return Object.entries(map)
      .map(([username, v]) => ({
        username,
        fullname: v.fullname,
        avg: Math.round(v.total / v.attempts),
        attempts: v.attempts,
        best: v.best,
      }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 10);
  }, [scores]);

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${("0" + (s % 60)).slice(-2)}`;

  // ══════════════════════════════════════════════════════════════════════════
  // REGISTER PAGE
  // ══════════════════════════════════════════════════════════════════════════
  if (mode === "register") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl">
              🎓
            </div>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-blue-100 text-sm mt-1">Join thousands of quiz takers!</p>
          </div>

          <div className="p-8 space-y-4">
            <p className="text-xs text-gray-500">
              Fields marked <span className="text-red-500 font-bold">*</span> are required
            </p>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Enter your full name"
                value={form.fullname}
                className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl outline-none transition text-sm"
                onChange={(e) => setForm({ ...form, fullname: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl outline-none transition text-sm"
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="Choose a unique username"
                value={form.username}
                className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl outline-none transition text-sm"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl outline-none transition text-sm pr-12"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPassword ? "👁" : "👁"}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={form.phone}
                className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl outline-none transition text-sm"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={form.dob}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl outline-none transition text-sm"
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">
                  Gender
                </label>
                <select
                  value={form.gender}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-xl outline-none transition text-sm"
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold text-sm hover:from-blue-500 hover:to-indigo-500 transition shadow-lg shadow-blue-200 mt-2"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <span
                className="text-blue-500 font-semibold cursor-pointer hover:underline"
                onClick={() => setMode("login")}
              >
                Login here
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // LOGIN PAGE
  // ══════════════════════════════════════════════════════════════════════════
  if (mode === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-white/50">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl backdrop-blur-md shadow-lg">
              🔐
            </div>
            <h1 className="text-3xl font-extrabold">Welcome Back!</h1>
            <p className="text-blue-100 text-sm mt-2">Login to continue your quiz journey</p>
          </div>

          <div className="p-8 space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Username</label>
              <input
                placeholder="Enter username"
                value={form.username}
                className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3 rounded-2xl outline-none transition-all duration-300 text-sm shadow-sm"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={form.password}
                  className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3 pr-12 rounded-2xl outline-none transition-all duration-300 text-sm shadow-sm"
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg transition"
                >
                  {showPassword ? "👁" : "👁"}
                </button>
              </div>
            </div>

            <div className="text-right -mt-1">
              <span
                className="text-sm text-indigo-600 font-semibold cursor-pointer hover:underline"
                onClick={() => {
                  setFpStep("email");
                  setFpEmail("");
                  setFpError("");
                  setMode("forgotPassword");
                }}
              >
                Forgot Password?
              </span>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3.5 rounded-2xl font-bold text-sm hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg shadow-blue-200 hover:scale-[1.02]"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-500">
              New here?{" "}
              <span
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
                onClick={() => setMode("register")}
              >
                Create account
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FORGOT PASSWORD PAGE
  // ══════════════════════════════════════════════════════════════════════════
  if (mode === "forgotPassword") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-white/50">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-8 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 text-4xl backdrop-blur-md shadow-lg">
              🔑
            </div>
            <h1 className="text-3xl font-extrabold">Forgot Password</h1>
            <p className="text-blue-100 text-sm mt-2">
              {fpStep === "email" ? "Enter your registered email to continue" : "Set your new password"}
            </p>
          </div>

          <div className="p-8 space-y-5">
            <div>
              <div className="flex gap-2 mb-2">
                <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${fpStep === "email" ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-green-500"}`}></div>
                <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${fpStep === "reset" ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gray-200"}`}></div>
              </div>
              <p className="text-xs text-gray-400 text-center">
                Step {fpStep === "email" ? "1" : "2"} of 2 — {fpStep === "email" ? "Verify Email" : "Reset Password"}
              </p>
            </div>

            {fpStep === "email" ? (
              <>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Registered Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={fpEmail}
                    className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3 rounded-2xl outline-none transition-all duration-300 text-sm shadow-sm"
                    onChange={(e) => setFpEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleForgotStep1()}
                  />
                </div>
                {fpError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-2xl">{fpError}</div>
                )}
                <button
                  onClick={handleForgotStep1}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3.5 rounded-2xl font-bold text-sm hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg shadow-blue-200 hover:scale-[1.02]"
                >
                  Verify Email →
                </button>
              </>
            ) : (
              <>
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-4 rounded-2xl">
                  ✅ Email verified successfully for <strong>{fpUsername}</strong>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showFpPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={fpNewPass}
                      className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3 pr-12 rounded-2xl outline-none transition-all duration-300 text-sm shadow-sm"
                      onChange={(e) => setFpNewPass(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowFpPassword(!showFpPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg"
                    >
                      {showFpPassword ? "👁" : "👁"}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Confirm Password</label>
                  <input
                    type={showFpPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={fpConfirmPass}
                    className="w-full border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 p-3 rounded-2xl outline-none transition-all duration-300 text-sm shadow-sm"
                    onChange={(e) => setFpConfirmPass(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
                  />
                </div>

                {fpNewPass.length > 0 && (
                  <div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-full transition-all ${
                            fpNewPass.length >= i * 3
                              ? i === 1 ? "bg-red-400" : i === 2 ? "bg-yellow-400" : i === 3 ? "bg-blue-400" : "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {fpNewPass.length < 4 ? "Weak" : fpNewPass.length < 7 ? "Fair" : fpNewPass.length < 10 ? "Good" : "Strong"} password
                    </p>
                  </div>
                )}

                {fpError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-2xl">{fpError}</div>
                )}

                <button
                  onClick={handleResetPassword}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3.5 rounded-2xl font-bold text-sm hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg shadow-blue-200 hover:scale-[1.02]"
                >
                  Reset Password
                </button>
              </>
            )}

            <button
              onClick={() => setMode("login")}
              className="w-full text-sm text-gray-500 hover:text-gray-700 py-2 transition"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ══════════════════════════════════════════════════════════════════════════
  if (mode === "dashboard" && currentUser)
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-6 flex justify-between items-center shadow-lg text-white mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
              🎓
            </div>
            <div>
              <p className="text-xs text-blue-100 font-medium uppercase tracking-wide">Welcome back</p>
              <h2 className="text-2xl font-bold">{currentUser.fullname}</h2>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-xl text-sm font-medium transition"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Attempts", value: userStats.attempts, icon: "📝", color: "from-blue-400 to-blue-500" },
            { label: "Avg Score", value: userStats.avg + "%", icon: "📊", color: "from-purple-400 to-purple-500" },
            { label: "Best Score", value: userStats.best + "%", icon: "🏆", color: "from-yellow-400 to-orange-500" },
            { label: "Total Correct", value: userStats.totalCorrect, icon: "✅", color: "from-green-400 to-green-500" },
          ].map((s) => (
            <div key={s.label} className={`bg-gradient-to-br ${s.color} p-5 rounded-2xl shadow text-center text-white`}>
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-white/80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Start Quiz */}
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">▶️</span>
              <h3 className="text-xl font-bold text-gray-800">Start a New Quiz</h3>
            </div>
            <p className="text-gray-500 text-sm">Pick a subject, difficulty and number of questions.</p>

            <div>
              <label className="text-sm font-semibold text-gray-700">Category</label>
              <select
                className="w-full border-2 border-gray-200 focus:border-blue-500 p-2.5 rounded-xl mt-1 text-sm outline-none"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Choose a subject</option>
                {Object.keys(questionBank).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Difficulty</label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {(["all", "easy", "medium", "hard"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`py-2 rounded-xl text-xs font-bold capitalize border-2 transition ${
                      difficulty === d
                        ? d === "easy" ? "bg-green-500 border-green-500 text-white"
                          : d === "medium" ? "bg-yellow-500 border-yellow-500 text-white"
                          : d === "hard" ? "bg-red-500 border-red-500 text-white"
                          : "bg-blue-500 border-blue-500 text-white"
                        : "border-gray-200 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                <label>Number of Questions</label>
                <span className="bg-blue-100 text-blue-500 px-2 py-0.5 rounded-full text-xs font-bold">
                  {numQuestions} Q
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5</span>
                <span>50</span>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-xl font-bold text-sm hover:from-blue-600 hover:to-indigo-700 transition shadow-md shadow-blue-200"
            >
              ▶ Start Quiz
            </button>

            <button
              onClick={() => setMode("leaderboard")}
              className="w-full border-2 border-yellow-400 text-yellow-600 py-2.5 rounded-xl font-semibold text-sm hover:bg-yellow-50 transition"
            >
              🏆 View Leaderboard
            </button>
          </div>

          {/* ── RECENT ATTEMPTS ── */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-bold mb-4 text-gray-800">🕒 Recent Attempts</h3>
            {userScores.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-5xl mb-3">📭</p>
                <p className="text-gray-400 text-sm">No attempts yet. Start your first quiz!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userScores
                  .slice(-5)
                  .reverse()
                  .map((s, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center border-2 border-gray-100 p-3.5 rounded-xl hover:border-blue-200 transition group"
                    >
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{s.category}</p>
                        <p className="text-xs text-gray-400 mt-0.5 capitalize">
                          {s.difficulty} • {new Date(s.date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-bold text-gray-800 text-sm">{s.score}/{s.total}</p>
                          <p className={`text-sm font-bold ${
                            s.percentage >= 70 ? "text-green-600"
                            : s.percentage >= 40 ? "text-yellow-600"
                            : "text-red-500"
                          }`}>
                            {s.percentage}%
                          </p>
                        </div>

                        {/* 🗑️ DELETE BUTTON */}
                        <button
                          onClick={() => handleDeleteScore(i)}
                          title="Delete this attempt"
                          className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );

  // ══════════════════════════════════════════════════════════════════════════
  // QUIZ PAGE
  // ══════════════════════════════════════════════════════════════════════════
  if (mode === "quiz" && questions.length > 0) {
    const q = questions[current];
    const userAns = answers[current];
    const answered = !!userAns;
    const lowTime = timeLeft < 30;
    const progress = ((current + 1) / questions.length) * 100;
    const timerPct = (timeLeft / totalTime) * 100;

    const diffColor =
      q.difficulty === "easy" ? "bg-green-100 text-green-700"
      : q.difficulty === "medium" ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4">
        <div className={`w-full max-w-2xl transition-all duration-300 ${animateQuestion ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          <div className="flex justify-between items-center mb-4 text-white">
            <div className="flex items-center gap-3">
              <span className="bg-white/10 backdrop-blur px-3 py-1.5 rounded-full text-sm font-bold">
                Q {current + 1} / {questions.length}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${diffColor}`}>
                {q.difficulty}
              </span>
              {streak >= 2 && (
                <span className="bg-orange-500/20 text-orange-300 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                  🔥 {streak} Streak!
                </span>
              )}
            </div>
            <div className={`font-mono font-bold text-lg px-4 py-1.5 rounded-full border-2 transition-all ${lowTime ? "border-red-400 text-red-400 animate-pulse bg-red-900/20" : "border-white/20 text-white bg-white/10"}`}>
              ⏱ {formatTime(timeLeft)}
            </div>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full mb-1 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full mb-6 overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-1000 ${lowTime ? "bg-red-500" : "bg-green-400"}`} style={{ width: `${timerPct}%` }} />
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-5">
              <span className="bg-indigo-500/20 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-400/30">
                📚 {selectedCategory}
              </span>
              <span className="text-white/40 text-xs">
                {Object.keys(answers).length}/{questions.length} answered
              </span>
            </div>

            <p className="text-white text-lg font-semibold leading-relaxed mb-6">{q.question}</p>

            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isCorrect = opt === q.answer;
                const isSelected = userAns === opt;
                let cls = "bg-white/5 border-white/20 text-white hover:bg-white/15 hover:border-white/40 cursor-pointer";
                if (showFeedback && answered) {
                  if (isCorrect) cls = "bg-green-500/20 border-green-400 text-green-200 shadow-lg shadow-green-900/30";
                  else if (isSelected) cls = "bg-red-500/20 border-red-400 text-red-200 shadow-lg shadow-red-900/30";
                  else cls = "bg-white/3 border-white/10 text-white/40 cursor-not-allowed";
                } else if (isSelected) {
                  cls = "bg-indigo-500/30 border-indigo-400 text-indigo-100 shadow-lg shadow-indigo-900/30";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    disabled={answered}
                    className={`w-full text-left p-4 border-2 rounded-2xl transition-all duration-200 flex items-center gap-3 ${cls}`}
                  >
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${showFeedback && answered ? isCorrect ? "bg-green-500 text-white" : isSelected ? "bg-red-500 text-white" : "bg-white/10 text-white/40" : isSelected ? "bg-indigo-500 text-white" : "bg-white/10 text-white/60"}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 text-sm font-medium">{opt}</span>
                    {showFeedback && isCorrect && <span className="text-green-400 text-lg">✓</span>}
                    {showFeedback && isSelected && !isCorrect && <span className="text-red-400 text-lg">✗</span>}
                  </button>
                );
              })}
            </div>

            {showFeedback && answered && (
              <div className={`mt-4 p-4 rounded-2xl border flex items-start gap-3 ${userAns === q.answer ? "bg-green-500/10 border-green-500/30 text-green-300" : "bg-red-500/10 border-red-500/30 text-red-300"}`}>
                <span className="text-xl">{userAns === q.answer ? "🎉" : "💡"}</span>
                <div>
                  <p className="font-bold text-sm">{userAns === q.answer ? "Correct!" : "Incorrect"}</p>
                  {userAns !== q.answer && (
                    <p className="text-xs mt-1 text-white/70">
                      Correct answer: <span className="font-semibold text-green-300">{q.answer}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6 gap-3">
              <button
                disabled={current === 0}
                onClick={goPrev}
                className="flex-1 py-3 rounded-2xl border-2 border-white/20 text-white/70 font-semibold text-sm hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>
              <button
                onClick={goNext}
                className="flex-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-sm hover:from-blue-600 hover:to-indigo-600 transition shadow-lg shadow-indigo-900/50"
              >
                {current === questions.length - 1 ? "✅ Submit Quiz" : "Next →"}
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-5 flex-wrap">
            {questions.map((_, i) => (
              <div
                key={i}
                onClick={() => { setShowFeedback(false); setCurrent(i); }}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all border ${
                  i === current ? "bg-white border-white scale-125"
                  : answers[i] ? answers[i] === questions[i].answer ? "bg-green-400 border-green-400" : "bg-red-400 border-red-400"
                  : "bg-white/20 border-white/30 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RESULT
  // ══════════════════════════════════════════════════════════════════════════
  if (mode === "result") {
    const pct = Math.round((score / questions.length) * 100);
    const taken = totalTime - timeLeft;
    const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "🎉" : pct >= 40 ? "👍" : "💪";
    const msg = pct >= 80 ? "Outstanding! 🌟" : pct >= 60 ? "Great job! Keep it up." : pct >= 40 ? "Good effort! Practice more." : "Don't give up — review and try again!";

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center text-white space-y-5">
          <div className="text-7xl animate-bounce">{emoji}</div>
          <h2 className="text-3xl font-bold">Quiz Complete!</h2>

          <div className="relative w-36 h-36 mx-auto">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={pct >= 70 ? "#4ade80" : pct >= 40 ? "#facc15" : "#f87171"}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-3xl font-bold">{pct}%</p>
              <p className="text-white/60 text-xs">{score}/{questions.length}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm">
            {[
              { label: "Time", value: formatTime(taken) },
              { label: "Streak", value: `🔥 ${maxStreak}` },
              { label: "Wrong", value: questions.length - score },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 border border-white/20 p-3 rounded-2xl">
                <p className="text-white/50 text-xs mb-1">{s.label}</p>
                <p className="font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          <p className="text-white/70 italic text-sm">{msg}</p>

          <div className="space-y-3">
            <button onClick={() => setMode("review")} className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 font-bold text-sm hover:from-blue-600 hover:to-indigo-600 transition shadow-lg">
              📝 Review Answers
            </button>
            <button onClick={() => setMode("leaderboard")} className="w-full py-3 rounded-2xl border-2 border-yellow-400/60 text-yellow-300 font-semibold text-sm hover:bg-yellow-400/10 transition">
              🏆 Leaderboard
            </button>
            <button onClick={() => setMode("dashboard")} className="w-full py-3 rounded-2xl border-2 border-white/20 text-white/70 font-semibold text-sm hover:bg-white/10 transition">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // REVIEW
  // ══════════════════════════════════════════════════════════════════════════
  if (mode === "review")
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">📝 Review Answers</h2>
            <button onClick={() => setMode("result")} className="px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition">
              ← Back
            </button>
          </div>
          {questions.map((q, i) => {
            const ua = answers[i];
            const correct = ua === q.answer;
            return (
              <div key={i} className={`border-2 p-5 rounded-2xl ${correct ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{correct ? "✅" : "❌"}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 mb-2">{i + 1}. {q.question}</p>
                    <p className="text-sm">
                      <span className="text-gray-500">Your answer: </span>
                      <span className={`font-semibold ${correct ? "text-green-600" : "text-red-600"}`}>{ua || "Not answered"}</span>
                    </p>
                    {!correct && (
                      <p className="text-sm mt-1">
                        <span className="text-gray-500">Correct: </span>
                        <span className="font-semibold text-green-600">{q.answer}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );

  // ══════════════════════════════════════════════════════════════════════════
  // LEADERBOARD
  // ══════════════════════════════════════════════════════════════════════════
  if (mode === "leaderboard")
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">🏆 Leaderboard</h2>
            <button onClick={() => setMode("dashboard")} className="px-4 py-2 rounded-xl border-2 border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-100 transition">
              ← Back
            </button>
          </div>
          {leaderboard.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">🏅</p>
              <p className="text-gray-400">No scores yet. Be the first!</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                  <tr>
                    <th className="p-3 text-left">Rank</th>
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-right">Avg %</th>
                    <th className="p-3 text-right">Best %</th>
                    <th className="p-3 text-right">Tries</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((row, i) => (
                    <tr key={row.username} className={`border-t border-gray-100 ${currentUser?.username === row.username ? "bg-yellow-50 font-semibold" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                      <td className="p-3 font-bold">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</td>
                      <td className="p-3 text-gray-800">
                        {row.fullname}
                        {currentUser?.username === row.username && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>
                        )}
                      </td>
                      <td className="p-3 text-right font-bold text-gray-800">{row.avg}%</td>
                      <td className="p-3 text-right text-gray-600">{row.best}%</td>
                      <td className="p-3 text-right text-gray-400">{row.attempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );

  return null;
};

export default QuizPage;