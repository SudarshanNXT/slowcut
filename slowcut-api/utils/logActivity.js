import Activity from "../models/activityModel.js";

const logActivity = async ({ userId, triggeredById, type, targetId, targetModel }) => {
  if (!userId || !triggeredById || !type) return;

  if (userId.toString() === triggeredById.toString()) return; // avoid self-notifications

  await Activity.create({
    user: userId,
    triggered_by: triggeredById,
    type,
    target_id: targetId,
    target_model: targetModel
  });
};

export default logActivity;
