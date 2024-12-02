import db from '../db.js';

const restrictHealthCheck = (req, res, next) => {
  const allowedIps = ['127.0.0.1', '::1'];
  const dockerNetworkRange = '172.17.0.0/16';
  const clientIp = req.ip;

  if (!allowedIps.includes(clientIp) && !isIpInRange(clientIp, dockerNetworkRange)) {
    return res.status(403).json({ error: 'Access denied' });
  }

  next();
};

const isIpInRange = (ip, range) => {
  const [rangeStart, rangeEnd] = range.split('/').map((part, index) => {
    const base = part.split('.').map(Number);
    return index === 0 ? base : Math.pow(2, 32 - Number(part)) - 1;
  });
  
  const ipParts = ip.split('.').map(Number);
  const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
  const rangeStartNum = (rangeStart[0] << 24) | (rangeStart[1] << 16) | (rangeStart[2] << 8) | rangeStart[3];
  const rangeEndNum = rangeStartNum + rangeEnd;

  return ipNum >= rangeStartNum && ipNum <= rangeEndNum;
};

const healthCheckHandler = async (req, res) => {
  try {
    await db.raw('SELECT 1'); // Simple query to check connection
    return res.status(200).json({ status: 'healthy' });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ status: 'unhealthy' });
  }
};

export { restrictHealthCheck, healthCheckHandler }; 