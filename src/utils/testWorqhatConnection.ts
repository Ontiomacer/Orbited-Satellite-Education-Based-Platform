/**
 * Worqhat Connection Test Utility
 * 
 * Use this to quickly test if your Worqhat API connection is working.
 * Can be called from browser console or used in components.
 */

import { getChatCompletion, executeWorkflow } from '../services/worqhatService';

/**
 * Test basic AI chat functionality
 */
export async function testChatConnection(): Promise<boolean> {
  console.log('🧪 Testing Worqhat Chat Connection...');
  
  try {
    const result = await getChatCompletion('Hello, can you respond with "Connection successful"?', {
      model: 'aicon-v4-nano-160824',
      randomness: 0.1,
    });
    
    if (result.success) {
      console.log('✅ Chat Connection Successful!');
      console.log('Response:', result.content);
      return true;
    } else {
      console.error('❌ Chat Connection Failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Chat Connection Error:', error);
    return false;
  }
}

/**
 * Test workflow execution (requires valid workflow ID)
 */
export async function testWorkflowConnection(workflowId: string): Promise<boolean> {
  console.log('🧪 Testing Worqhat Workflow Connection...');
  
  if (!workflowId) {
    console.warn('⚠️ No workflow ID provided. Skipping workflow test.');
    return false;
  }
  
  try {
    const result = await executeWorkflow(workflowId, {});
    
    if (result.success) {
      console.log('✅ Workflow Connection Successful!');
      console.log('Execution ID:', result.executionId);
      console.log('Data:', result.data);
      return true;
    } else {
      console.error('❌ Workflow Connection Failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Workflow Connection Error:', error);
    return false;
  }
}

/**
 * Run all connection tests
 */
export async function runAllTests(workflowId?: string): Promise<void> {
  console.log('🚀 Running Worqhat Connection Tests...\n');
  
  // Test 1: API Key Check
  const apiKey = import.meta.env.VITE_WORQHAT_API_KEY;
  if (!apiKey) {
    console.error('❌ VITE_WORQHAT_API_KEY not found in environment variables');
    console.log('💡 Make sure your .env file contains: VITE_WORQHAT_API_KEY=your_key_here');
    return;
  }
  console.log('✅ API Key found in environment');
  console.log(`   Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);
  
  // Test 2: Chat Connection
  const chatSuccess = await testChatConnection();
  console.log('');
  
  // Test 3: Workflow Connection (if ID provided)
  if (workflowId) {
    await testWorkflowConnection(workflowId);
    console.log('');
  }
  
  // Summary
  console.log('📊 Test Summary:');
  console.log(`   API Key: ✅`);
  console.log(`   Chat API: ${chatSuccess ? '✅' : '❌'}`);
  if (workflowId) {
    console.log(`   Workflow API: Check logs above`);
  }
  
  if (chatSuccess) {
    console.log('\n🎉 Worqhat integration is working correctly!');
  } else {
    console.log('\n⚠️ Some tests failed. Check the errors above.');
  }
}

/**
 * Quick test function - call this from browser console
 * 
 * Usage in browser console:
 * import { quickTest } from './src/utils/testWorqhatConnection';
 * quickTest();
 */
export async function quickTest(): Promise<void> {
  await runAllTests();
}

// Make available in window for easy console access (development only)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).testWorqhat = {
    chat: testChatConnection,
    workflow: testWorkflowConnection,
    all: runAllTests,
    quick: quickTest,
  };
  
  console.log('💡 Worqhat test utilities available:');
  console.log('   window.testWorqhat.chat() - Test chat API');
  console.log('   window.testWorqhat.workflow("workflow-id") - Test workflow');
  console.log('   window.testWorqhat.all() - Run all tests');
  console.log('   window.testWorqhat.quick() - Quick test');
}

export default {
  testChatConnection,
  testWorkflowConnection,
  runAllTests,
  quickTest,
};
