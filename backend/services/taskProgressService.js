/**
 * Task Progress Service
 * Calculates project progress based on completed tasks
 * Prepares payout calculations
 */

const Task = require('../models/Tasks');
const Project = require('../models/Project');

/**
 * Calculate project progress based on task weights
 * Formula: PROGRESS = Σ(task.weight_pct) for all DONE tasks
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} { progress: number, completedTasks: number, totalTasks: number }
 */
const calculateProjectProgress = async (projectId) => {
  try {
    const tasks = await Task.find({ projectId });

    if (!tasks || tasks.length === 0) {
      return {
        progress: 0,
        completedTasks: 0,
        totalTasks: 0,
        totalValue: 0,
        completedValue: 0,
      };
    }

    const completedTasks = tasks.filter(t => t.status === 'DONE');
    const totalProgress = completedTasks.reduce((sum, task) => {
      return sum + (task.weight_pct || 0);
    }, 0);

    const totalValue = tasks.reduce((sum, task) => sum + (task.value || 0), 0);
    const completedValue = completedTasks.reduce((sum, task) => sum + (task.value || 0), 0);

    // Ensure progress doesn't exceed 100%
    const progress = Math.min(100, Math.round(totalProgress * 100) / 100);

    return {
      progress,
      completedTasks: completedTasks.length,
      totalTasks: tasks.length,
      totalValue,
      completedValue,
      tasksBreakdown: tasks.map(t => ({
        taskId: t._id,
        name: t.name,
        status: t.status,
        weight_pct: t.weight_pct || 0,
        value: t.value || 0,
        contributesToProgress: t.status === 'DONE',
      })),
    };
  } catch (error) {
    console.error('Error calculating project progress:', error);
    throw error;
  }
};

/**
 * Update project progress
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Updated project with new progress
 */
const updateProjectProgress = async (projectId) => {
  try {
    const progressData = await calculateProjectProgress(projectId);
    const project = await Project.findByIdAndUpdate(
      projectId,
      { progress: progressData.progress },
      { new: true }
    );

    if (!project) {
      throw new Error('Project not found');
    }

    return {
      project,
      progressData,
    };
  } catch (error) {
    console.error('Error updating project progress:', error);
    throw error;
  }
};

/**
 * Calculate payout for completed tasks
 * @param {string} projectId - Project ID
 * @returns {Promise<Object>} Payout calculation
 */
const calculatePayout = async (projectId) => {
  try {
    const tasks = await Task.find({ projectId, status: 'DONE' });
    const project = await Project.findById(projectId);

    if (!project) {
      throw new Error('Project not found');
    }

    const totalPayout = tasks.reduce((sum, task) => {
      return sum + (task.value || 0);
    }, 0);

    // Get project total value (sum of all task values)
    const allTasks = await Task.find({ projectId });
    const projectTotal = allTasks.reduce((sum, task) => sum + (task.value || 0), 0);

    return {
      projectId,
      projectName: project.name,
      totalPayout,
      projectTotal,
      payoutPercentage: projectTotal > 0 ? (totalPayout / projectTotal) * 100 : 0,
      completedTasks: tasks.length,
      tasks: tasks.map(t => ({
        taskId: t._id,
        name: t.name,
        value: t.value || 0,
        approvedAt: t.approvedAt,
      })),
    };
  } catch (error) {
    console.error('Error calculating payout:', error);
    throw error;
  }
};

module.exports = {
  calculateProjectProgress,
  updateProjectProgress,
  calculatePayout,
};

