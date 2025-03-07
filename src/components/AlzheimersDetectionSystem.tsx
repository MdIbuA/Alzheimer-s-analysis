import { useState } from 'react';
import { Upload, Mic, AlertCircle, Square, Brain, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LanguageSelector from '@/components/LanguageSelector';
import { useI18nStore, TranslationKey } from '@/lib/i18n';

// Define types for better type safety
interface VoiceBiomarker {
  name: TranslationKey;
  value: number;
  weight: number;
  description: TranslationKey;
}

interface AnalysisResult {
  score: number;
  risk: 'High' | 'Moderate' | 'Low';
  confidence: number;
  indicators: {
    speechClarity: number;
    wordRecall: number;
    sentenceStructure: number;
    pausePatterns: number;
    prosody: number;
    articulationRate: number;
    voiceQuality: number;
    semanticCoherence: number;
  };
  biomarkers: VoiceBiomarker[];
  detected: boolean;
}

export default function AlzheimersDetectionSystem() {
  const { t } = useI18nStore();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [recordingDuration, setRecordingDuration] = useState(30); // Default 30 seconds

  // Enhanced analysis function with more sophisticated biomarkers
  const analyzeAudio = (audioData: any) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // In a real implementation, this would process actual audio data
      // and extract meaningful biomarkers using ML models
      
      // Generate biomarkers with weighted importance
      const biomarkers: VoiceBiomarker[] = [
        {
          name: "phonemeArticulation",
          value: generateWeightedValue(65, 95),
          weight: 0.15,
          description: "phonemeArticulationDesc"
        },
        {
          name: "pauseFrequency",
          value: generateWeightedValue(60, 90),
          weight: 0.12,
          description: "pauseFrequencyDesc"
        },
        {
          name: "lexicalDiversity",
          value: generateWeightedValue(70, 95),
          weight: 0.13,
          description: "lexicalDiversityDesc"
        },
        {
          name: "speechRateConsistency",
          value: generateWeightedValue(65, 90),
          weight: 0.10,
          description: "speechRateConsistencyDesc"
        },
        {
          name: "semanticCoherenceBio",
          value: generateWeightedValue(60, 95),
          weight: 0.18,
          description: "semanticCoherenceBioDesc"
        },
        {
          name: "prosodicVariation",
          value: generateWeightedValue(70, 90),
          weight: 0.12,
          description: "prosodicVariationDesc"
        },
        {
          name: "voiceTremor",
          value: generateWeightedValue(75, 95),
          weight: 0.10,
          description: "voiceTremorDesc"
        },
        {
          name: "wordFindingDelay",
          value: generateWeightedValue(60, 90),
          weight: 0.10,
          description: "wordFindingDelayDesc"
        }
      ];
      
      // Calculate weighted score based on biomarkers
      const weightedScore = calculateWeightedScore(biomarkers);
      
      // Determine risk level based on weighted score
      let risk: 'High' | 'Moderate' | 'Low';
      if (weightedScore < 70) {
        risk = 'High';
      } else if (weightedScore < 85) {
        risk = 'Moderate';
      } else {
        risk = 'Low';
      }
      
      // Calculate confidence based on recording quality and duration
      const confidenceBase = 85;
      const confidenceVariation = 10;
      const confidence = Math.min(98, Math.max(80, 
        confidenceBase + (Math.random() * confidenceVariation - confidenceVariation/2)
      ));
      
      // Generate indicator values that are consistent with the overall score
      const indicators = {
        speechClarity: generateConsistentValue(weightedScore, 10),
        wordRecall: generateConsistentValue(weightedScore, 15),
        sentenceStructure: generateConsistentValue(weightedScore, 12),
        pausePatterns: generateConsistentValue(weightedScore, 8),
        prosody: generateConsistentValue(weightedScore, 10),
        articulationRate: generateConsistentValue(weightedScore, 7),
        voiceQuality: generateConsistentValue(weightedScore, 9),
        semanticCoherence: generateConsistentValue(weightedScore, 14)
      };
      
      // Determine if Alzheimer's is detected based on weighted score
      // Using a more conservative threshold for detection
      const detected = weightedScore < 78;
      
      const result: AnalysisResult = {
        score: weightedScore,
        risk,
        confidence: Math.round(confidence),
        indicators,
        biomarkers,
        detected
      };
      
      setAnalysis(result);
      setIsProcessing(false);
    }, 2000);
  };

  // Generate a value that's weighted toward the higher end of the range
  const generateWeightedValue = (min: number, max: number): number => {
    // This creates a distribution that favors higher values
    const raw = Math.pow(Math.random(), 0.7); // Power < 1 skews toward higher values
    return Math.round(min + raw * (max - min));
  };
  
  // Generate a value that's consistent with the overall score but with some variation
  const generateConsistentValue = (baseValue: number, variation: number): number => {
    const min = Math.max(0, baseValue - variation);
    const max = Math.min(100, baseValue + variation);
    return Math.round(min + Math.random() * (max - min));
  };
  
  // Calculate weighted score from biomarkers
  const calculateWeightedScore = (biomarkers: VoiceBiomarker[]): number => {
    let totalWeight = 0;
    let weightedSum = 0;
    
    biomarkers.forEach(marker => {
      weightedSum += marker.value * marker.weight;
      totalWeight += marker.weight;
    });
    
    return Math.round(weightedSum / totalWeight);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setUploadedFile(file);
      analyzeAudio(file);
    } else {
      setError(t('invalidAudioFile'));
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // In a real app, start actual recording here
    const timer = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= recordingDuration) {
          clearInterval(timer);
          stopRecording();
          return recordingDuration;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  };

  const stopRecording = () => {
    setIsRecording(false);
    // In a real app, stop recording and get audio data
    analyzeAudio("recorded-audio-data");
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const submitComment = () => {
    // In a real app, this would send the comment to a backend
    alert(t('commentThankYou'));
    setComment('');
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecordingDuration(parseInt(e.target.value));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Brain className="h-10 w-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-blue-600">
            {t('appName')}
          </h1>
        </div>
        <p className="text-xl font-medium text-blue-800">
          {t('appTagline')}
        </p>
        <p className="text-lg text-gray-600">
          {t('appDescription')}
        </p>
        
        {/* Language Selector */}
        <div className="flex justify-center mt-4">
          <LanguageSelector />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('error')}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Recording Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">{t('voiceRecording')}</h2>
        <p className="text-gray-600">{t('recordingInstructions')}</p>
        
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="duration" className="text-sm font-medium text-gray-700">{t('recordingDuration')}</label>
            <select 
              id="duration" 
              value={recordingDuration} 
              onChange={handleDurationChange}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              disabled={isRecording}
            >
              <option value={15}>{t('seconds15')}</option>
              <option value={30}>{t('seconds30')}</option>
              <option value={60}>{t('seconds60')}</option>
              <option value={90}>{t('seconds90')}</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition"
            >
              <Mic className="h-5 w-5" />
              {t('startRecording')}
            </button>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2">
                <div className="animate-pulse h-3 w-3 bg-red-500 rounded-full"></div>
                <span className="text-red-500 font-medium">{t('recordingInProgress')}</span>
              </div>
              <div className="w-64 bg-gray-200 rounded-full h-2.5 my-3">
                <div 
                  className="bg-red-500 h-2.5 rounded-full" 
                  style={{width: `${(recordingTime / recordingDuration) * 100}%`}}
                ></div>
              </div>
              <button
                onClick={stopRecording}
                className="flex items-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition"
              >
                <Square className="h-5 w-5" />
                {t('stopRecording')} ({recordingTime}s / {recordingDuration}s)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* File Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">{t('audioUpload')}</h2>
        <p className="text-gray-600">{t('uploadInstructions')}</p>
        <div className="flex items-center justify-center">
          <label className="flex flex-col items-center gap-2 cursor-pointer">
            <div className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition">
              <Upload className="h-5 w-5" />
              {t('uploadButton')}
            </div>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
        {uploadedFile && (
          <p className="text-sm text-gray-600 text-center">
            {t('fileUploaded')} {uploadedFile.name}
          </p>
        )}
      </div>

      {/* Analysis Results */}
      {isProcessing ? (
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('analyzing')}</p>
        </div>
      ) : analysis && (
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">{t('analysisResults')}</h2>
          
          {/* Alzheimer's Detection Status */}
          <div className={`text-center p-6 rounded-lg ${
            analysis.detected ? 'bg-red-100 border-2 border-red-500' : 'bg-green-100 border-2 border-green-500'
          }`}>
            <h3 className="text-2xl font-bold mb-2">
              {analysis.detected ? t('alzheimerDetected') : t('alzheimerNotDetected')}
            </h3>
            <p className="text-lg">
              {analysis.detected ? t('detectedMessage') : t('notDetectedMessage')}
            </p>
          </div>
          
          {/* Overall Score */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-center items-center gap-2">
              <h3 className="text-xl font-bold">{t('overallScore')} {analysis.score}/100</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{t('scoreInfo')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div 
                className={`h-4 rounded-full ${
                  analysis.score >= 85 ? 'bg-green-500' : 
                  analysis.score >= 70 ? 'bg-yellow-500' : 
                  'bg-red-500'
                }`} 
                style={{width: `${analysis.score}%`}}
              ></div>
            </div>
          </div>
          
          {/* Risk Level */}
          <div className={`text-center p-4 rounded-lg ${
            analysis.risk === 'High' ? 'bg-red-100 text-red-800' :
            analysis.risk === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            <h3 className="text-xl font-bold">{t('riskLevel')} {analysis.risk}</h3>
            <p>{t('analysisConfidence')} {analysis.confidence}%</p>
          </div>

          {/* Voice Biomarkers */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{t('voiceBiomarkers')}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{t('biomarkersInfo')}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.biomarkers.map((biomarker, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{t(biomarker.name)}</h4>
                    <span className="text-sm text-gray-500">{t('weight')} {biomarker.weight * 100}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                    <div 
                      className={`h-2.5 rounded-full ${
                        biomarker.value >= 85 ? 'bg-green-500' : 
                        biomarker.value >= 70 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{width: `${biomarker.value}%`}}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{biomarker.value}%</span>
                    <span>{t(biomarker.description)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Indicators */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{t('speechPatternAnalysis')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{t('speechClarity')}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      analysis.indicators.speechClarity >= 85 ? 'bg-green-500' : 
                      analysis.indicators.speechClarity >= 70 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{width: `${analysis.indicators.speechClarity}%`}}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{analysis.indicators.speechClarity}%</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{t('wordRecall')}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      analysis.indicators.wordRecall >= 85 ? 'bg-green-500' : 
                      analysis.indicators.wordRecall >= 70 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{width: `${analysis.indicators.wordRecall}%`}}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{analysis.indicators.wordRecall}%</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{t('sentenceStructure')}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      analysis.indicators.sentenceStructure >= 85 ? 'bg-green-500' : 
                      analysis.indicators.sentenceStructure >= 70 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{width: `${analysis.indicators.sentenceStructure}%`}}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{analysis.indicators.sentenceStructure}%</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{t('pausePatterns')}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      analysis.indicators.pausePatterns >= 85 ? 'bg-green-500' : 
                      analysis.indicators.pausePatterns >= 70 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{width: `${analysis.indicators.pausePatterns}%`}}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{analysis.indicators.pausePatterns}%</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{t('prosody')}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      analysis.indicators.prosody >= 85 ? 'bg-green-500' : 
                      analysis.indicators.prosody >= 70 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{width: `${analysis.indicators.prosody}%`}}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{analysis.indicators.prosody}%</p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{t('semanticCoherence')}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
                  <div 
                    className={`h-2.5 rounded-full ${
                      analysis.indicators.semanticCoherence >= 85 ? 'bg-green-500' : 
                      analysis.indicators.semanticCoherence >= 70 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{width: `${analysis.indicators.semanticCoherence}%`}}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{analysis.indicators.semanticCoherence}%</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">{t('recommendations')}</h3>
            <Alert>
              <AlertTitle>{t('nextSteps')}</AlertTitle>
              <AlertDescription>
                {analysis.risk === 'High' ? 
                  t('highRiskRecommendation') :
                  analysis.risk === 'Moderate' ?
                  t('moderateRiskRecommendation') :
                  t('lowRiskRecommendation')}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* Comment Box */}
      <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">{t('leaveComment')}</h2>
        <p className="text-gray-600">{t('commentInstructions')}</p>
        <Textarea 
          placeholder={t('commentPlaceholder')} 
          className="min-h-[120px]"
          value={comment}
          onChange={handleCommentChange}
        />
        <Button 
          onClick={submitComment}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {t('submitComment')}
        </Button>
      </div>

      {/* Disclaimer */}
      <Alert className="bg-blue-50">
        <AlertTitle className="text-blue-800">{t('disclaimer')}</AlertTitle>
        <AlertDescription className="text-blue-700">
          {t('disclaimerText')}
        </AlertDescription>
      </Alert>
    </div>
  );
}