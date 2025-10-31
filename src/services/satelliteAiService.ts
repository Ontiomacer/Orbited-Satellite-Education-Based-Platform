import { getChatCompletion } from './worqhatService';

export interface SatelliteAnalysisRequest {
  satelliteData: {
    name: string;
    altitude: number;
    velocity: number;
    period: number;
    lat: number;
    lng: number;
  };
  analysisType: 'position' | 'orbit' | 'visibility' | 'educational' | 'technical';
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
}

export interface SatelliteAnalysisResponse {
  success: boolean;
  analysis: string;
  insights: string[];
  recommendations: string[];
  error?: string;
}

/**
 * Generate AI-powered satellite analysis
 */
export const analyzeSatelliteData = async (
  request: SatelliteAnalysisRequest
): Promise<SatelliteAnalysisResponse> => {
  try {
    const { satelliteData, analysisType, userLevel = 'intermediate' } = request;
    
    const prompts = {
      position: `
        Analyze the current position of ${satelliteData.name} at coordinates ${satelliteData.lat.toFixed(4)}°, ${satelliteData.lng.toFixed(4)}°.
        
        Provide:
        1. What geographic location is directly below the satellite
        2. What this position means for visibility from Earth
        3. Interesting facts about this orbital position
        
        Keep it ${userLevel === 'beginner' ? 'simple and educational' : userLevel === 'advanced' ? 'technical and detailed' : 'informative but accessible'}.
      `,
      
      orbit: `
        Analyze the orbital characteristics of ${satelliteData.name}:
        - Altitude: ${satelliteData.altitude} km
        - Velocity: ${satelliteData.velocity} km/s  
        - Period: ${satelliteData.period} minutes
        
        Explain:
        1. What type of orbit this is (LEO, MEO, GEO)
        2. Why these parameters make sense together
        3. How this orbit serves the satellite's purpose
        4. Comparison to other well-known satellites
        
        Level: ${userLevel}
      `,
      
      visibility: `
        Based on ${satelliteData.name}'s current position (${satelliteData.lat.toFixed(2)}°, ${satelliteData.lng.toFixed(2)}°) and altitude (${satelliteData.altitude} km):
        
        Explain:
        1. From which parts of Earth this satellite is currently visible
        2. When it might next be visible from major cities
        3. Best viewing conditions and times
        4. How to spot it in the night sky
        
        Make it practical for ${userLevel} observers.
      `,
      
      educational: `
        Use ${satelliteData.name} as a teaching example. Current data:
        - Position: ${satelliteData.lat.toFixed(2)}°, ${satelliteData.lng.toFixed(2)}°
        - Altitude: ${satelliteData.altitude} km
        - Speed: ${satelliteData.velocity} km/s
        
        Create an engaging educational explanation covering:
        1. Basic orbital mechanics concepts
        2. Why satellites stay in orbit
        3. How orbital speed relates to altitude
        4. Real-world applications and importance
        
        Target audience: ${userLevel} learners
      `,
      
      technical: `
        Provide a technical analysis of ${satelliteData.name}:
        
        Current Parameters:
        - Latitude: ${satelliteData.lat}°
        - Longitude: ${satelliteData.lng}°
        - Altitude: ${satelliteData.altitude} km
        - Velocity: ${satelliteData.velocity} km/s
        - Orbital Period: ${satelliteData.period} minutes
        
        Calculate and explain:
        1. Orbital inclination implications
        2. Ground track analysis
        3. Doppler shift considerations
        4. Communication windows
        5. Orbital decay factors
        
        Include relevant formulas and technical insights for ${userLevel} users.
      `
    };

    const result = await getChatCompletion(prompts[analysisType], {
      model: 'aicon-v4-nano-160824',
      randomness: 0.2, // Lower randomness for more consistent technical analysis
    });

    if (result.success) {
      // Parse the response to extract insights and recommendations
      const content = result.content;
      const lines = content.split('\n').filter(line => line.trim());
      
      // Extract insights (lines that start with numbers or bullets)
      const insights = lines
        .filter(line => /^[0-9•\-\*]/.test(line.trim()))
        .map(line => line.replace(/^[0-9•\-\*\.\s]+/, '').trim())
        .filter(insight => insight.length > 10);

      // Generate recommendations based on analysis type
      const recommendations = generateRecommendations(analysisType, satelliteData, userLevel);

      return {
        success: true,
        analysis: content,
        insights: insights.slice(0, 5), // Limit to top 5 insights
        recommendations,
      };
    } else {
      return {
        success: false,
        analysis: '',
        insights: [],
        recommendations: [],
        error: result.error,
      };
    }
  } catch (error) {
    return {
      success: false,
      analysis: '',
      insights: [],
      recommendations: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Generate contextual recommendations based on analysis type
 */
const generateRecommendations = (
  analysisType: string,
  satelliteData: any,
  userLevel: string
): string[] => {
  const recommendations: { [key: string]: string[] } = {
    position: [
      "Check visibility predictions for your location",
      "Use satellite tracking apps for real-time updates",
      "Learn about ground station coverage in this area"
    ],
    orbit: [
      "Compare with other satellites in similar orbits",
      "Study orbital mechanics principles",
      "Explore mission requirements for this orbit type"
    ],
    visibility: [
      "Download a satellite tracking app",
      "Check weather conditions for optimal viewing",
      "Join local astronomy groups for viewing events"
    ],
    educational: [
      "Try hands-on orbital mechanics simulations",
      "Read about the satellite's mission and history",
      "Explore related space missions and technologies"
    ],
    technical: [
      "Calculate orbital parameters using Kepler's laws",
      "Study Two-Line Element (TLE) data format",
      "Explore satellite communication protocols"
    ]
  };

  return recommendations[analysisType] || [
    "Continue exploring satellite tracking",
    "Learn more about space technology",
    "Share your interest with others"
  ];
};

/**
 * Generate educational content about satellite concepts
 */
export const generateSatelliteEducation = async (
  topic: string,
  currentSatelliteData?: any,
  userLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
): Promise<{ success: boolean; content: string; error?: string }> => {
  try {
    const contextualPrompt = currentSatelliteData 
      ? `Using the current ISS data as an example (altitude: ${currentSatelliteData.altitude}km, velocity: ${currentSatelliteData.velocity}km/s), explain "${topic}" for ${userLevel} learners. Make it practical and engaging with real examples.`
      : `Explain "${topic}" for ${userLevel} learners interested in satellites and space technology. Use clear examples and practical applications.`;

    const result = await getChatCompletion(contextualPrompt, {
      model: 'aicon-v4-nano-160824',
      randomness: 0.3,
    });

    return {
      success: result.success,
      content: result.content,
      error: result.error,
    };
  } catch (error) {
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Generate fun facts about satellites
 */
export const generateSatelliteFacts = async (
  satelliteName: string = 'ISS',
  count: number = 3
): Promise<{ success: boolean; facts: string[]; error?: string }> => {
  try {
    const prompt = `Generate ${count} fascinating and lesser-known facts about the ${satelliteName}. Make them engaging, accurate, and surprising. Format each fact as a complete sentence.`;

    const result = await getChatCompletion(prompt, {
      model: 'aicon-v4-nano-160824',
      randomness: 0.4,
    });

    if (result.success) {
      // Parse facts from the response
      const facts = result.content
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[0-9•\-\*\.\s]+/, '').trim())
        .filter(fact => fact.length > 20)
        .slice(0, count);

      return {
        success: true,
        facts,
      };
    } else {
      return {
        success: false,
        facts: [],
        error: result.error,
      };
    }
  } catch (error) {
    return {
      success: false,
      facts: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Generate quiz questions about satellites
 */
export const generateSatelliteQuiz = async (
  difficulty: 'easy' | 'medium' | 'hard' = 'medium',
  topic?: string
): Promise<{
  success: boolean;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  error?: string;
}> => {
  try {
    const topicContext = topic ? ` focusing on ${topic}` : '';
    const prompt = `Create a ${difficulty} multiple choice question about satellites${topicContext}. 

Format your response as:
QUESTION: [question text]
A) [option 1]
B) [option 2] 
C) [option 3]
D) [option 4]
CORRECT: [A, B, C, or D]
EXPLANATION: [detailed explanation of why the answer is correct]`;

    const result = await getChatCompletion(prompt, {
      model: 'aicon-v4-nano-160824',
      randomness: 0.3,
    });

    if (result.success) {
      // Parse the structured response
      const content = result.content;
      const questionMatch = content.match(/QUESTION:\s*(.+?)(?=\n[A-D]\))/s);
      const optionsMatch = content.match(/([A-D]\)\s*.+?)(?=\n[A-D]\)|CORRECT:|$)/g);
      const correctMatch = content.match(/CORRECT:\s*([A-D])/);
      const explanationMatch = content.match(/EXPLANATION:\s*(.+?)$/s);

      if (questionMatch && optionsMatch && correctMatch && explanationMatch) {
        const question = questionMatch[1].trim();
        const options = optionsMatch.map(opt => opt.replace(/^[A-D]\)\s*/, '').trim());
        const correctLetter = correctMatch[1];
        const correctAnswer = correctLetter.charCodeAt(0) - 'A'.charCodeAt(0);
        const explanation = explanationMatch[1].trim();

        return {
          success: true,
          question,
          options,
          correctAnswer,
          explanation,
        };
      }
    }

    // Fallback if parsing fails
    return {
      success: false,
      question: '',
      options: [],
      correctAnswer: 0,
      explanation: '',
      error: 'Failed to parse quiz question format',
    };
  } catch (error) {
    return {
      success: false,
      question: '',
      options: [],
      correctAnswer: 0,
      explanation: '',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export default {
  analyzeSatelliteData,
  generateSatelliteEducation,
  generateSatelliteFacts,
  generateSatelliteQuiz,
};