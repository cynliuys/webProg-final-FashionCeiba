const classNames = (...names) => {
  return names.reduce((res, val, idx) => {
    const className =
      typeof val === 'string'
        ? val
        : typeof val === 'object'
          ? val[Object.keys(val)[0]]
            ? Object.keys(val)[0]
            : ''
          : '';
    return res + (idx === 0 || !className ? className : ' ' + className);
  }, '');
};

export { classNames };
