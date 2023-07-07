const bubbleCommonStyle = {
  marginBottom: 10,
  paddingVertical: 7,
  paddingHorizontal: 5
};

export function getBubbleProps(mode) {
  return {
    mode: mode,
    wrapperStyle: {
      left: {
        ...bubbleCommonStyle,
        backgroundColor: mode === 'dark' ? '#484E5C' : '#f4f7fe',
        borderBottomRightRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 0,
      },
      right: {
        ...bubbleCommonStyle,
        backgroundColor: '#3498DB',
        borderBottomLeftRadius: 25,
        borderTopLeftRadius: 25,
        borderBottomRightRadius: 0,
      }
    },
    textStyle: {
      left: {
        color: mode === 'dark' ? '#fff' : '#333',
        marginBottom: 13,
        fontSize: 14.5,
      },
      right: {marginBottom: 10, fontSize: 14.5}
    }
  }
}
