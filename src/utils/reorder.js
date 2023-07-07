const removeFromList = (list, index) => {
  const result = Array.from(list);
  const [removed] = result.splice(index, 1);
  return [removed, result];
};

const addToList = (list, index, element) => {
  const result = Array.from(list);
  result.splice(index, 0, element);
  return result;
};

export default function (list, result, cb) {
  if (!result.destination) return;
  const listCopy = {...list};
  const sourceList = listCopy[result.source.droppableId];
  const [removedElement, newSourceList] = removeFromList(sourceList, result.source.index);
  listCopy[result.source.droppableId] = newSourceList;
  const destinationList = listCopy[result.destination.droppableId];
  listCopy[result.destination.droppableId] = addToList(
    destinationList,
    result.destination.index,
    removedElement
  );

  cb(listCopy);
}
