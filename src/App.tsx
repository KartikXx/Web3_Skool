import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Quest from "./pages/Quest";
import Quests from "./pages/Quests";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Leaderboard from "./pages/Leaderboard";
import WalletDebug from "./pages/WalletDebug";
import NotFound from "./pages/NotFound";
import InteractiveQuizPage from "./pages/quests/InteractiveQuiz";
import TransactionSimulationPage from "./pages/quests/TransactionSimulation";
import BlockchainInteractivePage from "./pages/quests/BlockchainInteractive";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { FirebaseProvider } from "./contexts/FirebaseContext";
import { Web3Provider } from "./contexts/Web3Context";
import { QuestProvider } from "./contexts/QuestContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="blockchain-heroes-theme">
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <FirebaseProvider>
            <Web3Provider>
              <QuestProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <AnimatePresence mode="wait">
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Index />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/sign-in" element={<SignIn />} />
                      <Route path="/sign-up" element={<SignUp />} />
                      <Route path="/wallet-debug" element={<WalletDebug />} />
                      <Route path="/leaderboard" element={<Leaderboard />} />
                      
                      {/* Protected routes - require authentication */}
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute>
                            <Dashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/quests" 
                        element={
                          <ProtectedRoute>
                            <Quests />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/quest/:questId" 
                        element={
                          <ProtectedRoute>
                            <Quest />
                          </ProtectedRoute>
                        } 
                      />
                      {/* Interactive quiz route */}
                      <Route 
                        path="/quests/interactive-quiz" 
                        element={
                          <ProtectedRoute>
                            <InteractiveQuizPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/quests/interactive-quiz/:questId" 
                        element={
                          <ProtectedRoute>
                            <InteractiveQuizPage />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Transaction simulation route */}
                      <Route 
                        path="/quests/transaction-simulation" 
                        element={
                          <ProtectedRoute>
                            <TransactionSimulationPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/quests/transaction-simulation/:questId" 
                        element={
                          <ProtectedRoute>
                            <TransactionSimulationPage />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Blockchain interactive quest route */}
                      <Route 
                        path="/quests/blockchain-interactive" 
                        element={
                          <ProtectedRoute>
                            <BlockchainInteractivePage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/quests/blockchain-interactive/:questId" 
                        element={
                          <ProtectedRoute>
                            <BlockchainInteractivePage />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Blockchain 101 route - also uses the interactive page */}
                      <Route 
                        path="/quests/blockchain-101" 
                        element={
                          <ProtectedRoute>
                            <BlockchainInteractivePage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/quests/blockchain-101/:questId" 
                        element={
                          <ProtectedRoute>
                            <BlockchainInteractivePage />
                          </ProtectedRoute>
                        } 
                      />
                      
                      {/* Catch-all route */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AnimatePresence>
                </TooltipProvider>
              </QuestProvider>
            </Web3Provider>
          </FirebaseProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
