export default class AH {
  static insertElement = (arr, idx, el) => [
    ...arr.slice(0, idx),
    el,
    ...arr.slice(idx),
  ];

  static replaceElement = (arr, idx, el) => [
    ...arr.slice(0, idx),
    el,
    ...arr.slice(idx + 1),
  ];

  static modifyElement = (arr, idx, action = (el) => el) => [
    ...arr.slice(0, idx),
    action(arr[idx]),
    ...arr.slice(idx + 1),
  ];

  static deleteElement = (arr, idx) => [
    ...arr.slice(0, idx),
    ...arr.slice(idx + 1),
  ];
}
