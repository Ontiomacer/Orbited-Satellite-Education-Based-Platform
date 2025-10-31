import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Trophy, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Sparkles,
  Target,
  Loader2,
  RotateCcw
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import GlassPanel from './GlassPanel';
import { generateSatelliteQuiz } from '../services/satelliteAiService';

interface SatelliteQuizWidgetProps {
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
  className?: string;
}

interface QuizState {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer: number | null;
  showResult: boolean;
  score: number;
  totalQuestions: number;
}

const SatelliteQuizWidget = ({ 
  difficulty = 'medium',
  topic,
  className = ""
}: SatelliteQuizWidgetProps) => {
  const [quiz, setQuiz] = useState<QuizState>({
    question: '',
    options: [],
    correctAnswer: 0,
    explanation: '',
    userAnswer: null,
    showResult: false,
    score: 0,
    totalQuestions: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNewQuestion = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await generateSatelliteQuiz(difficulty, topic);
      
      if (result.success) {
        setQuiz(prev => ({
          question: result.question,
          options: result.options,
          correctAnswer: result.correctAnswer,
          explanation: result.explanation,
          userAnswer: null,
          showResult: false,
          score: prev.score,
          totalQuestions: prev.totalQuestions
        }));
      } else {
        setError(result.error || 'Failed to generate quiz question');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Load initial question
  useEffect(() => {
    fetchNewQuestion();
  }, [difficulty, topic]);

  const handleAnswerSelect = (answerIndex: number) => {
    if (quiz.showResult) return;
    
    setQuiz(prev => ({
      ...prev,
      userAnswer: answerIndex,
      showResult: true,
      score: answerIndex === prev.correctAnswer ? prev.score + 1 : prev.score,
      totalQuestions: prev.totalQuestions + 1
    }));
  };

  const nextQuestion = () => {
    fetchNewQuestion();
  };

  const resetScore = () => {
    setQuiz(prev => ({
      ...prev,
      score: 0,
      totalQuestions: 0
    }));
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-400/30';
      case 'hard': return 'text-red-400 border-red-400/30';
      default: return 'text-yellow-400 border-yellow-400/30';
    }
  };

  const getScoreColor = () => {
    if (quiz.totalQuestions === 0) return 'text-muted-foreground';
    const percentage = (quiz.score / quiz.totalQuestions) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <GlassPanel className={`hover:shadow-glow transition-all duration-300 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400/20 to-blue-500/20 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.3 }}
          >
            <Brain className="w-5 h-5 text-purple-400" />
          </motion.div>
          <div>
            <h3 className="text-lg font-semibold">Space Quiz</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${getDifficultyColor()}`}>
                <Target className="w-2.5 h-2.5 mr-1" />
                {difficulty}
              </Badge>
              <Badge variant="outline" className="text-xs border-purple-400/30 text-purple-400">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                AI Generated
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {quiz.totalQuestions > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetScore}
              className="hover:bg-purple-400/10 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchNewQuestion}
            disabled={loading}
            className="hover:bg-purple-400/10"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Score Display */}
      {quiz.totalQuestions > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-background/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Score</span>
          </div>
          <span className={`text-sm font-bold ${getScoreColor()}`}>
            {quiz.score}/{quiz.totalQuestions} ({Math.round((quiz.score / quiz.totalQuestions) * 100)}%)
          </span>
        </div>
      )}

      {/* Quiz Content */}
      <div className="min-h-[300px]">
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-3"
          >
            <XCircle className="w-12 h-12 text-red-400" />
            <p className="text-sm text-red-400">Failed to load quiz</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNewQuestion}
              className="text-xs"
            >
              Try Again
            </Button>
          </motion.div>
        ) : loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full space-y-3"
          >
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            <p className="text-sm text-muted-foreground">Generating quiz question...</p>
          </motion.div>
        ) : quiz.question ? (
          <div className="space-y-4">
            {/* Question */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-background/40 rounded-lg border border-purple-400/20"
            >
              <h4 className="text-sm font-medium leading-relaxed">
                {quiz.question}
              </h4>
            </motion.div>

            {/* Options */}
            <div className="space-y-2">
              <AnimatePresence>
                {quiz.options.map((option, index) => {
                  const isSelected = quiz.userAnswer === index;
                  const isCorrect = index === quiz.correctAnswer;
                  const showResult = quiz.showResult;
                  
                  let buttonClass = "w-full p-3 text-left text-sm rounded-lg border transition-all duration-200 ";
                  
                  if (showResult) {
                    if (isCorrect) {
                      buttonClass += "bg-green-500/20 border-green-500/40 text-green-300";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "bg-red-500/20 border-red-500/40 text-red-300";
                    } else {
                      buttonClass += "bg-background/30 border-border/30 text-muted-foreground";
                    }
                  } else {
                    buttonClass += "bg-background/30 border-border/30 hover:bg-purple-400/10 hover:border-purple-400/30 text-foreground";
                  }

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={buttonClass}
                      whileHover={!showResult ? { scale: 1.02 } : {}}
                      whileTap={!showResult ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          showResult && isCorrect 
                            ? 'border-green-500 bg-green-500/20' 
                            : showResult && isSelected && !isCorrect
                            ? 'border-red-500 bg-red-500/20'
                            : 'border-muted-foreground/30'
                        }`}>
                          {showResult && isCorrect && <CheckCircle className="w-4 h-4 text-green-400" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400" />}
                          {!showResult && <span className="text-xs font-medium">{String.fromCharCode(65 + index)}</span>}
                        </div>
                        <span className="flex-1">{option}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {quiz.showResult && quiz.explanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg"
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="text-sm font-medium text-blue-300 mb-1">Explanation</h5>
                      <p className="text-sm text-foreground/90 leading-relaxed">
                        {quiz.explanation}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next Question Button */}
            {quiz.showResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={nextQuestion}
                  disabled={loading}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Next Question
                      <RefreshCw className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-3"
          >
            <Brain className="w-12 h-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No quiz available</p>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Powered by Worqhat AI</span>
        </div>
        
        {topic && (
          <Badge variant="outline" className="text-xs">
            {topic}
          </Badge>
        )}
      </div>
    </GlassPanel>
  );
};

export default SatelliteQuizWidget;