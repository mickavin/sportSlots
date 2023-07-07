export default function (tasks) {
  return [1, 2, 3, 4].reduce((acc, listKey) =>
      ({...acc, [listKey]: tasks.filter(t => t?.board === listKey).sort((a, b) => a.order - b.order)}), {}
  );
}

const mapTask = (task, board, i) => ({_id: task._id, board: parseInt(board), order: i});
export function getNewBoards(data, oldBoard, newBoard) {
  return [
    ...data[oldBoard].map((t, i) => mapTask(t, oldBoard, i)),
    ...(oldBoard !== newBoard ? data[newBoard].map((t, i) => mapTask(t, newBoard, i)) : [])
  ];
}
