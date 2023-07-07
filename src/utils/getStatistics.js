export default function (tasks) {
  const total = tasks.length;
  const todoSize = tasks.filter(t => t.board == 1).length;
  const inProgressSize = tasks.filter(t => t.board == 2).length;
  const inReview = tasks.filter(t => t.board == 3).length;
  const completedSize = tasks.filter(t => t.board == 4).length;
  return {
    todo: {size: todoSize, percent: ((todoSize / total * 100) || 0).toFixed(1).replace('.0', '')},
    inProgress: {size: inProgressSize, percent: ((inProgressSize / total * 100) || 0).toFixed(1).replace('.0', '')},
    inReview: {size: inReview, percent: ((inReview / total * 100) || 0).toFixed(1).replace('.0', '')},
    completed: {size: completedSize, percent: ((completedSize / total * 100) || 0).toFixed(1).replace('.0', '')}
  };
}
