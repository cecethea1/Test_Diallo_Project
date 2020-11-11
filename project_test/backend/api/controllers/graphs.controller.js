const {
  getGraphsById,
  insertGraph,
} = require('../services/graphs.service');

const getGraphsByIdHandler = async (req, res) => {
  try {
    const { graphId } = req.params;
    const graph = await getGraphsById(graphId);
    res.status(200).json(graph);
  } catch (err) {
    res.status(403).send('Access forbidden');
  }
};

const insertGraphHandler = async (req, res) => {
  try {
    const { graph } = req.body;
    const {
      siteId, name, metric, type, captorsId, minX, maxX, minY, maxY,
    } = graph;
    const id = await insertGraph(siteId, name, metric, type, captorsId, minX, maxX, minY, maxY);
    res.status(200).json(id);
  } catch (err) {
    res.status(403).send('Failed to Insert Graph');
  }
};

module.exports = {
  getGraphsByIdHandler,
  insertGraphHandler,
};
