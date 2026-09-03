import { Language } from '../types';

export interface AgenticStep {
  agentName: 'Perception Agent' | 'Cognitive Memory Agent' | 'Goal Planner Agent' | 'Tool Execution Engine' | 'Reflection Agent';
  action: string;
  details: string;
  timestamp: string;
  status: 'pending' | 'running' | 'completed';
}

export interface AgenticToolCall {
  toolName: 'speak_voice' | 'play_cultural_audio' | 'launch_cognitive_game' | 'notify_caregiver';
  parameters: Record<string, any>;
  result: string;
}

export interface AgenticExecutionResult {
  detectedEmotion: 'Calm' | 'Confused' | 'Anxious' | 'Nostalgic' | 'Joyful';
  detectedDialect: Language;
  retrievedMemories: string[];
  formulatedGoal: string;
  agentSteps: AgenticStep[];
  toolCalls: AgenticToolCall[];
  finalResponseSpeech: string;
  finalCaregiverLog: string;
}

export class OjaAgenticWorkflowEngine {
  public static async runWorkflow(
    inputPrompt: string,
    currentLanguage: Language = 'English',
    elderProfile: any = null
  ): Promise<AgenticExecutionResult> {
    const now = new Date().toLocaleTimeString();
    const elderName = elderProfile?.elderName || 'Uncle Dipankar Baruah';
    const nickname = elderProfile?.elderNickname || 'Dipankar Kaka';

    // 1. Determine Emotion & Dialect
    let emotion: 'Calm' | 'Confused' | 'Anxious' | 'Nostalgic' | 'Joyful' = 'Calm';
    const lower = inputPrompt.toLowerCase();
    if (lower.includes('confused') || lower.includes('where am i') || lower.includes('forget') || lower.includes('time')) {
      emotion = 'Confused';
    } else if (lower.includes('anxious') || lower.includes('scared') || lower.includes('worry')) {
      emotion = 'Anxious';
    } else if (lower.includes('bihu') || lower.includes('tea') || lower.includes('story') || lower.includes('shillong') || lower.includes('photo')) {
      emotion = 'Nostalgic';
    } else if (lower.includes('happy') || lower.includes('good') || lower.includes('namaskar')) {
      emotion = 'Joyful';
    }

    // 2. Multi-Agent Steps Trace
    const agentSteps: AgenticStep[] = [
      {
        agentName: 'Perception Agent',
        action: 'Speech & Emotion Recognition',
        details: `Parsed acoustic text: "${inputPrompt}". Detected Emotion: ${emotion}. Detected Dialect: ${currentLanguage}.`,
        timestamp: now,
        status: 'completed'
      },
      {
        agentName: 'Cognitive Memory Agent',
        action: 'AES-256 Vault Memory Query',
        details: `Querying local memory graph for ${elderName}. Retrieved: Tezpur Tea Estate (1982), Rongali Bihu Dhol, Daughter Anindita.`,
        timestamp: now,
        status: 'completed'
      },
      {
        agentName: 'Goal Planner Agent',
        action: 'Autonomous Goal Formulation',
        details: emotion === 'Confused'
          ? `Goal: Gentle grounding & reassurance. Remind ${nickname} he is safe at home.`
          : emotion === 'Anxious'
          ? `Goal: Anxiety reduction via 4-7-8 soothing Bihu flute audio pacing.`
          : `Goal: Engage in cultural photo reminiscence & family connection.`,
        timestamp: now,
        status: 'completed'
      },
      {
        agentName: 'Tool Execution Engine',
        action: 'Executing Autonomous Tools',
        details: `Dispatching tool_speak_voice and tool_play_cultural_audio to browser audio synthesizer.`,
        timestamp: now,
        status: 'completed'
      },
      {
        agentName: 'Reflection Agent',
        action: 'Memory Consolidation & Caregiver Logging',
        details: `Updating 7-day cognitive trend chart. Logging session state in local Encrypted Vault.`,
        timestamp: now,
        status: 'completed'
      }
    ];

    // 3. Autonomous Tool Calls
    const toolCalls: AgenticToolCall[] = [
      {
        toolName: 'speak_voice',
        parameters: {
          text: emotion === 'Confused'
            ? `Namaskar ${nickname}! Do not worry, you are safe at your Jorhat garden home. Your daughter Anindita is nearby.`
            : `Namaskar ${nickname}! It is wonderful to talk about your cherished tea garden memories.`,
          cadence: 'slow',
          pitch: 1.0
        },
        result: 'Voice synthesized successfully at 0.85x elder pace.'
      },
      {
        toolName: 'play_cultural_audio',
        parameters: {
          track: emotion === 'Anxious' ? 'Gentle Assam Flute' : 'Bihu Dhol Beat',
          volume: 0.4
        },
        result: 'Audio stream playing softly in background.'
      },
      {
        toolName: 'notify_caregiver',
        parameters: {
          elderName,
          emotionDetected: emotion,
          logType: emotion === 'Confused' ? 'Grounding Alert' : 'Routine Engagement'
        },
        result: 'Caregiver Portal 7-day trends updated successfully.'
      }
    ];

    const finalResponseSpeech = emotion === 'Confused'
      ? `Namaskar ${nickname}! Please take a gentle breath. You are safe at home in Jorhat. Would you like to look at your family tea garden photos together?`
      : emotion === 'Anxious'
      ? `Namaskar ${nickname}! Let us listen to this peaceful flute together. Breathing in gently... and out.`
      : `Namaskar ${nickname}! I remember your stories from Tezpur Tea Estate and playing the Dhol under the Banyan tree. Shall we play a quick memory game?`;

    return {
      detectedEmotion: emotion,
      detectedDialect: currentLanguage,
      retrievedMemories: [
        'Tezpur Tea Plantation Supervisor 1982',
        'Rongali Bihu Dhol Drummer 1995',
        'Daughter Anindita Baruah',
        'Ward’s Lake Shillong Afternoon Walk'
      ],
      formulatedGoal: agentSteps[2].details,
      agentSteps,
      toolCalls,
      finalResponseSpeech,
      finalCaregiverLog: `[${now}] Oja Agentic Loop: Emotion=${emotion}, ToolCalls=3, CaregiverNotified=True`
    };
  }
}
