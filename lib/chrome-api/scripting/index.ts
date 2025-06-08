class Scripting {
  static async executeFunction(
    tabId: number, 
    func: (...args: any[]) => any, 
    ...args: any[]
  ) {
    console.log(`Executing function in tab ${tabId}:`, func.name || 'anonymous function');
    console.log('Arguments:', args);

    try {
      const [injectionResult] = await chrome.scripting.executeScript({
        target: { tabId },
        func,
        args,
        world: 'MAIN',
      });

      console.log('Injection result:', injectionResult);
      return injectionResult?.result;
    } catch (error) {
      console.error('Error executing function via Scripting API:', error);
      throw error;
    }
  }
}

export { Scripting };
