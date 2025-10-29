import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 60 * 60 * 2 }); // 2 hours

export default cache;
