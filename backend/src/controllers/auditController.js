import * as AuditModel from "../models/auditModel.js";

export const getAuditLogs = async (req, res) => {
  try {
    const {page=1,limit=30,user_id,action,table_name,date_from,date_to} = req.query;
    const result = await AuditModel.getAuditLogs({
      page:parseInt(page),limit:parseInt(limit),
      user_id:user_id?parseInt(user_id):null,action,table_name,date_from,date_to
    });
    res.json(result);
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};

export const getRecentLogs = async (req, res) => {
  try {
    const logs = await AuditModel.getRecentAuditLogs(parseInt(req.query.limit||10));
    res.json({logs});
  } catch(e) { console.error(e); res.status(500).json({message:"Erreur serveur"}); }
};
