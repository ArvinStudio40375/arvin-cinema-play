export const getClientIP = async (): Promise<string> => {
  try {
    // Try multiple IP detection services
    const services = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://jsonip.com'
    ];

    for (const service of services) {
      try {
        const response = await fetch(service);
        const data = await response.json();
        
        // Different services return IP in different formats
        const ip = data.ip || data.IPv4 || data.query;
        if (ip) {
          return ip;
        }
      } catch (error) {
        console.warn(`Failed to get IP from ${service}:`, error);
        continue;
      }
    }
    
    // Fallback
    return '0.0.0.0';
  } catch (error) {
    console.error('Error getting client IP:', error);
    return '0.0.0.0';
  }
};