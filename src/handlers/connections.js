import db from '../db.js'; 

const connectionsHandler = async (req, res) => {
  const { character_id, corporation_id, alliance_id } = req.body;

  if (!character_id && !corporation_id && !alliance_id) {
    return res.status(400).json({ error: 'At least one of character_id, corporation_id, or alliance_id is required' });
  }

  try {
    const entities = await db('allowed_entity')
      .where('level', '>=', 2)
      .where(function() {
        if (character_id) this.orWhere('entity_id', character_id);
        if (corporation_id) this.orWhere('entity_id', corporation_id);
        if (alliance_id) this.orWhere('entity_id', alliance_id);
      });

    if (entities.length === 0) {
      return res.status(200).json({ 
        access: false 
      });
    }

    const connections = await db('trig_connections')
      .select([
        'pochvenSystemId as systemId',
        'pochvenSystemName as systemName',
        'externalSystemId as solarSystemIdDst',
        'externalSystemName as solarSystemNameDst',
        'pochvenSignature as signatureSrc',
        'externalSignature as signatureDst',
        'pochvenWormholeType as wormholeTypeSrc',
        'externalWormholeType as wormholeTypeDst',
        'massCritical',
        'timeCritical',
        'timeCriticalTime',
        'createdTime'
      ]);

    const systemNodes = new Map();

    connections.forEach(conn => {
      if (!systemNodes.has(conn.systemId)) {
        systemNodes.set(conn.systemId, {
          systemId: conn.systemId,
          systemName: conn.systemName,
          systemSecurityStatus: -1.0,
          shipSize: undefined,
          systemEdges: []
        });
      }

      const edge = {
        solarSystemIdDst: conn.solarSystemIdDst,
        solarSystemNameDst: conn.solarSystemNameDst,
        edgeSource: 'trig-map',
        signatureSrc: conn.signatureSrc,
        signatureDst: conn.signatureDst,
        wormholeTypeSrc: conn.wormholeTypeSrc,
        wormholeTypeDst: conn.wormholeTypeDst,
        wormholeMass: conn.massCritical ? 'critical' : 'stable',
        wormholeEol: conn.timeCritical ? 'critical' : 'stable',
        createdTime: conn.createdTime,
        lastSeenTime: conn.createdTime
      };

      systemNodes.get(conn.systemId).systemEdges.push(edge);
    });

    return res.status(200).json({ 
      access: true,
      connections: Array.from(systemNodes.values())
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { connectionsHandler }; 