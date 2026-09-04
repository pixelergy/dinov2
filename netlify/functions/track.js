// netlify/functions/track.js

// In production, you would import your database client here (e.g., Supabase / MongoDB)
// and write logEntry directly to your permanent cloud database table.

export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const data = await req.json();

    // Secure server-side header extraction
    const clientIp = req.headers.get('x-nf-client-connection-ip') || 
                     req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     'unknown';

    // Complete private developer register log item
    const privateLogEntry = {
      timestamp: new Date().toISOString(),
      ipAddress: clientIp,
      score: data.score,
      avatar: data.avatar,
      timePlayedSeconds: data.timePlayed,
      devicePlatform: data.device?.platform,
      userAgent: data.device?.userAgent,
      screenResolution: data.device?.screenResolution,
      language: data.language,
      battery: data.battery,
      network: data.network,
      hardware: data.hardware,
      motion: data.motion,
      session: data.session
    };

    // [DEVELOPER ACTION]: Save 'privateLogEntry' to your permanent database here.
    
    // For demonstration/testing console stream check in Netlify:
    console.log("SECURE DEVELOPER LOG RECORDED:", JSON.stringify(privateLogEntry, null, 2));

    // Mock response demonstrating public data restrictions
    // (In a real database setup, you would query your database table for the actual top 5 rows and counts)
    return new Response(JSON.stringify({
      topScores: [
        { score: data.score, avatar: data.avatar } // Example response structure
      ],
      mostUsedAvatar: data.avatar
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to process request' }), { status: 500 });
  }
};